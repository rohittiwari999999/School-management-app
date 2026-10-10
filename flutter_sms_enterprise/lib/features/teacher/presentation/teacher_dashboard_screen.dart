import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/features/attendance/data/attendance_repository.dart';
import 'package:edupulse_sms/features/conference/data/conference_repository.dart';
import 'package:edupulse_sms/features/conference/domain/conference_models.dart';
import 'package:edupulse_sms/features/conference/presentation/live_conference_screen.dart';
import 'package:edupulse_sms/features/exams/domain/grading_calculator.dart';

class TeacherDashboardScreen extends ConsumerStatefulWidget {
  const TeacherDashboardScreen({super.key});

  @override
  ConsumerState<TeacherDashboardScreen> createState() => _TeacherDashboardScreenState();
}

class _TeacherDashboardScreenState extends ConsumerState<TeacherDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Selected Class & Section
  String _selectedClassId = 'CLS_11';
  String _selectedSection = 'A';

  // Attendance in-memory working map (studentId -> AttendanceStatus)
  final Map<String, AttendanceStatus> _attendanceMap = {
    'STU_CLASS11_01': AttendanceStatus.present,
    'STU_02': AttendanceStatus.present,
    'STU_03': AttendanceStatus.absent,
    'STU_04': AttendanceStatus.leave,
    'STU_05': AttendanceStatus.present,
  };

  bool _isSavingAttendance = false;

  // Dynamic Grading Demo State
  double _theoryMarks = 65.0;
  double _practicalMarks = 28.0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _saveAttendance() async {
    setState(() => _isSavingAttendance = true);
    try {
      final repo = ref.read(attendanceRepositoryProvider);
      await repo.saveBatchAttendance(
        date: DateTime.now(),
        classId: _selectedClassId,
        sectionId: _selectedSection,
        recordedByTeacherUid: 'USR_TEACHER_01',
        studentStatusMap: _attendanceMap,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Attendance successfully saved to Cloud Firestore!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Save error: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isSavingAttendance = false);
    }
  }

  void _startLiveClass() async {
    final newConf = LiveConferenceModel(
      sessionId: 'CONF_${DateTime.now().millisecondsSinceEpoch}',
      title: 'Class 11-A Physics • Ray Optics & Wave Motion',
      subjectName: 'Physics',
      classId: _selectedClassId,
      className: 'Class 11-A (Science)',
      hostUid: 'USR_TEACHER_01',
      hostName: 'Ms. Priya Sharma',
      hostRole: 'Class Teacher',
      status: ConferenceStatus.live,
      startTime: DateTime.now(),
      durationMinutes: 45,
      participantsCount: 18,
      meetingType: MeetingType.classLesson,
      roomCode: 'PHY-11A-LIVE',
      isRecording: true,
      topicSummary: 'Refraction through prisms, spherical aberration, and Snell\'s law exercises.',
    );

    await ref.read(conferenceRepositoryProvider).createConference(newConf);

    if (mounted) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (ctx) => LiveConferenceScreen(
            conference: newConf,
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
            Text(
              'Teacher Academic Console',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            Text(
              'Ms. Priya Sharma • PGT Physics & Class 11-A Mentor',
              style: TextStyle(fontSize: 11, color: Colors.blueAccent),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.video_call, color: Colors.lightBlueAccent, size: 28),
            tooltip: 'Launch Live Video Classroom',
            onPressed: _startLiveClass,
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.blueAccent,
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          tabs: const [
            Tab(icon: Icon(Icons.fact_check, size: 18), text: 'Attendance'),
            Tab(icon: Icon(Icons.video_camera_front, size: 18), text: 'Live Class'),
            Tab(icon: Icon(Icons.calculate, size: 18), text: 'Grading'),
            Tab(icon: Icon(Icons.child_care, size: 18), text: 'Nursery'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // 1. Attendance Roll-Call Tab
          _buildAttendanceTab(),

          // 2. Live Video Conference Tab
          _buildLiveClassTab(),

          // 3. Exam Grading Calculator Tab
          _buildGradingTab(),

          // 4. Nursery / Pre-Primary Observational Tab
          _buildNurseryTab(),
        ],
      ),
    );
  }

  Widget _buildAttendanceTab() {
    final presentCount = _attendanceMap.values.where((v) => v == AttendanceStatus.present).length;
    final absentCount = _attendanceMap.values.where((v) => v == AttendanceStatus.absent).length;
    final leaveCount = _attendanceMap.values.where((v) => v == AttendanceStatus.leave).length;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Class selection banner
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Class 11-A (Science Stream)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    Text('Today: ${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year} • Term 1', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    setState(() {
                      _attendanceMap.updateAll((key, val) => AttendanceStatus.present);
                    });
                  },
                  icon: const Icon(Icons.done_all, size: 16),
                  label: const Text('Mark All Present', style: TextStyle(fontSize: 11)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue.shade50,
                    foregroundColor: Colors.blue.shade700,
                    elevation: 0,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Attendance Counts Summary Bar
          Row(
            children: [
              _buildCountBadge('Present', presentCount, const Color(0xFF10B981)),
              const SizedBox(width: 8),
              _buildCountBadge('Absent', absentCount, Colors.red),
              const SizedBox(width: 8),
              _buildCountBadge('On Leave', leaveCount, Colors.amber.shade800),
            ],
          ),
          const SizedBox(height: 16),

          // Student Roll-Call List
          ListView(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            children: _attendanceMap.entries.map((entry) {
              final studentId = entry.key;
              final status = entry.value;
              final studentName = studentId == 'STU_CLASS11_01'
                  ? 'Aarav Sharma (Roll 01)'
                  : studentId == 'STU_02'
                      ? 'Dia Patel (Roll 02)'
                      : studentId == 'STU_03'
                          ? 'Kabir Mehta (Roll 03)'
                          : studentId == 'STU_04'
                              ? 'Riya Verma (Roll 04)'
                              : 'Vivaan Gupta (Roll 05)';

              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 18,
                      backgroundColor: Colors.blue.shade100,
                      child: Text(studentName[0], style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade800)),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(studentName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          Text('Adm: ADM-2026-$studentId', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                        ],
                      ),
                    ),
                    // P / A / L Action Chips
                    Row(
                      children: [
                        _buildStatusChip(studentId, AttendanceStatus.present, 'P', status == AttendanceStatus.present, Colors.green),
                        const SizedBox(width: 4),
                        _buildStatusChip(studentId, AttendanceStatus.absent, 'A', status == AttendanceStatus.absent, Colors.red),
                        const SizedBox(width: 4),
                        _buildStatusChip(studentId, AttendanceStatus.leave, 'L', status == AttendanceStatus.leave, Colors.amber.shade800),
                      ],
                    ),
                  ],
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 16),
          // Batch Save Button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              onPressed: _isSavingAttendance ? null : _saveAttendance,
              icon: _isSavingAttendance
                  ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Icon(Icons.cloud_upload),
              label: Text(_isSavingAttendance ? 'Saving Batch...' : 'Commit Attendance to Cloud Firestore'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2563EB),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(String studentId, AttendanceStatus target, String label, bool isSelected, Color color) {
    return InkWell(
      onTap: () {
        setState(() {
          _attendanceMap[studentId] = target;
        });
      },
      borderRadius: BorderRadius.circular(8),
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: isSelected ? color : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? color : Colors.grey.shade300),
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.grey.shade700,
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
      ),
    );
  }

  Widget _buildCountBadge(String title, int count, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          children: [
            Text('$count', style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 16)),
            Text(title, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  Widget _buildLiveClassTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Launch Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 10)],
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
                        color: Colors.blue.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.blueAccent.withOpacity(0.4)),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.sensors, color: Colors.lightBlueAccent, size: 14),
                          SizedBox(width: 4),
                          Text('WebRTC Video Room', style: TextStyle(color: Colors.lightBlueAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                    const Icon(Icons.cast_for_education, color: Colors.white60, size: 24),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Host Virtual Classroom',
                  style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Connect with Class 11-A students via HD multi-peer video, whiteboard sharing, and automated cloud recording.',
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: ElevatedButton.icon(
                    onPressed: _startLiveClass,
                    icon: const Icon(Icons.videocam),
                    label: const Text('Start Live Physics Lecture Now'),
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
          const SizedBox(height: 20),
          const Text('Scheduled Live Lectures', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 10),
          _buildLectureScheduleCard(
            title: 'Ray Optics: Lens Maker\'s Formula',
            time: 'Today • 11:30 AM - 12:15 PM',
            className: 'Class 11-A',
            subject: 'Physics',
            isNext: true,
          ),
          const SizedBox(height: 8),
          _buildLectureScheduleCard(
            title: 'Parent-Teacher Virtual Meet (PTM)',
            time: 'Tomorrow • 04:00 PM - 05:00 PM',
            className: 'Nursery Pre-Primary',
            subject: 'Parent Conference',
            isNext: false,
          ),
        ],
      ),
    );
  }

  Widget _buildLectureScheduleCard({
    required String title,
    required String time,
    required String className,
    required String subject,
    required bool isNext,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isNext ? Colors.blue.shade200 : Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isNext ? Colors.blue.shade50 : Colors.grey.shade100,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(Icons.video_library, color: isNext ? Colors.blue.shade700 : Colors.grey.shade600),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Text('$className • $subject', style: const TextStyle(fontSize: 11, color: Colors.blueGrey)),
                Text(time, style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
              ],
            ),
          ),
          if (isNext)
            TextButton(
              onPressed: _startLiveClass,
              child: const Text('Join Room', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            ),
        ],
      ),
    );
  }

  Widget _buildGradingTab() {
    final totalMarks = _theoryMarks + _practicalMarks;
    final totalPercentage = (totalMarks / 100.0) * 100.0;
    final gradeResult = GradingCalculator.calculateSecondaryGrade([
      SubjectMark(
        subjectCode: 'PHY-11',
        subjectName: 'Physics',
        theoryMarks: _theoryMarks,
        maxTheoryMarks: 70,
        practicalMarks: _practicalMarks,
        maxPracticalMarks: 30,
        creditHours: 4,
      ),
    ]);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Automated CCE & CBSE Mark Entry Engine', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const Text('Compute composite GPA and grade classifications dynamically.', style: TextStyle(fontSize: 12, color: Colors.grey)),
          const SizedBox(height: 16),

          // Theory Slider
          Text('Theory Marks: ${_theoryMarks.toInt()} / 70', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          Slider(
            value: _theoryMarks,
            min: 0,
            max: 70,
            divisions: 70,
            label: '${_theoryMarks.toInt()}',
            onChanged: (val) => setState(() => _theoryMarks = val),
          ),

          // Practical Slider
          Text('Practical & Lab Marks: ${_practicalMarks.toInt()} / 30', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          Slider(
            value: _practicalMarks,
            min: 0,
            max: 30,
            divisions: 30,
            label: '${_practicalMarks.toInt()}',
            onChanged: (val) => setState(() => _practicalMarks = val),
          ),

          const SizedBox(height: 16),
          // Calculation Result Box
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.blue.shade200),
              boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 6)],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total Composite Marks:', style: TextStyle(fontSize: 13, color: Colors.grey)),
                    Text('${totalMarks.toInt()} / 100 (${totalPercentage.toStringAsFixed(1)}%)', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  ],
                ),
                const Divider(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('CBSE Grade Classification:', style: TextStyle(fontSize: 13, color: Colors.grey)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.green.shade50,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.green.shade300),
                      ),
                      child: Text(
                        gradeResult.overallGrade,
                        style: TextStyle(color: Colors.green.shade800, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Cumulative GPA (10 Pt Scale):', style: TextStyle(fontSize: 13, color: Colors.grey)),
                    Text(
                      gradeResult.cumulativeGpa.toStringAsFixed(2),
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.blueAccent),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNurseryTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Pre-Primary Observational Assessment', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const Text('Daily log for Ananya Sharma (Nursery Pre-Primary)', style: TextStyle(fontSize: 12, color: Colors.grey)),
          const SizedBox(height: 14),
          _buildNurseryTile(Icons.bedtime, 'Nap Duration', '1 Hour 20 Minutes (Restful)'),
          _buildNurseryTile(Icons.restaurant, 'Midday Meal Log', 'Eaten fully (Porridge and fruits)'),
          _buildNurseryTile(Icons.sports_esports, 'Fine Motor Skills', 'Excellent (Block stacking and scissor work)'),
          _buildNurseryTile(Icons.emoji_emotions, 'Social & Emotional', 'Joyful, engaged cooperatively with peers'),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 44,
            child: ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Nursery observation shared with parents via Firebase!')),
                );
              },
              icon: const Icon(Icons.send),
              label: const Text('Broadcast Daily Nursery Diary to Parents'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purple.shade700,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNurseryTile(IconData icon, String title, String subtitle) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.purple.shade600, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.black87)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
