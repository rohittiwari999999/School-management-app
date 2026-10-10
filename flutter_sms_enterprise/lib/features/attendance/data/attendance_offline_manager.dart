import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:edupulse_sms/core/network/firebase_service.dart';
import 'attendance_repository.dart';

final attendanceOfflineManagerProvider = Provider<AttendanceOfflineManager>((ref) {
  final firebaseService = ref.watch(firebaseServiceProvider);
  final repo = ref.watch(attendanceRepositoryProvider);
  return AttendanceOfflineManager(firebaseService, repo);
});

/// Offline-First Attendance Queue Item Model stored locally in Hive
class QueuedAttendanceBatch {
  final String docId;
  final DateTime date;
  final String classId;
  final String sectionId;
  final String recordedBy;
  final Map<String, String> records;
  final int presentCount;
  final int totalStudents;
  final DateTime queuedAt;

  QueuedAttendanceBatch({
    required this.docId,
    required this.date,
    required this.classId,
    required this.sectionId,
    required this.recordedBy,
    required this.records,
    required this.presentCount,
    required this.totalStudents,
    required this.queuedAt,
  });

  Map<String, dynamic> toMap() => {
        'docId': docId,
        'date': date.toIso8601String(),
        'classId': classId,
        'sectionId': sectionId,
        'recordedBy': recordedBy,
        'records': records,
        'presentCount': presentCount,
        'totalStudents': totalStudents,
        'queuedAt': queuedAt.toIso8601String(),
      };

  factory QueuedAttendanceBatch.fromMap(Map<dynamic, dynamic> map) {
    return QueuedAttendanceBatch(
      docId: map['docId'] as String,
      date: DateTime.parse(map['date'] as String),
      classId: map['classId'] as String,
      sectionId: map['sectionId'] as String,
      recordedBy: map['recordedBy'] as String,
      records: Map<String, String>.from(map['records'] as Map),
      presentCount: map['presentCount'] as int,
      totalStudents: map['totalStudents'] as int,
      queuedAt: DateTime.parse(map['queuedAt'] as String),
    );
  }
}

/// Manages offline-first attendance caching and automatic Wi-Fi sync:
///
/// 1. Uses Firestore's built-in offline persistence cache:
///    FirebaseFirestore.instance.settings = const Settings(persistenceEnabled: true);
/// 2. Uses Hive (hive_flutter) as a resilient local write buffer.
/// 3. Enables the teacher to submit attendance offline without network.
/// 4. The app queues the write and syncs it to Firebase the second they walk into a Wi-Fi zone.
/// 5. On sync, Firebase Cloud Function aggregateAttendanceOnWrite silently increments presentCount.
class AttendanceOfflineManager {
  final FirebaseService _firebase;
  final AttendanceRepository _repo;

  static const String hiveBoxName = 'attendance_offline_queue';
  Box? _box;
  bool _isSyncing = false;

  AttendanceOfflineManager(this._firebase, this._repo);

  /// Initialize Hive box for offline attendance caching
  Future<void> initialize() async {
    try {
      // Ensure Firestore offline persistence cache is configured
      _firebase.firestore.settings = const Settings(
        persistenceEnabled: true,
        cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
      );

      // Open Hive persistence box
      if (!Hive.isBoxOpen(hiveBoxName)) {
        _box = await Hive.openBox(hiveBoxName);
      } else {
        _box = Hive.box(hiveBoxName);
      }

      debugPrint('[AttendanceOfflineManager] Initialized with ${_box?.length ?? 0} queued offline batches.');
    } catch (e) {
      debugPrint('[AttendanceOfflineManager] Init notice: $e');
    }
  }

  /// Submit attendance with offline-first guarantees:
  /// Writes to Firestore local persistence cache immediately.
  /// If offline, preserves in Hive queue and flushes upon Wi-Fi connection.
  Future<void> submitAttendanceWithOfflineFallback({
    required DateTime date,
    required String classId,
    required String sectionId,
    required String recordedByTeacherUid,
    required Map<String, AttendanceStatus> studentStatusMap,
    required bool isDeviceOnline,
  }) async {
    final docId = _repo.generateDocId(date: date, classId: classId, sectionId: sectionId);

    final Map<String, String> records = {};
    int presentCount = 0;
    studentStatusMap.forEach((studentId, status) {
      records[studentId] = status.code;
      if (status == AttendanceStatus.present) presentCount++;
    });

    if (!isDeviceOnline) {
      // 1. Queue locally in Hive offline box
      final queuedBatch = QueuedAttendanceBatch(
        docId: docId,
        date: date,
        classId: classId,
        sectionId: sectionId,
        recordedBy: recordedByTeacherUid,
        records: records,
        presentCount: presentCount,
        totalStudents: studentStatusMap.length,
        queuedAt: DateTime.now(),
      );

      await _box?.put(docId, queuedBatch.toMap());
      debugPrint('[AttendanceOfflineManager] Teacher submitted offline! Queued batch $docId in local cache.');

      // 2. Also write to Firestore local persistence cache (persisted in IndexedDB/SQLite)
      // It will not fail; Firestore queues the write internally
      try {
        await _repo.saveBatchAttendance(
          date: date,
          classId: classId,
          sectionId: sectionId,
          recordedByTeacherUid: recordedByTeacherUid,
          studentStatusMap: studentStatusMap,
        );
      } catch (e) {
        debugPrint('[AttendanceOfflineManager] Firestore offline cache stored mutation: $e');
      }
      return;
    }

    // ONLINE: Direct atomic commit
    await _repo.saveBatchAttendance(
      date: date,
      classId: classId,
      sectionId: sectionId,
      recordedByTeacherUid: recordedByTeacherUid,
      studentStatusMap: studentStatusMap,
    );
  }

  /// Automatically called the second the teacher walks into a Wi-Fi zone
  Future<int> onWiFiZoneConnected() async {
    if (_isSyncing || _box == null || _box!.isEmpty) return 0;
    _isSyncing = true;
    int syncedCount = 0;

    try {
      debugPrint('[AttendanceOfflineManager] Reconnected to Wi-Fi zone! Syncing ${_box!.length} pending batch(es)...');
      final keys = List.from(_box!.keys);

      for (final key in keys) {
        final data = _box!.get(key);
        if (data != null) {
          final batch = QueuedAttendanceBatch.fromMap(Map<dynamic, dynamic>.from(data));

          final Map<String, AttendanceStatus> statusMap = {};
          batch.records.forEach((studentId, code) {
            statusMap[studentId] = AttendanceStatusExtension.fromCode(code);
          });

          // Commit to Cloud Firestore
          await _repo.saveBatchAttendance(
            date: batch.date,
            classId: batch.classId,
            sectionId: batch.sectionId,
            recordedByTeacherUid: batch.recordedBy,
            studentStatusMap: statusMap,
          );

          // Remove from local Hive queue upon successful upload
          await _box!.delete(key);
          syncedCount++;
        }
      }

      debugPrint('[AttendanceOfflineManager] Successfully synced $syncedCount batches to Firebase. Cloud Function triggered!');
    } catch (e) {
      debugPrint('[AttendanceOfflineManager] Error syncing pending queue: $e');
    } finally {
      _isSyncing = false;
    }

    return syncedCount;
  }

  int get pendingQueueCount => _box?.length ?? 0;
}
