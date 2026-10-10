import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/features/conference/data/conference_repository.dart';
import 'package:edupulse_sms/features/conference/domain/conference_models.dart';
import 'package:edupulse_sms/features/conference/presentation/live_conference_screen.dart';

class FamilyDashboardScreen extends ConsumerStatefulWidget {
  const FamilyDashboardScreen({super.key});

  @override
  ConsumerState<FamilyDashboardScreen> createState() => _FamilyDashboardScreenState();
}

class _FamilyDashboardScreenState extends ConsumerState<FamilyDashboardScreen> {
  // Sibling switcher state: Aarav (11), Rohan (5), Ananya (Nursery)
  int _selectedChildIndex = 0;

  final List<Map<String, dynamic>> _children = [
    {
      'name': 'Aarav Sharma',
      'grade': 'Class 11-A (PCM Science)',
      'roll': 'Roll No. 01',
      'attendance': 92.4,
      'pendingFee': 0,
      'hasLiveClass': true,
      'liveTopic': 'Physics: Ray Optics & Prisms',
      'teacher': 'Ms. Priya Sharma',
    },
    {
      'name': 'Rohan Sharma',
      'grade': 'Class 5-B (Primary)',
      'roll': 'Roll No. 14',
      'attendance': 96.0,
      'pendingFee': 0,
      'hasLiveClass': false,
      'liveTopic': 'Mathematics: Decimals & Fractions',
      'teacher': 'Mr. Vikram Sen',
    },
    {
      'name': 'Ananya Sharma',
      'grade': 'Nursery (Pre-Primary)',
      'roll': 'Roll No. 03',
      'attendance': 94.2,
      'pendingFee': 18500,
      'hasLiveClass': false,
      'liveTopic': 'Story Time & Rhymes',
      'teacher': 'Ms. Anjali Kapoor',
    },
  ];

  void _joinLiveClass() {
    final activeChild = _children[_selectedChildIndex];
    final conf = LiveConferenceModel(
      sessionId: 'CONF_LIVE_STUDENT',
      title: activeChild['liveTopic'] as String,
      subjectName: 'Live Class Lecture',
      classId: 'CLS_11',
      className: activeChild['grade'] as String,
      hostUid: 'USR_TEACHER_01',
      hostName: activeChild['teacher'] as String,
      hostRole: 'Class Teacher',
      status: ConferenceStatus.live,
      startTime: DateTime.now(),
      durationMinutes: 45,
      participantsCount: 22,
      meetingType: MeetingType.classLesson,
      roomCode: 'EDU-ROOM-77',
      isRecording: true,
      topicSummary: 'Interactive lecture with screen share and live doubt clearing.',
    );

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => LiveConferenceScreen(
          conference: conf,
          isHost: false, // Student joining
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final activeChild = _children[_selectedChildIndex];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Unified Parent & Student Portal', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Text('Sharma Family • Rajesh & Sunita Sharma', style: TextStyle(fontSize: 11, color: Colors.blueAccent)),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Sibling Switcher Header Bar
            const Text(
              'Select Child Profile:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.blueGrey),
            ),
            const SizedBox(height: 8),
            Row(
              children: List.generate(_children.length, (idx) {
                final child = _children[idx];
                final isSelected = _selectedChildIndex == idx;
                return Expanded(
                  child: InkWell(
                    onTap: () => setState(() => _selectedChildIndex = idx),
                    child: Container(
                      margin: EdgeInsets.only(right: idx == _children.length - 1 ? 0 : 8),
                      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF2563EB) : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isSelected ? const Color(0xFF2563EB) : Colors.grey.shade300),
                        boxShadow: isSelected ? [const BoxShadow(color: Colors.blueAccent, blurRadius: 4)] : [],
                      ),
                      child: Column(
                        children: [
                          Text(
                            (child['name'] as String).split(' ')[0],
                            style: TextStyle(
                              color: isSelected ? Colors.white : Colors.black87,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                          Text(
                            (child['grade'] as String).split(' ')[0],
                            style: TextStyle(
                              color: isSelected ? Colors.white70 : Colors.grey.shade600,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ),
            const SizedBox(height: 16),

            // Live Class Alert Card if active for selected child
            if (activeChild['hasLiveClass'] == true) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: [Colors.indigo.shade900, Colors.blue.shade900]),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 8)],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.red.withOpacity(0.3),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.redAccent),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.fiber_manual_record, color: Colors.redAccent, size: 12),
                              SizedBox(width: 4),
                              Text('LIVE CLASSROOM ACTIVE', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        const Icon(Icons.cast_connected, color: Colors.lightBlueAccent, size: 22),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      activeChild['liveTopic'] as String,
                      style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      'Teacher: ${activeChild['teacher']} • Class 11-A',
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                    const SizedBox(height: 14),
                    SizedBox(
                      width: double.infinity,
                      height: 42,
                      child: ElevatedButton.icon(
                        onPressed: _joinLiveClass,
                        icon: const Icon(Icons.videocam),
                        label: const Text('Join Video Classroom Now'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue.shade600,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Student Overview Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 22,
                        backgroundColor: Colors.blue.shade100,
                        child: Text(
                          (activeChild['name'] as String)[0],
                          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade800, fontSize: 18),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(activeChild['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                            Text('${activeChild['grade']} • ${activeChild['roll']}', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        children: [
                          Text('${activeChild['attendance']}%', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.green)),
                          const Text('Attendance (CBSE >75%)', style: TextStyle(fontSize: 10, color: Colors.grey)),
                        ],
                      ),
                      Container(width: 1, height: 30, color: Colors.grey.shade200),
                      Column(
                        children: [
                          Text(
                            (activeChild['pendingFee'] as int) > 0 ? '₹${activeChild['pendingFee']}' : 'Settled',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                              color: (activeChild['pendingFee'] as int) > 0 ? Colors.red : Colors.green,
                            ),
                          ),
                          const Text('Fee Due Status', style: TextStyle(fontSize: 10, color: Colors.grey)),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Quick Actions Grid (Report Card, Leave, Chat, Fees)
            const Text('Academic & Family Services', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 10),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 1.6,
              children: [
                _buildActionCard(Icons.assessment, 'Term Report Card', 'Download PDF Marks', Colors.blue, () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Report Card PDF downloaded!')));
                }),
                _buildActionCard(Icons.payment, 'Fee Payment', 'Pay via Razorpay', Colors.green, () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Opening secure fee payment gateway...')));
                }),
                _buildActionCard(Icons.mail, 'Leave Application', 'Apply for Leave', Colors.amber.shade800, () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Leave request submitted to Class Teacher.')));
                }),
                _buildActionCard(Icons.chat, 'Teacher Messaging', 'Chat with Mentor', Colors.purple, () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Direct thread opened with Class Mentor.')));
                }),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(IconData icon, String title, String subtitle, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            Text(subtitle, style: TextStyle(fontSize: 10, color: Colors.grey.shade500)),
          ],
        ),
      ),
    );
  }
}
