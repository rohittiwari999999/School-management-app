import 'package:flutter/material.dart';
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

      // If logged in and still at login screen, route to respective role home
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
      GoRoute(
        path: '/login',
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('EduPulse Secure Login Screen')),
        ),
      ),
      GoRoute(
        path: '/principal/dashboard',
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Principal & Executive Leadership Console')),
        ),
      ),
      GoRoute(
        path: '/teacher/dashboard',
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Class Teacher Academic & Roll-call Console')),
        ),
      ),
      GoRoute(
        path: '/family/dashboard',
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Unified Parent & Student Family Portal')),
        ),
      ),
      GoRoute(
        path: '/accountant/dashboard',
        builder: (context, state) => const Scaffold(
          body: Center(child: Text('Finance & Invoicing Terminal')),
        ),
      ),
    ],
  );
});

String _getDefaultRouteForRole(UserRole role) {
  switch (role) {
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
