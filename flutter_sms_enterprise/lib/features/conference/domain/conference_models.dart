enum ConferenceStatus { scheduled, live, ended }

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

  factory LiveConferenceModel.fromFirestore(Map<String, dynamic> data, String id) {
    return LiveConferenceModel(
      sessionId: id,
      title: data['title'] ?? '',
      subjectName: data['subjectName'] ?? '',
      classId: data['classId'] ?? '',
      className: data['className'] ?? '',
      hostUid: data['hostUid'] ?? '',
      hostName: data['hostName'] ?? '',
      hostRole: data['hostRole'] ?? 'teacher',
      status: _parseStatus(data['status']),
      startTime: DateTime.tryParse(data['startTime'] ?? '') ?? DateTime.now(),
      durationMinutes: data['durationMinutes'] ?? 45,
      participantsCount: data['participantsCount'] ?? 0,
      meetingType: _parseType(data['meetingType']),
      roomCode: data['roomCode'] ?? '',
      isRecording: data['isRecording'] ?? false,
      topicSummary: data['topicSummary'],
    );
  }

  static ConferenceStatus _parseStatus(dynamic val) {
    for (var s in ConferenceStatus.values) {
      if (s.name == val) return s;
    }
    return ConferenceStatus.scheduled;
  }

  static MeetingType _parseType(dynamic val) {
    for (var t in MeetingType.values) {
      if (t.name == val) return t;
    }
    return MeetingType.classLesson;
  }
}
