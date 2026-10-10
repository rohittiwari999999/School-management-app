import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/features/conference/data/conference_repository.dart';
import 'package:edupulse_sms/features/conference/domain/conference_models.dart';
import 'package:edupulse_sms/features/conference/presentation/live_conference_screen.dart';

class PrincipalDashboardScreen extends ConsumerStatefulWidget {
  const PrincipalDashboardScreen({super.key});

  @override
  ConsumerState<PrincipalDashboardScreen> createState() => _PrincipalDashboardScreenState();
}

class _PrincipalDashboardScreenState extends ConsumerState<PrincipalDashboardScreen> {
  final TextEditingController _circularTitleController = TextEditingController();
  final TextEditingController _circularMsgController = TextEditingController();
  bool _isUrgent = true;

  @override
  void dispose() {
    _circularTitleController.dispose();
    _circularMsgController.dispose();
    super.dispose();
  }

  void _launchAllHandsAssembly() async {
    final conf = LiveConferenceModel(
      sessionId: 'ASSEMBLY_${DateTime.now().millisecondsSinceEpoch}',
      title: 'School-Wide Morning Assembly & Principal\'s Address',
      subjectName: 'All Grades Assembly',
      classId: 'CLS_ALL',
      className: 'All School (K-12)',
      hostUid: 'USR_ADMIN_01',
      hostName: 'Dr. Alok Verma',
      hostRole: 'Principal',
      status: ConferenceStatus.live,
      startTime: DateTime.now(),
      durationMinutes: 30,
      participantsCount: 420,
      meetingType: MeetingType.assembly,
      roomCode: 'PRINCIPAL-LIVE-01',
      isRecording: true,
      topicSummary: 'National Anthem, Academic Excellence Awards, and Safety Advisory.',
    );

    await ref.read(conferenceRepositoryProvider).createConference(conf);

    if (mounted) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (ctx) => LiveConferenceScreen(
            conference: conf,
            isHost: true,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Principal & Executive Console', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Text('Dr. Alok Verma • EduPulse Global Academy', style: TextStyle(fontSize: 11, color: Colors.blueAccent)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.broadcast_on_home, color: Colors.lightBlueAccent, size: 26),
            tooltip: 'Broadcast Morning Assembly',
            onPressed: _launchAllHandsAssembly,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // KPI Summary Grid
            Row(
              children: [
                _buildKpiCard('Total Enrolled', '1,480', 'Nursery to 12th', Colors.blue, Icons.people),
                const SizedBox(width: 10),
                _buildKpiCard('Fee Collections', '88.4%', '₹42.8L Collected', Colors.green, Icons.payments),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                _buildKpiCard('Faculty On Duty', '98.2%', '64 Present', Colors.indigo, Icons.badge),
                const SizedBox(width: 10),
                _buildKpiCard('Daily Attendance', '94.6%', '1,400 Students', Colors.amber.shade800, Icons.check_circle),
              ],
            ),
            const SizedBox(height: 18),

            // Live Conference / Virtual Assembly Action Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF0F172A), Color(0xFF1E293B)]),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(color: Colors.blue.withOpacity(0.2), shape: BoxShape.circle),
                        child: const Icon(Icons.video_camera_front, color: Colors.lightBlueAccent, size: 20),
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'School-Wide Live Video Broadcasting',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Direct HD WebRTC video stream to all classes, teachers, and parent-student portals with zero latency.',
                    style: TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _launchAllHandsAssembly,
                      icon: const Icon(Icons.play_circle_fill),
                      label: const Text('Start Morning Assembly Broadcast'),
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
            const SizedBox(height: 18),

            // Emergency Circular Broadcast Form
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.campaign, color: Colors.red.shade600, size: 22),
                      const SizedBox(width: 8),
                      const Text('Dispatch Emergency Circular & Push FCM', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _circularTitleController,
                    decoration: InputDecoration(
                      labelText: 'Circular Headline',
                      hintText: 'e.g. Inclement Weather Advisory / Early Dismissal',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _circularMsgController,
                    maxLines: 3,
                    decoration: InputDecoration(
                      labelText: 'Full Description & Directions',
                      hintText: 'Detailed instructions for parents, students, and faculty...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      contentPadding: const EdgeInsets.all(12),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Switch(
                        value: _isUrgent,
                        activeColor: Colors.redAccent,
                        onChanged: (val) => setState(() => _isUrgent = val),
                      ),
                      const Text('High-Priority Emergency Siren Broadcast', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    height: 44,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        if (_circularTitleController.text.trim().isEmpty) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Emergency Circular dispatched to all 1,480 students & parents via Firebase FCM!'),
                            backgroundColor: Colors.green,
                          ),
                        );
                        _circularTitleController.clear();
                        _circularMsgController.clear();
                      },
                      icon: const Icon(Icons.send),
                      label: const Text('Publish Circular Across SMS'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red.shade700,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiCard(String title, String mainValue, String subValue, Color color, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: TextStyle(fontSize: 11, color: Colors.grey.shade600, fontWeight: FontWeight.bold)),
                Icon(icon, color: color, size: 18),
              ],
            ),
            const SizedBox(height: 6),
            Text(mainValue, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 2),
            Text(subValue, style: TextStyle(fontSize: 10, color: Colors.grey.shade500)),
          ],
        ),
      ),
    );
  }
}
