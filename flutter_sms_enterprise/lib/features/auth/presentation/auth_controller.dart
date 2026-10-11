import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/features/auth/data/auth_repository.dart';
import 'package:edupulse_sms/features/auth/domain/models/app_user.dart';

enum AuthStatus {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
}

class AuthState {
  final AuthStatus status;
  final AppUser? user;
  final String? errorMessage;
  final String? activeChildStudentId; // For Parent persona multi-child switcher

  const AuthState({
    this.status = AuthStatus.initial,
    this.user,
    this.errorMessage,
    this.activeChildStudentId,
  });

  AuthState copyWith({
    AuthStatus? status,
    AppUser? user,
    String? errorMessage,
    String? activeChildStudentId,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      errorMessage: errorMessage,
      activeChildStudentId: activeChildStudentId ?? this.activeChildStudentId,
    );
  }
}

final authControllerProvider =
    StateNotifierProvider<AuthController, AuthState>((ref) {
  final authRepo = ref.watch(authRepositoryProvider);
  return AuthController(authRepo);
});

class AuthController extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthController(this._repository) : super(const AuthState()) {
    _initialize();
  }

  void _initialize() {
    try {
      _repository.authStateChanges.listen((firebaseUser) async {
        if (firebaseUser != null) {
          state = state.copyWith(status: AuthStatus.loading);
          try {
            final userProfile = await _repository.getUserProfile(firebaseUser.uid);
            if (userProfile != null) {
              String? defaultChildId;
              if (userProfile.parentLinkedStudentIds != null &&
                  userProfile.parentLinkedStudentIds!.isNotEmpty) {
                defaultChildId = userProfile.parentLinkedStudentIds!.first;
              }
              state = state.copyWith(
                status: AuthStatus.authenticated,
                user: userProfile,
                activeChildStudentId: defaultChildId,
              );
            } else {
              state = state.copyWith(
                status: AuthStatus.unauthenticated,
                errorMessage: 'Profile does not exist.',
              );
            }
          } catch (e) {
            state = state.copyWith(
              status: AuthStatus.error,
              errorMessage: e.toString(),
            );
          }
        } else {
          state = const AuthState(status: AuthStatus.unauthenticated);
        }
      }, onError: (e) {
        state = const AuthState(status: AuthStatus.unauthenticated);
      });
    } catch (e) {
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  /// Instant Demo Mode Login for offline testing and review
  void loginAsDemoRole(UserRole role) {
    AppUser demoUser;
    switch (role) {
      case UserRole.principal:
        demoUser = const AppUser(
          uid: 'demo_principal_001',
          email: 'principal@edupulse.org',
          fullName: 'Dr. Rajesh Sharma (Principal)',
          role: UserRole.principal,
          schoolId: 'SCH_GLOBAL_001',
        );
        break;
      case UserRole.teacher:
      case UserRole.classTeacher:
        demoUser = const AppUser(
          uid: 'demo_teacher_001',
          email: 'teacher@edupulse.org',
          fullName: 'Mrs. Anjali Verma (Senior Faculty)',
          role: UserRole.teacher,
          schoolId: 'SCH_GLOBAL_001',
          studentClassId: 'CLASS_10',
          studentSectionId: 'SEC_A',
        );
        break;
      case UserRole.parentStudent:
        demoUser = const AppUser(
          uid: 'demo_parent_001',
          email: 'parent@edupulse.org',
          fullName: 'Mr. & Mrs. Kapoor (Parent)',
          role: UserRole.parentStudent,
          schoolId: 'SCH_GLOBAL_001',
          parentLinkedStudentIds: ['STU_10A_042', 'STU_06B_015'],
        );
        break;
      case UserRole.accountant:
        demoUser = const AppUser(
          uid: 'demo_accountant_001',
          email: 'accountant@edupulse.org',
          fullName: 'Mr. Sunil Gupta (Chief Bursar)',
          role: UserRole.accountant,
          schoolId: 'SCH_GLOBAL_001',
        );
        break;
    }

    state = AuthState(
      status: AuthStatus.authenticated,
      user: demoUser,
      activeChildStudentId: demoUser.parentLinkedStudentIds?.first,
    );
  }

  Future<void> signIn(String email, String password) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);
    try {
      final user = await _repository.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      String? defaultChildId;
      if (user.parentLinkedStudentIds != null &&
          user.parentLinkedStudentIds!.isNotEmpty) {
        defaultChildId = user.parentLinkedStudentIds!.first;
      }
      state = state.copyWith(
        status: AuthStatus.authenticated,
        user: user,
        activeChildStudentId: defaultChildId,
      );
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.toString(),
      );
    }
  }

  /// Switch active child for multi-child parent
  void switchActiveChild(String studentId) {
    if (state.user != null &&
        state.user!.parentLinkedStudentIds != null &&
        state.user!.parentLinkedStudentIds!.contains(studentId)) {
      state = state.copyWith(activeChildStudentId: studentId);
    }
  }

  Future<void> signOut() async {
    await _repository.signOut();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }
}
