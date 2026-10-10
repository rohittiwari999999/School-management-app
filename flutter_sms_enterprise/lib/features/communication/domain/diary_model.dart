enum DiaryEntryType { homework, notice, circular, observation }

class DiaryEntry {
  final String entryId;
  final String schoolId;
  final String classId;
  final String? sectionId;
  final String title;
  final String description;
  final DiaryEntryType type;
  final String authorUid;
  final String authorName;
  final DateTime createdAt;
  final DateTime? submissionDeadline;
  final List<String> attachmentUrls;
  final bool isEmergencyCircular;

  // Pre-Primary specialized observation logs
  final String? mealLog; // e.g. "Finished healthy fruit salad"
  final String? napLog;  // e.g. "45 mins calm sleep"
  final String? motorSkillObservation;

  const DiaryEntry({
    required this.entryId,
    required this.schoolId,
    required this.classId,
    this.sectionId,
    required this.title,
    required this.description,
    required this.type,
    required this.authorUid,
    required this.authorName,
    required this.createdAt,
    this.submissionDeadline,
    this.attachmentUrls = const [],
    this.isEmergencyCircular = false,
    this.mealLog,
    this.napLog,
    this.motorSkillObservation,
  });

  Map<String, dynamic> toFirestore() {
    return {
      'schoolId': schoolId,
      'classId': classId,
      'sectionId': sectionId,
      'title': title,
      'description': description,
      'type': type.name,
      'authorUid': authorUid,
      'authorName': authorName,
      'createdAt': createdAt.toIso8601String(),
      if (submissionDeadline != null)
        'submissionDeadline': submissionDeadline!.toIso8601String(),
      'attachmentUrls': attachmentUrls,
      'isEmergencyCircular': isEmergencyCircular,
      if (mealLog != null) 'mealLog': mealLog,
      if (napLog != null) 'napLog': napLog,
      if (motorSkillObservation != null)
        'motorSkillObservation': motorSkillObservation,
    };
  }

  factory DiaryEntry.fromFirestore(Map<String, dynamic> map, String id) {
    return DiaryEntry(
      entryId: id,
      schoolId: map['schoolId'] ?? '',
      classId: map['classId'] ?? '',
      sectionId: map['sectionId'],
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      type: _parseType(map['type']),
      authorUid: map['authorUid'] ?? '',
      authorName: map['authorName'] ?? '',
      createdAt: DateTime.tryParse(map['createdAt'] ?? '') ?? DateTime.now(),
      submissionDeadline: map['submissionDeadline'] != null
          ? DateTime.tryParse(map['submissionDeadline'])
          : null,
      attachmentUrls: List<String>.from(map['attachmentUrls'] ?? []),
      isEmergencyCircular: map['isEmergencyCircular'] ?? false,
      mealLog: map['mealLog'],
      napLog: map['napLog'],
      motorSkillObservation: map['motorSkillObservation'],
    );
  }

  static DiaryEntryType _parseType(dynamic value) {
    for (var type in DiaryEntryType.values) {
      if (type.name == value) return type;
    }
    return DiaryEntryType.notice;
  }
}
