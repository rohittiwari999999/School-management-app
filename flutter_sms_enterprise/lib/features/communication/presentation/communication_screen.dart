import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:edupulse_sms/features/communication/domain/diary_model.dart';

class CommunicationScreen extends ConsumerStatefulWidget {
  const CommunicationScreen({super.key});

  @override
  ConsumerState<CommunicationScreen> createState() => _CommunicationScreenState();
}

class _CommunicationScreenState extends ConsumerState<CommunicationScreen> {
  DiaryEntryType _selectedTab = DiaryEntryType.homework;

  final List<DiaryEntry> _entries = [
    DiaryEntry(
      entryId: 'CIRC_001',
      schoolId: 'SCH_GLOBAL_001',
      classId: 'CLS_ALL',
      title: 'Annual Science Fair & Exhibition 2026',
      description: 'Registration opens for working models and robotics displays. Parents cordially invited on Friday.',
      type: DiaryEntryType.circular,
      authorUid: 'USR_ADMIN_01',
      authorName: 'Dr. Alok Verma (Principal)',
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      isEmergencyCircular: true,
    ),
    DiaryEntry(
      entryId: 'HW_001',
      schoolId: 'SCH_GLOBAL_001',
      classId: 'CLS_11',
      title: 'Physics: Numerical Problems on Total Internal Reflection',
      description: 'Complete NCERT problems 9.1 to 9.8 in the fair notebook. Prepare for viva.',
      type: DiaryEntryType.homework,
      authorUid: 'USR_TEACHER_01',
      authorName: 'Dr. Ananya Sen',
      createdAt: DateTime.now().subtract(const Duration(hours: 4)),
      submissionDeadline: DateTime.now().add(const Duration(days: 1)),
    ),
    DiaryEntry(
      entryId: 'OBS_001',
      schoolId: 'SCH_GLOBAL_001',
      classId: 'CLS_NURSERY',
      title: 'Sensory Play & Water Table Activity',
      description: 'Ananya happily engaged in sensory water play and shared crayons warmly with friends.',
      type: DiaryEntryType.observation,
      authorUid: 'USR_CLASS_TEACHER_01',
      authorName: 'Ms. Priya Sharma',
      createdAt: DateTime.now().subtract(const Duration(hours: 6)),
      mealLog: 'Eaten fully (Fresh Apple Slices & Khichdi)',
      napLog: '1 hr 15 mins (Restful nap)',
      motorSkillObservation: 'Excellent grip during crayon sketching',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _entries.where((e) => e.type == _selectedTab).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('School Communications & Diary'),
        backgroundColor: Colors.indigo.shade900,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Container(
            color: Colors.indigo.shade900,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildTabButton('Homework', DiaryEntryType.homework, Icons.assignment),
                _buildTabButton('Circulars', DiaryEntryType.circular, Icons.campaign),
                _buildTabButton('Nursery Log', DiaryEntryType.observation, Icons.child_care),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final entry = filtered[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            if (entry.isEmergencyCircular)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.red.shade100,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Row(
                                  children: [
                                    Icon(Icons.warning, size: 12, color: Colors.red.shade900),
                                    const SizedBox(width: 4),
                                    Text(
                                      'HIGH PRIORITY CIRCULAR',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.red.shade900,
                                      ),
                                    ),
                                  ],
                                ),
                              )
                            else
                              Text(
                                entry.authorName,
                                style: TextStyle(fontSize: 12, color: Colors.grey.shade600, fontWeight: FontWeight.bold),
                              ),
                            Text(
                              DateFormat('hh:mm a').format(entry.createdAt),
                              style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          entry.title,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          entry.description,
                          style: TextStyle(fontSize: 13, color: Colors.grey.shade800, height: 1.3),
                        ),
                        if (entry.submissionDeadline != null) ...[
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              const Icon(Icons.alarm, size: 14, color: Colors.red),
                              const SizedBox(width: 4),
                              Text(
                                'Due: ${DateFormat('dd MMM yyyy, hh:mm a').format(entry.submissionDeadline!)}',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.red),
                              ),
                            ],
                          ),
                        ],
                        if (entry.mealLog != null || entry.napLog != null) ...[
                          const Divider(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: Text('Meal: ${entry.mealLog ?? "-"}', style: const TextStyle(fontSize: 11)),
                              ),
                              Expanded(
                                child: Text('Nap: ${entry.napLog ?? "-"}', style: const TextStyle(fontSize: 11)),
                              ),
                            ],
                          ),
                        ],
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

  Widget _buildTabButton(String label, DiaryEntryType type, IconData icon) {
    final isSelected = _selectedTab == type;
    return InkWell(
      onTap: () => setState(() => _selectedTab = type),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          children: [
            Icon(icon, size: 14, color: isSelected ? Colors.indigo.shade900 : Colors.white70),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.indigo.shade900 : Colors.white70,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
