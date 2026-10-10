class TimetablePeriod {
  final String periodId;
  final int dayOfWeek; // 1 = Monday ... 6 = Saturday
  final int periodNumber; // 1 to 8
  final String startTime; // e.g. "08:30 AM"
  final String endTime;   // e.g. "09:15 AM"
  final String classId;
  final String sectionId;
  final String subjectCode;
  final String subjectName;
  final String teacherUid;
  final String teacherName;
  final String roomNumber;

  const TimetablePeriod({
    required this.periodId,
    required this.dayOfWeek,
    required this.periodNumber,
    required this.startTime,
    required this.endTime,
    required this.classId,
    required this.sectionId,
    required this.subjectCode,
    required this.subjectName,
    required this.teacherUid,
    required this.teacherName,
    required this.roomNumber,
  });

  Map<String, dynamic> toMap() {
    return {
      'periodId': periodId,
      'dayOfWeek': dayOfWeek,
      'periodNumber': periodNumber,
      'startTime': startTime,
      'endTime': endTime,
      'classId': classId,
      'sectionId': sectionId,
      'subjectCode': subjectCode,
      'subjectName': subjectName,
      'teacherUid': teacherUid,
      'teacherName': teacherName,
      'roomNumber': roomNumber,
    };
  }

  factory TimetablePeriod.fromMap(Map<String, dynamic> map) {
    return TimetablePeriod(
      periodId: map['periodId'] ?? '',
      dayOfWeek: map['dayOfWeek'] ?? 1,
      periodNumber: map['periodNumber'] ?? 1,
      startTime: map['startTime'] ?? '08:30 AM',
      endTime: map['endTime'] ?? '09:15 AM',
      classId: map['classId'] ?? '',
      sectionId: map['sectionId'] ?? '',
      subjectCode: map['subjectCode'] ?? '',
      subjectName: map['subjectName'] ?? '',
      teacherUid: map['teacherUid'] ?? '',
      teacherName: map['teacherName'] ?? '',
      roomNumber: map['roomNumber'] ?? '',
    );
  }
}

class TimetableConflictResult {
  final bool hasConflict;
  final String? conflictType; // 'TEACHER_DOUBLE_BOOKED' or 'ROOM_DOUBLE_BOOKED'
  final String? message;
  final TimetablePeriod? conflictingPeriod;

  const TimetableConflictResult({
    required this.hasConflict,
    this.conflictType,
    this.message,
    this.conflictingPeriod,
  });

  static const TimetableConflictResult ok =
      TimetableConflictResult(hasConflict: false);
}

class TimetableEngine {
  /// Check if the candidate period causes any teacher or room collision across the school
  static TimetableConflictResult checkConflict({
    required TimetablePeriod candidate,
    required List<TimetablePeriod> existingPeriods,
  }) {
    for (final period in existingPeriods) {
      // Skip comparing against self when updating
      if (period.periodId == candidate.periodId) continue;

      // Same day and same period index
      if (period.dayOfWeek == candidate.dayOfWeek &&
          period.periodNumber == candidate.periodNumber) {
        // Teacher double booked
        if (period.teacherUid == candidate.teacherUid) {
          return TimetableConflictResult(
            hasConflict: true,
            conflictType: 'TEACHER_DOUBLE_BOOKED',
            message:
                'Teacher ${candidate.teacherName} is already assigned to Class ${period.classId}-${period.sectionId} in Period ${candidate.periodNumber}.',
            conflictingPeriod: period,
          );
        }

        // Room double booked
        if (period.roomNumber.isNotEmpty &&
            period.roomNumber.toLowerCase() == candidate.roomNumber.toLowerCase()) {
          return TimetableConflictResult(
            hasConflict: true,
            conflictType: 'ROOM_DOUBLE_BOOKED',
            message:
                'Room ${candidate.roomNumber} is already occupied by Class ${period.classId}-${period.sectionId}.',
            conflictingPeriod: period,
          );
        }
      }
    }

    return TimetableConflictResult.ok;
  }
}
