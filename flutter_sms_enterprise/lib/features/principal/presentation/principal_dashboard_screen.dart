import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/core/widgets/role_switcher_bar.dart';
import 'package:edupulse_sms/features/conference/data/conference_repository.dart';
import 'package:edupulse_sms/features/conference/domain/conference_models.dart';
import 'package:edupulse_sms/features/conference/presentation/live_conference_screen.dart';

class PrincipalStaffItem {
  final String id;
  final String fullName;
  final String role;
  final String email;
  final String phone;
  final String designation;
  final String department;
  final String employeeId;
  String avatarUrl;
  String status;

  PrincipalStaffItem({
    required this.id,
    required this.fullName,
    required this.role,
    required this.email,
    required this.phone,
    required this.designation,
    required this.department,
    required this.employeeId,
    required this.avatarUrl,
    this.status = 'active',
  });
}

class PrincipalStudentItem {
  final String id;
  final String name;
  final String classId;
  final String admissionNo;
  String? boardRollNumber;
  final String avatarUrl;
  final double attendance;

  PrincipalStudentItem({
    required this.id,
    required this.name,
    required this.classId,
    required this.admissionNo,
    this.boardRollNumber,
    required this.avatarUrl,
    required this.attendance,
  });
}

class PrincipalDashboardScreen extends ConsumerStatefulWidget {
  const PrincipalDashboardScreen({super.key});

  @override
  ConsumerState<PrincipalDashboardScreen> createState() => _PrincipalDashboardScreenState();
}

class _PrincipalDashboardScreenState extends ConsumerState<PrincipalDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final TextEditingController _circularTitleController = TextEditingController();
  final TextEditingController _circularMsgController = TextEditingController();
  bool _isUrgent = true;

  // Avatar presets for photo selection
  final List<String> _photoPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  ];

  // Active Staff List
  final List<PrincipalStaffItem> _staffList = [
    PrincipalStaffItem(
      id: 'CRED_PRIN_01',
      fullName: 'Dr. Alok Verma',
      role: 'Principal & Head of School',
      email: 'principal@edupulse.edu',
      phone: '+91 98765 43210',
      designation: 'Head of Institution',
      department: 'Executive Administration',
      employeeId: 'EMP-PRIN-001',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    ),
    PrincipalStaffItem(
      id: 'CRED_TCH_01',
      fullName: 'Ms. Priya Sharma',
      role: 'Class Teacher & Senior Faculty',
      email: 'priya.sharma@edupulse.edu',
      phone: '+91 98112 23344',
      designation: 'Sr. Faculty (Physics)',
      department: 'Senior Secondary Science',
      employeeId: 'EMP-TCH-101',
      avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    ),
    PrincipalStaffItem(
      id: 'CRED_TCH_02',
      fullName: 'Dr. Vikram Sen',
      role: 'Head of Mathematics',
      email: 'vikram.sen@edupulse.edu',
      phone: '+91 98112 77889',
      designation: 'Sr. Faculty (Math & Calculus)',
      department: 'Secondary Mathematics',
      employeeId: 'EMP-TCH-102',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    ),
    PrincipalStaffItem(
      id: 'CRED_ACC_01',
      fullName: 'Mr. Vikram Goel',
      role: 'Accounts & Bursar',
      email: 'vikram.goel@edupulse.edu',
      phone: '+91 97654 32109',
      designation: 'Senior Accountant / Fee Desk',
      department: 'Finance & Accounts',
      employeeId: 'EMP-ACC-301',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    ),
    PrincipalStaffItem(
      id: 'CRED_SUPP_01',
      fullName: 'Ramesh Kumar',
      role: 'Senior Driver (Bus Route 14)',
      email: 'ramesh.k@edupulse.edu',
      phone: '+91 98100 11223',
      designation: 'Transport Staff',
      department: 'Logistics & Safety',
      employeeId: 'EMP-DRV-401',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    ),
  ];

  // Students Directory with CBSE rolls
  final List<PrincipalStudentItem> _studentsList = [
    PrincipalStudentItem(
      id: 'STU_CLASS11_01',
      name: 'Aarav Sharma',
      classId: 'Class 11-A',
      admissionNo: 'ADM-2026-089',
      boardRollNumber: 'CBSE-2026-11001',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      attendance: 94.5,
    ),
    PrincipalStudentItem(
      id: 'STU_02',
      name: 'Dia Patel',
      classId: 'Class 11-A',
      admissionNo: 'ADM-2026-090',
      boardRollNumber: 'CBSE-2026-11002',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      attendance: 96.0,
    ),
    PrincipalStudentItem(
      id: 'STU_03',
      name: 'Kabir Mehta',
      classId: 'Class 11-A',
      admissionNo: 'ADM-2026-091',
      boardRollNumber: 'CBSE-2026-11003',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      attendance: 88.0,
    ),
    PrincipalStudentItem(
      id: 'STU_NURSERY_01',
      name: 'Ananya Sharma',
      classId: 'Nursery-A',
      admissionNo: 'ADM-2026-099',
      boardRollNumber: null,
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      attendance: 98.0,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _circularTitleController.dispose();
    _circularMsgController.dispose();
    super.dispose();
  }

  void _showAddStaffModal() {
    final nameCtrl = TextEditingController();
    final emailCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final deptCtrl = TextEditingController(text: 'Academics');
    final desigCtrl = TextEditingController(text: 'Faculty Member');
    String selectedRole = 'Teacher';
    String selectedPhoto = _photoPresets[0];

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: const Row(
                children: [
                  Icon(Icons.person_add_alt_1, color: Color(0xFF2563EB), size: 22),
                  SizedBox(width: 8),
                  Text('Add New Staff Personnel', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Photo Selection Section (Optional photo with preview)
                    Center(
                      child: Column(
                        children: [
                          CircleAvatar(
                            radius: 32,
                            backgroundImage: NetworkImage(selectedPhoto),
                          ),
                          const SizedBox(height: 6),
                          const Text('Staff Photo (Optional):', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.blueGrey)),
                          const SizedBox(height: 6),
                          Wrap(
                            spacing: 6,
                            runSpacing: 6,
                            children: _photoPresets.take(5).map((preset) {
                              final isSel = preset == selectedPhoto;
                              return GestureDetector(
                                onTap: () => setModalState(() => selectedPhoto = preset),
                                child: Container(
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: isSel ? const Color(0xFF2563EB) : Colors.transparent,
                                      width: 2,
                                    ),
                                  ),
                                  child: CircleAvatar(
                                    radius: 14,
                                    backgroundImage: NetworkImage(preset),
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    TextField(
                      controller: nameCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Full Name *',
                        hintText: 'e.g. Dr. Rajesh Kumar',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
                    ),
                    const SizedBox(height: 10),

                    DropdownButtonFormField<String>(
                      value: selectedRole,
                      decoration: const InputDecoration(
                        labelText: 'Role Designation *',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'Teacher', child: Text('Teacher / Faculty')),
                        DropdownMenuItem(value: 'Class Teacher', child: Text('Class In-Charge')),
                        DropdownMenuItem(value: 'Accountant', child: Text('Accountant / Bursar')),
                        DropdownMenuItem(value: 'Principal', child: Text('Principal / Vice Principal')),
                        DropdownMenuItem(value: 'Support Staff', child: Text('Support Staff')),
                      ],
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedRole = val);
                      },
                    ),
                    const SizedBox(height: 10),

                    TextField(
                      controller: emailCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Official Email *',
                        hintText: 'name@edupulse.edu',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
                    ),
                    const SizedBox(height: 10),

                    TextField(
                      controller: phoneCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Contact Phone Number',
                        hintText: '+91 98000 00000',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
                    ),
                    const SizedBox(height: 10),

                    TextField(
                      controller: deptCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Department / Section',
                        hintText: 'e.g. Physics / English / Administration',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      ),
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
                    final name = nameCtrl.text.trim();
                    if (name.isEmpty) return;

                    final newStaff = PrincipalStaffItem(
                      id: 'CRED_STAFF_${DateTime.now().millisecondsSinceEpoch}',
                      fullName: name,
                      role: selectedRole,
                      email: emailCtrl.text.trim().isNotEmpty ? emailCtrl.text.trim() : '$name@edupulse.edu',
                      phone: phoneCtrl.text.trim().isNotEmpty ? phoneCtrl.text.trim() : '+91 98000 12345',
                      designation: desigCtrl.text.trim(),
                      department: deptCtrl.text.trim(),
                      employeeId: 'EMP-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
                      avatarUrl: selectedPhoto,
                      status: 'active',
                    );

                    setState(() {
                      _staffList.add(newStaff);
                    });

                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('✓ Staff member "$name" saved with photo successfully!'),
                        backgroundColor: Colors.green,
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB), foregroundColor: Colors.white),
                  child: const Text('Save Staff Details'),
                ),
              ],
            );
          },
        );
      },
    );
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

  void _generateCbseRolls() {
    setState(() {
      int roll = 11005;
      for (var s in _studentsList) {
        if (s.classId.contains('11')) {
          s.boardRollNumber = 'CBSE-2026-$roll';
          roll++;
        }
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✓ CBSE Board Roll Numbers generated & synced across student profiles!'),
        backgroundColor: Colors.indigo,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            // Principal Header Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              color: const Color(0xFF0F172A),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Principal & Executive Console', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white)),
                      Text('Dr. Alok Verma • EduPulse Global Academy', style: TextStyle(fontSize: 11, color: Colors.lightBlueAccent)),
                    ],
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.broadcast_on_home, color: Colors.lightBlueAccent, size: 22),
                        tooltip: 'Broadcast Morning Assembly',
                        onPressed: _launchAllHandsAssembly,
                      ),
                      IconButton(
                        icon: const Icon(Icons.logout_rounded, color: Colors.white70, size: 22),
                        tooltip: 'Sign Out to Login',
                        onPressed: () {
                          ref.read(authControllerProvider.notifier).signOut();
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Tabs Selector
            Container(
              color: const Color(0xFF1E293B),
              child: TabBar(
                controller: _tabController,
                isScrollable: true,
                indicatorColor: const Color(0xFF60A5FA),
                indicatorWeight: 3,
                labelColor: Colors.white,
                unselectedLabelColor: const Color(0xFF94A3B8),
                labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                tabs: [
                  Tab(icon: const Icon(Icons.badge, size: 16), text: 'Staff Directory (${_staffList.length})'),
                  Tab(icon: const Icon(Icons.people_alt, size: 16), text: 'Students (${_studentsList.length})'),
                  const Tab(icon: Icon(Icons.campaign, size: 16), text: 'Broadcasts & Assembly'),
                  const Tab(icon: Icon(Icons.analytics, size: 16), text: 'School KPIs'),
                ],
              ),
            ),

            // Tab Views
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildStaffDirectoryTab(),
                  _buildStudentsDirectoryTab(),
                  _buildBroadcastsTab(),
                  _buildKpisTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStaffDirectoryTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Active Staff & Faculty', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A))),
              ElevatedButton.icon(
                onPressed: _showAddStaffModal,
                icon: const Icon(Icons.person_add, size: 16),
                label: const Text('Add Staff Personnel', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB), foregroundColor: Colors.white),
              ),
            ],
          ),
          const SizedBox(height: 10),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _staffList.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final staff = _staffList[index];
              return Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 2, offset: Offset(0, 1))],
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 22,
                      backgroundImage: NetworkImage(staff.avatarUrl),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(staff.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEFF6FF),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(staff.role, style: const TextStyle(fontSize: 10, color: Color(0xFF1D4ED8), fontWeight: FontWeight.w600)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Text('${staff.department} • ${staff.employeeId}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                          const SizedBox(height: 2),
                          Text('${staff.email} • ${staff.phone}', style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.green.shade50,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: Colors.green.shade200),
                      ),
                      child: Text('Active', style: TextStyle(fontSize: 10, color: Colors.green.shade800, fontWeight: FontWeight.bold)),
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

  Widget _buildStudentsDirectoryTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Enrolled Students', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A))),
              ElevatedButton.icon(
                onPressed: _generateCbseRolls,
                icon: const Icon(Icons.format_list_numbered, size: 16),
                label: const Text('Generate Board Rolls', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5), foregroundColor: Colors.white),
              ),
            ],
          ),
          const SizedBox(height: 10),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _studentsList.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final student = _studentsList[index];
              return Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundImage: NetworkImage(student.avatarUrl),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(student.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                                decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(4)),
                                child: Text(student.classId, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text('Adm: ${student.admissionNo} • Attendance: ${student.attendance}%', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                          if (student.boardRollNumber != null)
                            Padding(
                              padding: const EdgeInsets.only(top: 2),
                              child: Text('Board Roll: ${student.boardRollNumber}', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF2563EB))),
                            ),
                        ],
                      ),
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

  Widget _buildBroadcastsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Live Video Assembly Banner
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF0F172A), Color(0xFF1E293B)]),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.video_camera_front, color: Colors.lightBlueAccent, size: 20),
                    SizedBox(width: 8),
                    Text('School-Wide Morning Assembly Broadcast', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                  ],
                ),
                const SizedBox(height: 6),
                const Text('Live HD WebRTC video stream directly to classroom smart displays and parent portals.', style: TextStyle(color: Colors.white70, fontSize: 11)),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _launchAllHandsAssembly,
                    icon: const Icon(Icons.play_circle_fill),
                    label: const Text('Start Morning Assembly Broadcast'),
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB), foregroundColor: Colors.white),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Emergency Circular
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.campaign, color: Colors.red.shade600, size: 20),
                    const SizedBox(width: 8),
                    const Text('Dispatch Emergency Circular & Push FCM', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  ],
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _circularTitleController,
                  decoration: const InputDecoration(
                    labelText: 'Circular Headline',
                    hintText: 'e.g. Inclement Weather Advisory',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _circularMsgController,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    labelText: 'Full Description',
                    hintText: 'Detailed instructions for parents & faculty...',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.all(10),
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Switch(
                      value: _isUrgent,
                      activeColor: Colors.redAccent,
                      onChanged: (val) => setState(() => _isUrgent = val),
                    ),
                    const Text('High-Priority Siren Broadcast', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                  ],
                ),
                const SizedBox(height: 6),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      if (_circularTitleController.text.trim().isEmpty) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('✓ Emergency Circular dispatched to all parents & teachers via FCM!'),
                          backgroundColor: Colors.green,
                        ),
                      );
                      _circularTitleController.clear();
                      _circularMsgController.clear();
                    },
                    icon: const Icon(Icons.send, size: 14),
                    label: const Text('Publish Circular Across SMS'),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade700, foregroundColor: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKpisTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          Row(
            children: [
              _buildKpiCard('Total Enrolled', '1,480', 'Nursery to 12th', Colors.blue, Icons.people),
              const SizedBox(width: 8),
              _buildKpiCard('Fee Collections', '88.4%', '₹42.8L Collected', Colors.green, Icons.payments),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              _buildKpiCard('Faculty On Duty', '98.2%', '64 Present', Colors.indigo, Icons.badge),
              const SizedBox(width: 8),
              _buildKpiCard('Daily Attendance', '94.6%', '1,400 Students', Colors.amber.shade800, Icons.check_circle),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildKpiCard(String title, String mainValue, String subValue, Color color, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: const TextStyle(fontSize: 10, color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
                Icon(icon, color: color, size: 16),
              ],
            ),
            const SizedBox(height: 4),
            Text(mainValue, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 2),
            Text(subValue, style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
          ],
        ),
      ),
    );
  }
}
