/// Core constants for EduPulse K-12 SMS
class AppConstants {
  static const String appName = 'EduPulse K-12 ERP';
  static const String currentAcademicYear = '2026-2027';

  // Firestore Collections matching normalized schema
  static const String colSchools = 'schools';
  static const String colUsers = 'users';
  static const String colAcademicYears = 'academic_years';
  static const String colClasses = 'classes';
  static const String colSections = 'sections';
  static const String colSubjects = 'subjects';
  static const String colStudents = 'students';
  static const String colAttendance = 'attendance';
  static const String colFeeStructures = 'fee_structures';
  static const String colInvoices = 'invoices';
  static const String colExams = 'exams';
  static const String colResults = 'results';
  static const String colDiaryEntries = 'diary_entries';
  static const String colMessages = 'messages';
}

/// Academic Grade Tiers in K-12
enum AcademicTier {
  prePrimary, // Nursery, LKG, UKG
  primary,    // Class 1 to 5
  middle,     // Class 6 to 8
  secondary,  // Class 9 & 10
  seniorSec,  // Class 11 & 12
}

/// Academic streams for senior secondary
enum AcademicStream {
  none,
  sciencePCM,
  sciencePCB,
  commerce,
  artsHumanities,
}

/// Multirole RBAC: Super Admin, Principal, Teacher, Class Teacher, Unified Parent & Student, Accountant
enum UserRole {
  superAdmin,
  principal,
  teacher,
  classTeacher,
  parentStudent,
  accountant,
}

extension UserRoleExtension on UserRole {
  String get displayName {
    switch (this) {
      case UserRole.superAdmin:
        return 'Super Admin (Institutional Governance)';
      case UserRole.principal:
        return 'Principal (Head of School)';
      case UserRole.teacher:
        return 'Teacher Dashboard (Subject Faculty)';
      case UserRole.classTeacher:
        return 'Class Teacher';
      case UserRole.parentStudent:
        return 'Parent Portal (Family & Guardian)';
      case UserRole.accountant:
        return 'Accountant / Cashier';
    }
  }

  String get idName {
    switch (this) {
      case UserRole.superAdmin:
        return 'super_admin';
      case UserRole.principal:
        return 'principal';
      case UserRole.teacher:
        return 'teacher';
      case UserRole.classTeacher:
        return 'class_teacher';
      case UserRole.parentStudent:
        return 'parent_student';
      case UserRole.accountant:
        return 'accountant';
    }
  }

  static UserRole fromString(String role) {
    switch (role.toLowerCase()) {
      case 'super_admin':
        return UserRole.superAdmin;
      case 'principal':
        return UserRole.principal;
      case 'teacher':
        return UserRole.teacher;
      case 'class_teacher':
        return UserRole.classTeacher;
      case 'parent_student':
      case 'parent':
      case 'student':
        return UserRole.parentStudent;
      case 'accountant':
      case 'cashier':
        return UserRole.accountant;
      default:
        return UserRole.parentStudent;
    }
  }
}
