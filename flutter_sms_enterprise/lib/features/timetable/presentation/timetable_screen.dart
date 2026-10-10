import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/features/timetable/domain/timetable_engine.dart';

class TimetableScreen extends ConsumerStatefulWidget {
  const TimetableScreen({super.key});

  @override
  ConsumerState<TimetableScreen> createState() => _TimetableScreenState();
}

class _TimetableScreenState extends ConsumerState<TimetableScreen> {
  int _selectedDay = 1; // 1 = Monday ... 5 = Friday

  final List<TimetablePeriod> _periods = const [
    TimetablePeriod(
      periodId: 'TT_001',
      dayOfWeek: 1,
      periodNumber: 1,
      startTime: '08:30 AM',
      endTime: '09:15 AM',
      classId: 'CLS_11',
      sectionId: 'SEC_A',
      subjectCode: 'PHY-042',
      subjectName: 'Physics (Ray Optics)',
      teacherUid: 'USR_TEACHER_01',
      teacherName: 'Dr. Ananya Sen',
      roomNumber: 'Room 302',
    ),
    TimetablePeriod(
      periodId: 'TT_002',
      dayOfWeek: 1,
      periodNumber: 2,
      startTime: '09:15 AM',
      endTime: '10:00 AM',
      classId: 'CLS_11',
      sectionId: 'SEC_A',
      subjectCode: 'MATH-041',
      subjectName: 'Mathematics (Calculus)',
      teacherUid: 'USR_TEACHER_02',
      teacherName: 'Mr. Rajesh Nair',
      roomNumber: 'Room 302',
    ),
    TimetablePeriod(
      periodId: 'TT_003',
      dayOfWeek: 1,
      periodNumber: 3,
      startTime: '10:15 AM',
      endTime: '11:00 AM',
      classId: 'CLS_11',
      sectionId: 'SEC_A',
      subjectCode: 'CHEM-043',
      subjectName: 'Chemistry Lab',
      teacherUid: 'USR_TEACHER_03',
      teacherName: 'Dr. Sunita Rao',
      roomNumber: 'Science Lab 2',
    ),
    TimetablePeriod(
      periodId: 'TT_004',
      dayOfWeek: 1,
      periodNumber: 4,
      startTime: '11:00 AM',
      endTime: '11:45 AM',
      classId: 'CLS_11',
      sectionId: 'SEC_A',
      subjectCode: 'ENG-301',
      subjectName: 'English Core',
      teacherUid: 'USR_TEACHER_04',
      teacherName: 'Ms. Priya Sharma',
      roomNumber: 'Room 302',
    ),
    TimetablePeriod(
      periodId: 'TT_005',
      dayOfWeek: 1,
      periodNumber: 5,
      startTime: '12:30 PM',
      endTime: '01:15 PM',
      classId: 'CLS_11',
      sectionId: 'SEC_A',
      subjectCode: 'CS-083',
      subjectName: 'Computer Science & AI',
      teacherUid: 'USR_TEACHER_05',
      teacherName: 'Mr. Arvind Gupta',
      roomNumber: 'Computer Lab 1',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Daily Timetable Matrix'),
        backgroundColor: Colors.indigo.shade900,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Day selector chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: List.generate(5, (index) {
                final day = index + 1;
                final isSelected = _selectedDay == day;
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: ChoiceChip(
                    label: Text(dayNames[index]),
                    selected: isSelected,
                    selectedColor: Colors.indigo.shade900,
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : Colors.black87,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                    onSelected: (val) {
                      if (val) setState(() => _selectedDay = day);
                    },
                  ),
                );
              }),
            ),
          ),
          const Divider(height: 1),

          // Periods list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: _periods.length,
              itemBuilder: (context, index) {
                final p = _periods[index];
                final isCurrent = p.periodNumber == 2;

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                    side: isCurrent
                        ? BorderSide(color: Colors.blue.shade600, width: 2)
                        : BorderSide.none,
                  ),
                  color: isCurrent ? Colors.blue.shade50 : Colors.white,
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: isCurrent ? Colors.blue.shade600 : Colors.grey.shade200,
                      foregroundColor: isCurrent ? Colors.white : Colors.grey.shade800,
                      child: Text('P${p.periodNumber}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    title: Row(
                      children: [
                        Text(p.subjectName, style: const TextStyle(fontWeight: FontWeight.bold)),
                        if (isCurrent) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.blue.shade600,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text(
                              'ACTIVE NOW',
                              style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ],
                    ),
                    subtitle: Text('Faculty: ${p.teacherName} • ${p.roomNumber}'),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(p.startTime, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        Text(p.endTime, style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
