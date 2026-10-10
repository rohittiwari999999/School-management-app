import 'package:edupulse_sms/core/constants/app_constants.dart';

class ClassModel {
  final String classId;
  final String name; // e.g. "Nursery", "Class 5", "Class 11"
  final int gradeLevel; // 0 = Nursery, 1 = LKG, 2 = UKG, 3..14 for 1..12
  final AcademicTier tier;
  final List<String> availableSections;
  final List<AcademicStream> allowedStreams;

  const ClassModel({
    required this.classId,
    required this.name,
    required this.gradeLevel,
    required this.tier,
    required this.availableSections,
    this.allowedStreams = const [AcademicStream.none],
  });

  bool get requiresStreamSelection =>
      tier == AcademicTier.seniorSec || gradeLevel >= 13;

  bool get isPrePrimary => tier == AcademicTier.prePrimary;
}

class StudentProfile {
  final String studentId;
  final String schoolId;
  final String admissionNumber;
  final String fullName;
  final String classId;
  final String sectionId;
  final AcademicStream stream;
  final String? boardRollNumber; // Classes 10 & 12
  final String parentContact;
  final String parentUid;
  final String? bloodGroup;
  final double attendancePercentage;

  // Pre-Primary Observation Metrics
  final Map<String, dynamic>? prePrimaryMetrics; // motorSkills, socialBehavior, napMeals

  const StudentProfile({
    required this.studentId,
    required this.schoolId,
    required this.admissionNumber,
    required this.fullName,
    required this.classId,
    required this.sectionId,
    this.stream = AcademicStream.none,
    this.boardRollNumber,
    required this.parentContact,
    required this.parentUid,
    this.bloodGroup,
    this.attendancePercentage = 100.0,
    this.prePrimaryMetrics,
  });

  factory StudentProfile.fromFirestore(Map<String, dynamic> data, String id) {
    return StudentProfile(
      studentId: id,
      schoolId: data['schoolId'] ?? '',
      admissionNumber: data['admissionNumber'] ?? '',
      fullName: data['fullName'] ?? '',
      classId: data['classId'] ?? '',
      sectionId: data['sectionId'] ?? '',
      stream: _parseStream(data['stream']),
      boardRollNumber: data['boardRollNumber'],
      parentContact: data['parentContact'] ?? '',
      parentUid: data['parentUid'] ?? '',
      bloodGroup: data['bloodGroup'],
      attendancePercentage: (data['attendancePercentage'] ?? 100.0).toDouble(),
      prePrimaryMetrics: data['prePrimaryMetrics'] != null
          ? Map<String, dynamic>.from(data['prePrimaryMetrics'])
          : null,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'schoolId': schoolId,
      'admissionNumber': admissionNumber,
      'fullName': fullName,
      'classId': classId,
      'sectionId': sectionId,
      'stream': stream.name,
      'boardRollNumber': boardRollNumber,
      'parentContact': parentContact,
      'parentUid': parentUid,
      'bloodGroup': bloodGroup,
      'attendancePercentage': attendancePercentage,
      if (prePrimaryMetrics != null) 'prePrimaryMetrics': prePrimaryMetrics,
    };
  }

  static AcademicStream _parseStream(dynamic value) {
    if (value == null) return AcademicStream.none;
    for (var stream in AcademicStream.values) {
      if (stream.name == value.toString()) return stream;
    }
    return AcademicStream.none;
  }
}
