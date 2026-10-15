import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/core/widgets/role_switcher_bar.dart';
import 'package:edupulse_sms/features/auth/presentation/auth_controller.dart';

/// Models matching the Web Preview App Super Admin Data Schemas
class StaffCredentialItem {
  final String id;
  final String fullName;
  final UserRole role;
  final String email;
  final String password;
  final String phoneNumber;
  final String employeeId;
  final String departmentOrClass;
  final String qualification;
  final bool isAccepted;
  final DateTime acceptedAt;

  const StaffCredentialItem({
    required this.id,
    required this.fullName,
    required this.role,
    required this.email,
    required this.password,
    required this.phoneNumber,
    required this.employeeId,
    required this.departmentOrClass,
    required this.qualification,
    required this.isAccepted,
    required this.acceptedAt,
  });
}

class StaffSalaryItem {
  final String id;
  final String paymentDate;
  final String monthYear;
  final String staffId;
  final String staffName;
  final UserRole staffRole;
  final String staffDepartment;
  final String employeeId;
  final double baseSalary;
  final double bonusOrAllowance;
  final double deductions;
  final double netAmountPaid;
  final String paymentMode; // 'Bank Transfer', 'UPI', 'Cash', 'Cheque'
  final String transactionRef;
  final String remarks;
  final String disbursedBy;
  final String status; // 'paid', 'pending'
  final String receiptVoucherNumber;

  const StaffSalaryItem({
    required this.id,
    required this.paymentDate,
    required this.monthYear,
    required this.staffId,
    required this.staffName,
    required this.staffRole,
    required this.staffDepartment,
    required this.employeeId,
    required this.baseSalary,
    required this.bonusOrAllowance,
    required this.deductions,
    required this.netAmountPaid,
    required this.paymentMode,
    required this.transactionRef,
    required this.remarks,
    required this.disbursedBy,
    required this.status,
    required this.receiptVoucherNumber,
  });
}

class StaffDirectiveItem {
  final String id;
  final String title;
  final String instructions;
  final String targetStaffName;
  final String priority; // 'urgent', 'high', 'normal'
  final String category; // 'academic', 'administrative', 'compliance', 'finance'
  final String deadline;
  final String issuedAt;
  String status; // 'pending', 'in_progress', 'completed'

  StaffDirectiveItem({
    required this.id,
    required this.title,
    required this.instructions,
    required this.targetStaffName,
    required this.priority,
    required this.category,
    required this.deadline,
    required this.issuedAt,
    required this.status,
  });
}

class StaffActivityLogItem {
  final String id;
  final String staffName;
  final UserRole role;
  final String action;
  final String category; // 'attendance', 'academic', 'finance', 'administration', 'communication'
  final String timeAgo;
  final String status; // 'completed', 'in_progress', 'flagged'

  const StaffActivityLogItem({
    required this.id,
    required this.staffName,
    required this.role,
    required this.action,
    required this.category,
    required this.timeAgo,
    required this.status,
  });
}

class StaffCommMessageItem {
  final String id;
  final String senderName;
  final String recipientName;
  final String message;
  final String timestamp;
  final bool isBroadcast;
  final String priority; // 'urgent', 'normal'
  final bool isRead;

  const StaffCommMessageItem({
    required this.id,
    required this.senderName,
    required this.recipientName,
    required this.message,
    required this.timestamp,
    required this.isBroadcast,
    required this.priority,
    required this.isRead,
  });
}

class SuperAdminDashboardScreen extends ConsumerStatefulWidget {
  const SuperAdminDashboardScreen({super.key});

  @override
  ConsumerState<SuperAdminDashboardScreen> createState() =>
      _SuperAdminDashboardScreenState();
}

class _SuperAdminDashboardScreenState
    extends ConsumerState<SuperAdminDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // 1. Staff Credentials List
  final List<StaffCredentialItem> _credentials = [
    StaffCredentialItem(
      id: 'CRED_PRIN_01',
      fullName: 'Dr. Rajesh Sharma',
      role: UserRole.principal,
      email: 'principal@edupulse.org',
      password: 'Principal@Edu2026!',
      phoneNumber: '+91 98765 43210',
      employeeId: 'EMP-PRIN-001',
      departmentOrClass: 'Head of School & Administration',
      qualification: 'Ph.D in Education, M.Ed',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 45)),
    ),
    StaffCredentialItem(
      id: 'CRED_TCH_01',
      fullName: 'Mrs. Anjali Verma',
      role: UserRole.teacher,
      email: 'teacher@edupulse.org',
      password: 'Teacher@Physics2026!',
      phoneNumber: '+91 98112 77889',
      employeeId: 'EMP-TCH-102',
      departmentOrClass: 'Senior Physics & Science Labs',
      qualification: 'M.Sc Physics, B.Ed',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
    StaffCredentialItem(
      id: 'CRED_CT_01',
      fullName: 'Ms. Priya Sharma',
      role: UserRole.classTeacher,
      email: 'classteacher@edupulse.org',
      password: 'ClassTeacher@11A!',
      phoneNumber: '+91 98112 23344',
      employeeId: 'EMP-CT-204',
      departmentOrClass: 'Class 10-A In-Charge & English Dept.',
      qualification: 'M.A English, B.Ed',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 20)),
    ),
    StaffCredentialItem(
      id: 'CRED_ACC_01',
      fullName: 'Mr. Sunil Gupta',
      role: UserRole.accountant,
      email: 'accountant@edupulse.org',
      password: 'Accountant@Bursar2026!',
      phoneNumber: '+91 97654 32109',
      employeeId: 'EMP-ACC-301',
      departmentOrClass: 'Accounts Desk & Fee Bursar',
      qualification: 'M.Com, CA-Inter',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 15)),
    ),
  ];

  // 2. Staff Salary Payments
  final List<StaffSalaryItem> _salaries = [
    StaffSalaryItem(
      id: 'SAL_001',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_PRIN_01',
      staffName: 'Dr. Rajesh Sharma',
      staffRole: UserRole.principal,
      staffDepartment: 'Head of School & Administration',
      employeeId: 'EMP-PRIN-001',
      baseSalary: 125000,
      bonusOrAllowance: 10000,
      deductions: 5000,
      netAmountPaid: 130000,
      paymentMode: 'Bank Transfer (NEFT)',
      transactionRef: 'NEFT-AXIS-9823412',
      remarks: 'Executive payroll for October 2026',
      disbursedBy: 'Super Admin Trustee',
      status: 'paid',
      receiptVoucherNumber: 'VCH-OCT-2026-001',
    ),
    StaffSalaryItem(
      id: 'SAL_002',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_TCH_01',
      staffName: 'Mrs. Anjali Verma',
      staffRole: UserRole.teacher,
      staffDepartment: 'Senior Physics & Science Labs',
      employeeId: 'EMP-TCH-102',
      baseSalary: 65000,
      bonusOrAllowance: 3000,
      deductions: 2500,
      netAmountPaid: 65500,
      paymentMode: 'UPI Auto-Disburse',
      transactionRef: 'UPI-HDFC-881239',
      remarks: 'Monthly salary disbursement with science lab allowance',
      disbursedBy: 'Super Admin Trustee',
      status: 'paid',
      receiptVoucherNumber: 'VCH-OCT-2026-002',
    ),
    StaffSalaryItem(
      id: 'SAL_003',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_CT_01',
      staffName: 'Ms. Priya Sharma',
      staffRole: UserRole.classTeacher,
      staffDepartment: 'Class 10-A In-Charge & English Dept.',
      employeeId: 'EMP-CT-204',
      baseSalary: 55000,
      bonusOrAllowance: 2500,
      deductions: 2000,
      netAmountPaid: 55500,
      paymentMode: 'Bank Transfer (IMPS)',
      transactionRef: 'IMPS-SBI-332910',
      remarks: 'Monthly salary and class mentor allowance',
      disbursedBy: 'Super Admin Trustee',
      status: 'paid',
      receiptVoucherNumber: 'VCH-OCT-2026-003',
    ),
    StaffSalaryItem(
      id: 'SAL_004',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_ACC_01',
      staffName: 'Mr. Sunil Gupta',
      staffRole: UserRole.accountant,
      staffDepartment: 'Accounts Desk & Fee Bursar',
      employeeId: 'EMP-ACC-301',
      baseSalary: 48000,
      bonusOrAllowance: 2000,
      deductions: 1800,
      netAmountPaid: 48200,
      paymentMode: 'UPI Auto-Disburse',
      transactionRef: 'UPI-ICICI-441098',
      remarks: 'Monthly salary settlement with audit compliance bonus',
      disbursedBy: 'Super Admin Trustee',
      status: 'paid',
      receiptVoucherNumber: 'VCH-OCT-2026-004',
    ),
  ];

  // 3. Official Directives
  final List<StaffDirectiveItem> _directives = [
    StaffDirectiveItem(
      id: 'DIR_001',
      title: 'Mandatory Submission of Mid-Term Formative Assessment Scores',
      instructions:
          'All senior secondary subject teachers must finalize student progress cards and submit digital marks before Friday 5:00 PM.',
      targetStaffName: 'All Subject Faculty & Mentors',
      priority: 'urgent',
      category: 'academic',
      deadline: '2026-10-20',
      issuedAt: '2026-10-12',
      status: 'in_progress',
    ),
    StaffDirectiveItem(
      id: 'DIR_002',
      title: 'Q3 Tuition Fee Reconciliation & Defaulter Follow-up',
      instructions:
          'Accounts desk to complete fee book verification for all sections and issue reminder notices to pending fee guardians.',
      targetStaffName: 'Finance & Accounts Desk',
      priority: 'high',
      category: 'finance',
      deadline: '2026-10-25',
      issuedAt: '2026-10-10',
      status: 'in_progress',
    ),
    StaffDirectiveItem(
      id: 'DIR_003',
      title: 'Annual CBSE Affiliation Compliance & Safety Inspection',
      instructions:
          'Ensure fire drills, science lab safety gear audit, and CCTV monitoring room logs are fully updated for state audit committee.',
      targetStaffName: 'Principal & Administration Office',
      priority: 'urgent',
      category: 'compliance',
      deadline: '2026-10-18',
      issuedAt: '2026-10-08',
      status: 'completed',
    ),
  ];

  // 4. Institutional Activities Log
  final List<StaffActivityLogItem> _activities = [
    StaffActivityLogItem(
      id: 'ACT_01',
      staffName: 'Dr. Rajesh Sharma',
      role: UserRole.principal,
      action: 'Approved Class 10-A revised science and lab practical timetable.',
      category: 'academic',
      timeAgo: '12 mins ago',
      status: 'completed',
    ),
    StaffActivityLogItem(
      id: 'ACT_02',
      staffName: 'Mr. Sunil Gupta',
      role: UserRole.accountant,
      action: 'Reconciled ₹2,45,000 in Q3 bus transport and tuition fee payments.',
      category: 'finance',
      timeAgo: '45 mins ago',
      status: 'completed',
    ),
    StaffActivityLogItem(
      id: 'ACT_03',
      staffName: 'Mrs. Anjali Verma',
      role: UserRole.teacher,
      action: 'Published Unit Test 2 Physics marks and laboratory assignment rubrics.',
      category: 'academic',
      timeAgo: '2 hours ago',
      status: 'completed',
    ),
    StaffActivityLogItem(
      id: 'ACT_04',
      staffName: 'Ms. Priya Sharma',
      role: UserRole.classTeacher,
      action: 'Submitted biometric and RFID morning attendance muster with 96.4% present.',
      category: 'attendance',
      timeAgo: '4 hours ago',
      status: 'completed',
    ),
    StaffActivityLogItem(
      id: 'ACT_05',
      staffName: 'Super Admin Trustee',
      role: UserRole.superAdmin,
      action: 'Disbursed October 2026 payroll settlements for authorized faculty.',
      category: 'administration',
      timeAgo: '1 day ago',
      status: 'completed',
    ),
  ];

  // 5. Staff Communication Messages
  final List<StaffCommMessageItem> _commMessages = [
    StaffCommMessageItem(
      id: 'MSG_01',
      senderName: 'Super Admin Trustee Office',
      recipientName: 'All Teaching & Administrative Staff',
      message:
          'Welcome to Term 2! The digital LMS & biometric attendance portal are fully synchronized. Please ensure daily diary entries are uploaded by 4:00 PM.',
      timestamp: 'Today, 09:30 AM',
      isBroadcast: true,
      priority: 'urgent',
      isRead: false,
    ),
    StaffCommMessageItem(
      id: 'MSG_02',
      senderName: 'Dr. Rajesh Sharma (Principal)',
      recipientName: 'Super Admin Trustee Office',
      message:
          'Board compliance inspection report has been prepared and uploaded to the governance documents vault.',
      timestamp: 'Yesterday, 04:15 PM',
      isBroadcast: false,
      priority: 'normal',
      isRead: true,
    ),
    StaffCommMessageItem(
      id: 'MSG_03',
      senderName: 'Mr. Sunil Gupta (Accountant)',
      recipientName: 'Super Admin Trustee Office',
      message:
          'Payment gateway settlement report for October batch is ready for your sign-off and auditing.',
      timestamp: 'Oct 12, 11:20 AM',
      isBroadcast: false,
      priority: 'normal',
      isRead: true,
    ),
  ];

  // Filters & State
  String _rosterFilter = 'all';
  String _rosterSearch = '';
  String _activityFilter = 'all';
  final Set<String> _revealedPasswords = {};

  // Form Controllers for New Staff Credentials
  final _formKey = GlobalKey<FormState>();
  UserRole _selectedRole = UserRole.principal;
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _empIdController = TextEditingController(text: 'EMP-PRIN-002');
  final _deptController = TextEditingController(text: 'Head of School / Administration');
  final _qualController = TextEditingController();

  // Salary Disbursement Form State
  String _selectedSalaryStaffId = 'CRED_PRIN_01';
  final _salaryBaseController = TextEditingController(text: '125000');
  final _salaryBonusController = TextEditingController(text: '5000');
  final _salaryDeductController = TextEditingController(text: '2000');
  final _salaryTxnRefController = TextEditingController(text: 'UPI-TXN-');
  final _salaryRemarksController = TextEditingController(text: 'Monthly salary and wage settlement');
  String _salaryPaymentMode = 'UPI';

  // New Directive Form State
  final _directiveTitleController = TextEditingController();
  final _directiveInstructionsController = TextEditingController();
  String _directivePriority = 'urgent';
  String _directiveCategory = 'academic';
  String _directiveTarget = 'All Faculty & Staff';

  // Message Form State
  final _commMessageController = TextEditingController();
  String _commPriority = 'normal';
  String _commTarget = 'All Staff';

  @override
  void initState() {
    super.initState();
    // 6 Full Tabs Matching Preview App
    _tabController = TabController(length: 6, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    _empIdController.dispose();
    _deptController.dispose();
    _qualController.dispose();

    _salaryBaseController.dispose();
    _salaryBonusController.dispose();
    _salaryDeductController.dispose();
    _salaryTxnRefController.dispose();
    _salaryRemarksController.dispose();

    _directiveTitleController.dispose();
    _directiveInstructionsController.dispose();
    _commMessageController.dispose();
    super.dispose();
  }

  void _onRoleSelected(UserRole role) {
    setState(() {
      _selectedRole = role;
      switch (role) {
        case UserRole.principal:
          _empIdController.text = 'EMP-PRIN-00${_credentials.where((c) => c.role == UserRole.principal).length + 1}';
          _deptController.text = 'Head of School / Administration';
          break;
        case UserRole.teacher:
          _empIdController.text = 'EMP-TCH-${100 + _credentials.where((c) => c.role == UserRole.teacher).length + 1}';
          _deptController.text = 'Senior Faculty (Mathematics & Physics)';
          break;
        case UserRole.classTeacher:
          _empIdController.text = 'EMP-CT-${200 + _credentials.where((c) => c.role == UserRole.classTeacher).length + 1}';
          _deptController.text = 'Class 11-A In-Charge & Student Mentor';
          break;
        case UserRole.accountant:
          _empIdController.text = 'EMP-ACC-${300 + _credentials.where((c) => c.role == UserRole.accountant).length + 1}';
          _deptController.text = 'Finance & Fee Collection Desk';
          break;
        default:
          break;
      }
    });
  }

  void _generateStrongPassword() {
    final prefix = _selectedRole == UserRole.principal
        ? 'Prin'
        : _selectedRole == UserRole.classTeacher
            ? 'ClsTch'
            : _selectedRole == UserRole.teacher
                ? 'Teach'
                : 'Acc';
    final rand = 1000 + (DateTime.now().millisecond * 9);
    setState(() {
      _passwordController.text = '$prefix@Edu$rand!';
    });
  }

  void _acceptAndSaveCredential() {
    if (!_formKey.currentState!.validate()) return;

    final newCred = StaffCredentialItem(
      id: 'CRED_${DateTime.now().millisecondsSinceEpoch}',
      fullName: _nameController.text.trim(),
      role: _selectedRole,
      email: _emailController.text.trim().toLowerCase(),
      password: _passwordController.text.trim(),
      phoneNumber: _phoneController.text.trim().isEmpty
          ? '+91 98000 00000'
          : _phoneController.text.trim(),
      employeeId: _empIdController.text.trim(),
      departmentOrClass: _deptController.text.trim().isEmpty
          ? 'School Faculty'
          : _deptController.text.trim(),
      qualification: _qualController.text.trim().isEmpty
          ? 'Qualified Specialist'
          : _qualController.text.trim(),
      isAccepted: true,
      acceptedAt: DateTime.now(),
    );

    setState(() {
      _credentials.insert(0, newCred);
      _nameController.clear();
      _emailController.clear();
      _passwordController.clear();
      _phoneController.clear();
      _qualController.clear();
    });

    Navigator.of(context).pop();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Login credentials authorized for ${newCred.fullName} (${newCred.role.displayName})!',
        ),
        backgroundColor: const Color(0xFF059669),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _copyCredentials(StaffCredentialItem item) {
    Clipboard.setData(
      ClipboardData(text: 'Email: ${item.email}\nPassword: ${item.password}'),
    );
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Credentials for ${item.fullName} copied to clipboard!'),
        backgroundColor: const Color(0xFF1E293B),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _showAuthorizeStaffDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: EdgeInsets.only(
            top: 20,
            left: 20,
            right: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.person_add_alt_1_rounded, color: Color(0xFF881337), size: 24),
                          SizedBox(width: 8),
                          Text(
                            'Authorize New Staff',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () => Navigator.of(ctx).pop(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text('Select Designation / Role *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _buildModalRoleChip(UserRole.principal, 'Principal', Icons.admin_panel_settings_rounded, setModalState),
                      _buildModalRoleChip(UserRole.teacher, 'Teacher', Icons.co_present_rounded, setModalState),
                      _buildModalRoleChip(UserRole.classTeacher, 'Class Teacher', Icons.assignment_ind_rounded, setModalState),
                      _buildModalRoleChip(UserRole.accountant, 'Accountant', Icons.account_balance_wallet_rounded, setModalState),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Full Official Name *',
                      prefixIcon: Icon(Icons.person_outline),
                      border: OutlineInputBorder(),
                    ),
                    validator: (v) => v == null || v.trim().isEmpty ? 'Enter full name' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      labelText: 'Email Address (Used for Login) *',
                      prefixIcon: Icon(Icons.email_outlined),
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.emailAddress,
                    validator: (v) => v == null || !v.contains('@') ? 'Enter valid email' : null,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _passwordController,
                          decoration: const InputDecoration(
                            labelText: 'System Password *',
                            prefixIcon: Icon(Icons.lock_outline),
                            border: OutlineInputBorder(),
                          ),
                          validator: (v) => v == null || v.length < 6 ? 'Min 6 characters' : null,
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton.icon(
                        onPressed: () {
                          _generateStrongPassword();
                          setModalState(() {});
                        },
                        icon: const Icon(Icons.auto_fix_high_rounded, size: 16),
                        label: const Text('Generate'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF881337),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _empIdController,
                          decoration: const InputDecoration(
                            labelText: 'Employee ID',
                            border: OutlineInputBorder(),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextFormField(
                          controller: _phoneController,
                          decoration: const InputDecoration(
                            labelText: 'Phone',
                            border: OutlineInputBorder(),
                          ),
                          keyboardType: TextInputType.phone,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _deptController,
                    decoration: const InputDecoration(
                      labelText: 'Department / Assigned Classes',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: _acceptAndSaveCredential,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF059669),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const Text('Authorize & Issue Login Credentials', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildModalRoleChip(UserRole role, String label, IconData icon, StateSetter setModalState) {
    final isSelected = _selectedRole == role;
    return ChoiceChip(
      avatar: Icon(icon, size: 16, color: isSelected ? Colors.white : const Color(0xFF881337)),
      label: Text(label, style: TextStyle(color: isSelected ? Colors.white : const Color(0xFF1E293B))),
      selected: isSelected,
      selectedColor: const Color(0xFF881337),
      backgroundColor: const Color(0xFFF1F5F9),
      onSelected: (_) {
        setModalState(() {
          _onRoleSelected(role);
        });
      },
    );
  }

  void _showDisburseSalaryDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) {
          final base = double.tryParse(_salaryBaseController.text) ?? 0;
          final bonus = double.tryParse(_salaryBonusController.text) ?? 0;
          final deduct = double.tryParse(_salaryDeductController.text) ?? 0;
          final net = (base + bonus - deduct).clamp(0, 9999999);

          return Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            padding: EdgeInsets.only(
              top: 20,
              left: 20,
              right: 20,
              bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
            ),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.payments_rounded, color: Color(0xFF059669), size: 24),
                          SizedBox(width: 8),
                          Text(
                            'Disburse Monthly Salary',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () => Navigator.of(ctx).pop(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text('Select Staff Member *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: _selectedSalaryStaffId,
                    decoration: const InputDecoration(border: OutlineInputBorder()),
                    items: _credentials.map((c) {
                      return DropdownMenuItem(
                        value: c.id,
                        child: Text('${c.fullName} (${c.role.displayName.split('(')[0].trim()})'),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        final cred = _credentials.firstWhere((c) => c.id == val);
                        setModalState(() {
                          _selectedSalaryStaffId = val;
                          if (cred.role == UserRole.principal) {
                            _salaryBaseController.text = '125000';
                          } else if (cred.role == UserRole.teacher) {
                            _salaryBaseController.text = '65000';
                          } else if (cred.role == UserRole.classTeacher) {
                            _salaryBaseController.text = '55000';
                          } else if (cred.role == UserRole.accountant) {
                            _salaryBaseController.text = '48000';
                          }
                        });
                      }
                    },
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _salaryBaseController,
                          decoration: const InputDecoration(labelText: 'Base Salary (₹)', border: OutlineInputBorder()),
                          keyboardType: TextInputType.number,
                          onChanged: (_) => setModalState(() {}),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextFormField(
                          controller: _salaryBonusController,
                          decoration: const InputDecoration(labelText: 'Allowances (₹)', border: OutlineInputBorder()),
                          keyboardType: TextInputType.number,
                          onChanged: (_) => setModalState(() {}),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextFormField(
                          controller: _salaryDeductController,
                          decoration: const InputDecoration(labelText: 'Deductions (₹)', border: OutlineInputBorder()),
                          keyboardType: TextInputType.number,
                          onChanged: (_) => setModalState(() {}),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  // Net Calculation Card
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDF4),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF86EFAC)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Net Disbursed Amount:', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF166534))),
                        Text(
                          '₹${NumberFormat('#,##,###').format(net)}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF15803D)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: _salaryPaymentMode,
                          decoration: const InputDecoration(labelText: 'Payment Mode', border: OutlineInputBorder()),
                          items: const [
                            DropdownMenuItem(value: 'UPI', child: Text('UPI Auto-Transfer')),
                            DropdownMenuItem(value: 'Bank Transfer (NEFT)', child: Text('Bank Transfer (NEFT)')),
                            DropdownMenuItem(value: 'Bank Transfer (IMPS)', child: Text('Bank Transfer (IMPS)')),
                            DropdownMenuItem(value: 'Cash Voucher', child: Text('Cash Voucher')),
                            DropdownMenuItem(value: 'Cheque', child: Text('Cheque')),
                          ],
                          onChanged: (v) {
                            if (v != null) setModalState(() => _salaryPaymentMode = v);
                          },
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextFormField(
                          controller: _salaryTxnRefController,
                          decoration: const InputDecoration(labelText: 'Transaction Ref #', border: OutlineInputBorder()),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.check_circle_rounded),
                      label: const Text('Authorize & Disburse Salary', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF059669),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () {
                        final cred = _credentials.firstWhere((c) => c.id == _selectedSalaryStaffId);
                        final newSalary = StaffSalaryItem(
                          id: 'SAL_${DateTime.now().millisecondsSinceEpoch}',
                          paymentDate: DateFormat('yyyy-MM-dd').format(DateTime.now()),
                          monthYear: 'October 2026',
                          staffId: cred.id,
                          staffName: cred.fullName,
                          staffRole: cred.role,
                          staffDepartment: cred.departmentOrClass,
                          employeeId: cred.employeeId,
                          baseSalary: base.toDouble(),
                          bonusOrAllowance: bonus.toDouble(),
                          deductions: deduct.toDouble(),
                          netAmountPaid: net.toDouble(),
                          paymentMode: _salaryPaymentMode,
                          transactionRef: _salaryTxnRefController.text.trim().isEmpty
                              ? 'TXN-${DateTime.now().millisecondsSinceEpoch}'
                              : _salaryTxnRefController.text.trim(),
                          remarks: _salaryRemarksController.text.trim(),
                          disbursedBy: 'Super Admin Trustee',
                          status: 'paid',
                          receiptVoucherNumber: 'VCH-OCT-2026-00${_salaries.length + 1}',
                        );

                        setState(() {
                          _salaries.insert(0, newSalary);
                        });

                        Navigator.of(ctx).pop();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Salary of ₹${NumberFormat('#,##,###').format(net)} disbursed to ${cred.fullName}!'),
                            backgroundColor: const Color(0xFF059669),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _showIssueDirectiveDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: EdgeInsets.only(
            top: 20,
            left: 20,
            right: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.campaign_rounded, color: Color(0xFF881337), size: 24),
                        SizedBox(width: 8),
                        Text(
                          'Issue Official Directive',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded),
                      onPressed: () => Navigator.of(ctx).pop(),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _directiveTitleController,
                  decoration: const InputDecoration(labelText: 'Directive Subject / Title *', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _directiveInstructionsController,
                  maxLines: 3,
                  decoration: const InputDecoration(labelText: 'Instructions & Action Points *', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _directivePriority,
                        decoration: const InputDecoration(labelText: 'Priority', border: OutlineInputBorder()),
                        items: const [
                          DropdownMenuItem(value: 'urgent', child: Text('Urgent (Immediate Action)')),
                          DropdownMenuItem(value: 'high', child: Text('High Priority')),
                          DropdownMenuItem(value: 'normal', child: Text('Standard')),
                        ],
                        onChanged: (v) {
                          if (v != null) setModalState(() => _directivePriority = v);
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _directiveCategory,
                        decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
                        items: const [
                          DropdownMenuItem(value: 'academic', child: Text('Academic')),
                          DropdownMenuItem(value: 'administrative', child: Text('Administrative')),
                          DropdownMenuItem(value: 'compliance', child: Text('Compliance & Safety')),
                          DropdownMenuItem(value: 'finance', child: Text('Finance & Bursar')),
                        ],
                        onChanged: (v) {
                          if (v != null) setModalState(() => _directiveCategory = v);
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: _directiveTarget,
                  decoration: const InputDecoration(labelText: 'Target Staff Audience', border: OutlineInputBorder()),
                  items: const [
                    DropdownMenuItem(value: 'All Faculty & Staff', child: Text('All Faculty & Staff (Broadcast)')),
                    DropdownMenuItem(value: 'Principal & Administration Office', child: Text('Principal & Executive Office')),
                    DropdownMenuItem(value: 'All Subject Faculty & Mentors', child: Text('Teachers & Mentors')),
                    DropdownMenuItem(value: 'Finance & Accounts Desk', child: Text('Accounts & Bursar')),
                  ],
                  onChanged: (v) {
                    if (v != null) setModalState(() => _directiveTarget = v);
                  },
                ),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.send_rounded),
                    label: const Text('Publish Directive Circular', style: TextStyle(fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF881337),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () {
                      if (_directiveTitleController.text.trim().isEmpty) return;

                      final newDir = StaffDirectiveItem(
                        id: 'DIR_${DateTime.now().millisecondsSinceEpoch}',
                        title: _directiveTitleController.text.trim(),
                        instructions: _directiveInstructionsController.text.trim(),
                        targetStaffName: _directiveTarget,
                        priority: _directivePriority,
                        category: _directiveCategory,
                        deadline: '2026-10-30',
                        issuedAt: DateFormat('yyyy-MM-dd').format(DateTime.now()),
                        status: 'pending',
                      );

                      setState(() {
                        _directives.insert(0, newDir);
                        _directiveTitleController.clear();
                        _directiveInstructionsController.clear();
                      });

                      Navigator.of(ctx).pop();
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Official directive published to faculty desks!'),
                          backgroundColor: Color(0xFF881337),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showSalarySlipModal(StaffSalaryItem item) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.receipt_long_rounded, color: Color(0xFF059669)),
            const SizedBox(width: 8),
            Text('Salary Voucher: ${item.receiptVoucherNumber}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Staff Name: ${item.staffName}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            Text('Designation: ${item.staffRole.displayName.split('(')[0].trim()} • ${item.employeeId}'),
            Text('Month: ${item.monthYear}'),
            const Divider(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Base Salary:'),
                Text('₹${NumberFormat('#,##,###').format(item.baseSalary)}'),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Allowances:'),
                Text('+ ₹${NumberFormat('#,##,###').format(item.bonusOrAllowance)}', style: const TextStyle(color: Colors.green)),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Deductions:'),
                Text('- ₹${NumberFormat('#,##,###').format(item.deductions)}', style: const TextStyle(color: Colors.red)),
              ],
            ),
            const Divider(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Net Paid:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text('₹${NumberFormat('#,##,###').format(item.netAmountPaid)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF059669))),
              ],
            ),
            const SizedBox(height: 8),
            Text('Mode: ${item.paymentMode}'),
            Text('Ref: ${item.transactionRef}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
            const SizedBox(height: 6),
            Text('Disbursed By: ${item.disbursedBy}', style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Close'),
          ),
          ElevatedButton.icon(
            icon: const Icon(Icons.share_rounded, size: 16),
            label: const Text('Share Receipt'),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF059669), foregroundColor: Colors.white),
            onPressed: () {
              Navigator.of(ctx).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Salary slip ${item.receiptVoucherNumber} prepared for sharing.')),
              );
            },
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final user = authState.user;

    final filteredCredentials = _credentials.where((c) {
      if (_rosterFilter != 'all' && c.role.idName != _rosterFilter && c.role.name != _rosterFilter) {
        return false;
      }
      if (_rosterSearch.isNotEmpty) {
        final query = _rosterSearch.toLowerCase();
        return c.fullName.toLowerCase().contains(query) ||
            c.email.toLowerCase().contains(query) ||
            c.employeeId.toLowerCase().contains(query);
      }
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF881337), // Rose/Burgundy Super Admin header
        foregroundColor: Colors.white,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Super Admin Console',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            Text(
              user?.fullName ?? 'Shri Vikramaditya Roy (Board Trustee)',
              style: const TextStyle(fontSize: 12, color: Color(0xFFFECDD3)),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            tooltip: 'Sign Out to Login',
            onPressed: () {
              ref.read(authControllerProvider.notifier).signOut();
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          indicatorColor: Colors.white,
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: const Color(0xFFFECDD3),
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: [
            Tab(
              icon: const Icon(Icons.vpn_key_rounded, size: 18),
              text: 'Credentials & Roster (${_credentials.length})',
            ),
            Tab(
              icon: const Icon(Icons.payments_rounded, size: 18),
              text: 'Salary & Payroll (${_salaries.length})',
            ),
            Tab(
              icon: const Icon(Icons.campaign_rounded, size: 18),
              text: 'Directives & Orders (${_directives.length})',
            ),
            Tab(
              icon: const Icon(Icons.timeline_rounded, size: 18),
              text: 'Activity Audit Log (${_activities.length})',
            ),
            Tab(
              icon: const Icon(Icons.forum_rounded, size: 18),
              text: 'Communication Desk (${_commMessages.length})',
            ),
            const Tab(
              icon: Icon(Icons.verified_user_rounded, size: 18),
              text: 'RBAC Matrix',
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            const RoleSwitcherBar(),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  // TAB 1: CREDENTIALS & ROSTER
                  _buildCredentialsAndRosterTab(filteredCredentials),

                  // TAB 2: SALARY & PAYROLL DISBURSEMENT
                  _buildSalaryAndPayrollTab(),

                  // TAB 3: OFFICIAL DIRECTIVES & ORDERS
                  _buildDirectivesTab(),

                  // TAB 4: ACTIVITY AUDIT LOG
                  _buildActivityAuditTab(),

                  // TAB 5: COMMUNICATION & BROADCAST DESK
                  _buildCommunicationTab(),

                  // TAB 6: RBAC GOVERNANCE MATRIX
                  _buildRbacMatrixTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // TAB 1: CREDENTIALS & ROSTER
  // ==========================================
  Widget _buildCredentialsAndRosterTab(List<StaffCredentialItem> filteredList) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Banner with Quick Authorize Button
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF881337), Color(0xFF4C0519)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF881337).withOpacity(0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.security_rounded, color: Colors.white, size: 22),
                        SizedBox(width: 8),
                        Text(
                          'Staff Governance Desk',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                      ],
                    ),
                    ElevatedButton.icon(
                      onPressed: _showAuthorizeStaffDialog,
                      icon: const Icon(Icons.person_add_alt_1_rounded, size: 16),
                      label: const Text('Authorize Staff'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFF881337),
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'Authorize institutional credentials for Principal, Teacher, Class Teacher, and Accountant. Credentials synchronize directly with mobile & web dashboards.',
                  style: TextStyle(color: Color(0xFFFEE2E2), fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Search Bar
          TextField(
            decoration: InputDecoration(
              hintText: 'Search by staff name, email, or employee ID...',
              prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF64748B)),
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
            onChanged: (val) {
              setState(() {
                _rosterSearch = val.trim();
              });
            },
          ),
          const SizedBox(height: 12),

          // Role Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip('all', 'All Staff (${_credentials.length})'),
                const SizedBox(width: 8),
                _buildFilterChip('principal', 'Principals'),
                const SizedBox(width: 8),
                _buildFilterChip('teacher', 'Teachers'),
                const SizedBox(width: 8),
                _buildFilterChip('class_teacher', 'Class Teachers'),
                const SizedBox(width: 8),
                _buildFilterChip('accountant', 'Accountants'),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Staff Cards List
          if (filteredList.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              alignment: Alignment.center,
              child: const Column(
                children: [
                  Icon(Icons.person_search_rounded, size: 48, color: Color(0xFF94A3B8)),
                  SizedBox(height: 12),
                  Text('No staff credentials match your filter.', style: TextStyle(color: Color(0xFF64748B))),
                ],
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: filteredList.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final item = filteredList[index];
                final roleColor = item.role == UserRole.principal
                    ? const Color(0xFFB45309)
                    : item.role == UserRole.teacher
                        ? const Color(0xFF2563EB)
                        : item.role == UserRole.classTeacher
                            ? const Color(0xFF0D9488)
                            : const Color(0xFFE11D48);

                final isPasswordVisible = _revealedPasswords.contains(item.id);

                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.02),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CircleAvatar(
                            radius: 20,
                            backgroundColor: roleColor.withOpacity(0.12),
                            child: Text(
                              item.fullName.isNotEmpty ? item.fullName[0] : 'S',
                              style: TextStyle(color: roleColor, fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.fullName,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${item.departmentOrClass} • ${item.employeeId}',
                                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: roleColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: roleColor.withOpacity(0.2)),
                            ),
                            child: Text(
                              item.role.displayName.split('(')[0].trim(),
                              style: TextStyle(color: roleColor, fontWeight: FontWeight.bold, fontSize: 11),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Divider(height: 1, color: Color(0xFFF1F5F9)),
                      const SizedBox(height: 10),

                      // Credentials Display Box
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.email_outlined, size: 14, color: Color(0xFF64748B)),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    item.email,
                                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF1E293B)),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                const Icon(Icons.lock_outline, size: 14, color: Color(0xFF64748B)),
                                const SizedBox(width: 6),
                                Text(
                                  isPasswordVisible ? item.password : '••••••••••••',
                                  style: const TextStyle(
                                    fontFamily: 'monospace',
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                const Spacer(),
                                InkWell(
                                  onTap: () {
                                    setState(() {
                                      if (isPasswordVisible) {
                                        _revealedPasswords.remove(item.id);
                                      } else {
                                        _revealedPasswords.add(item.id);
                                      }
                                    });
                                  },
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 4),
                                    child: Icon(
                                      isPasswordVisible ? Icons.visibility_off : Icons.visibility,
                                      size: 16,
                                      color: const Color(0xFF64748B),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 4),
                                InkWell(
                                  onTap: () => _copyCredentials(item),
                                  child: const Padding(
                                    padding: EdgeInsets.symmetric(horizontal: 4),
                                    child: Icon(Icons.copy_rounded, size: 16, color: Color(0xFF881337)),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Quick Test Login
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton.icon(
                          onPressed: () {
                            ref.read(authControllerProvider.notifier).loginAsDemoRole(item.role);
                          },
                          icon: const Icon(Icons.login_rounded, size: 14),
                          label: Text('Test Login as ${item.role.displayName.split('(')[0].trim()}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          style: TextButton.styleFrom(foregroundColor: roleColor),
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

  // ==========================================
  // TAB 2: SALARY & PAYROLL DISBURSEMENT
  // ==========================================
  Widget _buildSalaryAndPayrollTab() {
    final totalDisbursed = _salaries.fold<double>(0, (sum, s) => sum + s.netAmountPaid);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Payroll Metric Cards
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Total Disbursed (Oct)', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      const SizedBox(height: 4),
                      Text(
                        '₹${NumberFormat('#,##,###').format(totalDisbursed)}',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF059669)),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Staff on Payroll', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      const SizedBox(height: 4),
                      Text(
                        '${_salaries.length} Verified',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Disburse Action Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Disbursed Salary Slips', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A))),
              ElevatedButton.icon(
                onPressed: _showDisburseSalaryDialog,
                icon: const Icon(Icons.add_card_rounded, size: 16),
                label: const Text('Disburse Salary'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF059669),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Salary Slips List
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _salaries.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final salary = _salaries[index];
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
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFF059669).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(Icons.receipt_rounded, color: Color(0xFF059669), size: 20),
                            ),
                            const SizedBox(width: 10),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(salary.staffName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                Text('${salary.employeeId} • ${salary.monthYear}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                              ],
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCFCE7),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: const Color(0xFF86EFAC)),
                          ),
                          child: const Text('Paid', style: TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.bold, fontSize: 11)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Net Disbursed: ₹${NumberFormat('#,##,###').format(salary.netAmountPaid)}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF059669))),
                        Text(salary.paymentMode, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('Ref: ${salary.transactionRef} • Voucher: ${salary.receiptVoucherNumber}', style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                    const SizedBox(height: 10),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton.icon(
                        onPressed: () => _showSalarySlipModal(salary),
                        icon: const Icon(Icons.visibility_rounded, size: 14),
                        label: const Text('View Salary Voucher', style: TextStyle(fontSize: 12)),
                        style: TextButton.styleFrom(foregroundColor: const Color(0xFF059669)),
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

  // ==========================================
  // TAB 3: OFFICIAL DIRECTIVES & ORDERS
  // ==========================================
  Widget _buildDirectivesTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Super Admin Orders & Directives', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A))),
              ElevatedButton.icon(
                onPressed: _showIssueDirectiveDialog,
                icon: const Icon(Icons.add_rounded, size: 16),
                label: const Text('Issue Directive'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF881337),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _directives.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final dir = _directives[index];
              final isUrgent = dir.priority == 'urgent';

              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isUrgent ? const Color(0xFFFECDD3) : const Color(0xFFE2E8F0),
                    width: isUrgent ? 1.5 : 1,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: isUrgent ? const Color(0xFFFFE4E6) : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            dir.priority.toUpperCase(),
                            style: TextStyle(
                              color: isUrgent ? const Color(0xFFE11D48) : const Color(0xFF475569),
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(dir.category.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: dir.status == 'completed' ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            dir.status == 'completed' ? 'Completed' : 'In Progress',
                            style: TextStyle(
                              color: dir.status == 'completed' ? const Color(0xFF15803D) : const Color(0xFFB45309),
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(dir.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
                    const SizedBox(height: 6),
                    Text(dir.instructions, style: const TextStyle(fontSize: 12, color: Color(0xFF475569))),
                    const SizedBox(height: 10),
                    const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Target: ${dir.targetStaffName}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        Text('Deadline: ${dir.deadline}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF881337))),
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

  // ==========================================
  // TAB 4: ACTIVITY AUDIT LOG
  // ==========================================
  Widget _buildActivityAuditTab() {
    final filtered = _activities.where((a) {
      if (_activityFilter == 'all') return true;
      return a.category == _activityFilter;
    }).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildActivityFilterChip('all', 'All Activities'),
                const SizedBox(width: 8),
                _buildActivityFilterChip('academic', 'Academic'),
                const SizedBox(width: 8),
                _buildActivityFilterChip('finance', 'Finance'),
                const SizedBox(width: 8),
                _buildActivityFilterChip('attendance', 'Attendance'),
                const SizedBox(width: 8),
                _buildActivityFilterChip('administration', 'Admin'),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Audit Stream Cards
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: filtered.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              final act = filtered[index];
              return Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF881337).withOpacity(0.08),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.history_rounded, size: 18, color: Color(0xFF881337)),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(act.staffName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                              Text(act.timeAgo, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(act.action, style: const TextStyle(fontSize: 12, color: Color(0xFF334155))),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(act.category.toUpperCase(), style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
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

  Widget _buildActivityFilterChip(String value, String label) {
    final isSelected = _activityFilter == value;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isSelected ? Colors.white : const Color(0xFF475569),
        ),
      ),
      selected: isSelected,
      selectedColor: const Color(0xFF881337),
      backgroundColor: const Color(0xFFF1F5F9),
      onSelected: (_) => setState(() => _activityFilter = value),
      showCheckmark: false,
    );
  }

  // ==========================================
  // TAB 5: COMMUNICATION & BROADCAST DESK
  // ==========================================
  Widget _buildCommunicationTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Broadcast Composer
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.campaign_rounded, color: Color(0xFF881337), size: 20),
                    SizedBox(width: 8),
                    Text('Super Admin Broadcast Dispatch', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  ],
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _commMessageController,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    hintText: 'Type announcement or message to faculty desks...',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _commTarget,
                        decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8), border: OutlineInputBorder()),
                        items: const [
                          DropdownMenuItem(value: 'All Staff', child: Text('All Staff (Broadcast)')),
                          DropdownMenuItem(value: 'Principal Office', child: Text('Principal Office')),
                          DropdownMenuItem(value: 'Teaching Faculty', child: Text('Teaching Faculty')),
                          DropdownMenuItem(value: 'Finance Desk', child: Text('Finance Desk')),
                        ],
                        onChanged: (v) {
                          if (v != null) setState(() => _commTarget = v);
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton.icon(
                      icon: const Icon(Icons.send_rounded, size: 16),
                      label: const Text('Send'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF881337),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                      onPressed: () {
                        if (_commMessageController.text.trim().isEmpty) return;
                        final newMsg = StaffCommMessageItem(
                          id: 'MSG_${DateTime.now().millisecondsSinceEpoch}',
                          senderName: 'Super Admin Trustee Office',
                          recipientName: _commTarget,
                          message: _commMessageController.text.trim(),
                          timestamp: 'Just now',
                          isBroadcast: _commTarget.contains('All'),
                          priority: _commPriority,
                          isRead: true,
                        );

                        setState(() {
                          _commMessages.insert(0, newMsg);
                          _commMessageController.clear();
                        });

                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Announcement dispatched!')),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Message Feed
          const Text('Institutional Message Stream', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A))),
          const SizedBox(height: 10),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _commMessages.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              final msg = _commMessages[index];
              return Container(
                padding: const EdgeInsets.all(14),
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
                        Text(msg.senderName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                        Text(msg.timestamp, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('To: ${msg.recipientName}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                    const SizedBox(height: 6),
                    Text(msg.message, style: const TextStyle(fontSize: 13, color: Color(0xFF334155))),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 6: RBAC GOVERNANCE MATRIX
  // ==========================================
  Widget _buildRbacMatrixTab() {
    final permissions = [
      {'module': 'Staff Authorization & Passwords', 'superAdmin': true, 'principal': false, 'teacher': false, 'accountant': false, 'parent': false},
      {'module': 'Salary & Payroll Settlements', 'superAdmin': true, 'principal': false, 'teacher': false, 'accountant': true, 'parent': false},
      {'module': 'Institutional Directives & Circulars', 'superAdmin': true, 'principal': true, 'teacher': false, 'accountant': false, 'parent': false},
      {'module': 'Student Admissions & Identity Slips', 'superAdmin': true, 'principal': true, 'teacher': false, 'accountant': false, 'parent': false},
      {'module': 'Fee Structure & Invoicing', 'superAdmin': true, 'principal': true, 'teacher': false, 'accountant': true, 'parent': false},
      {'module': 'Fee Payments & UPI Collections', 'superAdmin': true, 'principal': false, 'teacher': false, 'accountant': true, 'parent': true},
      {'module': 'Attendance & RFID Roll Call', 'superAdmin': true, 'principal': true, 'teacher': true, 'accountant': false, 'parent': false},
      {'module': 'Exam Marks & Report Cards', 'superAdmin': true, 'principal': true, 'teacher': true, 'accountant': false, 'parent': false},
      {'module': 'Live Classes & Video Conferences', 'superAdmin': true, 'principal': true, 'teacher': true, 'accountant': false, 'parent': true},
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFF881337).withOpacity(0.06),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF881337).withOpacity(0.2)),
            ),
            child: const Row(
              children: [
                Icon(Icons.shield_rounded, color: Color(0xFF881337)),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Multi-Role RBAC Security Matrix across Super Admin, Principal, Faculty, Bursar & Family portals.',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF881337)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: permissions.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              final row = permissions[index];
              return Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      row['module'] as String,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 6,
                      children: [
                        _buildPermChip('Super Admin', row['superAdmin'] as bool, const Color(0xFF881337)),
                        _buildPermChip('Principal', row['principal'] as bool, const Color(0xFFB45309)),
                        _buildPermChip('Teacher', row['teacher'] as bool, const Color(0xFF2563EB)),
                        _buildPermChip('Accountant', row['accountant'] as bool, const Color(0xFFE11D48)),
                        _buildPermChip('Parent/Student', row['parent'] as bool, const Color(0xFF0D9488)),
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

  Widget _buildPermChip(String roleName, bool hasAccess, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: hasAccess ? color.withOpacity(0.1) : const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: hasAccess ? color.withOpacity(0.3) : const Color(0xFFE2E8F0)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(hasAccess ? Icons.check_circle_rounded : Icons.cancel_rounded, size: 12, color: hasAccess ? color : const Color(0xFF94A3B8)),
          const SizedBox(width: 4),
          Text(
            roleName,
            style: TextStyle(
              fontSize: 11,
              fontWeight: hasAccess ? FontWeight.bold : FontWeight.normal,
              color: hasAccess ? color : const Color(0xFF94A3B8),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String value, String label) {
    final isSelected = _rosterFilter == value;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isSelected ? Colors.white : const Color(0xFF475569),
        ),
      ),
      selected: isSelected,
      selectedColor: const Color(0xFF881337),
      backgroundColor: const Color(0xFFF1F5F9),
      onSelected: (_) {
        setState(() {
          _rosterFilter = value;
        });
      },
      showCheckmark: false,
    );
  }
}
