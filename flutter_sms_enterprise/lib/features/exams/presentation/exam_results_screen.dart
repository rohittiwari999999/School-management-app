import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/features/exams/domain/grading_calculator.dart';

class ExamResultsScreen extends ConsumerWidget {
  const ExamResultsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const subjects = [
      SubjectMark(
        subjectCode: 'PHY-042',
        subjectName: 'Physics (Theory & Practical)',
        theoryMarks: 65,
        maxTheoryMarks: 70,
        practicalMarks: 28,
        maxPracticalMarks: 30,
      ),
      SubjectMark(
        subjectCode: 'CHEM-043',
        subjectName: 'Chemistry',
        theoryMarks: 62,
        maxTheoryMarks: 70,
        practicalMarks: 29,
        maxPracticalMarks: 30,
      ),
      SubjectMark(
        subjectCode: 'MATH-041',
        subjectName: 'Mathematics',
        theoryMarks: 76,
        maxTheoryMarks: 80,
        practicalMarks: 19,
        maxPracticalMarks: 20,
      ),
      SubjectMark(
        subjectCode: 'ENG-301',
        subjectName: 'English Core',
        theoryMarks: 74,
        maxTheoryMarks: 80,
        practicalMarks: 18,
        maxPracticalMarks: 20,
      ),
      SubjectMark(
        subjectCode: 'CS-083',
        subjectName: 'Computer Science',
        theoryMarks: 67,
        maxTheoryMarks: 70,
        practicalMarks: 29,
        maxPracticalMarks: 30,
      ),
    ];

    final totalObtained = subjects.fold(0.0, (acc, s) => acc + s.totalObtained);
    final totalMax = subjects.fold(0.0, (acc, s) => acc + s.totalMax);
    final percentage = (totalObtained / totalMax) * 100;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cumulative Report Card (CBSE CCE)'),
        backgroundColor: Colors.indigo.shade900,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.print),
            tooltip: 'Print PDF Report Card',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Preparing printable official PDF...')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Score Summary Card
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              color: Colors.indigo.shade900,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Overall Cumulative GPA',
                              style: TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              '9.4 / 10.0',
                              style: TextStyle(
                                color: Colors.greenAccent,
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Score: ${totalObtained.toInt()} / ${totalMax.toInt()} (${percentage.toStringAsFixed(1)}%)',
                              style: const TextStyle(color: Colors.white, fontSize: 13),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: Colors.greenAccent.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.greenAccent),
                          ),
                          child: const Text(
                            'Grade A1\nPassed (1st Rank)',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.greenAccent,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            Text(
              'Scholastic Subject Marks',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            ...subjects.map((sub) {
              return Card(
                margin: const EdgeInsets.only(bottom: 10),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(14.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(sub.subjectName, style: const TextStyle(fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Text(
                              'Theory: ${sub.theoryMarks.toInt()}/${sub.maxTheoryMarks.toInt()} • Practical: ${sub.practicalMarks.toInt()}/${sub.maxPracticalMarks.toInt()}',
                              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '${sub.totalObtained.toInt()} / 100',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                          Text(
                            sub.grade,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.blue,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
