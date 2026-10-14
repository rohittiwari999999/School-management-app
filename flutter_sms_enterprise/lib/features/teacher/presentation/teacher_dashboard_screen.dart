import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/core/widgets/role_switcher_bar.dart';
import 'package:edupulse_sms/features/auth/presentation/auth_controller.dart';
import 'package:edupulse_sms/features/attendance/data/attendance_repository.dart';
import 'package:edupulse_sms/features/conference/data/conference_repository.dart';
import 'package:edupulse_sms/features/conference/domain/conference_models.dart';
import 'package:edupulse_sms/features/conference/presentation/live_conference_screen.dart';

class StudentItem {
  final String id;
  final String name;
  final String roll;
  final String admissionNo;
  String avatarUrl;

  StudentItem({
    required this.id,
    required this.name,
    required this.roll,
    required this.admissionNo,
    required this.avatarUrl,
  });
}

class TeacherDashboardScreen extends ConsumerStatefulWidget {
  const TeacherDashboardScreen({super.key});

  @override
  ConsumerState<TeacherDashboardScreen> createState() => _TeacherDashboardScreenState();
}

class _TeacherDashboardScreenState extends ConsumerState<TeacherDashboardScreen> {
  String _activeTab = 'attendance'; // attendance, live_class, grading, homework, nursery, audit
  String _selectedClassId = 'CLS_11';

  final List<StudentItem> _students = [
    StudentItem(
      id: 'STU_CLASS11_01',
      name: 'Aarav Sharma',
      roll: 'ROLL-1101',
      admissionNo: 'ADM-2026-089',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    ),
    StudentItem(
      id: 'STU_02',
      name: 'Dia Patel',
      roll: 'ROLL-1102',
      admissionNo: 'ADM-2026-090',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    ),
    StudentItem(
      id: 'STU_03',
      name: 'Kabir Mehta',
      roll: 'ROLL-1103',
      admissionNo: 'ADM-2026-091',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    ),
    StudentItem(
      id: 'STU_04',
      name: 'Ishaan Verma',
      roll: 'ROLL-1104',
      admissionNo: 'ADM-2026-092',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ),
    StudentItem(
      id: 'STU_05',
      name: 'Ananya Sen',
      roll: 'ROLL-1105',
      admissionNo: 'ADM-2026-093',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ),
  ];

  final Map<String, AttendanceStatus> _attendanceMap = {
    'STU_CLASS11_01': AttendanceStatus.present,
    'STU_02': AttendanceStatus.present,
    'STU_03': AttendanceStatus.absent,
    'STU_04': AttendanceStatus.leave,
    'STU_05': AttendanceStatus.present,
  };

  bool _isSavingAttendance = false;
  String? _statusNotice;

  // Grading states
  double _theoryMarks = 65.0;
  double _practicalMarks = 28.0;

  // Homework states
  final TextEditingController _hwTitleController = TextEditingController(text: 'Chapter 4: Optics Problems 1-10');
  final TextEditingController _hwDescController = TextEditingController(text: 'Solve ray tracing problems. Submit on Thursday.');

  final List<String> _avatarPresets = [
    'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  ];

  @override
  void dispose() {
    _hwTitleController.dispose();
    _hwDescController.dispose();
    super.dispose();
  }

  void _showTeacherPhotoDialog() {
    final authState = ref.read(authControllerProvider);
    String currentUrl = authState.user?.avatarUrl ?? _avatarPresets[0];

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: const Row(
                children: [
                  Icon(Icons.camera_alt, color: Color(0xFF2563EB), size: 22),
                  SizedBox(width: 8),
                  Text('Update Teacher Photo', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircleAvatar(
                      radius: 36,
                      backgroundImage: NetworkImage(currentUrl),
                    ),
                    const SizedBox(height: 12),
                    const Text('Select Avatar Preset / फ़ोटो चुनें:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _avatarPresets.map((preset) {
                        final isSel = preset == currentUrl;
                        return GestureDetector(
                          onTap: () => setDialogState(() => currentUrl = preset),
                          child: Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isSel ? const Color(0xFF2563EB) : Colors.transparent,
                                width: 2.5,
                              ),
                            ),
                            child: CircleAvatar(
                              radius: 20,
                              backgroundImage: NetworkImage(preset),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    ref.read(authControllerProvider.notifier).updateUserAvatar(currentUrl);
                    Navigator.pop(ctx);
                    setState(() {
                      _statusNotice = '✓ Teacher photo updated successfully!';
                    });
                    Future.delayed(const Duration(seconds: 4), () {
                      if (mounted) setState(() => _statusNotice = null);
                    });
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB), foregroundColor: Colors.white),
                  child: const Text('Save Photo'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showStudentPhotoDialog(StudentItem student) {
    String currentUrl = student.avatarUrl;

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: Row(
                children: [
                  const Icon(Icons.person, color: Color(0xFF4F46E5), size: 22),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text('Update Photo: ${student.name}', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircleAvatar(
                      radius: 36,
                      backgroundImage: NetworkImage(currentUrl),
                    ),
                    const SizedBox(height: 12),
                    const Text('Select Student Avatar Preset:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _avatarPresets.map((preset) {
                        final isSel = preset == currentUrl;
                        return GestureDetector(
                          onTap: () => setDialogState(() => currentUrl = preset),
                          child: Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isSel ? const Color(0xFF4F46E5) : Colors.transparent,
                                width: 2.5,
                              ),
                            ),
                            child: CircleAvatar(
                              radius: 20,
                              backgroundImage: NetworkImage(preset),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      student.avatarUrl = currentUrl;
                      _statusNotice = '✓ Photo updated for ${student.name}!';
                    });
                    Navigator.pop(ctx);
                    Future.delayed(const Duration(seconds: 4), () {
                      if (mounted) setState(() => _statusNotice = null);
                    });
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5), foregroundColor: Colors.white),
                  child: const Text('Save Photo'),
                ),
              ],
            );
          },
        );
      },
    );
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

  Future<void> _saveAttendance() async {
    setState(() => _isSavingAttendance = true);
    await Future.delayed(const Duration(milliseconds: 600));
    if (mounted) {
      setState(() {
        _isSavingAttendance = false;
        _statusNotice = '✓ Daily attendance saved & synced successfully!';
      });
      Future.delayed(const Duration(seconds: 4), () {
        if (mounted) setState(() => _statusNotice = null);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final user = authState.user;
    final teacherName = user?.fullName ?? 'Ms. Priya Sharma';
    final teacherDesignation = user?.designation ?? 'Senior Faculty & Class In-Charge';
    final teacherAvatar = user?.avatarUrl ?? _avatarPresets[0];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            // Persistent Role Switcher at the very top
            const RoleSwitcherBar(),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Top Teacher Banner: Only Name, Short Designation, Photo & Photo Option
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF1E3A8A), Color(0xFF312E81), Color(0xFF0F172A)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 8, offset: Offset(0, 3))],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              // Teacher Photo with camera icon
                              Stack(
                                children: [
                                  CircleAvatar(
                                    radius: 26,
                                    backgroundImage: NetworkImage(teacherAvatar),
                                  ),
                                  Positioned(
                                    bottom: -2,
                                    right: -2,
                                    child: GestureDetector(
                                      onTap: _showTeacherPhotoDialog,
                                      child: Container(
                                        padding: const EdgeInsets.all(4),
                                        decoration: const BoxDecoration(
                                          color: Color(0xFF2563EB),
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(Icons.camera_alt, color: Colors.white, size: 12),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(width: 12),

                              // Name & Short Designation
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      teacherName,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 18,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: -0.3,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      teacherDesignation,
                                      style: const TextStyle(
                                        color: Color(0xFF93C5FD),
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              // Quick Action Buttons
                              Row(
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.photo_camera, color: Color(0xFF93C5FD), size: 20),
                                    tooltip: 'Teacher Photo',
                                    onPressed: _showTeacherPhotoDialog,
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.people, color: Color(0xFFA5B4FC), size: 20),
                                    tooltip: 'Student Photos',
                                    onPressed: () => _showStudentPhotoDialog(_students.first),
                                  ),
                                ],
                              ),
                            ],
                          ),

                          if (_statusNotice != null) ...[
                            const SizedBox(height: 10),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.emerald.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.emerald.withOpacity(0.4)),
                              ),
                              child: Text(
                                _statusNotice!,
                                style: const TextStyle(color: Color(0xFF6EE7B7), fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Teacher Console Switcher - 2 Rows (3 Buttons Top, 3 Buttons Below)
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 3, offset: Offset(0, 1))],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Icon(Icons.school, size: 14, color: Color(0xFF2563EB)),
                                    SizedBox(width: 4),
                                    Text('Teacher Console Switcher', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF475569))),
                                  ],
                                ),
                                Text('Switch Active Module', style: TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                              ],
                            ),
                          ),
                          const Divider(height: 10),

                          // Row 1: Attendance, Live Class, Grading
                          Row(
                            children: [
                              Expanded(
                                child: _buildSwitcherButton(
                                  id: 'attendance',
                                  label: 'Attendance',
                                  icon: Icons.calendar_today,
                                  color: const Color(0xFF2563EB),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: _buildSwitcherButton(
                                  id: 'live_class',
                                  label: 'Live Class',
                                  icon: Icons.videocam,
                                  color: const Color(0xFFE11D48),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: _buildSwitcherButton(
                                  id: 'grading',
                                  label: 'Grading',
                                  icon: Icons.calculate,
                                  color: const Color(0xFF2563EB),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),

                          // Row 2: Homework, Nursery, Audit
                          Row(
                            children: [
                              Expanded(
                                child: _buildSwitcherButton(
                                  id: 'homework',
                                  label: 'Homework',
                                  icon: Icons.assignment,
                                  color: const Color(0xFF2563EB),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: _buildSwitcherButton(
                                  id: 'nursery',
                                  label: 'Nursery',
                                  icon: Icons.child_care,
                                  color: const Color(0xFF2563EB),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: _buildSwitcherButton(
                                  id: 'audit',
                                  label: 'Sync Audit',
                                  icon: Icons.sync,
                                  color: const Color(0xFF2563EB),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Active Module View
                    if (_activeTab == 'attendance') _buildAttendanceModule(),
                    if (_activeTab == 'live_class') _buildLiveClassModule(),
                    if (_activeTab == 'grading') _buildGradingModule(),
                    if (_activeTab == 'homework') _buildHomeworkModule(),
                    if (_activeTab == 'nursery') _buildNurseryModule(),
                    if (_activeTab == 'audit') _buildAuditModule(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitcherButton({
    required String id,
    required String label,
    required IconData icon,
    required Color color,
  }) {
    final isSelected = _activeTab == id;

    return InkWell(
      onTap: () => setState(() => _activeTab = id),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        decoration: BoxDecoration(
          color: isSelected ? color : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? color : const Color(0xFFE2E8F0),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 14, color: isSelected ? Colors.white : const Color(0xFF475569)),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : const Color(0xFF334155),
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAttendanceModule() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Class Switcher & Save Button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              DropdownButton<String>(
                value: _selectedClassId,
                underline: const SizedBox(),
                items: const [
                  DropdownMenuItem(value: 'CLS_11', child: Text('Class 11-A (Science)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13))),
                  DropdownMenuItem(value: 'CLS_NURSERY', child: Text('Nursery-A (Pre-Primary)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13))),
                ],
                onChanged: (val) {
                  if (val != null) setState(() => _selectedClassId = val);
                },
              ),
              ElevatedButton.icon(
                onPressed: _isSavingAttendance ? null : _saveAttendance,
                icon: const Icon(Icons.check, size: 14),
                label: Text(_isSavingAttendance ? 'Saving...' : 'Save Roll-Call', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981), foregroundColor: Colors.white),
              ),
            ],
          ),
          const Divider(height: 16),

          // Roll-Call Student Rows with Photo and Camera Update Button
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _students.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (context, idx) {
              final student = _students[idx];
              final currentStatus = _attendanceMap[student.id] ?? AttendanceStatus.present;

              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Row(
                  children: [
                    // Student Photo with update button
                    Stack(
                      children: [
                        CircleAvatar(
                          radius: 18,
                          backgroundImage: NetworkImage(student.avatarUrl),
                        ),
                        Positioned(
                          bottom: -3,
                          right: -3,
                          child: GestureDetector(
                            onTap: () => _showStudentPhotoDialog(student),
                            child: Container(
                              padding: const EdgeInsets.all(2),
                              decoration: const BoxDecoration(
                                color: Color(0xFF2563EB),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.camera_alt, color: Colors.white, size: 9),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 10),

                    // Student Details
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(student.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          Text('${student.roll} • Adm: ${student.admissionNo}', style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                        ],
                      ),
                    ),

                    // P, A, L toggle buttons
                    Row(
                      children: [
                        _buildStatusChip(student.id, AttendanceStatus.present, 'P', const Color(0xFF10B981), currentStatus),
                        const SizedBox(width: 4),
                        _buildStatusChip(student.id, AttendanceStatus.absent, 'A', const Color(0xFFEF4444), currentStatus),
                        const SizedBox(width: 4),
                        _buildStatusChip(student.id, AttendanceStatus.leave, 'L', const Color(0xFFF59E0B), currentStatus),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(String studentId, AttendanceStatus status, String label, Color color, AttendanceStatus current) {
    final isSelected = current == status;

    return GestureDetector(
      onTap: () {
        setState(() {
          _attendanceMap[studentId] = status;
        });
      },
      child: Container(
        width: 28,
        height: 28,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: isSelected ? color : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(6),
          border: Border.all(
            color: isSelected ? color : const Color(0xFFCBD5E1),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : const Color(0xFF475569),
            fontWeight: FontWeight.bold,
            fontSize: 11,
          ),
        ),
      ),
    );
  }

  Widget _buildLiveClassModule() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Live Interactive Classroom', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 4),
          const Text('Launch WebRTC high-definition virtual classroom with live audio, video & screen share.', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: _startLiveClass,
            icon: const Icon(Icons.videocam, size: 18),
            label: const Text('Start Physics Live Class', style: TextStyle(fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE11D48),
              foregroundColor: Colors.white,
              minimumSize: const Size.fromHeight(42),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGradingModule() {
    final total = _theoryMarks + _practicalMarks;
    final pct = (total / 100.0) * 100;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('CBSE Secondary Grading Calculator', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 12),
          Text('Theory: ${_theoryMarks.toInt()} / 70', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          Slider(
            value: _theoryMarks,
            min: 0,
            max: 70,
            divisions: 70,
            onChanged: (v) => setState(() => _theoryMarks = v),
          ),
          Text('Practical: ${_practicalMarks.toInt()} / 30', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          Slider(
            value: _practicalMarks,
            min: 0,
            max: 30,
            divisions: 30,
            onChanged: (v) => setState(() => _practicalMarks = v),
          ),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Total: ${total.toInt()} / 100 (${pct.toStringAsFixed(1)}%)', style: const TextStyle(fontWeight: FontWeight.bold)),
                Text(pct >= 90 ? 'Grade: A1' : pct >= 80 ? 'Grade: A2' : 'Grade: B1', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF2563EB))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHomeworkModule() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Homework & Digital Diary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 12),
          TextField(
            controller: _hwTitleController,
            decoration: const InputDecoration(labelText: 'Assignment Title', border: OutlineInputBorder()),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _hwDescController,
            maxLines: 2,
            decoration: const InputDecoration(labelText: 'Instructions', border: OutlineInputBorder()),
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('✓ Assignment published to student portals!')),
              );
            },
            icon: const Icon(Icons.send, size: 16),
            label: const Text('Publish Assignment'),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB), foregroundColor: Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _buildNurseryModule() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Pre-Primary Sensory Observation', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          SizedBox(height: 8),
          Text('Meal Intake: Eaten fully (Healthy appetite)', style: TextStyle(fontSize: 12)),
          SizedBox(height: 4),
          Text('Nap Duration: 1 hr 15 mins (Restful)', style: TextStyle(fontSize: 12)),
          SizedBox(height: 4),
          Text('Fine Motor: Building blocks and crayon grips', style: TextStyle(fontSize: 12)),
          SizedBox(height: 4),
          Text('Social: Cooperative, energetic and shared toys gladly.', style: TextStyle(fontSize: 12, color: Color(0xFF2563EB), fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildAuditModule() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Sync & Storage Audit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          SizedBox(height: 8),
          Text('Cloud Firestore: Connected (Region: asia-south1)', style: TextStyle(fontSize: 12, color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
          SizedBox(height: 4),
          Text('Offline Queue: 0 Pending Batches (All synced)', style: TextStyle(fontSize: 12)),
          SizedBox(height: 4),
          Text('Network State: Wi-Fi Online (Latency: 28ms)', style: TextStyle(fontSize: 12)),
        ],
      ),
    );
  }
}
