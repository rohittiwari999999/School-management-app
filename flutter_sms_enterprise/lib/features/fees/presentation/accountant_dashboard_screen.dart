import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:edupulse_sms/core/utils/auth_dialog_utils.dart';
import 'package:edupulse_sms/features/fees/domain/fee_calculator.dart';

class EnrolledStudentModel {
  final String id;
  final String fullName;
  final String classId;
  final String admissionNo;
  final String parentName;
  final String phone;
  final double feeDue;
  String avatarUrl;
  final DateTime admissionDate;

  EnrolledStudentModel({
    required this.id,
    required this.fullName,
    required this.classId,
    required this.admissionNo,
    required this.parentName,
    required this.phone,
    required this.feeDue,
    required this.avatarUrl,
    required this.admissionDate,
  });
}

class SupportStaffModel {
  final String id;
  final String fullName;
  final String role;
  final String phone;
  final double salary;
  String avatarUrl;

  SupportStaffModel({
    required this.id,
    required this.fullName,
    required this.role,
    required this.phone,
    required this.salary,
    required this.avatarUrl,
  });
}

class AccountantDashboardScreen extends ConsumerStatefulWidget {
  const AccountantDashboardScreen({super.key});

  @override
  ConsumerState<AccountantDashboardScreen> createState() =>
      _AccountantDashboardScreenState();
}

class _AccountantDashboardScreenState extends ConsumerState<AccountantDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Photo presets for student & staff
  final List<String> _photoPresets = [
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];

  // Enrolled students state
  final List<EnrolledStudentModel> _enrolledStudents = [
    EnrolledStudentModel(
      id: 'STU_CLASS11_01',
      fullName: 'Aarav Sharma',
      classId: 'Class 11-A',
      admissionNo: 'ADM-2026-089',
      parentName: 'Rajesh Sharma',
      phone: '+91 99887 76655',
      feeDue: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      admissionDate: DateTime(2026, 4, 1),
    ),
    EnrolledStudentModel(
      id: 'STU_02',
      fullName: 'Dia Patel',
      classId: 'Class 11-A',
      admissionNo: 'ADM-2026-090',
      parentName: 'Kiran Patel',
      phone: '+91 98223 34455',
      feeDue: 4500,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      admissionDate: DateTime(2026, 4, 2),
    ),
    EnrolledStudentModel(
      id: 'STU_NURSERY_01',
      fullName: 'Ananya Sharma',
      classId: 'Nursery-A',
      admissionNo: 'ADM-2026-099',
      parentName: 'Rajesh Sharma',
      phone: '+91 99887 76655',
      feeDue: 18500,
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      admissionDate: DateTime(2026, 4, 5),
    ),
  ];

  // Support staff list
  final List<SupportStaffModel> _supportStaff = [
    SupportStaffModel(
      id: 'SUPP_01',
      fullName: 'Ramesh Kumar',
      role: 'Bus Driver (Route 14)',
      phone: '+91 98100 11223',
      salary: 22000,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ),
    SupportStaffModel(
      id: 'SUPP_02',
      fullName: 'Sunita Devi',
      role: 'Head Ayah & Daycare Caretaker',
      phone: '+91 98200 33445',
      salary: 16500,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    ),
    SupportStaffModel(
      id: 'SUPP_03',
      fullName: 'Bahadur Thapa',
      role: 'Senior Security Guard (Main Gate)',
      phone: '+91 98300 55667',
      salary: 19000,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    ),
  ];

  // Invoices list
  final List<InvoiceModel> _invoices = [
    InvoiceModel(
      invoiceId: 'INV-2026-001',
      schoolId: 'SCH_GLOBAL_001',
      studentId: 'STU_CLASS11_01',
      studentName: 'Aarav Sharma',
      classId: 'CLS_11',
      term: 'Term 2 (Quarterly)',
      dueDate: DateTime.now().add(const Duration(days: 5)),
      status: 'paid',
      amountPaid: 27500,
      lineItems: const [
        FeeItem(feeType: 'tuition', title: 'Senior Secondary Tuition (PCM)', amount: 18000),
        FeeItem(feeType: 'lab', title: 'Physics & Chemistry Lab Fee', amount: 4500),
        FeeItem(feeType: 'transport', title: 'Route 14 AC Bus Service', amount: 3500),
        FeeItem(feeType: 'sports', title: 'Cricket & Swimming Academy', amount: 1500),
      ],
    ),
    InvoiceModel(
      invoiceId: 'INV-2026-002',
      schoolId: 'SCH_GLOBAL_001',
      studentId: 'STU_02',
      studentName: 'Dia Patel',
      classId: 'CLS_11',
      term: 'Term 2 (Quarterly)',
      dueDate: DateTime.now().subtract(const Duration(days: 10)),
      status: 'pending',
      amountPaid: 12000,
      lineItems: const [
        FeeItem(feeType: 'tuition', title: 'Senior Secondary Tuition (PCM)', amount: 18000),
        FeeItem(feeType: 'lab', title: 'Computer STEM Lab', amount: 2500),
      ],
    ),
    InvoiceModel(
      invoiceId: 'INV-2026-003',
      schoolId: 'SCH_GLOBAL_001',
      studentId: 'STU_NURSERY_01',
      studentName: 'Ananya Sharma',
      classId: 'CLS_NURSERY',
      term: 'Term 2 (Quarterly)',
      dueDate: DateTime.now().add(const Duration(days: 12)),
      status: 'pending',
      amountPaid: 0,
      lineItems: const [
        FeeItem(feeType: 'tuition', title: 'Pre-Primary Tuition & Care', amount: 12000),
        FeeItem(feeType: 'activity', title: 'Sensory Play & Materials', amount: 4500),
        FeeItem(feeType: 'meals', title: 'Nutrition & Hot Meal Care', amount: 2000),
      ],
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
    super.dispose();
  }

  // --- Modal: New Student Admission Registration with Photo Option ---
  void _showNewAdmissionModal() {
    final nameCtrl = TextEditingController();
    final admNoCtrl = TextEditingController(text: 'ADM-2026-${100 + _enrolledStudents.length}');
    final parentCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final aadhaarCtrl = TextEditingController();
    String selectedClass = 'Class 11-A';
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
                  Icon(Icons.person_add, color: Color(0xFF1D4ED8), size: 22),
                  SizedBox(width: 8),
                  Text('New Student Admission', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Optional Photo Selection with instant circular preview
                    Center(
                      child: Column(
                        children: [
                          CircleAvatar(
                            radius: 34,
                            backgroundImage: NetworkImage(selectedPhoto),
                          ),
                          const SizedBox(height: 6),
                          const Text('Student Photo (Optional / फ़ोटो):', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.blueGrey)),
                          const SizedBox(height: 6),
                          Wrap(
                            spacing: 6,
                            runSpacing: 6,
                            children: _photoPresets.map((preset) {
                              final isSel = preset == selectedPhoto;
                              return GestureDetector(
                                onTap: () => setModalState(() => selectedPhoto = preset),
                                child: Container(
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: isSel ? const Color(0xFF1D4ED8) : Colors.transparent,
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
                        labelText: 'Student Full Name *',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      ),
                    ),
                    const SizedBox(height: 10),

                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: selectedClass,
                            decoration: const InputDecoration(
                              labelText: 'Allocated Class',
                              border: OutlineInputBorder(),
                              contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            ),
                            items: const [
                              DropdownMenuItem(value: 'Class 11-A', child: Text('Class 11-A')),
                              DropdownMenuItem(value: 'Class 5-B', child: Text('Class 5-B')),
                              DropdownMenuItem(value: 'Nursery-A', child: Text('Nursery-A')),
                            ],
                            onChanged: (val) {
                              if (val != null) setModalState(() => selectedClass = val);
                            },
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: TextField(
                            controller: admNoCtrl,
                            decoration: const InputDecoration(
                              labelText: 'Admission No',
                              border: OutlineInputBorder(),
                              contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    TextField(
                      controller: parentCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Father / Mother Name *',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      ),
                    ),
                    const SizedBox(height: 10),

                    TextField(
                      controller: phoneCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Parent Mobile Phone *',
                        hintText: '+91 98000 00000',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      ),
                    ),
                    const SizedBox(height: 10),

                    TextField(
                      controller: aadhaarCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Aadhaar Card No. (Optional)',
                        hintText: 'xxxx-xxxx-xxxx',
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
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

                    final newStudent = EnrolledStudentModel(
                      id: 'STU_${DateTime.now().millisecondsSinceEpoch}',
                      fullName: name,
                      classId: selectedClass,
                      admissionNo: admNoCtrl.text.trim(),
                      parentName: parentCtrl.text.trim().isNotEmpty ? parentCtrl.text.trim() : 'Parent',
                      phone: phoneCtrl.text.trim().isNotEmpty ? phoneCtrl.text.trim() : '+91 99000 11223',
                      feeDue: 18000,
                      avatarUrl: selectedPhoto,
                      admissionDate: DateTime.now(),
                    );

                    setState(() {
                      _enrolledStudents.add(newStudent);
                    });

                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('✓ New student "$name" enrolled with photo successfully!'),
                        backgroundColor: Colors.green,
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1D4ED8), foregroundColor: Colors.white),
                  child: const Text('Save & Enroll Student'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  // --- Modal: Support Staff Registration with Photo Option ---
  void _showAddSupportStaffModal() {
    final nameCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final salaryCtrl = TextEditingController(text: '18000');
    String selectedRole = 'School Bus Driver';
    String selectedPhoto = _photoPresets[3];

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: const Row(
                children: [
                  Icon(Icons.badge, color: Color(0xFF4F46E5), size: 22),
                  SizedBox(width: 8),
                  Text('Add Support Staff', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
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
                      children: _photoPresets.map((preset) {
                        final isSel = preset == selectedPhoto;
                        return GestureDetector(
                          onTap: () => setModalState(() => selectedPhoto = preset),
                          child: Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: isSel ? const Color(0xFF4F46E5) : Colors.transparent, width: 2),
                            ),
                            child: CircleAvatar(radius: 14, backgroundImage: NetworkImage(preset)),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 14),

                    TextField(
                      controller: nameCtrl,
                      decoration: const InputDecoration(labelText: 'Staff Full Name *', border: OutlineInputBorder(), contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8)),
                    ),
                    const SizedBox(height: 10),

                    DropdownButtonFormField<String>(
                      value: selectedRole,
                      decoration: const InputDecoration(labelText: 'Job Role *', border: OutlineInputBorder(), contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8)),
                      items: const [
                        DropdownMenuItem(value: 'School Bus Driver', child: Text('School Bus Driver')),
                        DropdownMenuItem(value: 'Security Guard', child: Text('Security Guard')),
                        DropdownMenuItem(value: 'Ayah / Daycare Attendant', child: Text('Ayah / Daycare')),
                        DropdownMenuItem(value: 'Office Peon / Runner', child: Text('Office Peon')),
                        DropdownMenuItem(value: 'Campus Electrician', child: Text('Electrician / Maintenance')),
                      ],
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedRole = val);
                      },
                    ),
                    const SizedBox(height: 10),

                    TextField(
                      controller: phoneCtrl,
                      decoration: const InputDecoration(labelText: 'Phone Number', hintText: '+91 98000 00000', border: OutlineInputBorder(), contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8)),
                    ),
                    const SizedBox(height: 10),

                    TextField(
                      controller: salaryCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Monthly Salary (₹)', border: OutlineInputBorder(), contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8)),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                ElevatedButton(
                  onPressed: () {
                    final name = nameCtrl.text.trim();
                    if (name.isEmpty) return;

                    final newStaff = SupportStaffModel(
                      id: 'SUPP_${DateTime.now().millisecondsSinceEpoch}',
                      fullName: name,
                      role: selectedRole,
                      phone: phoneCtrl.text.trim().isNotEmpty ? phoneCtrl.text.trim() : '+91 98000 11223',
                      salary: double.tryParse(salaryCtrl.text.trim()) ?? 18000,
                      avatarUrl: selectedPhoto,
                    );

                    setState(() {
                      _supportStaff.add(newStaff);
                    });

                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('✓ Support staff "$name" added with photo!'), backgroundColor: Colors.green),
                    );
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5), foregroundColor: Colors.white),
                  child: const Text('Save Support Staff'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  // --- Modal: Admission Slip Viewer ---
  void _showAdmissionSlipModal(EnrolledStudentModel student) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Text('Official Admission Certificate', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircleAvatar(radius: 36, backgroundImage: NetworkImage(student.avatarUrl)),
              const SizedBox(height: 10),
              Text(student.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              Text('Adm No: ${student.admissionNo} • ${student.classId}', style: const TextStyle(fontSize: 12, color: Colors.blueGrey)),
              const Divider(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Guardian:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  Text(student.parentName, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Contact:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  Text(student.phone, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Enrollment Date:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  Text(DateFormat('dd MMM yyyy').format(student.admissionDate), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () => Navigator.pop(ctx),
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1D4ED8), foregroundColor: Colors.white),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) {
        if (!didPop) {
          AuthDialogUtils.showSignOutOrExitBottomSheet(context, ref);
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        body: SafeArea(
          child: Column(
            children: [
              // Clerk Header Bar
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                color: const Color(0xFF1E1B4B),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Clerk & Accounts Terminal', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white)),
                        Text('Mr. Vikram Goel • Fee Bursar Desk', style: TextStyle(fontSize: 11, color: Color(0xFFA5B4FC))),
                      ],
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.receipt_long, color: Color(0xFFA5B4FC), size: 22),
                          tooltip: 'New Admission Slip',
                          onPressed: _showNewAdmissionModal,
                        ),
                        IconButton(
                          icon: const Icon(Icons.logout_rounded, color: Colors.white70, size: 22),
                          tooltip: 'Sign Out / Exit App',
                          onPressed: () {
                            AuthDialogUtils.showSignOutOrExitBottomSheet(context, ref);
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),

            // Tabs Selector
            Container(
              color: const Color(0xFF312E81),
              child: TabBar(
                controller: _tabController,
                isScrollable: true,
                indicatorColor: const Color(0xFF67E8F9),
                indicatorWeight: 3,
                labelColor: Colors.white,
                unselectedLabelColor: const Color(0xFFC7D2FE),
                labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                tabs: [
                  const Tab(icon: Icon(Icons.payments, size: 16), text: 'Fee Billing & Desk'),
                  Tab(icon: const Icon(Icons.person_add, size: 16), text: 'New Admission (${_enrolledStudents.length})'),
                  Tab(icon: const Icon(Icons.people_outline, size: 16), text: 'Support Staff (${_supportStaff.length})'),
                  Tab(icon: const Icon(Icons.school, size: 16), text: 'Enrolled Directory (${_enrolledStudents.length})'),
                ],
              ),
            ),

            // Tab Views
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildFeeBillingTab(),
                  _buildAdmissionFormTab(),
                  _buildSupportStaffTab(),
                  _buildEnrolledDirectoryTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

  Widget _buildFeeBillingTab() {
    final currencyFormat = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
    final totalBilled = _invoices.fold(0.0, (acc, i) => acc + i.totalPayable);
    final totalCollected = _invoices.fold(0.0, (acc, i) => acc + i.amountPaid);
    final totalOutstanding = totalBilled - totalCollected;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              _buildStatCard('Billed', currencyFormat.format(totalBilled), Colors.blue),
              const SizedBox(width: 8),
              _buildStatCard('Collected', currencyFormat.format(totalCollected), Colors.green),
              const SizedBox(width: 8),
              _buildStatCard('Due', currencyFormat.format(totalOutstanding), Colors.orange),
            ],
          ),
          const SizedBox(height: 12),

          const Text('Recent Invoices & Payment Status', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 8),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _invoices.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, idx) {
              final inv = _invoices[idx];
              final isPaid = inv.status == 'paid';

              return Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(inv.studentName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        Text('${inv.invoiceId} • ${inv.term}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        Text('Payable: ${currencyFormat.format(inv.totalPayable)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF1E293B))),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: isPaid ? Colors.green.shade50 : Colors.amber.shade50,
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: isPaid ? Colors.green.shade200 : Colors.amber.shade200),
                          ),
                          child: Text(
                            isPaid ? 'PAID' : 'PENDING',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isPaid ? Colors.green.shade800 : Colors.amber.shade900),
                          ),
                        ),
                        const SizedBox(height: 6),
                        ElevatedButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('✓ Thermal Fee Receipt printed for ${inv.studentName}!'), backgroundColor: Colors.indigo),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF2563EB),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            minimumSize: const Size(60, 26),
                          ),
                          child: const Text('Receipt', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
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

  Widget _buildAdmissionFormTab() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.how_to_reg, size: 56, color: Color(0xFF1D4ED8)),
            const SizedBox(height: 12),
            const Text('Clerk Student Admission Desk', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            const Text(
              'Register new admissions with name, class, parents info, and optional student photo.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _showNewAdmissionModal,
              icon: const Icon(Icons.person_add),
              label: const Text('Open Admission Form / नया छात्र जोड़ें'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1D4ED8),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSupportStaffTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Registered Support Staff', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              ElevatedButton.icon(
                onPressed: _showAddSupportStaffModal,
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Add Support Staff', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5), foregroundColor: Colors.white),
              ),
            ],
          ),
          const SizedBox(height: 10),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _supportStaff.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, idx) {
              final staff = _supportStaff[idx];
              return Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(radius: 20, backgroundImage: NetworkImage(staff.avatarUrl)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(staff.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          Text('${staff.role} • ${staff.phone}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                          Text('Salary: ₹${staff.salary.toInt()}/mo', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF047857))),
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

  Widget _buildEnrolledDirectoryTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Enrolled Students Directory', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              ElevatedButton.icon(
                onPressed: _showNewAdmissionModal,
                icon: const Icon(Icons.person_add, size: 16),
                label: const Text('New Admission', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1D4ED8), foregroundColor: Colors.white),
              ),
            ],
          ),
          const SizedBox(height: 10),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _enrolledStudents.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, idx) {
              final st = _enrolledStudents[idx];
              return Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(radius: 22, backgroundImage: NetworkImage(st.avatarUrl)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(st.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          Text('${st.classId} • Adm: ${st.admissionNo}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                          Text('Guardian: ${st.parentName} (${st.phone})', style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                        ],
                      ),
                    ),
                    TextButton(
                      onPressed: () => _showAdmissionSlipModal(st),
                      child: const Text('Slip', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
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

  Widget _buildStatCard(String label, String value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 10, color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
            const SizedBox(height: 2),
            Text(value, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: color)),
          ],
        ),
      ),
    );
  }
}
