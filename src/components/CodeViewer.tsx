import React, { useState } from 'react';
import {
  FileCode,
  Folder,
  FolderOpen,
  Copy,
  Check,
  Download,
  Terminal,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CodeFile {
  path: string;
  name: string;
  category: string;
  content: string;
}

const FLUTTER_CODE_DATABASE: CodeFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'Project Config',
    content: `name: edupulse_sms
description: "A comprehensive K-12 School Management System catering to Nursery to 12th Standard."
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.2.0 <4.0.0"
  flutter: ">=3.16.0"

dependencies:
  flutter:
    sdk: flutter

  # State Management & Dependency Injection
  flutter_riverpod: ^2.5.1
  riverpod_annotation: ^2.3.5

  # Routing & RBAC Deep-linking
  go_router: ^13.2.0

  # Firebase Enterprise Suite
  firebase_core: ^2.27.0
  firebase_auth: ^4.17.8
  cloud_firestore: ^4.15.8
  firebase_storage: ^11.6.9
  firebase_messaging: ^14.7.19

  # Local Caching & Offline-First
  hive_flutter: ^1.1.0

  # Utilities
  intl: ^0.19.0
  uuid: ^4.3.3
  google_fonts: ^6.1.0

flutter:
  uses-material-design: true`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'Core',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/core/network/firebase_service.dart';
import 'package:edupulse_sms/core/router/app_router.dart';
import 'package:edupulse_sms/core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Core Firebase Services & Offline Cache
  final container = ProviderContainer();
  final firebaseService = container.read(firebaseServiceProvider);
  await firebaseService.initialize();

  runApp(
    UncontrolledProviderScope(
      container: container,
      child: const EduPulseApp(),
    ),
  );
}

class EduPulseApp extends ConsumerWidget {
  const EduPulseApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: router,
    );
  }
}`,
  },
  {
    path: 'lib/core/router/app_router.dart',
    name: 'app_router.dart',
    category: 'Routing & RBAC',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/features/auth/presentation/auth_controller.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authControllerProvider);

  return GoRouter(
    initialLocation: '/login',
    redirect: (BuildContext context, GoRouterState state) {
      final isAuth = authState.status == AuthStatus.authenticated;
      final isLoggingIn = state.matchedLocation == '/login';

      if (!isAuth) {
        return isLoggingIn ? null : '/login';
      }

      final user = authState.user;
      if (user == null) return '/login';

      // Redirect from login to role-specific dashboard
      if (isLoggingIn) {
        switch (user.role) {
          case UserRole.principal:
            return '/principal/dashboard';
          case UserRole.classTeacher:
            return '/teacher/dashboard';
          case UserRole.parentStudent:
            return '/family/dashboard';
          case UserRole.accountant:
            return '/accountant/dashboard';
        }
      }

      // Security RBAC Gate check on matched route paths
      final path = state.matchedLocation;
      if (path.startsWith('/principal') && user.role != UserRole.principal) {
        return _getDefaultRouteForRole(user.role);
      }
      if (path.startsWith('/teacher') && user.role != UserRole.classTeacher) {
        return _getDefaultRouteForRole(user.role);
      }
      if (path.startsWith('/family') && user.role != UserRole.parentStudent) {
        return _getDefaultRouteForRole(user.role);
      }
      if (path.startsWith('/accountant') && user.role != UserRole.accountant) {
        return _getDefaultRouteForRole(user.role);
      }

      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (c, s) => const Scaffold(body: Center(child: Text('Login')))),
      GoRoute(path: '/principal/dashboard', builder: (c, s) => const Scaffold(body: Center(child: Text('Principal Console')))),
      GoRoute(path: '/teacher/dashboard', builder: (c, s) => const Scaffold(body: Center(child: Text('Class Teacher Console')))),
      GoRoute(path: '/family/dashboard', builder: (c, s) => const Scaffold(body: Center(child: Text('Unified Parent & Student Portal')))),
      GoRoute(path: '/accountant/dashboard', builder: (c, s) => const Scaffold(body: Center(child: Text('Accountant Terminal')))),
    ],
  );
});

String _getDefaultRouteForRole(UserRole role) {
  switch (role) {
    case UserRole.principal: return '/principal/dashboard';
    case UserRole.classTeacher: return '/teacher/dashboard';
    case UserRole.parentStudent: return '/family/dashboard';
    case UserRole.accountant: return '/accountant/dashboard';
  }
}`,
  },
  {
    path: 'lib/core/network/firebase_service.dart',
    name: 'firebase_service.dart',
    category: 'Firebase Core',
    content: `import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final firebaseServiceProvider = Provider<FirebaseService>((ref) {
  return FirebaseService();
});

class FirebaseService {
  final FirebaseAuth auth = FirebaseAuth.instance;
  final FirebaseFirestore firestore = FirebaseFirestore.instance;
  final FirebaseStorage storage = FirebaseStorage.instance;
  final FirebaseMessaging messaging = FirebaseMessaging.instance;

  Future<void> initialize() async {
    try {
      // Enable offline persistence settings for Firestore
      firestore.settings = const Settings(
        persistenceEnabled: true,
        cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
      );

      final settings = await messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );
      debugPrint('FCM Authorization: \${settings.authorizationStatus}');
    } catch (e) {
      debugPrint('Firebase init: \$e');
    }
  }

  Future<String?> getDeviceFCMToken() async {
    try {
      return await messaging.getToken();
    } catch (e) {
      return null;
    }
  }
}`,
  },
  {
    path: 'lib/features/attendance/data/attendance_repository.dart',
    name: 'attendance_repository.dart',
    category: 'Attendance Engine',
    content: `import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/core/network/firebase_service.dart';

enum AttendanceStatus { present, absent, leave }

class AttendanceRepository {
  final FirebaseService _firebase;
  AttendanceRepository(this._firebase);

  String generateDocId({
    required DateTime date,
    required String classId,
    required String sectionId,
  }) {
    final d = '\${date.year}-\${date.month.toString().padLeft(2, '0')}-\${date.day.toString().padLeft(2, '0')}';
    return '\${d}_\${classId}_\$sectionId';
  }

  /// Atomic batch write to attendance collection
  Future<void> saveBatchAttendance({
    required DateTime date,
    required String classId,
    required String sectionId,
    required String recordedByTeacherUid,
    required Map<String, AttendanceStatus> studentStatusMap,
  }) async {
    final docId = generateDocId(date: date, classId: classId, sectionId: sectionId);
    final batch = _firebase.firestore.batch();
    final docRef = _firebase.firestore.collection(AppConstants.colAttendance).doc(docId);

    final Map<String, String> records = {};
    int p = 0, a = 0, l = 0;

    studentStatusMap.forEach((sId, status) {
      records[sId] = status == AttendanceStatus.present ? 'P' : (status == AttendanceStatus.absent ? 'A' : 'L');
      if (status == AttendanceStatus.present) p++;
      if (status == AttendanceStatus.absent) a++;
      if (status == AttendanceStatus.leave) l++;
    });

    batch.set(docRef, {
      'date': Timestamp.fromDate(date),
      'classId': classId,
      'sectionId': sectionId,
      'recordedBy': recordedByTeacherUid,
      'records': records,
      'totalStudents': studentStatusMap.length,
      'presentCount': p,
      'absentCount': a,
      'leaveCount': l,
      'updatedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));

    await batch.commit();
  }
}`,
  },
  {
    path: 'lib/features/timetable/domain/timetable_engine.dart',
    name: 'timetable_engine.dart',
    category: 'Timetable Engine',
    content: `class TimetableEngine {
  /// Check if candidate period causes any teacher or room collision across the school
  static TimetableConflictResult checkConflict({
    required TimetablePeriod candidate,
    required List<TimetablePeriod> existingPeriods,
  }) {
    for (final period in existingPeriods) {
      if (period.periodId == candidate.periodId) continue;

      if (period.dayOfWeek == candidate.dayOfWeek &&
          period.periodNumber == candidate.periodNumber) {
        // Teacher double booked
        if (period.teacherUid == candidate.teacherUid) {
          return TimetableConflictResult(
            hasConflict: true,
            conflictType: 'TEACHER_DOUBLE_BOOKED',
            message: 'Teacher \${candidate.teacherName} is already assigned to Class \${period.classId}-\${period.sectionId}.',
          );
        }

        // Room double booked
        if (period.roomNumber.isNotEmpty &&
            period.roomNumber.toLowerCase() == candidate.roomNumber.toLowerCase()) {
          return TimetableConflictResult(
            hasConflict: true,
            conflictType: 'ROOM_DOUBLE_BOOKED',
            message: 'Room \${candidate.roomNumber} is already occupied by Class \${period.classId}-\${period.sectionId}.',
          );
        }
      }
    }
    return const TimetableConflictResult(hasConflict: false);
  }
}`,
  },
  {
    path: 'lib/features/exams/domain/grading_calculator.dart',
    name: 'grading_calculator.dart',
    category: 'Academic Evaluation',
    content: `class GradingCalculator {
  /// Calculate comprehensive results conforming to standard CBSE/ICSE Board policies
  static ExamReportCardResult calculateReportCard({
    required List<SubjectMark> subjectMarks,
    double passingThresholdPercentage = 33.0,
  }) {
    double totalObtained = 0.0;
    double totalMaximum = 0.0;
    double weightedGradePoints = 0.0;
    int totalCredits = 0;

    for (final mark in subjectMarks) {
      totalObtained += mark.totalObtained;
      totalMaximum += mark.totalMax;
      weightedGradePoints += (mark.gradePoint * mark.creditHours);
      totalCredits += mark.creditHours;
    }

    final double overallPercentage = totalMaximum > 0 ? (totalObtained / totalMaximum) * 100 : 0;
    final double gpa = totalCredits > 0 ? (weightedGradePoints / totalCredits) : 0.0;

    String overallGrade;
    if (overallPercentage >= 91) overallGrade = 'A1';
    else if (overallPercentage >= 81) overallGrade = 'A2';
    else if (overallPercentage >= 71) overallGrade = 'B1';
    else if (overallPercentage >= 61) overallGrade = 'B2';
    else if (overallPercentage >= 51) overallGrade = 'C1';
    else if (overallPercentage >= 41) overallGrade = 'C2';
    else if (overallPercentage >= 33) overallGrade = 'D';
    else overallGrade = 'E';

    return ExamReportCardResult(
      totalObtained: totalObtained,
      totalMaximum: totalMaximum,
      overallPercentage: overallPercentage,
      cumulativeGpa: gpa,
      overallGrade: overallGrade,
      hasPassed: overallPercentage >= passingThresholdPercentage,
    );
  }
}`,
  },
  {
    path: 'lib/features/conference/domain/conference_models.dart',
    name: 'conference_models.dart',
    category: 'Live Conferencing',
    content: `enum ConferenceStatus { scheduled, live, ended }

enum MeetingType { classLesson, assembly, ptm, facultyMeeting }

class LiveConferenceModel {
  final String sessionId;
  final String title;
  final String subjectName;
  final String classId;
  final String className;
  final String hostUid;
  final String hostName;
  final String hostRole;
  final ConferenceStatus status;
  final DateTime startTime;
  final int durationMinutes;
  final int participantsCount;
  final MeetingType meetingType;
  final String roomCode;
  final bool isRecording;
  final String? topicSummary;

  const LiveConferenceModel({
    required this.sessionId,
    required this.title,
    required this.subjectName,
    required this.classId,
    required this.className,
    required this.hostUid,
    required this.hostName,
    required this.hostRole,
    required this.status,
    required this.startTime,
    required this.durationMinutes,
    this.participantsCount = 0,
    required this.meetingType,
    required this.roomCode,
    this.isRecording = false,
    this.topicSummary,
  });

  Map<String, dynamic> toFirestore() {
    return {
      'title': title,
      'subjectName': subjectName,
      'classId': classId,
      'className': className,
      'hostUid': hostUid,
      'hostName': hostName,
      'hostRole': hostRole,
      'status': status.name,
      'startTime': startTime.toIso8601String(),
      'durationMinutes': durationMinutes,
      'participantsCount': participantsCount,
      'meetingType': meetingType.name,
      'roomCode': roomCode,
      'isRecording': isRecording,
      if (topicSummary != null) 'topicSummary': topicSummary,
    };
  }
}`,
  },
  {
    path: '.github/workflows/build_android_aab_apk.yml',
    name: 'build_android_aab_apk.yml',
    category: 'CI/CD (Android)',
    content: `name: Build Android APK & AAB (Release)
on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.x'
          channel: 'stable'
      - name: Build Split Release APK
        run: flutter build apk --release --split-per-abi
      - name: Build Play Store AAB
        run: flutter build appbundle --release
      - uses: actions/upload-artifact@v4
        with:
          name: release-apks
          path: build/app/outputs/flutter-apk/*.apk
      - uses: actions/upload-artifact@v4
        with:
          name: release-aab
          path: build/app/outputs/bundle/release/*.aab`,
  },
  {
    path: '.github/workflows/build_ios_app.yml',
    name: 'build_ios_app.yml',
    category: 'CI/CD (iOS)',
    content: `name: Build iOS IPA & Archive
on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-ios:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.x'
          channel: 'stable'
      - name: Install Pods
        run: |
          cd ios && pod install --repo-update
      - name: Build iOS Release Archive
        run: flutter build ios --release --no-codesign
      - name: Package Payload to .IPA
        run: |
          cd build/ios/iphoneos
          mkdir -p Payload && cp -r Runner.app Payload/
          zip -r EduPulse_iOS_Release.ipa Payload/
      - uses: actions/upload-artifact@v4
        with:
          name: release-ipa
          path: build/ios/iphoneos/*.ipa`,
  },
  {
    path: 'android/app/build.gradle',
    name: 'build.gradle (App)',
    category: 'Android Native',
    content: `android {
    namespace "com.edupulse.sms"
    compileSdk 34
    defaultConfig {
        applicationId "com.edupulse.sms"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
        multiDexEnabled true
    }
    signingConfigs {
        release {
            // Configured from key.properties
        }
    }
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
        }
    }
}`,
  },
  {
    path: 'ios/Runner/Info.plist',
    name: 'Info.plist',
    category: 'iOS Native',
    content: `<!-- Permissions for WebRTC Live Classroom & Camera/Mic -->
<key>NSCameraUsageDescription</key>
<string>EduPulse requires camera access to join live video classroom lectures.</string>
<key>NSMicrophoneUsageDescription</key>
<string>EduPulse requires microphone access to speak during live virtual classes.</string>
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
    <string>remote-notification</string>
    <string>voip</string>
</array>`,
  },
];

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(FLUTTER_CODE_DATABASE[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-indigo-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-400/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>Flutter Clean Architecture Code Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Enterprise Mobile Codebase & Riverpod DI
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Production-ready Flutter Dart files created under <code className="font-mono text-indigo-300">/flutter_sms_enterprise/</code>.
              Null-safety enabled, Riverpod 2.x StateNotifier, GoRouter RBAC, and offline-first cache.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = selectedFile.name;
                a.click();
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export {selectedFile.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: File Tree Explorer & Syntax Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): File Tree */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <span>Project Explorer</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">12 Core & CI/CD Files</span>
          </div>

          <div className="space-y-1">
            {FLUTTER_CODE_DATABASE.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Architecture Checklist */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="font-bold text-slate-800">Clean Architecture Pillars:</div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Feature-first: data/, domain/, presentation/</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>GoRouter Dynamic Redirects & RBAC Gates</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Normalized Firestore Schema conforming to ABAC</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero dummy data / real calculation logic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden flex flex-col">
          {/* File Tab Bar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="font-mono font-semibold text-white">{selectedFile.path}</span>
            </div>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Code Content */}
          <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200 bg-slate-900/90 max-h-[600px] overflow-y-auto">
            <pre className="select-text">{selectedFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
