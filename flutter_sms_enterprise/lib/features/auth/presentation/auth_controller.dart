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

  AuthController(this._repository)
      : super(const AuthState(
          status: AuthStatus.authenticated,
          user: AppUser(
            uid: 'USR_TEACHER_01',
            email: 'priya.sharma@edupulse.edu',
            fullName: 'Ms. Priya Sharma',
            role: UserRole.teacher,
            schoolId: 'SCH_GLOBAL_001',
            avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
            phoneNumber: '+91 98112 23344',
            designation: 'Senior Faculty & Class In-Charge',
            studentClassId: 'CLS_11',
            studentSectionId: 'SEC_A',
          ),
        )) {
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
            }
          } catch (_) {}
        }
      });
    } catch (_) {}
  }

  /// Instant Demo Mode Login matching Web preview app
  void loginAsDemoRole(UserRole role) {
    AppUser demoUser;
    switch (role) {
      case UserRole.superAdmin:
        demoUser = const AppUser(
          uid: 'USR_SUPER_ADMIN_01',
          email: 'superadmin@edupulse.edu',
          fullName: 'Shri Vikramaditya Roy',
          role: UserRole.superAdmin,
          schoolId: 'SCH_GLOBAL_001',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          phoneNumber: '+91 99990 11223',
          designation: 'Super Admin & Institutional Board Trustee',
        );
        break;
      case UserRole.principal:
        demoUser = const AppUser(
          uid: 'USR_ADMIN_01',
          email: 'principal@edupulse.edu',
          fullName: 'Dr. Alok Verma',
          role: UserRole.principal,
          schoolId: 'SCH_GLOBAL_001',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          phoneNumber: '+91 98765 43210',
          designation: 'Principal & Head of School',
        );
        break;
      case UserRole.teacher:
      case UserRole.classTeacher:
        demoUser = const AppUser(
          uid: 'USR_TEACHER_01',
          email: 'priya.sharma@edupulse.edu',
          fullName: 'Ms. Priya Sharma',
          role: UserRole.teacher,
          schoolId: 'SCH_GLOBAL_001',
          avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
          phoneNumber: '+91 98112 23344',
          designation: 'Senior Faculty & Class In-Charge',
          studentClassId: 'CLS_11',
          studentSectionId: 'SEC_A',
        );
        break;
      case UserRole.parentStudent:
        demoUser = const AppUser(
          uid: 'USR_PARENT_STUDENT_01',
          email: 'family.sharma@edupulse.edu',
          fullName: 'Sharma Family (Parent)',
          role: UserRole.parentStudent,
          schoolId: 'SCH_GLOBAL_001',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          phoneNumber: '+91 99887 76655',
          designation: 'Parent Portal (Family & Guardian)',
          parentLinkedStudentIds: ['STU_CLASS11_01', 'STU_CLASS5_01', 'STU_NURSERY_01'],
        );
        break;
      case UserRole.accountant:
        demoUser = const AppUser(
          uid: 'USR_ACCOUNTANT_01',
          email: 'vikram.goel@edupulse.edu',
          fullName: 'Mr. Vikram Goel',
          role: UserRole.accountant,
          schoolId: 'SCH_GLOBAL_001',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          phoneNumber: '+91 97654 32109',
          designation: 'Accounts & Bursar',
        );
        break;
    }

    state = AuthState(
      status: AuthStatus.authenticated,
      user: demoUser,
      activeChildStudentId: demoUser.parentLinkedStudentIds?.first,
    );
  }

  void updateUserAvatar(String newAvatarUrl) {
    if (state.user != null) {
      final updated = AppUser(
        uid: state.user!.uid,
        email: state.user!.email,
        fullName: state.user!.fullName,
        role: state.user!.role,
        schoolId: state.user!.schoolId,
        phoneNumber: state.user!.phoneNumber,
        avatarUrl: newAvatarUrl,
        designation: state.user!.designation,
        fcmTokens: state.user!.fcmTokens,
        metadata: state.user!.metadata,
        studentClassId: state.user!.studentClassId,
        studentSectionId: state.user!.studentSectionId,
        parentLinkedStudentIds: state.user!.parentLinkedStudentIds,
      );
      state = state.copyWith(user: updated);
    }
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
