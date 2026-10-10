import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/features/auth/presentation/auth_controller.dart';
import 'package:edupulse_sms/features/teacher/presentation/teacher_dashboard_screen.dart';
import 'package:edupulse_sms/features/principal/presentation/principal_dashboard_screen.dart';
import 'package:edupulse_sms/features/parent_student/presentation/family_dashboard_screen.dart';
import 'package:edupulse_sms/features/fees/presentation/accountant_dashboard_screen.dart';
import 'package:edupulse_sms/features/exams/presentation/exam_results_screen.dart';
import 'package:edupulse_sms/features/timetable/presentation/timetable_screen.dart';
import 'package:edupulse_sms/features/communication/presentation/communication_screen.dart';
import 'package:edupulse_sms/features/conference/domain/conference_models.dart';
import 'package:edupulse_sms/features/conference/presentation/live_conference_screen.dart';

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

      // If logged in and still at login screen, route to respective role home
      if (isLoggingIn) {
        switch (user.role) {
          case UserRole.principal:
            return '/principal/dashboard';
          case UserRole.teacher:
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
      if (path.startsWith('/teacher') && user.role != UserRole.teacher && user.role != UserRole.classTeacher) {
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
      GoRoute(
        path: '/login',
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('EduPulse Secure Login Screen')),
        ),
      ),
      GoRoute(
        path: '/principal/dashboard',
        builder: (context, state) => const PrincipalDashboardScreen(),
      ),
      GoRoute(
        path: '/teacher/dashboard',
        builder: (context, state) => const TeacherDashboardScreen(),
      ),
      GoRoute(
        path: '/family/dashboard',
        builder: (context, state) => const FamilyDashboardScreen(),
      ),
      GoRoute(
        path: '/accountant/dashboard',
        builder: (context, state) => const AccountantDashboardScreen(),
      ),
      GoRoute(
        path: '/exams',
        builder: (context, state) => const ExamResultsScreen(),
      ),
      GoRoute(
        path: '/timetable',
        builder: (context, state) => const TimetableScreen(),
      ),
      GoRoute(
        path: '/communication',
        builder: (context, state) => const CommunicationScreen(),
      ),
      GoRoute(
        path: '/conference',
        builder: (context, state) {
          final extra = state.extra;
          LiveConferenceModel conf;
          bool isHost = false;

          if (extra is Map<String, dynamic>) {
            conf = extra['conference'] as LiveConferenceModel? ??
                LiveConferenceModel(
                  sessionId: 'CONF_DEFAULT',
                  title: 'Class 11-A Physics • Ray Optics',
                  subjectName: 'Physics',
                  classId: 'CLS_11',
                  className: 'Class 11-A',
                  hostUid: 'USR_TEACHER_01',
                  hostName: 'Dr. Ananya Sen',
                  hostRole: 'Faculty',
                  status: ConferenceStatus.live,
                  startTime: DateTime.now(),
                  durationMinutes: 45,
                  participantsCount: 1,
                  meetingType: MeetingType.classLesson,
                  roomCode: 'PHY-11A-LIVE',
                );
            isHost = extra['isHost'] as bool? ?? false;
          } else if (extra is LiveConferenceModel) {
            conf = extra;
          } else {
            conf = LiveConferenceModel(
              sessionId: 'CONF_DEFAULT',
              title: 'Class 11-A Physics • Ray Optics',
              subjectName: 'Physics',
              classId: 'CLS_11',
              className: 'Class 11-A',
              hostUid: 'USR_TEACHER_01',
              hostName: 'Dr. Ananya Sen',
              hostRole: 'Faculty',
              status: ConferenceStatus.live,
              startTime: DateTime.now(),
              durationMinutes: 45,
              participantsCount: 1,
              meetingType: MeetingType.classLesson,
              roomCode: 'PHY-11A-LIVE',
            );
          }

          return LiveConferenceScreen(
            conference: conf,
            isHost: isHost,
          );
        },
      ),
    ],
  );
});

String _getDefaultRouteForRole(UserRole role) {
  switch (role) {
    case UserRole.principal:
      return '/principal/dashboard';
    case UserRole.teacher:
    case UserRole.classTeacher:
      return '/teacher/dashboard';
    case UserRole.parentStudent:
      return '/family/dashboard';
    case UserRole.accountant:
      return '/accountant/dashboard';
  }
}
