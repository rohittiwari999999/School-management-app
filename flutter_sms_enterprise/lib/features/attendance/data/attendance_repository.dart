import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/core/network/firebase_service.dart';

enum AttendanceStatus { present, absent, leave }

extension AttendanceStatusExtension on AttendanceStatus {
  String get code {
    switch (this) {
      case AttendanceStatus.present:
        return 'P';
      case AttendanceStatus.absent:
        return 'A';
      case AttendanceStatus.leave:
        return 'L';
    }
  }

  static AttendanceStatus fromCode(String code) {
    switch (code.toUpperCase()) {
      case 'P':
        return AttendanceStatus.present;
      case 'A':
        return AttendanceStatus.absent;
      case 'L':
        return AttendanceStatus.leave;
      default:
        return AttendanceStatus.present;
    }
  }
}

final attendanceRepositoryProvider = Provider<AttendanceRepository>((ref) {
  final firebaseService = ref.watch(firebaseServiceProvider);
  return AttendanceRepository(firebaseService);
});

class AttendanceRepository {
  final FirebaseService _firebase;

  AttendanceRepository(this._firebase);

  String generateDocId({
    required DateTime date,
    required String classId,
    required String sectionId,
  }) {
    final dateStr =
        '${date.year.toString().padLeft(4, '0')}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
    return '${dateStr}_${classId}_$sectionId';
  }

  /// Submit batch roll-call attendance to Firestore
  Future<void> saveBatchAttendance({
    required DateTime date,
    required String classId,
    required String sectionId,
    required String recordedByTeacherUid,
    required Map<String, AttendanceStatus> studentStatusMap,
  }) async {
    final docId = generateDocId(
      date: date,
      classId: classId,
      sectionId: sectionId,
    );

    final Map<String, String> records = {};
    int presentCount = 0;
    int absentCount = 0;
    int leaveCount = 0;

    studentStatusMap.forEach((studentId, status) {
      records[studentId] = status.code;
      if (status == AttendanceStatus.present) presentCount++;
      if (status == AttendanceStatus.absent) absentCount++;
      if (status == AttendanceStatus.leave) leaveCount++;
    });

    final batch = _firebase.firestore.batch();
    final attendanceDocRef =
        _firebase.firestore.collection(AppConstants.colAttendance).doc(docId);

    batch.set(
      attendanceDocRef,
      {
        'date': Timestamp.fromDate(date),
        'classId': classId,
        'sectionId': sectionId,
        'recordedBy': recordedByTeacherUid,
        'records': records,
        'totalStudents': studentStatusMap.length,
        'presentCount': presentCount,
        'absentCount': absentCount,
        'leaveCount': leaveCount,
        'updatedAt': FieldValue.serverTimestamp(),
      },
      SetOptions(merge: true),
    );

    // Commit atomic write
    await batch.commit();
  }

  /// Fetch attendance record for class-section on specific date
  Future<Map<String, AttendanceStatus>?> fetchAttendanceForDate({
    required DateTime date,
    required String classId,
    required String sectionId,
  }) async {
    final docId = generateDocId(
      date: date,
      classId: classId,
      sectionId: sectionId,
    );

    final snapshot = await _firebase.firestore
        .collection(AppConstants.colAttendance)
        .doc(docId)
        .get();

    if (!snapshot.exists || snapshot.data() == null) {
      return null;
    }

    final data = snapshot.data()!;
    final recordsRaw = Map<String, dynamic>.from(data['records'] ?? {});
    final Map<String, AttendanceStatus> result = {};

    recordsRaw.forEach((studentId, code) {
      result[studentId] = AttendanceStatusExtension.fromCode(code.toString());
    });

    return result;
  }
}
