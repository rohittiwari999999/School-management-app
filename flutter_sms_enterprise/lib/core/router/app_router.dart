import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/features/auth/presentation/auth_controller.dart';
import 'package:edupulse_sms/features/auth/presentation/login_screen.dart';
import 'package:edupulse_sms/features/super_admin/presentation/super_admin_dashboard_screen.dart';
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
    initialLocation: '/teacher/dashboard',
    redirect: (BuildContext context, GoRouterState state) {
      final isAuth = authState.status == AuthStatus.authenticated;
      final isLoggingIn = state.matchedLocation == '/login';

      if (!isAuth) {
        return isLoggingIn ? null : '/teacher/dashboard';
      }

      final user = authState.user;
      if (user == null) return null;

      // If logged in and at login screen, route to user role home
      if (isLoggingIn) {
        switch (user.role) {
          case UserRole.superAdmin:
            return '/super_admin/dashboard';
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

      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/super_admin/dashboard',
        builder: (context, state) => const SuperAdminDashboardScreen(),
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
    case UserRole.superAdmin:
      return '/super_admin/dashboard';
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
