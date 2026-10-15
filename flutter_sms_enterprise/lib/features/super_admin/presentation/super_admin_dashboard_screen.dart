import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:edupulse_sms/core/constants/app_constants.dart';
import 'package:edupulse_sms/features/auth/presentation/auth_controller.dart';

/// Staff Credential Model matching the React Preview App Data Schema
class StaffCredentialItem {
  final String id;
  final String fullName;
  final String role; // 'principal', 'teacher', 'class_teacher', 'accountant', 'peon', 'maid', 'security_guard', 'driver'
  final String roleTitle; // 'Principal', 'Subject Teacher', 'Class Teacher', etc.
  final String email;
  final String password;
  final String phoneNumber;
  final String employeeId;
  final String departmentOrClass;
  final String qualification;
  final String avatarUrl;
  final bool isAccepted;
  final DateTime acceptedAt;

  const StaffCredentialItem({
    required this.id,
    required this.fullName,
    required this.role,
    required this.roleTitle,
    required this.email,
    required this.password,
    required this.phoneNumber,
    required this.employeeId,
    required this.departmentOrClass,
    required this.qualification,
    required this.avatarUrl,
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
  final String roleTitle;
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
    required this.roleTitle,
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
  final String roleTitle;
  final String action;
  final String category; // 'attendance', 'academic', 'finance', 'administration'
  final String timeAgo;
  final String status; // 'completed', 'in_progress'

  const StaffActivityLogItem({
    required this.id,
    required this.staffName,
    required this.roleTitle,
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
    extends ConsumerState<SuperAdminDashboardScreen> {
  // Active Tab: 'roster', 'salary', 'activities', 'directives', 'communication', 'rbac'
  String _activeTab = 'roster';

  // 1. Exactly the 8 Staff Credentials matching the Preview App (Screenshot & store.ts)
  final List<StaffCredentialItem> _credentials = [
    StaffCredentialItem(
      id: 'CRED_PRIN_01',
      fullName: 'Dr. Alok Verma',
      role: 'principal',
      roleTitle: 'Principal',
      email: 'principal@edupulse.edu',
      password: 'Principal@Edu2026',
      phoneNumber: '+91 98765 43210',
      employeeId: 'EMP-PRIN-001',
      departmentOrClass: 'Head of School / Administration',
      qualification: 'Ph.D in Educational Leadership, M.Ed',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 45)),
    ),
    StaffCredentialItem(
      id: 'CRED_TCH_01',
      fullName: 'Dr. Ananya Sen',
      role: 'teacher',
      roleTitle: 'Subject Teacher',
      email: 'ananya.sen@edupulse.edu',
      password: 'Teacher@Physics2026',
      phoneNumber: '+91 98112 77889',
      employeeId: 'EMP-TCH-102',
      departmentOrClass: 'Senior Physics & Mathematics',
      qualification: 'M.Sc Physics, B.Ed, Ph.D',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
    StaffCredentialItem(
      id: 'CRED_CT_01',
      fullName: 'Ms. Priya Sharma',
      role: 'class_teacher',
      roleTitle: 'Class Teacher',
      email: 'priya.sharma@edupulse.edu',
      password: 'ClassTeacher@11A',
      phoneNumber: '+91 98112 23344',
      employeeId: 'EMP-CT-204',
      departmentOrClass: 'Class 11-A In-Charge & Nursery Supervisor',
      qualification: 'M.A English, B.Ed, Early Childhood Dip.',
      avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 20)),
    ),
    StaffCredentialItem(
      id: 'CRED_ACC_01',
      fullName: 'Mr. Vikram Goel',
      role: 'accountant',
      roleTitle: 'Accountant',
      email: 'vikram.goel@edupulse.edu',
      password: 'Accountant@Bursar2026',
      phoneNumber: '+91 97654 32109',
      employeeId: 'EMP-ACC-301',
      departmentOrClass: 'Finance, Bursar & Fee Collection Desk',
      qualification: 'M.Com, Chartered Accountant (Inter)',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 15)),
    ),
    StaffCredentialItem(
      id: 'CRED_PEON_01',
      fullName: 'Ramesh Kumar',
      role: 'peon',
      roleTitle: 'Peon / Attendant',
      email: 'ramesh.kumar@edupulse.edu',
      password: 'Peon@Edu2026',
      phoneNumber: '+91 98450 11223',
      employeeId: 'EMP-PEON-001',
      departmentOrClass: 'Office Attendant & Bell Operations',
      qualification: 'Secondary (10th Pass), First Aid Certified',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 60)),
    ),
    StaffCredentialItem(
      id: 'CRED_MAID_01',
      fullName: 'Sunita Devi',
      role: 'maid',
      roleTitle: 'Maid / Caretaker',
      email: 'sunita.devi@edupulse.edu',
      password: 'Maid@Edu2026',
      phoneNumber: '+91 98711 44556',
      employeeId: 'EMP-MAID-001',
      departmentOrClass: 'Sanitation & Early Childhood Care',
      qualification: 'Middle School, Childcare Trained',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 50)),
    ),
    StaffCredentialItem(
      id: 'CRED_SEC_01',
      fullName: 'Baldev Singh',
      role: 'security_guard',
      roleTitle: 'Security Guard',
      email: 'baldev.singh@edupulse.edu',
      password: 'Guard@Edu2026',
      phoneNumber: '+91 98223 66778',
      employeeId: 'EMP-SEC-001',
      departmentOrClass: 'Campus Safety & Gate Verification',
      qualification: 'Ex-Serviceman, Security Badge #402',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 40)),
    ),
    StaffCredentialItem(
      id: 'CRED_DRV_01',
      fullName: 'Rajesh Yadav',
      role: 'driver',
      roleTitle: 'Driver / Transport',
      email: 'rajesh.yadav@edupulse.edu',
      password: 'Driver@Edu2026',
      phoneNumber: '+91 98334 99001',
      employeeId: 'EMP-DRV-001',
      departmentOrClass: 'Bus Route 12 & Student Logistics',
      qualification: 'Heavy Vehicle Commercial License',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      isAccepted: true,
      acceptedAt: DateTime.now().subtract(const Duration(days: 35)),
    ),
  ];

  // 2. Staff Salary Payments (8 records)
  final List<StaffSalaryItem> _salaries = [
    const StaffSalaryItem(
      id: 'SAL_001',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_PRIN_01',
      staffName: 'Dr. Alok Verma',
      roleTitle: 'Principal',
      staffDepartment: 'Head of School / Administration',
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
    const StaffSalaryItem(
      id: 'SAL_002',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_TCH_01',
      staffName: 'Dr. Ananya Sen',
      roleTitle: 'Subject Teacher',
      staffDepartment: 'Senior Physics & Mathematics',
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
    const StaffSalaryItem(
      id: 'SAL_003',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_CT_01',
      staffName: 'Ms. Priya Sharma',
      roleTitle: 'Class Teacher',
      staffDepartment: 'Class 11-A In-Charge & Nursery Supervisor',
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
    const StaffSalaryItem(
      id: 'SAL_004',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_ACC_01',
      staffName: 'Mr. Vikram Goel',
      roleTitle: 'Accountant',
      staffDepartment: 'Finance, Bursar & Fee Collection Desk',
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
    const StaffSalaryItem(
      id: 'SAL_005',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_PEON_01',
      staffName: 'Ramesh Kumar',
      roleTitle: 'Peon / Attendant',
      staffDepartment: 'Office Attendant & Bell Operations',
      employeeId: 'EMP-PEON-001',
      baseSalary: 18000,
      bonusOrAllowance: 1000,
      deductions: 1000,
      netAmountPaid: 18000,
      paymentMode: 'Cash Voucher',
      transactionRef: 'CSH-VCH-8801',
      remarks: 'Office attendant wage voucher for October',
      disbursedBy: 'Super Admin Trustee',
      status: 'paid',
      receiptVoucherNumber: 'VCH-OCT-2026-005',
    ),
    const StaffSalaryItem(
      id: 'SAL_006',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_MAID_01',
      staffName: 'Sunita Devi',
      roleTitle: 'Maid / Caretaker',
      staffDepartment: 'Sanitation & Early Childhood Care',
      employeeId: 'EMP-MAID-001',
      baseSalary: 16500,
      bonusOrAllowance: 1000,
      deductions: 1000,
      netAmountPaid: 16500,
      paymentMode: 'Cash Voucher',
      transactionRef: 'CSH-VCH-8802',
      remarks: 'Sanitation & nursery hygiene monthly wage',
      disbursedBy: 'Super Admin Trustee',
      status: 'paid',
      receiptVoucherNumber: 'VCH-OCT-2026-006',
    ),
    const StaffSalaryItem(
      id: 'SAL_007',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_SEC_01',
      staffName: 'Baldev Singh',
      roleTitle: 'Security Guard',
      staffDepartment: 'Campus Safety & Gate Verification',
      employeeId: 'EMP-SEC-001',
      baseSalary: 20000,
      bonusOrAllowance: 1500,
      deductions: 1500,
      netAmountPaid: 20000,
      paymentMode: 'UPI Auto-Disburse',
      transactionRef: 'UPI-PNB-661204',
      remarks: 'Campus gate security shift compensation',
      disbursedBy: 'Super Admin Trustee',
      status: 'paid',
      receiptVoucherNumber: 'VCH-OCT-2026-007',
    ),
    const StaffSalaryItem(
      id: 'SAL_008',
      paymentDate: '2026-10-01',
      monthYear: 'October 2026',
      staffId: 'CRED_DRV_01',
      staffName: 'Rajesh Yadav',
      roleTitle: 'Driver / Transport',
      staffDepartment: 'Bus Route 12 & Student Logistics',
      employeeId: 'EMP-DRV-001',
      baseSalary: 22000,
      bonusOrAllowance: 1500,
      deductions: 1500,
      netAmountPaid: 22000,
      paymentMode: 'Bank Transfer (NEFT)',
      transactionRef: 'NEFT-SBI-440192',
      remarks: 'Transport department bus driver compensation',
      disbursedBy: 'Super Admin Trustee',
      status: 'paid',
      receiptVoucherNumber: 'VCH-OCT-2026-008',
    ),
  ];

  // 3. Official Directives (4 records)
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
    StaffDirectiveItem(
      id: 'DIR_004',
      title: 'Pre-Primary Nutrition, Hygiene & Sensory Play Audit',
      instructions:
          'Class teachers & nursery caretakers to audit playground toys sanitation and student allergy registers.',
      targetStaffName: 'Nursery & Pre-Primary Staff',
      priority: 'normal',
      category: 'academic',
      deadline: '2026-10-28',
      issuedAt: '2026-10-05',
      status: 'pending',
    ),
  ];

  // 4. Institutional Activities Log (6 records)
  final List<StaffActivityLogItem> _activities = [
    const StaffActivityLogItem(
      id: 'ACT_01',
      staffName: 'Dr. Ananya Sen',
      roleTitle: 'Subject Teacher',
      action: 'Completed Period 3 Physics Lab Optical Experiment with 24 student notebooks.',
      category: 'academic',
      timeAgo: '12 mins ago',
      status: 'completed',
    ),
    const StaffActivityLogItem(
      id: 'ACT_02',
      staffName: 'Mr. Vikram Goel',
      roleTitle: 'Accountant',
      action: 'Reconciled ₹24,500 daily counter fee collection against bank deposit scroll.',
      category: 'finance',
      timeAgo: '45 mins ago',
      status: 'completed',
    ),
    const StaffActivityLogItem(
      id: 'ACT_03',
      staffName: 'Ms. Priya Sharma',
      roleTitle: 'Class Teacher',
      action: 'Updated Pre-Primary Nutrition & Rest Observation Sheet for Nursery Section A.',
      category: 'academic',
      timeAgo: '2 hours ago',
      status: 'completed',
    ),
    const StaffActivityLogItem(
      id: 'ACT_04',
      staffName: 'Dr. Alok Verma',
      roleTitle: 'Principal',
      action: 'Audited Weekly Faculty Absence & Substitution Roster without instructional disruption.',
      category: 'administration',
      timeAgo: '4 hours ago',
      status: 'completed',
    ),
    const StaffActivityLogItem(
      id: 'ACT_05',
      staffName: 'Baldev Singh',
      roleTitle: 'Security Guard',
      action: 'Logged afternoon bus departure convoy and visitor identity verification check.',
      category: 'attendance',
      timeAgo: '6 hours ago',
      status: 'completed',
    ),
    const StaffActivityLogItem(
      id: 'ACT_06',
      staffName: 'Super Admin Trustee',
      roleTitle: 'Super Admin',
      action: 'Disbursed October 2026 payroll settlements for all 8 authorized staff members.',
      category: 'administration',
      timeAgo: '1 day ago',
      status: 'completed',
    ),
  ];

  // 5. Staff Communication Messages (3 records)
  final List<StaffCommMessageItem> _commMessages = [
    const StaffCommMessageItem(
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
    const StaffCommMessageItem(
      id: 'MSG_02',
      senderName: 'Dr. Alok Verma (Principal)',
      recipientName: 'Super Admin Trustee Office',
      message:
          'Board compliance inspection report has been prepared and uploaded to the governance documents vault.',
      timestamp: 'Yesterday, 04:15 PM',
      isBroadcast: false,
      priority: 'normal',
      isRead: true,
    ),
    const StaffCommMessageItem(
      id: 'MSG_03',
      senderName: 'Mr. Vikram Goel (Accountant)',
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
  final Set<String> _revealedPasswords = {};

  // Form Controllers for New Staff Credentials
  final _formKey = GlobalKey<FormState>();
  String _selectedNewRole = 'principal';
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _empIdController = TextEditingController(text: 'EMP-PRIN-002');
  final _deptController = TextEditingController(text: 'Head of School / Administration');
  final _qualController = TextEditingController();

  // Salary Form State
  String _selectedSalaryStaffId = 'CRED_PRIN_01';
  final _salaryBaseController = TextEditingController(text: '125000');
  final _salaryBonusController = TextEditingController(text: '5000');
  final _salaryDeductController = TextEditingController(text: '2000');
  final _salaryTxnRefController = TextEditingController(text: 'UPI-TXN-');
  final _salaryRemarksController = TextEditingController(text: 'Monthly salary and wage settlement');
  String _salaryPaymentMode = 'UPI';

  // Directive Form State
  final _directiveTitleController = TextEditingController();
  final _directiveInstructionsController = TextEditingController();
  String _directivePriority = 'urgent';
  String _directiveCategory = 'academic';
  String _directiveTarget = 'All Faculty & Staff';

  // Message Form State
  final _commMessageController = TextEditingController();
  String _commTarget = 'All Staff';

  @override
  void dispose() {
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

  void _onRoleSelected(String role) {
    setState(() {
      _selectedNewRole = role;
      switch (role) {
        case 'principal':
          _empIdController.text = 'EMP-PRIN-002';
          _deptController.text = 'Head of School / Administration';
          break;
        case 'teacher':
          _empIdController.text = 'EMP-TCH-103';
          _deptController.text = 'Senior Faculty (Mathematics & Physics)';
          break;
        case 'class_teacher':
          _empIdController.text = 'EMP-CT-205';
          _deptController.text = 'Class 11-A In-Charge & Student Mentor';
          break;
        case 'accountant':
          _empIdController.text = 'EMP-ACC-302';
          _deptController.text = 'Finance & Fee Collection Desk';
          break;
        case 'peon':
          _empIdController.text = 'EMP-PEON-002';
          _deptController.text = 'Office Attendant & Bell Operations';
          break;
        case 'maid':
          _empIdController.text = 'EMP-MAID-002';
          _deptController.text = 'Housekeeping & Nursery Care';
          break;
        case 'security_guard':
          _empIdController.text = 'EMP-SEC-002';
          _deptController.text = 'Campus Security & Gate Safety';
          break;
        case 'driver':
          _empIdController.text = 'EMP-DRV-002';
          _deptController.text = 'Transport Dept / Bus Fleet';
          break;
      }
    });
  }

  void _generateStrongPassword() {
    final prefix = _selectedNewRole == 'principal'
        ? 'Prin'
        : _selectedNewRole == 'class_teacher'
            ? 'ClsTch'
            : _selectedNewRole == 'teacher'
                ? 'Teach'
                : _selectedNewRole == 'accountant'
                    ? 'Acc'
                    : 'Stf';
    final rand = 1000 + (DateTime.now().millisecond * 9);
    setState(() {
      _passwordController.text = '$prefix@Edu$rand!';
    });
  }

  void _acceptAndSaveCredential() {
    if (!_formKey.currentState!.validate()) return;

    String roleTitle = 'Faculty';
    if (_selectedNewRole == 'principal') roleTitle = 'Principal';
    if (_selectedNewRole == 'teacher') roleTitle = 'Subject Teacher';
    if (_selectedNewRole == 'class_teacher') roleTitle = 'Class Teacher';
    if (_selectedNewRole == 'accountant') roleTitle = 'Accountant';
    if (_selectedNewRole == 'peon') roleTitle = 'Peon / Attendant';
    if (_selectedNewRole == 'maid') roleTitle = 'Maid / Caretaker';
    if (_selectedNewRole == 'security_guard') roleTitle = 'Security Guard';
    if (_selectedNewRole == 'driver') roleTitle = 'Driver / Transport';

    final newCred = StaffCredentialItem(
      id: 'CRED_${DateTime.now().millisecondsSinceEpoch}',
      fullName: _nameController.text.trim(),
      role: _selectedNewRole,
      roleTitle: roleTitle,
      email: _emailController.text.trim().toLowerCase(),
      password: _passwordController.text.trim(),
      phoneNumber: _phoneController.text.trim().isEmpty
          ? '+91 98000 00000'
          : _phoneController.text.trim(),
      employeeId: _empIdController.text.trim(),
      departmentOrClass: _deptController.text.trim().isEmpty
          ? 'School Staff'
          : _deptController.text.trim(),
      qualification: _qualController.text.trim().isEmpty
          ? 'Qualified Specialist'
          : _qualController.text.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
          'Login credentials authorized for ${newCred.fullName} ($roleTitle)!',
        ),
        backgroundColor: const Color(0xFFE11D48),
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
        content: Text('Credentials for ${item.fullName} copied!'),
        backgroundColor: const Color(0xFF0F172A),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
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
                        Icon(Icons.assignment_turned_in_rounded, color: Color(0xFFE11D48), size: 22),
                        SizedBox(width: 8),
                        Text(
                          'Issue Official Directive',
                          style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
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
                TextField(
                  controller: _directiveTitleController,
                  decoration: const InputDecoration(
                    labelText: 'Directive Title / Order Subject *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _directiveInstructionsController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: 'Instructions & Action Items *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _directivePriority,
                        decoration: const InputDecoration(labelText: 'Priority', border: OutlineInputBorder()),
                        items: const [
                          DropdownMenuItem(value: 'urgent', child: Text('Urgent')),
                          DropdownMenuItem(value: 'high', child: Text('High')),
                          DropdownMenuItem(value: 'normal', child: Text('Normal')),
                        ],
                        onChanged: (val) {
                          if (val != null) setModalState(() => _directivePriority = val);
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
                          DropdownMenuItem(value: 'finance', child: Text('Finance')),
                          DropdownMenuItem(value: 'compliance', child: Text('Compliance')),
                          DropdownMenuItem(value: 'administration', child: Text('Admin')),
                        ],
                        onChanged: (val) {
                          if (val != null) setModalState(() => _directiveCategory = val);
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: _directiveTarget,
                  decoration: const InputDecoration(labelText: 'Target Staff Group', border: OutlineInputBorder()),
                  items: const [
                    DropdownMenuItem(value: 'All Faculty & Staff', child: Text('All Faculty & Staff')),
                    DropdownMenuItem(value: 'Principal & Administration Office', child: Text('Principal & Admin')),
                    DropdownMenuItem(value: 'All Subject Faculty & Mentors', child: Text('Subject Faculty & Mentors')),
                    DropdownMenuItem(value: 'Finance & Accounts Desk', child: Text('Finance & Accounts Desk')),
                    DropdownMenuItem(value: 'Nursery & Pre-Primary Staff', child: Text('Nursery & Pre-Primary Staff')),
                  ],
                  onChanged: (val) {
                    if (val != null) setModalState(() => _directiveTarget = val);
                  },
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      if (_directiveTitleController.text.trim().isEmpty) return;
                      final newDir = StaffDirectiveItem(
                        id: 'DIR_${DateTime.now().millisecondsSinceEpoch}',
                        title: _directiveTitleController.text.trim(),
                        instructions: _directiveInstructionsController.text.trim().isEmpty
                            ? 'Executive compliance required.'
                            : _directiveInstructionsController.text.trim(),
                        targetStaffName: _directiveTarget,
                        priority: _directivePriority,
                        category: _directiveCategory,
                        deadline: DateFormat('yyyy-MM-dd').format(DateTime.now().add(const Duration(days: 7))),
                        issuedAt: DateFormat('yyyy-MM-dd').format(DateTime.now()),
                        status: 'in_progress',
                      );
                      setState(() {
                        _directives.insert(0, newDir);
                        _directiveTitleController.clear();
                        _directiveInstructionsController.clear();
                      });
                      Navigator.of(ctx).pop();
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Directive "${newDir.title}" issued successfully!'),
                          backgroundColor: const Color(0xFFE11D48),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFE11D48),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: const Text('Dispatch Official Order', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
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
                          Icon(Icons.vpn_key_rounded, color: Color(0xFFE11D48), size: 22),
                          SizedBox(width: 8),
                          Text(
                            'Staff Login Credentials',
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
                  const Text('Select Role / Designation *', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _buildModalRoleChoice('principal', 'Principal', setModalState),
                      _buildModalRoleChoice('teacher', 'Teacher', setModalState),
                      _buildModalRoleChoice('class_teacher', 'Class Teacher', setModalState),
                      _buildModalRoleChoice('accountant', 'Accountant', setModalState),
                      _buildModalRoleChoice('peon', 'Peon', setModalState),
                      _buildModalRoleChoice('maid', 'Maid', setModalState),
                      _buildModalRoleChoice('security_guard', 'Security', setModalState),
                      _buildModalRoleChoice('driver', 'Driver', setModalState),
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
                          backgroundColor: const Color(0xFFE11D48),
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
                      labelText: 'Department / Assigned Section',
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
                        backgroundColor: const Color(0xFFE11D48),
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

  Widget _buildModalRoleChoice(String roleKey, String label, StateSetter setModalState) {
    final isSelected = _selectedNewRole == roleKey;
    return ChoiceChip(
      label: Text(label, style: TextStyle(fontSize: 12, color: isSelected ? Colors.white : const Color(0xFF1E293B))),
      selected: isSelected,
      selectedColor: const Color(0xFFE11D48),
      backgroundColor: const Color(0xFFF1F5F9),
      onSelected: (_) {
        setModalState(() {
          _onRoleSelected(roleKey);
        });
      },
      showCheckmark: false,
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
                            'Disburse Staff Fees / Salary',
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
                        child: Text('${c.fullName} (${c.roleTitle})'),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        final cred = _credentials.firstWhere((c) => c.id == val);
                        setModalState(() {
                          _selectedSalaryStaffId = val;
                          if (cred.role == 'principal') _salaryBaseController.text = '125000';
                          else if (cred.role == 'teacher') _salaryBaseController.text = '65000';
                          else if (cred.role == 'class_teacher') _salaryBaseController.text = '55000';
                          else if (cred.role == 'accountant') _salaryBaseController.text = '48000';
                          else if (cred.role == 'peon') _salaryBaseController.text = '18000';
                          else if (cred.role == 'maid') _salaryBaseController.text = '16500';
                          else if (cred.role == 'security_guard') _salaryBaseController.text = '20000';
                          else if (cred.role == 'driver') _salaryBaseController.text = '22000';
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
                          roleTitle: cred.roleTitle,
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
            Text('Designation: ${item.roleTitle} • ${item.employeeId}'),
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
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _handleTestLogin(StaffCredentialItem item) {
    UserRole targetRole = UserRole.principal;
    if (item.role == 'principal') targetRole = UserRole.principal;
    else if (item.role == 'teacher') targetRole = UserRole.teacher;
    else if (item.role == 'class_teacher') targetRole = UserRole.classTeacher;
    else if (item.role == 'accountant') targetRole = UserRole.accountant;

    ref.read(authControllerProvider.notifier).loginAsDemoRole(targetRole);
  }

  @override
  Widget build(BuildContext context) {
    final filteredCredentials = _credentials.where((c) {
      if (_rosterFilter != 'all' && c.role != _rosterFilter) {
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
        backgroundColor: const Color(0xFF0F172A), // Dark slate header matching top bar
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Super Admin Console',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            Text(
              'Shri Vikramaditya Roy (Board Trustee)',
              style: TextStyle(fontSize: 11, color: Color(0xFFFDA4AF)),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: Colors.white70),
            tooltip: 'Sign Out to Login',
            onPressed: () {
              ref.read(authControllerProvider.notifier).signOut();
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // =========================================================
              // 1. TOP EXECUTIVE BANNER (EXACT MATCH WITH PREVIEW APP)
              // =========================================================
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F172A), Color(0xFF4C0519), Color(0xFF0F172A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF881337).withOpacity(0.4)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF43F5E).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: const Color(0xFFF43F5E).withOpacity(0.3)),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.shield_outlined, size: 12, color: Color(0xFFFDA4AF)),
                                SizedBox(width: 4),
                                Text(
                                  'Super Admin',
                                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFFDA4AF)),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Institutional Admin Console',
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              letterSpacing: -0.3,
                            ),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            'Staff onboarding and credential issuance.',
                            style: TextStyle(fontSize: 11, color: Color(0xFFCBD5E1)),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),

                    // Right Side Action Buttons
                    Row(
                      children: [
                        // Pay Salary Button
                        InkWell(
                          onTap: () {
                            setState(() => _activeTab = 'salary');
                            _showDisburseSalaryDialog();
                          },
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                            decoration: BoxDecoration(
                              color: const Color(0xFF059669),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.attach_money_rounded, size: 14, color: Colors.white),
                                SizedBox(width: 2),
                                Text(
                                  'Pay Salary',
                                  style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),

                        // Key Button
                        InkWell(
                          onTap: _showAuthorizeStaffDialog,
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            padding: const EdgeInsets.all(7),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE11D48),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.vpn_key_rounded, size: 14, color: Colors.white),
                          ),
                        ),
                        const SizedBox(width: 6),

                        // Staff Count Box
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFF334155)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              const Text('Staff Count', style: TextStyle(fontSize: 9, color: Color(0xFF94A3B8))),
                              Text(
                                '${_credentials.length} Active',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFFFDA4AF)),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // =========================================================
              // 2. 2-ROW NAVIGATION SWITCHER (EXACT MATCH WITH PREVIEW APP)
              // =========================================================
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    // Row 1: 3 Buttons
                    Row(
                      children: [
                        Expanded(
                          child: _buildNavButton(
                            tabKey: 'roster',
                            label: 'Staff Roster (${_credentials.length})',
                            icon: Icons.people_alt_rounded,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: _buildNavButton(
                            tabKey: 'salary',
                            label: 'Staff Fees / Salary (${_salaries.length})',
                            icon: Icons.receipt_long_rounded,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: _buildNavButton(
                            tabKey: 'activities',
                            label: 'Staff Activity (${_activities.length})',
                            icon: Icons.trending_up_rounded,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),

                    // Row 2: 3 Buttons
                    Row(
                      children: [
                        Expanded(
                          child: _buildNavButton(
                            tabKey: 'directives',
                            label: 'Directives (${_directives.length})',
                            icon: Icons.explore_rounded,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: _buildNavButton(
                            tabKey: 'communication',
                            label: 'Communication (${_commMessages.length})',
                            icon: Icons.chat_bubble_outline_rounded,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: _buildNavButton(
                            tabKey: 'rbac',
                            label: 'Permissions',
                            icon: Icons.shield_outlined,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // =========================================================
              // 3. TAB CONTENT
              // =========================================================
              if (_activeTab == 'roster')
                _buildRosterView(filteredCredentials)
              else if (_activeTab == 'salary')
                _buildSalaryView()
              else if (_activeTab == 'activities')
                _buildActivitiesView()
              else if (_activeTab == 'directives')
                _buildDirectivesView()
              else if (_activeTab == 'communication')
                _buildCommunicationView()
              else if (_activeTab == 'rbac')
                _buildRbacView(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavButton({
    required String tabKey,
    required String label,
    required IconData icon,
  }) {
    final isSelected = _activeTab == tabKey;
    return InkWell(
      onTap: () => setState(() => _activeTab = tabKey),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFE2E8F0),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 13,
              color: isSelected ? Colors.white : const Color(0xFF64748B),
            ),
            const SizedBox(width: 4),
            Flexible(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? Colors.white : const Color(0xFF334155),
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // =========================================================
  // TAB: ROSTER (EXACT MATCH WITH SCREENSHOT_20261015_064219)
  // =========================================================
  Widget _buildRosterView(List<StaffCredentialItem> filteredList) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Section Header Row
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Staff Credentials Roster',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0F172A),
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Active login credentials approved by Super Admin.',
                  style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                ),
              ],
            ),
            ElevatedButton.icon(
              onPressed: _showAuthorizeStaffDialog,
              icon: const Icon(Icons.vpn_key_rounded, size: 14),
              label: const Text('Staff Login Credentials', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE11D48),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        // Search Bar
        TextField(
          decoration: InputDecoration(
            hintText: 'Search staff, email, ID...',
            hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
            prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF94A3B8), size: 18),
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          ),
          onChanged: (val) {
            setState(() {
              _rosterSearch = val.trim();
            });
          },
        ),
        const SizedBox(height: 10),

        // Filter Pills Row
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildFilterPill('all', 'All'),
              const SizedBox(width: 6),
              _buildFilterPill('principal', 'Principal'),
              const SizedBox(width: 6),
              _buildFilterPill('teacher', 'Teacher'),
              const SizedBox(width: 6),
              _buildFilterPill('class_teacher', 'Class Teacher'),
              const SizedBox(width: 6),
              _buildFilterPill('accountant', 'Accountant'),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Staff Cards (Exactly matching screenshot cards)
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: filteredList.length,
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (context, index) {
            final item = filteredList[index];
            final isPasswordVisible = _revealedPasswords.contains(item.id);

            // Badge styling
            Color badgeBg = const Color(0xFFFEF3C7);
            Color badgeText = const Color(0xFFD97706);
            Color badgeBorder = const Color(0xFFFDE68A);

            if (item.role == 'teacher') {
              badgeBg = const Color(0xFFDBEAFE);
              badgeText = const Color(0xFF1D4ED8);
              badgeBorder = const Color(0xFFBFDBFE);
            } else if (item.role == 'class_teacher') {
              badgeBg = const Color(0xFFCCFBF1);
              badgeText = const Color(0xFF0F766E);
              badgeBorder = const Color(0xFF99F6E4);
            } else if (item.role == 'accountant') {
              badgeBg = const Color(0xFFFFE4E6);
              badgeText = const Color(0xFFBE123C);
              badgeBorder = const Color(0xFFFECDD3);
            } else if (item.role == 'peon') {
              badgeBg = const Color(0xFFFFEDD5);
              badgeText = const Color(0xFFC2410C);
              badgeBorder = const Color(0xFFFED7AA);
            } else if (item.role == 'maid') {
              badgeBg = const Color(0xFFFCE7F3);
              badgeText = const Color(0xFFBE185D);
              badgeBorder = const Color(0xFFFBCFE8);
            } else if (item.role == 'security_guard') {
              badgeBg = const Color(0xFFF3E8FF);
              badgeText = const Color(0xFF7E22CE);
              badgeBorder = const Color(0xFFE9D5FF);
            } else if (item.role == 'driver') {
              badgeBg = const Color(0xFFFEF9C3);
              badgeText = const Color(0xFFA16207);
              badgeBorder = const Color(0xFFFEF08A);
            }

            final bool canTestLogin = item.role == 'principal' ||
                item.role == 'teacher' ||
                item.role == 'class_teacher' ||
                item.role == 'accountant';

            return Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.02),
                    blurRadius: 4,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Card Info Row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Avatar
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: const Color(0xFFF1F5F9),
                        backgroundImage: NetworkImage(item.avatarUrl),
                      ),
                      const SizedBox(width: 10),

                      // Name, Badge, ID
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Flexible(
                                  child: Text(
                                    item.fullName,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                      color: Color(0xFF0F172A),
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: badgeBg,
                                    borderRadius: BorderRadius.circular(4),
                                    border: Border.all(color: badgeBorder),
                                  ),
                                  child: Text(
                                    item.roleTitle,
                                    style: TextStyle(
                                      color: badgeText,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 10,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${item.employeeId} • ${item.departmentOrClass}',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 6),

                      // Top Right: Test Login + Active Badge
                      Row(
                        children: [
                          if (canTestLogin)
                            InkWell(
                              onTap: () => _handleTestLogin(item),
                              borderRadius: BorderRadius.circular(6),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEFF6FF),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: const Color(0xFFBFDBFE)),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(Icons.open_in_new_rounded, size: 11, color: Color(0xFF2563EB)),
                                    SizedBox(width: 3),
                                    Text(
                                      'Test Login',
                                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF2563EB)),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          const SizedBox(width: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFECFDF5),
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: const Color(0xFFA7F3D0)),
                            ),
                            child: const Text(
                              'Active',
                              style: TextStyle(color: Color(0xFF059669), fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Bottom Grey Credentials Row
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      children: [
                        Flexible(
                          child: Text(
                            'Email: ${item.email}',
                            style: const TextStyle(fontSize: 11, color: Color(0xFF475569)),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Pass: ${isPasswordVisible ? item.password : '••••••••'}',
                          style: const TextStyle(fontSize: 11, fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                        ),
                        const SizedBox(width: 6),
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
                            padding: const EdgeInsets.all(2),
                            child: Icon(
                              isPasswordVisible ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                              size: 15,
                              color: const Color(0xFF64748B),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        InkWell(
                          onTap: () => _copyCredentials(item),
                          child: const Row(
                            children: [
                              Icon(Icons.copy_rounded, size: 13, color: Color(0xFFE11D48)),
                              SizedBox(width: 2),
                              Text('Copy', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFE11D48))),
                            ],
                          ),
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
    );
  }

  Widget _buildFilterPill(String key, String label) {
    final isSelected = _rosterFilter == key;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          fontSize: 11,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isSelected ? Colors.white : const Color(0xFF475569),
        ),
      ),
      selected: isSelected,
      selectedColor: const Color(0xFFE11D48),
      backgroundColor: const Color(0xFFF1F5F9),
      onSelected: (_) => setState(() => _rosterFilter = key),
      showCheckmark: false,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 0),
    );
  }

  // =========================================================
  // TAB: SALARY & FEES
  // =========================================================
  Widget _buildSalaryView() {
    final total = _salaries.fold<double>(0, (s, e) => s + e.netAmountPaid);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            Expanded(
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
                    const Text('Total Disbursed (Oct)', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                    const SizedBox(height: 2),
                    Text(
                      '₹${NumberFormat('#,##,###').format(total)}',
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF059669)),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
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
                    const Text('Staff on Payroll', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                    const SizedBox(height: 2),
                    Text(
                      '${_salaries.length} Verified',
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Disbursed Staff Salary Slips', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A))),
            ElevatedButton.icon(
              onPressed: _showDisburseSalaryDialog,
              icon: const Icon(Icons.payments_rounded, size: 14),
              label: const Text('Pay Salary', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF059669),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _salaries.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (context, index) {
            final sal = _salaries[index];
            return Container(
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
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(sal.staffName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                          Text('${sal.roleTitle} • ${sal.employeeId}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFDCFCE7),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: const Color(0xFF86EFAC)),
                        ),
                        child: const Text('Paid', style: TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.bold, fontSize: 10)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Net: ₹${NumberFormat('#,##,###').format(sal.netAmountPaid)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF059669))),
                      Text(sal.paymentMode, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Voucher: ${sal.receiptVoucherNumber}', style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                      InkWell(
                        onTap: () => _showSalarySlipModal(sal),
                        child: const Text('View Voucher →', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF059669))),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  // =========================================================
  // TAB: ACTIVITIES
  // =========================================================
  Widget _buildActivitiesView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text('Staff Institutional Activity Stream', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A))),
        const SizedBox(height: 10),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _activities.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (context, index) {
            final act = _activities[index];
            return Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE11D48).withOpacity(0.08),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Icon(Icons.history_rounded, size: 16, color: Color(0xFFE11D48)),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(act.staffName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A))),
                            Text(act.timeAgo, style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(act.action, style: const TextStyle(fontSize: 11, color: Color(0xFF334155))),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
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
    );
  }

  // =========================================================
  // TAB: DIRECTIVES
  // =========================================================
  Widget _buildDirectivesView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Super Admin Official Directives', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A))),
            ElevatedButton.icon(
              onPressed: _showIssueDirectiveDialog,
              icon: const Icon(Icons.add_rounded, size: 14),
              label: const Text('New Directive', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE11D48),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _directives.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (context, index) {
            final dir = _directives[index];
            final isUrgent = dir.priority == 'urgent';

            return Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
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
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: isUrgent ? const Color(0xFFFFE4E6) : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          dir.priority.toUpperCase(),
                          style: TextStyle(
                            color: isUrgent ? const Color(0xFFE11D48) : const Color(0xFF475569),
                            fontWeight: FontWeight.bold,
                            fontSize: 9,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(dir.category.toUpperCase(), style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                      const Spacer(),
                      Text(
                        dir.status == 'completed' ? 'Completed' : 'In Progress',
                        style: TextStyle(
                          color: dir.status == 'completed' ? const Color(0xFF15803D) : const Color(0xFFB45309),
                          fontWeight: FontWeight.bold,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(dir.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                  const SizedBox(height: 4),
                  Text(dir.instructions, style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                  const SizedBox(height: 6),
                  Text('Target: ${dir.targetStaffName} • Due: ${dir.deadline}', style: const TextStyle(fontSize: 10, color: Color(0xFF881337), fontWeight: FontWeight.w600)),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  // =========================================================
  // TAB: COMMUNICATION
  // =========================================================
  Widget _buildCommunicationView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Broadcast to All Staff', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 8),
              TextField(
                controller: _commMessageController,
                decoration: const InputDecoration(
                  hintText: 'Type official broadcast notice...',
                  border: OutlineInputBorder(),
                  contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                ),
              ),
              const SizedBox(height: 8),
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.send_rounded, size: 14),
                  label: const Text('Broadcast Notice', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE11D48),
                    foregroundColor: Colors.white,
                  ),
                  onPressed: () {
                    if (_commMessageController.text.trim().isEmpty) return;
                    final msg = StaffCommMessageItem(
                      id: 'MSG_${DateTime.now().millisecondsSinceEpoch}',
                      senderName: 'Super Admin Office',
                      recipientName: _commTarget,
                      message: _commMessageController.text.trim(),
                      timestamp: 'Just now',
                      isBroadcast: true,
                      priority: 'urgent',
                      isRead: true,
                    );
                    setState(() {
                      _commMessages.insert(0, msg);
                      _commMessageController.clear();
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Notice broadcasted to all staff!')),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        const Text('Broadcast History', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 8),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _commMessages.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (context, index) {
            final m = _commMessages[index];
            return Container(
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
                      Text(m.senderName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A))),
                      Text(m.timestamp, style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text('Audience: ${m.recipientName}', style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                  const SizedBox(height: 4),
                  Text(m.message, style: const TextStyle(fontSize: 12, color: Color(0xFF334155))),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  // =========================================================
  // TAB: RBAC PERMISSIONS
  // =========================================================
  Widget _buildRbacView() {
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

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFE11D48).withOpacity(0.06),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFE11D48).withOpacity(0.2)),
          ),
          child: const Row(
            children: [
              Icon(Icons.shield_rounded, color: Color(0xFFE11D48), size: 20),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Multi-Role RBAC Security Matrix across Super Admin, Principal, Faculty, Bursar & Family portals.',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFFE11D48)),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: permissions.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (context, index) {
            final row = permissions[index];
            return Container(
              padding: const EdgeInsets.all(12),
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
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: [
                      _buildPermBadge('Super Admin', row['superAdmin'] as bool, const Color(0xFF881337)),
                      _buildPermBadge('Principal', row['principal'] as bool, const Color(0xFFB45309)),
                      _buildPermBadge('Teacher', row['teacher'] as bool, const Color(0xFF2563EB)),
                      _buildPermBadge('Accountant', row['accountant'] as bool, const Color(0xFFE11D48)),
                      _buildPermBadge('Parent/Student', row['parent'] as bool, const Color(0xFF0D9488)),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildPermBadge(String roleName, bool hasAccess, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
      decoration: BoxDecoration(
        color: hasAccess ? color.withOpacity(0.1) : const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: hasAccess ? color.withOpacity(0.3) : const Color(0xFFE2E8F0)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(hasAccess ? Icons.check_circle_rounded : Icons.cancel_rounded, size: 11, color: hasAccess ? color : const Color(0xFF94A3B8)),
          const SizedBox(width: 3),
          Text(
            roleName,
            style: TextStyle(
              fontSize: 10,
              fontWeight: hasAccess ? FontWeight.bold : FontWeight.normal,
              color: hasAccess ? color : const Color(0xFF94A3B8),
            ),
          ),
        ],
      ),
    );
  }
}
