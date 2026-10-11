import 'package:edupulse_sms/core/constants/app_constants.dart';
export 'package:edupulse_sms/core/constants/app_constants.dart' show UserRole, UserRoleExtension;

class AppUser {
  final String uid;
  final String email;
  final String fullName;
  final UserRole role;
  final String schoolId;
  final String? phoneNumber;
  final String? avatarUrl;
  final List<String> fcmTokens;
  final Map<String, dynamic> metadata;

  // Role-specific relational pointers
  final String? studentClassId;
  final String? studentSectionId;
  final List<String>? parentLinkedStudentIds; // Siblings linked for Parent persona

  const AppUser({
    required this.uid,
    required this.email,
    required this.fullName,
    required this.role,
    required this.schoolId,
    this.phoneNumber,
    this.avatarUrl,
    this.fcmTokens = const [],
    this.metadata = const {},
    this.studentClassId,
    this.studentSectionId,
    this.parentLinkedStudentIds,
  });

  factory AppUser.fromFirestore(Map<String, dynamic> data, String uid) {
    return AppUser(
      uid: uid,
      email: data['email'] ?? '',
      fullName: data['fullName'] ?? 'User',
      role: UserRoleExtension.fromString(data['role'] ?? 'student'),
      schoolId: data['schoolId'] ?? 'SCH_GLOBAL_001',
      phoneNumber: data['phoneNumber'],
      avatarUrl: data['avatarUrl'],
      fcmTokens: List<String>.from(data['fcmTokens'] ?? []),
      metadata: Map<String, dynamic>.from(data['metadata'] ?? {}),
      studentClassId: data['studentClassId'],
      studentSectionId: data['studentSectionId'],
      parentLinkedStudentIds: data['parentLinkedStudentIds'] != null
          ? List<String>.from(data['parentLinkedStudentIds'])
          : null,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'email': email,
      'fullName': fullName,
      'role': role.idName,
      'schoolId': schoolId,
      'phoneNumber': phoneNumber,
      'avatarUrl': avatarUrl,
      'fcmTokens': fcmTokens,
      'metadata': metadata,
      if (studentClassId != null) 'studentClassId': studentClassId,
      if (studentSectionId != null) 'studentSectionId': studentSectionId,
      if (parentLinkedStudentIds != null)
        'parentLinkedStudentIds': parentLinkedStudentIds,
    };
  }
}
