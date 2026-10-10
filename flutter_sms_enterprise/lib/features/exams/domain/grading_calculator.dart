class SubjectMark {
  final String subjectCode;
  final String subjectName;
  final double theoryMarks;
  final double maxTheoryMarks;
  final double practicalMarks;
  final double maxPracticalMarks;
  final int creditHours;

  const SubjectMark({
    required this.subjectCode,
    required this.subjectName,
    required this.theoryMarks,
    required this.maxTheoryMarks,
    this.practicalMarks = 0.0,
    this.maxPracticalMarks = 0.0,
    this.creditHours = 4,
  });

  double get totalObtained => theoryMarks + practicalMarks;
  double get totalMax => maxTheoryMarks + maxPracticalMarks;
  double get percentage => totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

  String get grade {
    final p = percentage;
    if (p >= 91) return 'A1';
    if (p >= 81) return 'A2';
    if (p >= 71) return 'B1';
    if (p >= 61) return 'B2';
    if (p >= 51) return 'C1';
    if (p >= 41) return 'C2';
    if (p >= 33) return 'D';
    return 'E (Needs Improvement)';
  }

  double get gradePoint {
    final p = percentage;
    if (p >= 91) return 10.0;
    if (p >= 81) return 9.0;
    if (p >= 71) return 8.0;
    if (p >= 61) return 7.0;
    if (p >= 51) return 6.0;
    if (p >= 41) return 5.0;
    if (p >= 33) return 4.0;
    return 0.0;
  }
}

class ExamReportCardResult {
  final double totalObtained;
  final double totalMaximum;
  final double overallPercentage;
  final double cumulativeGpa;
  final String overallGrade;
  final bool hasPassed;
  final List<String> passedSubjects;
  final List<String> failedSubjects;

  const ExamReportCardResult({
    required this.totalObtained,
    required this.totalMaximum,
    required this.overallPercentage,
    required this.cumulativeGpa,
    required this.overallGrade,
    required this.hasPassed,
    required this.passedSubjects,
    required this.failedSubjects,
  });

  /// Alias getters for backwards and UI compatibility
  String get primaryGrade => overallGrade;
  double get gpa => cumulativeGpa;
}

class GradingCalculator {
  /// Calculate comprehensive results conforming to standard CBSE/ICSE/State Board policies
  static ExamReportCardResult calculateReportCard({
    required List<SubjectMark> subjectMarks,
    double passingThresholdPercentage = 33.0,
  }) {
    if (subjectMarks.isEmpty) {
      return const ExamReportCardResult(
        totalObtained: 0,
        totalMaximum: 0,
        overallPercentage: 0,
        cumulativeGpa: 0,
        overallGrade: 'N/A',
        hasPassed: false,
        passedSubjects: [],
        failedSubjects: [],
      );
    }

    double totalObtained = 0.0;
    double totalMaximum = 0.0;
    double weightedGradePoints = 0.0;
    int totalCredits = 0;
    final List<String> passed = [];
    final List<String> failed = [];

    for (final mark in subjectMarks) {
      totalObtained += mark.totalObtained;
      totalMaximum += mark.totalMax;
      weightedGradePoints += (mark.gradePoint * mark.creditHours);
      totalCredits += mark.creditHours;

      if (mark.percentage >= passingThresholdPercentage) {
        passed.add(mark.subjectName);
      } else {
        failed.add(mark.subjectName);
      }
    }

    final double overallPercentage =
        totalMaximum > 0 ? (totalObtained / totalMaximum) * 100 : 0;
    final double gpa =
        totalCredits > 0 ? (weightedGradePoints / totalCredits) : 0.0;

    String overallGrade;
    if (overallPercentage >= 91) {
      overallGrade = 'A1';
    } else if (overallPercentage >= 81) {
      overallGrade = 'A2';
    } else if (overallPercentage >= 71) {
      overallGrade = 'B1';
    } else if (overallPercentage >= 61) {
      overallGrade = 'B2';
    } else if (overallPercentage >= 51) {
      overallGrade = 'C1';
    } else if (overallPercentage >= 41) {
      overallGrade = 'C2';
    } else if (overallPercentage >= 33) {
      overallGrade = 'D';
    } else {
      overallGrade = 'E';
    }

    return ExamReportCardResult(
      totalObtained: double.parse(totalObtained.toStringAsFixed(1)),
      totalMaximum: double.parse(totalMaximum.toStringAsFixed(1)),
      overallPercentage: double.parse(overallPercentage.toStringAsFixed(2)),
      cumulativeGpa: double.parse(gpa.toStringAsFixed(2)),
      overallGrade: overallGrade,
      hasPassed: failed.isEmpty && overallPercentage >= passingThresholdPercentage,
      passedSubjects: passed,
      failedSubjects: failed,
    );
  }

  /// Convenience method for secondary grade calculation
  static ExamReportCardResult calculateSecondaryGrade(List<SubjectMark> subjectMarks) {
    return calculateReportCard(subjectMarks: subjectMarks);
  }
}
