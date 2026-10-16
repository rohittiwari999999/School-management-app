import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:edupulse_sms/core/utils/auth_dialog_utils.dart';

// =========================================================================
// DATA MODELS MATCHING PREVIEW DATA SCHEMA
// =========================================================================

class FeeLineItem {
  final String id;
  final String title;
  final double amount;

  const FeeLineItem({
    required this.id,
    required this.title,
    required this.amount,
  });
}

class InvoiceModel {
  final String invoiceId;
  final String studentName;
  final String classId;
  final String className;
  final String term;
  final List<FeeLineItem> lineItems;
  final double subtotal;
  final String dueDate;
  final double fineAccumulated;
  final double totalPayable;
  double amountPaid;
  String status; // 'paid' or 'pending'
  String? receiptNumber;
  String? paymentDate;
  String? paymentMode;
  String? transactionRef;

  InvoiceModel({
    required this.invoiceId,
    required this.studentName,
    required this.classId,
    required this.className,
    required this.term,
    required this.lineItems,
    required this.subtotal,
    required this.dueDate,
    required this.fineAccumulated,
    required this.totalPayable,
    required this.amountPaid,
    required this.status,
    this.receiptNumber,
    this.paymentDate,
    this.paymentMode,
    this.transactionRef,
  });
}

class PettyCashModel {
  final String id;
  final String time;
  final String description;
  final String category;
  final double amount;
  final String voucherNo;

  const PettyCashModel({
    required this.id,
    required this.time,
    required this.description,
    required this.category,
    required this.amount,
    required this.voucherNo,
  });
}

class EnrolledStudentModel {
  final String id;
  final String fullName;
  final String classId;
  final String className;
  final String admissionNo;
  final String rollNo;
  final String parentName;
  final String parentPhone;
  final double tuitionFee;
  final String avatarUrl;
  final String admissionDate;
  final String bloodGroup;

  EnrolledStudentModel({
    required this.id,
    required this.fullName,
    required this.classId,
    required this.className,
    required this.admissionNo,
    required this.rollNo,
    required this.parentName,
    required this.parentPhone,
    required this.tuitionFee,
    required this.avatarUrl,
    required this.admissionDate,
    required this.bloodGroup,
  });
}

class StaffSalaryRecord {
  final String id;
  final String staffName;
  final String role;
  final String roleTitle;
  final String departmentOrClass;
  final String employeeId;
  final double baseSalary;
  final double bonus;
  final double deductions;
  final double netSalary;
  final String month;
  final String paymentMode;
  final String status;
  final String paymentDate;
  final String voucherNo;
  final String remarks;
  final String disbursedBy;

  const StaffSalaryRecord({
    required this.id,
    required this.staffName,
    required this.role,
    required this.roleTitle,
    required this.departmentOrClass,
    required this.employeeId,
    required this.baseSalary,
    required this.bonus,
    required this.deductions,
    required this.netSalary,
    required this.month,
    required this.paymentMode,
    required this.status,
    required this.paymentDate,
    required this.voucherNo,
    this.remarks = '',
    this.disbursedBy = 'Bursar & Accounts Desk',
  });
}

class StaffMemberModel {
  final String id;
  final String fullName;
  final String role;
  final String roleTitle;
  final String department;
  final String employeeId;
  final double defaultBaseSalary;
  final String phoneNumber;
  final String email;
  final String avatarUrl;

  const StaffMemberModel({
    required this.id,
    required this.fullName,
    required this.role,
    required this.roleTitle,
    required this.department,
    required this.employeeId,
    required this.defaultBaseSalary,
    required this.phoneNumber,
    required this.email,
    required this.avatarUrl,
  });
}

class AccountsDirective {
  final String id;
  final String title;
  final String priority;
  final String deadline;
  final String instructions;
  bool isCompleted;

  AccountsDirective({
    required this.id,
    required this.title,
    required this.priority,
    required this.deadline,
    required this.instructions,
    this.isCompleted = false,
  });
}

class ClassOption {
  final String id;
  final String name;
  final String label;
  final double defaultFee;
  final String classTeacherName;

  const ClassOption({
    required this.id,
    required this.name,
    required this.label,
    required this.defaultFee,
    required this.classTeacherName,
  });
}

// =========================================================================
// SCREEN COMPONENT
// =========================================================================

class AccountantDashboardScreen extends ConsumerStatefulWidget {
  const AccountantDashboardScreen({super.key});

  @override
  ConsumerState<AccountantDashboardScreen> createState() =>
      _AccountantDashboardScreenState();
}

class _AccountantDashboardScreenState
    extends ConsumerState<AccountantDashboardScreen> {
  // Active Tab state: 8 consoles matching preview app
  String _activeTab = 'ledger'; // 'ledger', 'pos', 'defaulters', 'admissions', 'staff_salary', 'daybook', 'analytics', 'directives'

  // Search & Filter state for Fee Ledger
  String _ledgerSearch = '';
  String _statusFilter = 'all'; // 'all', 'pending', 'paid'
  String _classFilter = 'all'; // 'all', 'CLS_NURSERY', 'CLS_05', 'CLS_11'

  // Counter POS form state
  String? _posSelectedInvoiceId;
  String _posPaymentMethod = 'cash'; // 'cash', 'upi', 'card', 'cheque'
  final _posTenderedController = TextEditingController();
  final _posNotesController = TextEditingController();

  // New Admission form state
  final _admNameController = TextEditingController();
  final _admRollController = TextEditingController();
  final _admParentNameController = TextEditingController();
  final _admPhoneController = TextEditingController(text: '+91 98765 43210');
  final _admFeeController = TextEditingController(text: '24000');
  final _admPhotoController = TextEditingController();
  final _admCustomNoController = TextEditingController(text: 'ADM-2026-489');
  String _admClassId = 'CLS_11';
  String _admBloodGroup = 'B+';
  String _admSearchQuery = '';

  // Staff Salary filters & search state
  String _salarySearch = '';
  String _salaryRoleFilter = 'all';
  String _salaryMonthFilter = 'all';

  // Petty Cash form state
  final _pettyDescController = TextEditingController();
  final _pettyAmountController = TextEditingController();
  String _pettyCategory = 'office_supplies';

  // Feedback banner
  String? _toastMessage;

  // Class options matching preview app
  final List<ClassOption> _classOptions = const [
    ClassOption(
      id: 'CLS_11',
      name: 'Class 11-A (Sr. Secondary)',
      label: 'Class 11-A (PCM Science · Sr. Sec)',
      defaultFee: 24000,
      classTeacherName: 'Mrs. Sunita Rao',
    ),
    ClassOption(
      id: 'CLS_NURSERY',
      name: 'Nursery (Pre-Primary)',
      label: 'Nursery (Pre-Primary Early Childhood)',
      defaultFee: 14000,
      classTeacherName: 'Mrs. Sunita Rao',
    ),
    ClassOption(
      id: 'CLS_05',
      name: 'Class 5-B (Primary CCE)',
      label: 'Class 5-B (Primary Foundation)',
      defaultFee: 18000,
      classTeacherName: 'Mr. Arvind Verma',
    ),
    ClassOption(
      id: 'CLS_09',
      name: 'Class 9-A (Secondary)',
      label: 'Class 9-A (Secondary CBSE)',
      defaultFee: 20000,
      classTeacherName: 'Dr. K. N. Rao',
    ),
    ClassOption(
      id: 'CLS_10',
      name: 'Class 10-A (Secondary)',
      label: 'Class 10-A (Secondary Board)',
      defaultFee: 22000,
      classTeacherName: 'Mrs. Neha Sinha',
    ),
    ClassOption(
      id: 'CLS_12',
      name: 'Class 12-A (Sr. Secondary)',
      label: 'Class 12-A (Commerce · Sr. Sec)',
      defaultFee: 25000,
      classTeacherName: 'Mr. Rajesh Mehra',
    ),
  ];

  // Invoices list exact match with preview store.ts
  final List<InvoiceModel> _invoices = [
    InvoiceModel(
      invoiceId: 'INV-2026-Q2-089',
      studentName: 'Ananya Sharma',
      classId: 'CLS_NURSERY',
      className: 'Nursery (Pre-Primary)',
      term: 'Quarter 2 (Jul - Sep 2026)',
      lineItems: const [
        FeeLineItem(id: '1', title: 'Pre-Primary Tuition & Montessori Care', amount: 18000),
        FeeLineItem(id: '2', title: 'Activity & Sensory Play Kit', amount: 3500),
        FeeLineItem(id: '3', title: 'Air-Conditioned Bus Route #12', amount: 6500),
      ],
      subtotal: 28000,
      dueDate: '2026-10-15',
      fineAccumulated: 0,
      totalPayable: 28000,
      amountPaid: 28000,
      status: 'paid',
      receiptNumber: 'REC-2026-0891',
      paymentDate: '2026-10-05',
      paymentMode: 'Razorpay UPI',
      transactionRef: 'RZP_TXN_88192039',
    ),
    InvoiceModel(
      invoiceId: 'INV-2026-Q2-342',
      studentName: 'Rohan Sharma',
      classId: 'CLS_05',
      className: 'Class 5-B (Primary)',
      term: 'Quarter 2 (Jul - Sep 2026)',
      lineItems: const [
        FeeLineItem(id: '1', title: 'Primary Tuition Fee', amount: 22000),
        FeeLineItem(id: '2', title: 'Junior Science & STEM Lab', amount: 4000),
        FeeLineItem(id: '3', title: 'Digital Library & Sports Council', amount: 2500),
        FeeLineItem(id: '4', title: 'Bus Route #12', amount: 6500),
      ],
      subtotal: 35000,
      dueDate: '2026-10-15',
      fineAccumulated: 0,
      totalPayable: 35000,
      amountPaid: 35000,
      status: 'paid',
      receiptNumber: 'REC-2026-0342',
      paymentDate: '2026-10-06',
      paymentMode: 'HDFC NetBanking',
      transactionRef: 'HDFC_NBF_9120194',
    ),
    InvoiceModel(
      invoiceId: 'INV-2026-Q2-101',
      studentName: 'Aarav Sharma',
      classId: 'CLS_11',
      className: 'Class 11-A (Science PCM)',
      term: 'Quarter 2 (Jul - Sep 2026)',
      lineItems: const [
        FeeLineItem(id: '1', title: 'Tuition Fee (Sr. Secondary Science)', amount: 32000),
        FeeLineItem(id: '2', title: 'Physics, Chem & CS Lab Consumables', amount: 7500),
        FeeLineItem(id: '3', title: 'CBSE Board Reg & Exam Fee', amount: 4500),
        FeeLineItem(id: '4', title: 'AC Transport Route #12', amount: 6500),
      ],
      subtotal: 50500,
      dueDate: '2026-10-01',
      fineAccumulated: 450,
      totalPayable: 50950,
      amountPaid: 0,
      status: 'pending',
    ),
    InvoiceModel(
      invoiceId: 'INV-2026-Q2-102',
      studentName: 'Kabir Mehta',
      classId: 'CLS_11',
      className: 'Class 11-A (Science PCM)',
      term: 'Quarter 2 (Jul - Sep 2026)',
      lineItems: const [
        FeeLineItem(id: '1', title: 'Tuition Fee (Sr. Secondary Science)', amount: 32000),
        FeeLineItem(id: '2', title: 'Science Lab Consumables', amount: 7500),
        FeeLineItem(id: '3', title: 'AC Transport Route #12', amount: 6500),
      ],
      subtotal: 46000,
      dueDate: '2026-10-01',
      fineAccumulated: 500,
      totalPayable: 46500,
      amountPaid: 0,
      status: 'pending',
    ),
    InvoiceModel(
      invoiceId: 'INV-2026-Q2-103',
      studentName: 'Dia Patel',
      classId: 'CLS_11',
      className: 'Class 11-A (Science PCM)',
      term: 'Quarter 2 (Jul - Sep 2026)',
      lineItems: const [
        FeeLineItem(id: '1', title: 'Tuition Fee (Sr. Secondary Science)', amount: 32000),
        FeeLineItem(id: '2', title: 'Science Lab Consumables', amount: 7500),
        FeeLineItem(id: '3', title: 'Annual Sports & Library Fee', amount: 4500),
      ],
      subtotal: 44000,
      dueDate: '2026-10-10',
      fineAccumulated: 0,
      totalPayable: 44000,
      amountPaid: 0,
      status: 'pending',
    ),
  ];

  // Petty cash records matching preview app
  final List<PettyCashModel> _pettyCashList = [
    const PettyCashModel(
      id: 'PC_01',
      time: '09:45 AM',
      description: 'CBSE Secondary Exam Circular Printing Paper & Toner',
      category: 'office_supplies',
      amount: 1450,
      voucherNo: 'VCH-2026-042',
    ),
    const PettyCashModel(
      id: 'PC_02',
      time: '11:15 AM',
      description: 'Faculty Meeting Refreshment & Drinking Water Cans',
      category: 'refreshment',
      amount: 680,
      voucherNo: 'VCH-2026-043',
    ),
    const PettyCashModel(
      id: 'PC_03',
      time: '02:00 PM',
      description: 'Speed Post Dispatch: CBSE Affiliation Compliance Dossier',
      category: 'courier',
      amount: 320,
      voucherNo: 'VCH-2026-044',
    ),
  ];

  // Enrolled students matching preview app
  final List<EnrolledStudentModel> _enrolledStudents = [
    EnrolledStudentModel(
      id: 'STU_1',
      fullName: 'Aarav Sharma',
      classId: 'CLS_11',
      className: 'Class 11-A (Science PCM)',
      admissionNo: 'ADM-2015-089',
      rollNo: 'Roll No. 01',
      parentName: 'Vikram Sharma',
      parentPhone: '+91 98765 43210',
      tuitionFee: 50950,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      admissionDate: '2026-04-12',
      bloodGroup: 'B+',
    ),
    EnrolledStudentModel(
      id: 'STU_2',
      fullName: 'Rohan Sharma',
      classId: 'CLS_05',
      className: 'Class 5-B (Primary)',
      admissionNo: 'ADM-2026-0342',
      rollNo: 'Roll No. 12',
      parentName: 'Rajesh Sharma',
      parentPhone: '+91 99887 76655',
      tuitionFee: 35000,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      admissionDate: '2026-04-10',
      bloodGroup: 'O+',
    ),
    EnrolledStudentModel(
      id: 'STU_3',
      fullName: 'Ananya Sharma',
      classId: 'CLS_NURSERY',
      className: 'Nursery (Pre-Primary)',
      admissionNo: 'ADM-2026-0089',
      rollNo: 'Roll No. 05',
      parentName: 'Sunita Sharma',
      parentPhone: '+91 99887 76655',
      tuitionFee: 28000,
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
      admissionDate: '2026-04-15',
      bloodGroup: 'A+',
    ),
    EnrolledStudentModel(
      id: 'STU_4',
      fullName: 'Kabir Mehta',
      classId: 'CLS_11',
      className: 'Class 11-A (Science PCM)',
      admissionNo: 'ADM-2015-125',
      rollNo: 'Roll No. 02',
      parentName: 'Sanjay Mehta',
      parentPhone: '+91 99222 33445',
      tuitionFee: 52500,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      admissionDate: '2026-04-05',
      bloodGroup: 'AB+',
    ),
    EnrolledStudentModel(
      id: 'STU_5',
      fullName: 'Dia Patel',
      classId: 'CLS_11',
      className: 'Class 11-A (Science PCM)',
      admissionNo: 'ADM-2018-092',
      rollNo: 'Roll No. 03',
      parentName: 'Manish Patel',
      parentPhone: '+91 99111 22334',
      tuitionFee: 52500,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      admissionDate: '2026-04-08',
      bloodGroup: 'A+',
    ),
  ];

  // Active Staff Members eligible for payroll & management
  final List<StaffMemberModel> _staffRoster = [
    const StaffMemberModel(
      id: 'CRED_PRIN_01',
      fullName: 'Dr. Alok Verma',
      role: 'principal',
      roleTitle: 'Principal & Head of School',
      department: 'Executive Directorate',
      employeeId: 'EMP-PRIN-001',
      defaultBaseSalary: 125000,
      phoneNumber: '+91 98765 43210',
      email: 'principal@edupulse.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    ),
    const StaffMemberModel(
      id: 'CRED_TCH_01',
      fullName: 'Dr. Ananya Sen',
      role: 'teacher',
      roleTitle: 'Senior Physics Faculty (PGT)',
      department: 'Senior Physics & Mathematics',
      employeeId: 'EMP-TCH-102',
      defaultBaseSalary: 65000,
      phoneNumber: '+91 98112 77889',
      email: 'ananya.sen@edupulse.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    ),
    const StaffMemberModel(
      id: 'CRED_CT_01',
      fullName: 'Ms. Priya Sharma',
      role: 'class_teacher',
      roleTitle: 'Class 11-A In-Charge & Faculty',
      department: 'Class 11-A / Science',
      employeeId: 'EMP-CT-204',
      defaultBaseSalary: 55000,
      phoneNumber: '+91 98112 23344',
      email: 'priya.sharma@edupulse.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150',
    ),
    const StaffMemberModel(
      id: 'CRED_ACC_01',
      fullName: 'Mr. Vikram Goel',
      role: 'accountant',
      roleTitle: 'Senior Accounts Officer & Bursar',
      department: 'Finance & Bursar Desk',
      employeeId: 'EMP-ACC-301',
      defaultBaseSalary: 45000,
      phoneNumber: '+91 97654 32109',
      email: 'vikram.goel@edupulse.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    ),
    const StaffMemberModel(
      id: 'CRED_PEON_01',
      fullName: 'Ramesh Kumar',
      role: 'peon',
      roleTitle: 'Head Office Attendant & Peon',
      department: 'Support Services / Admin',
      employeeId: 'EMP-PEON-001',
      defaultBaseSalary: 16500,
      phoneNumber: '+91 98450 11223',
      email: 'ramesh.kumar@edupulse.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    ),
    const StaffMemberModel(
      id: 'CRED_MAID_01',
      fullName: 'Sunita Devi',
      role: 'maid',
      roleTitle: 'Housekeeping & Nursery Caretaker',
      department: 'Pre-Primary & Hygiene',
      employeeId: 'EMP-MAID-001',
      defaultBaseSalary: 14500,
      phoneNumber: '+91 98711 44556',
      email: 'sunita.devi@edupulse.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    ),
    const StaffMemberModel(
      id: 'CRED_SEC_01',
      fullName: 'Baldev Singh',
      role: 'security_guard',
      roleTitle: 'Chief Gate Security Officer',
      department: 'Campus Security',
      employeeId: 'EMP-SEC-001',
      defaultBaseSalary: 17500,
      phoneNumber: '+91 98223 66778',
      email: 'baldev.singh@edupulse.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    ),
    const StaffMemberModel(
      id: 'CRED_DRV_01',
      fullName: 'Gurpreet Singh',
      role: 'driver',
      roleTitle: 'Senior Bus Route #12 Operator',
      department: 'Transport Division',
      employeeId: 'EMP-DRV-001',
      defaultBaseSalary: 19000,
      phoneNumber: '+91 98111 88990',
      email: 'gurpreet.singh@edupulse.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    ),
  ];

  // Staff Salary Records (matching preview store)
  final List<StaffSalaryRecord> _salaryRecords = [
    const StaffSalaryRecord(
      id: 'SAL_01',
      staffName: 'Dr. Alok Verma',
      role: 'principal',
      roleTitle: 'Principal & Head of School',
      departmentOrClass: 'Executive Directorate',
      employeeId: 'EMP-PRIN-001',
      baseSalary: 125000,
      bonus: 15000,
      deductions: 5000,
      netSalary: 135000,
      month: 'September 2026',
      paymentMode: 'Bank Transfer (NEFT)',
      status: 'Paid',
      paymentDate: '2026-10-01',
      voucherNo: 'VCH-SAL-2026-081',
      remarks: 'Monthly Executive Principal Emoluments + Administrative Allowance',
      disbursedBy: 'Super Admin Management Board',
    ),
    const StaffSalaryRecord(
      id: 'SAL_02',
      staffName: 'Dr. Ananya Sen',
      role: 'teacher',
      roleTitle: 'Senior Physics Faculty (PGT)',
      departmentOrClass: 'Senior Physics & Mathematics',
      employeeId: 'EMP-TCH-102',
      baseSalary: 65000,
      bonus: 5000,
      deductions: 2500,
      netSalary: 67500,
      month: 'September 2026',
      paymentMode: 'Bank Transfer (NEFT)',
      status: 'Paid',
      paymentDate: '2026-10-01',
      voucherNo: 'VCH-SAL-2026-082',
      remarks: 'Physics PGT Salary & Science Lab In-Charge Allowance',
      disbursedBy: 'Dr. Alok Verma (Principal)',
    ),
    const StaffSalaryRecord(
      id: 'SAL_03',
      staffName: 'Ms. Priya Sharma',
      role: 'class_teacher',
      roleTitle: 'Class 11-A In-Charge & Faculty',
      departmentOrClass: 'Class 11-A / Science',
      employeeId: 'EMP-CT-204',
      baseSalary: 55000,
      bonus: 3000,
      deductions: 2000,
      netSalary: 56000,
      month: 'September 2026',
      paymentMode: 'Bank Transfer (NEFT)',
      status: 'Paid',
      paymentDate: '2026-10-01',
      voucherNo: 'VCH-SAL-2026-083',
      remarks: 'Class Teacher Supervisor Allowance + Academic Salary',
      disbursedBy: 'Dr. Alok Verma (Principal)',
    ),
    const StaffSalaryRecord(
      id: 'SAL_04',
      staffName: 'Mr. Vikram Goel',
      role: 'accountant',
      roleTitle: 'Senior Accounts Officer & Bursar',
      departmentOrClass: 'Finance & Bursar Desk',
      employeeId: 'EMP-ACC-301',
      baseSalary: 45000,
      bonus: 3500,
      deductions: 1500,
      netSalary: 47000,
      month: 'September 2026',
      paymentMode: 'Bank Transfer (NEFT)',
      status: 'Paid',
      paymentDate: '2026-10-01',
      voucherNo: 'VCH-SAL-2026-084',
      remarks: 'Fee Audit & Accounts Reconciliation Payout',
      disbursedBy: 'Super Admin Management Board',
    ),
    const StaffSalaryRecord(
      id: 'SAL_05',
      staffName: 'Ramesh Kumar',
      role: 'peon',
      roleTitle: 'Head Office Attendant & Peon',
      departmentOrClass: 'Support Services / Admin',
      employeeId: 'EMP-PEON-001',
      baseSalary: 14000,
      bonus: 1000,
      deductions: 0,
      netSalary: 15000,
      month: 'September 2026',
      paymentMode: 'Cash Register',
      status: 'Paid',
      paymentDate: '2026-10-01',
      voucherNo: 'VCH-SAL-2026-085',
      remarks: 'Overtime Bell Duty & Exam Dispatch Support',
      disbursedBy: 'Mr. Vikram Goel (Accountant)',
    ),
    const StaffSalaryRecord(
      id: 'SAL_06',
      staffName: 'Sunita Devi',
      role: 'maid',
      roleTitle: 'Housekeeping & Nursery Caretaker',
      departmentOrClass: 'Pre-Primary & Hygiene',
      employeeId: 'EMP-MAID-001',
      baseSalary: 13000,
      bonus: 500,
      deductions: 0,
      netSalary: 13500,
      month: 'September 2026',
      paymentMode: 'Cash Register',
      status: 'Paid',
      paymentDate: '2026-10-01',
      voucherNo: 'VCH-SAL-2026-086',
      remarks: 'Pre-Primary Early Morning Sanitization Incentive',
      disbursedBy: 'Mr. Vikram Goel (Accountant)',
    ),
    const StaffSalaryRecord(
      id: 'SAL_07',
      staffName: 'Baldev Singh',
      role: 'security_guard',
      roleTitle: 'Chief Gate Security Officer',
      departmentOrClass: 'Campus Security',
      employeeId: 'EMP-SEC-001',
      baseSalary: 16000,
      bonus: 1500,
      deductions: 0,
      netSalary: 17500,
      month: 'September 2026',
      paymentMode: 'Cash Register',
      status: 'Paid',
      paymentDate: '2026-10-01',
      voucherNo: 'VCH-SAL-2026-087',
      remarks: 'Night Vigil Shift Allowance',
      disbursedBy: 'Mr. Vikram Goel (Accountant)',
    ),
    const StaffSalaryRecord(
      id: 'SAL_08',
      staffName: 'Gurpreet Singh',
      role: 'driver',
      roleTitle: 'Senior Bus Route #12 Operator',
      departmentOrClass: 'Transport Division',
      employeeId: 'EMP-DRV-001',
      baseSalary: 18000,
      bonus: 2000,
      deductions: 0,
      netSalary: 20000,
      month: 'September 2026',
      paymentMode: 'Bank Transfer (NEFT)',
      status: 'Paid',
      paymentDate: '2026-10-01',
      voucherNo: 'VCH-SAL-2026-088',
      remarks: 'Zero-Incident Safe Driving Route Bonus',
      disbursedBy: 'Dr. Alok Verma (Principal)',
    ),
  ];

  // Directives matching preview app
  final List<AccountsDirective> _directives = [
    AccountsDirective(
      id: 'DIR_01',
      title: 'Q2 Fee Collection & Defaulter Notice Dispatch',
      priority: 'urgent',
      deadline: '2026-10-20',
      instructions:
          'Audit all pending Class 11-A and Pre-Primary accounts. Transmit automated reminder circulars via WhatsApp and SMS gateway.',
      isCompleted: false,
    ),
    AccountsDirective(
      id: 'DIR_02',
      title: 'CBSE Affiliation Fee & Audit Clearance Dossier',
      priority: 'high',
      deadline: '2026-10-28',
      instructions:
          'Compile physical vault day book, bank statement reconciliation, and audited ledger for official statutory submission.',
      isCompleted: false,
    ),
  ];

  @override
  void dispose() {
    _posTenderedController.dispose();
    _posNotesController.dispose();
    _admNameController.dispose();
    _admRollController.dispose();
    _admParentNameController.dispose();
    _admPhoneController.dispose();
    _admFeeController.dispose();
    _admPhotoController.dispose();
    _admCustomNoController.dispose();
    _pettyDescController.dispose();
    _pettyAmountController.dispose();
    super.dispose();
  }

  void _showToast(String msg) {
    setState(() => _toastMessage = msg);
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) setState(() => _toastMessage = null);
    });
  }

  void _settleInvoiceAtCounter(String invoiceId) {
    final idx = _invoices.indexWhere((i) => i.invoiceId == invoiceId);
    if (idx != -1) {
      setState(() {
        _invoices[idx].status = 'paid';
        _invoices[idx].amountPaid = _invoices[idx].totalPayable;
        _invoices[idx].paymentDate = DateFormat('yyyy-MM-dd').format(DateTime.now());
        _invoices[idx].paymentMode = 'Cash Counter';
        _invoices[idx].receiptNumber = 'REC-2026-${1000 + DateTime.now().millisecond}';
        _invoices[idx].transactionRef = 'CSH_${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
      });
      _showToast('Invoice $invoiceId settled successfully at counter! Official receipt generated.');
      _showReceiptDialog(_invoices[idx]);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Financial Aggregates
    final totalBilled = _invoices.fold<double>(0, (sum, i) => sum + i.totalPayable);
    final totalCollected = _invoices.fold<double>(0, (sum, i) => sum + i.amountPaid);
    final totalOutstanding = totalBilled - totalCollected;
    final totalFines = _invoices.fold<double>(0, (sum, i) => sum + i.fineAccumulated);
    final paidCount = _invoices.where((i) => i.status == 'paid').length;
    final pendingCount = _invoices.where((i) => i.status == 'pending').length;
    final collectionRate = totalBilled > 0
        ? ((totalCollected / totalBilled) * 100).toStringAsFixed(1)
        : '0.0';

    const double cashVaultOpening = 25000;
    final totalPettyDisbursed = _pettyCashList.fold<double>(0, (sum, p) => sum + p.amount);
    final cashVaultCurrent = cashVaultOpening + totalCollected - totalPettyDisbursed;

    // Filter invoices
    final filteredInvoices = _invoices.where((inv) {
      final matchesSearch = _ledgerSearch.isEmpty ||
          inv.studentName.toLowerCase().contains(_ledgerSearch.toLowerCase()) ||
          inv.invoiceId.toLowerCase().contains(_ledgerSearch.toLowerCase()) ||
          inv.className.toLowerCase().contains(_ledgerSearch.toLowerCase()) ||
          (inv.receiptNumber != null &&
              inv.receiptNumber!.toLowerCase().contains(_ledgerSearch.toLowerCase()));
      final matchesStatus = _statusFilter == 'all' || inv.status == _statusFilter;
      final matchesClass = _classFilter == 'all' || inv.classId == _classFilter;
      return matchesSearch && matchesStatus && matchesClass;
    }).toList();

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
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // =========================================================
                // 1. TOP PROFESSIONAL EXECUTIVE BURSAR BANNER
                // =========================================================
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF0F172A), Color(0xFF4C0519), Color(0xFF020617)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF881337).withOpacity(0.5)),
                    boxShadow: const [
                      BoxShadow(color: Colors.black26, blurRadius: 10, offset: Offset(0, 4)),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Badge Pill
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFE11D48).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFFDA4AF).withOpacity(0.3)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.receipt_long, size: 12, color: Color(0xFFFDA4AF)),
                            const SizedBox(width: 4),
                            const Text(
                              'Central Bursar & Finance Desk',
                              style: TextStyle(
                                color: Color(0xFFFDA4AF),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(width: 5),
                            Container(
                              width: 6,
                              height: 6,
                              decoration: const BoxDecoration(
                                color: Color(0xFF34D399),
                                shape: BoxShape.circle,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 6),

                      // Title & Subtitle + Right Actions
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Institutional Accounts Console',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 17,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: -0.3,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'Fee collection, cash register, real-time ledger & parent invoicing.',
                                  style: TextStyle(
                                    color: Color(0xFFCBD5E1),
                                    fontSize: 11,
                                    height: 1.25,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),

                          // Vault Pill
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF1E293B).withOpacity(0.9),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: const Color(0xFF334155)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                const Text(
                                  'Till #1 Vault',
                                  style: TextStyle(color: Color(0xFF94A3B8), fontSize: 9),
                                ),
                                Text(
                                  '₹${NumberFormat('#,##,###').format(cashVaultCurrent)}',
                                  style: const TextStyle(
                                    color: Color(0xFF34D399),
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    fontFamily: 'monospace',
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 6),

                          // Export CSV button
                          InkWell(
                            onTap: () {
                              _showToast('Official Fee Ledger CSV generated & saved to downloads!');
                            },
                            borderRadius: BorderRadius.circular(8),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 7),
                              decoration: BoxDecoration(
                                color: const Color(0xFFE11D48),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Row(
                                children: [
                                  Icon(Icons.download_rounded, size: 13, color: Colors.white),
                                  SizedBox(width: 2),
                                  Text(
                                    'Export CSV',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 4),

                          // Logout button
                          IconButton(
                            icon: const Icon(Icons.logout_rounded, color: Colors.white70, size: 20),
                            tooltip: 'Sign Out / Exit App',
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                            onPressed: () {
                              AuthDialogUtils.showSignOutOrExitBottomSheet(context, ref);
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Toast Feedback
                if (_toastMessage != null) ...[
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFA7F3D0)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle_rounded, color: Color(0xFF059669), size: 16),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _toastMessage!,
                            style: const TextStyle(
                              color: Color(0xFF065F46),
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

                const SizedBox(height: 12),

                // =========================================================
                // 2. 8-BUTTON NAVIGATION SWITCHER (2 ROWS OF 4)
                // =========================================================
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: const [
                      BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
                    ],
                  ),
                  child: Column(
                    children: [
                      // Row 1: 4 Buttons
                      Row(
                        children: [
                          Expanded(
                            child: _buildNavButton(
                              id: 'ledger',
                              label: 'Fee Ledger (${_invoices.length})',
                              icon: Icons.receipt_long_rounded,
                              activeColor: const Color(0xFFE11D48),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _buildNavButton(
                              id: 'pos',
                              label: 'Counter POS',
                              icon: Icons.credit_card_rounded,
                              activeColor: const Color(0xFFE11D48),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _buildNavButton(
                              id: 'defaulters',
                              label: 'Defaulters ($pendingCount)',
                              icon: Icons.warning_amber_rounded,
                              activeColor: const Color(0xFFE11D48),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _buildNavButton(
                              id: 'admissions',
                              label: 'New Admission (${_enrolledStudents.length})',
                              icon: Icons.person_add_rounded,
                              activeColor: const Color(0xFF059669),
                              hasBadgeDot: true,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),

                      // Row 2: 4 Buttons
                      Row(
                        children: [
                          Expanded(
                            child: _buildNavButton(
                              id: 'staff_salary',
                              label: 'Staff Salary Report (${_salaryRecords.length})',
                              icon: Icons.payments_rounded,
                              activeColor: const Color(0xFF4F46E5),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _buildNavButton(
                              id: 'daybook',
                              label: 'Day Book & Vault',
                              icon: Icons.account_balance_wallet_rounded,
                              activeColor: const Color(0xFFE11D48),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _buildNavButton(
                              id: 'analytics',
                              label: 'Financial Analytics',
                              icon: Icons.trending_up_rounded,
                              activeColor: const Color(0xFFE11D48),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _buildNavButton(
                              id: 'directives',
                              label: 'Directives (${_directives.length})',
                              icon: Icons.security_rounded,
                              activeColor: const Color(0xFFE11D48),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 14),

                // =========================================================
                // 3. TAB VIEWS (EXACTLY MATCHING PREVIEW APP)
                // =========================================================
                if (_activeTab == 'ledger')
                  _buildFeeLedgerTab(filteredInvoices)
                else if (_activeTab == 'pos')
                  _buildCounterPosTab()
                else if (_activeTab == 'defaulters')
                  _buildDefaultersTab()
                else if (_activeTab == 'admissions')
                  _buildAdmissionsTab()
                else if (_activeTab == 'staff_salary')
                  _buildStaffSalaryTab()
                else if (_activeTab == 'daybook')
                  _buildDayBookTab(cashVaultOpening, totalCollected, totalPettyDisbursed, cashVaultCurrent)
                else if (_activeTab == 'analytics')
                  _buildAnalyticsTab(totalBilled, totalCollected, totalOutstanding)
                else if (_activeTab == 'directives')
                  _buildDirectivesTab(),

                const SizedBox(height: 16),

                // =========================================================
                // 4. BOTTOM 4 KPI FINANCIAL METRIC SUMMARY CARDS
                // Total Invoiced, Realized Collection, Outstanding Dues, Late Penalties
                // (Matches preview app bottom cards)
                // =========================================================
                _buildKpiSummaryCards(
                  totalBilled: totalBilled,
                  totalCollected: totalCollected,
                  totalOutstanding: totalOutstanding,
                  totalFines: totalFines,
                  collectionRate: collectionRate,
                  paidCount: paidCount,
                  pendingCount: pendingCount,
                ),

                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // HELPER: NAVIGATION BUTTON
  // =========================================================================
  Widget _buildNavButton({
    required String id,
    required String label,
    required IconData icon,
    required Color activeColor,
    bool hasBadgeDot = false,
  }) {
    final isSelected = _activeTab == id;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => setState(() => _activeTab = id),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? activeColor : const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? activeColor : const Color(0xFFE2E8F0),
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: activeColor.withOpacity(0.3),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    icon,
                    size: 14,
                    color: isSelected ? Colors.white : const Color(0xFF475569),
                  ),
                  if (hasBadgeDot) ...[
                    const SizedBox(width: 3),
                    Container(
                      width: 5,
                      height: 5,
                      decoration: BoxDecoration(
                        color: isSelected ? Colors.white : const Color(0xFF10B981),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 3),
              Text(
                label,
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: isSelected ? Colors.white : const Color(0xFF334155),
                  fontSize: 10,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                  height: 1.1,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // TAB 1: STUDENT INVOICES & FEE LEDGER
  // =========================================================================
  Widget _buildFeeLedgerTab(List<InvoiceModel> invoicesList) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Section Title
          const Row(
            children: [
              Icon(Icons.receipt_long_rounded, color: Color(0xFFE11D48), size: 18),
              SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Student Fee Invoices & Collection Ledger',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                    ),
                    Text(
                      'Filter by status, search admission numbers, or settle pending fees at counter.',
                      style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Search & Filter Bar
          Row(
            children: [
              Expanded(
                flex: 3,
                child: TextField(
                  onChanged: (val) => setState(() => _ledgerSearch = val),
                  decoration: InputDecoration(
                    hintText: 'Search student, invoice...',
                    hintStyle: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                    prefixIcon: const Icon(Icons.search, size: 16, color: Color(0xFF94A3B8)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                    ),
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                  ),
                  style: const TextStyle(fontSize: 12),
                ),
              ),
              const SizedBox(width: 8),
              DropdownButton<String>(
                value: _statusFilter,
                underline: const SizedBox(),
                items: const [
                  DropdownMenuItem(value: 'all', child: Text('All Status', style: TextStyle(fontSize: 11))),
                  DropdownMenuItem(value: 'pending', child: Text('Pending Only', style: TextStyle(fontSize: 11))),
                  DropdownMenuItem(value: 'paid', child: Text('Settled Only', style: TextStyle(fontSize: 11))),
                ],
                onChanged: (v) => setState(() => _statusFilter = v ?? 'all'),
              ),
              const SizedBox(width: 6),
              DropdownButton<String>(
                value: _classFilter,
                underline: const SizedBox(),
                items: const [
                  DropdownMenuItem(value: 'all', child: Text('All Grades', style: TextStyle(fontSize: 11))),
                  DropdownMenuItem(value: 'CLS_NURSERY', child: Text('Nursery', style: TextStyle(fontSize: 11))),
                  DropdownMenuItem(value: 'CLS_05', child: Text('Class 5-B', style: TextStyle(fontSize: 11))),
                  DropdownMenuItem(value: 'CLS_11', child: Text('Class 11-A', style: TextStyle(fontSize: 11))),
                ],
                onChanged: (v) => setState(() => _classFilter = v ?? 'all'),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Table / Cards View
          if (invoicesList.isEmpty)
            const Padding(
              padding: EdgeInsets.all(24.0),
              child: Center(
                child: Text(
                  'No invoices match the selected search criteria.',
                  style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                ),
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: invoicesList.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final inv = invoicesList[index];
                final isPending = inv.status == 'pending';
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Text(
                                inv.invoiceId,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                  fontFamily: 'monospace',
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: isPending ? const Color(0xFFFEF2F2) : const Color(0xFFECFDF5),
                                  borderRadius: BorderRadius.circular(4),
                                  border: Border.all(
                                    color: isPending ? const Color(0xFFFECACA) : const Color(0xFFA7F3D0),
                                  ),
                                ),
                                child: Text(
                                  inv.status.toUpperCase(),
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 10,
                                    color: isPending ? const Color(0xFFDC2626) : const Color(0xFF059669),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          Text(
                            '₹${NumberFormat('#,##,###').format(inv.totalPayable)}',
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 14,
                              fontFamily: 'monospace',
                              color: isPending ? const Color(0xFFDC2626) : const Color(0xFF0F172A),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '${inv.studentName} • ${inv.className}',
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Color(0xFF334155)),
                          ),
                          Text(
                            'Due: ${inv.dueDate}',
                            style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                      if (inv.fineAccumulated > 0) ...[
                        const SizedBox(height: 2),
                        Text(
                          'Subtotal: ₹${NumberFormat('#,##,###').format(inv.subtotal)}  |  Late Fine: +₹${inv.fineAccumulated.toInt()}',
                          style: const TextStyle(fontSize: 11, color: Color(0xFFDC2626)),
                        ),
                      ],
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (isPending) ...[
                            ElevatedButton.icon(
                              onPressed: () => _settleInvoiceAtCounter(inv.invoiceId),
                              icon: const Icon(Icons.point_of_sale, size: 14),
                              label: const Text('Counter Settle', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFE11D48),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                              ),
                            ),
                          ] else ...[
                            OutlinedButton.icon(
                              onPressed: () => _showReceiptDialog(inv),
                              icon: const Icon(Icons.print, size: 14),
                              label: const Text('View Receipt', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: const Color(0xFF334155),
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                              ),
                            ),
                          ],
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

  // =========================================================================
  // TAB 2: COUNTER POS TERMINAL
  // =========================================================================
  Widget _buildCounterPosTab() {
    final pendingInvoices = _invoices.where((i) => i.status == 'pending').toList();
    final selectedInv = _invoices.firstWhere(
      (i) => i.invoiceId == _posSelectedInvoiceId,
      orElse: () => pendingInvoices.isNotEmpty ? pendingInvoices.first : _invoices.first,
    );

    final double tendered = double.tryParse(_posTenderedController.text) ?? 0;
    final double change = tendered >= selectedInv.totalPayable ? tendered - selectedInv.totalPayable : 0;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.credit_card_rounded, color: Color(0xFFE11D48), size: 18),
                  SizedBox(width: 8),
                  Text('Counter POS Cashier Terminal', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: const Text('POS Till Active', style: TextStyle(fontSize: 10, color: Color(0xFF059669), fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 12),

          const Text('Select Student with Outstanding Dues', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 6),
          DropdownButtonFormField<String>(
            value: _posSelectedInvoiceId ?? (pendingInvoices.isNotEmpty ? pendingInvoices.first.invoiceId : null),
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              filled: true,
              fillColor: const Color(0xFFF8FAFC),
            ),
            items: _invoices.map((i) {
              return DropdownMenuItem(
                value: i.invoiceId,
                child: Text('${i.studentName} (${i.className}) • Due: ₹${NumberFormat('#,##,###').format(i.totalPayable)} [${i.status.toUpperCase()}]', style: const TextStyle(fontSize: 12)),
              );
            }).toList(),
            onChanged: (v) {
              setState(() {
                _posSelectedInvoiceId = v;
                final inv = _invoices.firstWhere((item) => item.invoiceId == v);
                _posTenderedController.text = inv.totalPayable.toInt().toString();
              });
            },
          ),
          const SizedBox(height: 12),

          // Fee line items breakdown card
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(selectedInv.studentName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text(selectedInv.invoiceId, style: const TextStyle(fontSize: 11, fontFamily: 'monospace', color: Color(0xFF64748B))),
                  ],
                ),
                const Divider(),
                ...selectedInv.lineItems.map(
                  (item) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 2.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(item.title, style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                        Text('₹${NumberFormat('#,##,###').format(item.amount)}', style: const TextStyle(fontSize: 11, fontFamily: 'monospace')),
                      ],
                    ),
                  ),
                ),
                if (selectedInv.fineAccumulated > 0)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 2.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Accumulated Late Fine', style: TextStyle(fontSize: 11, color: Color(0xFFDC2626), fontWeight: FontWeight.bold)),
                        Text('+₹${selectedInv.fineAccumulated.toInt()}', style: const TextStyle(fontSize: 11, color: Color(0xFFDC2626), fontFamily: 'monospace')),
                      ],
                    ),
                  ),
                const Divider(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total Net Payable:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF991B1B))),
                    Text(
                      '₹${NumberFormat('#,##,###').format(selectedInv.totalPayable)}',
                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF991B1B), fontFamily: 'monospace'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Payment mode selector
          const Text('Payment Mode', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 6),
          Row(
            children: [
              _buildPosModeButton('cash', 'Cash Counter', Icons.payments_rounded),
              const SizedBox(width: 6),
              _buildPosModeButton('upi', 'UPI QR Code', Icons.qr_code_rounded),
              const SizedBox(width: 6),
              _buildPosModeButton('card', 'Debit/Credit POS', Icons.credit_card_rounded),
              const SizedBox(width: 6),
              _buildPosModeButton('cheque', 'Cheque / DD', Icons.receipt_rounded),
            ],
          ),
          const SizedBox(height: 12),

          // Tendered cash & Change to return
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _posTenderedController,
                  keyboardType: TextInputType.number,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    labelText: 'Tendered Cash (₹)',
                    labelStyle: const TextStyle(fontSize: 11),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                  decoration: BoxDecoration(
                    color: change > 0 ? const Color(0xFFECFDF5) : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: change > 0 ? const Color(0xFFA7F3D0) : const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Change to Return', style: TextStyle(fontSize: 9, color: Color(0xFF64748B))),
                      Text(
                        '₹${NumberFormat('#,##,###').format(change)}',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: change > 0 ? const Color(0xFF059669) : const Color(0xFF334155),
                          fontFamily: 'monospace',
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          ElevatedButton.icon(
            onPressed: () {
              _settleInvoiceAtCounter(selectedInv.invoiceId);
            },
            icon: const Icon(Icons.check_circle, size: 16),
            label: const Text('Collect Payment & Print E-Receipt', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE11D48),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPosModeButton(String modeKey, String label, IconData icon) {
    final isSelected = _posPaymentMethod == modeKey;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _posPaymentMethod = modeKey),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFBE123C) : const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: isSelected ? const Color(0xFFBE123C) : const Color(0xFFCBD5E1)),
          ),
          child: Column(
            children: [
              Icon(icon, size: 14, color: isSelected ? Colors.white : const Color(0xFF475569)),
              const SizedBox(height: 2),
              Text(
                label,
                style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: isSelected ? Colors.white : const Color(0xFF334155)),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // TAB 3: DEFAULTERS LIST
  // =========================================================================
  Widget _buildDefaultersTab() {
    final defaulters = _invoices.where((i) => i.status == 'pending').toList();
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              const Icon(Icons.warning_amber_rounded, color: Color(0xFFD97706), size: 18),
              const SizedBox(width: 8),
              Text('Pending Fee Defaulters (${defaulters.length})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 10),
          if (defaulters.isEmpty)
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Center(child: Text('No defaulters! All quarterly dues are settled.', style: TextStyle(color: Color(0xFF059669)))),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: defaulters.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, idx) {
                final d = defaulters[idx];
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFFBEB),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFFFDE68A)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(d.studentName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            Text('${d.className} • Overdue by 9 days (Fine: ₹${d.fineAccumulated.toInt()})', style: const TextStyle(fontSize: 11, color: Color(0xFFB45309))),
                            Text('Owed: ₹${NumberFormat('#,##,###').format(d.totalPayable)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFFDC2626))),
                          ],
                        ),
                      ),
                      Row(
                        children: [
                          ElevatedButton.icon(
                            onPressed: () {
                              _showToast('Fee notice dispatched to parent of ${d.studentName} via SMS & WhatsApp!');
                            },
                            icon: const Icon(Icons.send, size: 12),
                            label: const Text('Send Notice', style: TextStyle(fontSize: 11)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFD97706),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            ),
                          ),
                          const SizedBox(width: 6),
                          ElevatedButton(
                            onPressed: () => _settleInvoiceAtCounter(d.invoiceId),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFE11D48),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            ),
                            child: const Text('Settle', style: TextStyle(fontSize: 11)),
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

  // =========================================================================
  // TAB 4: NEW ADMISSION DESK (NAVEEEN CHHATRA PRAVESH)
  // =========================================================================
  Widget _buildAdmissionsTab() {
    final filteredStudents = _enrolledStudents.where((s) {
      if (_admSearchQuery.isEmpty) return true;
      final q = _admSearchQuery.toLowerCase();
      return s.fullName.toLowerCase().contains(q) ||
          s.admissionNo.toLowerCase().contains(q) ||
          s.className.toLowerCase().contains(q) ||
          s.parentName.toLowerCase().contains(q);
    }).toList();

    final selectedClassOpt = _classOptions.firstWhere(
      (c) => c.id == _admClassId,
      orElse: () => _classOptions.first,
    );

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header Card
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.person_add_rounded, color: Color(0xFF059669), size: 18),
                  SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'New Student Admission & Class Sync (नवीन छात्र प्रवेश)',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                      ),
                      Text(
                        'Auto-syncs with Class Teacher roster, attendance & ledger.',
                        style: TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: Text('Total Enrolled: ${_enrolledStudents.length}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF059669))),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Admission Entry Form Card
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFCBD5E1)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Row(
                  children: [
                    Icon(Icons.edit_note_rounded, size: 16, color: Color(0xFF059669)),
                    SizedBox(width: 6),
                    Text('Admission Entry Form (2026-27 Session)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF065F46))),
                  ],
                ),
                const SizedBox(height: 10),

                // Full Name
                TextField(
                  controller: _admNameController,
                  decoration: InputDecoration(
                    labelText: 'Student Full Name *',
                    labelStyle: const TextStyle(fontSize: 11),
                    hintText: 'e.g. Devansh V. Sharma',
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  style: const TextStyle(fontSize: 12),
                ),
                const SizedBox(height: 8),

                // Class selection
                DropdownButtonFormField<String>(
                  value: _admClassId,
                  decoration: InputDecoration(
                    labelText: 'Enrolling Class & Stream *',
                    labelStyle: const TextStyle(fontSize: 11),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  items: _classOptions.map((opt) {
                    return DropdownMenuItem(
                      value: opt.id,
                      child: Text('${opt.label} • In-Charge: ${opt.classTeacherName}', style: const TextStyle(fontSize: 11)),
                    );
                  }).toList(),
                  onChanged: (v) {
                    if (v != null) {
                      setState(() {
                        _admClassId = v;
                        final opt = _classOptions.firstWhere((c) => c.id == v);
                        _admFeeController.text = opt.defaultFee.toInt().toString();
                      });
                    }
                  },
                ),
                const SizedBox(height: 4),

                // Class Teacher auto-sync pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFFA7F3D0)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Class Teacher In-Charge: ${selectedClassOpt.classTeacherName}',
                        style: const TextStyle(fontSize: 10, color: Color(0xFF065F46), fontWeight: FontWeight.bold),
                      ),
                      const Text('Auto-Sync Active', style: TextStyle(fontSize: 9, color: Color(0xFF059669), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                const SizedBox(height: 8),

                // Admission No & Roll No
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _admCustomNoController,
                        decoration: InputDecoration(
                          labelText: 'Admission Number *',
                          labelStyle: const TextStyle(fontSize: 11),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          filled: true,
                          fillColor: Colors.white,
                        ),
                        style: const TextStyle(fontSize: 11, fontFamily: 'monospace'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _admRollController,
                        decoration: InputDecoration(
                          labelText: 'Roll Number',
                          labelStyle: const TextStyle(fontSize: 11),
                          hintText: 'e.g. ROLL-042',
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          filled: true,
                          fillColor: Colors.white,
                        ),
                        style: const TextStyle(fontSize: 11, fontFamily: 'monospace'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Parent details
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _admParentNameController,
                        decoration: InputDecoration(
                          labelText: 'Parent / Guardian Name',
                          labelStyle: const TextStyle(fontSize: 11),
                          hintText: 'e.g. Vikram Sharma',
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          filled: true,
                          fillColor: Colors.white,
                        ),
                        style: const TextStyle(fontSize: 11),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _admPhoneController,
                        decoration: InputDecoration(
                          labelText: 'Parent Mobile / WhatsApp',
                          labelStyle: const TextStyle(fontSize: 11),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          filled: true,
                          fillColor: Colors.white,
                        ),
                        style: const TextStyle(fontSize: 11, fontFamily: 'monospace'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Blood Group & Fee
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _admBloodGroup,
                        decoration: InputDecoration(
                          labelText: 'Blood Group',
                          labelStyle: const TextStyle(fontSize: 11),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          filled: true,
                          fillColor: Colors.white,
                        ),
                        items: const [
                          DropdownMenuItem(value: 'A+', child: Text('A+')),
                          DropdownMenuItem(value: 'A-', child: Text('A-')),
                          DropdownMenuItem(value: 'B+', child: Text('B+')),
                          DropdownMenuItem(value: 'B-', child: Text('B-')),
                          DropdownMenuItem(value: 'O+', child: Text('O+')),
                          DropdownMenuItem(value: 'O-', child: Text('O-')),
                          DropdownMenuItem(value: 'AB+', child: Text('AB+')),
                          DropdownMenuItem(value: 'AB-', child: Text('AB-')),
                        ],
                        onChanged: (v) => setState(() => _admBloodGroup = v ?? 'B+'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _admFeeController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Composite Fee (₹)',
                          labelStyle: const TextStyle(fontSize: 11),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          filled: true,
                          fillColor: Colors.white,
                        ),
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Submit button
                ElevatedButton.icon(
                  onPressed: () {
                    final name = _admNameController.text.trim();
                    if (name.isEmpty) {
                      _showToast('Please enter the student full name!');
                      return;
                    }
                    final opt = _classOptions.firstWhere((c) => c.id == _admClassId);
                    final fee = double.tryParse(_admFeeController.text) ?? opt.defaultFee;
                    final admNo = _admCustomNoController.text.trim().isNotEmpty
                        ? _admCustomNoController.text.trim()
                        : 'ADM-2026-${100 + _enrolledStudents.length + 1}';
                    final rollNo = _admRollController.text.trim().isNotEmpty
                        ? _admRollController.text.trim()
                        : 'Roll No. ${10 + _enrolledStudents.length + 1}';
                    final parent = _admParentNameController.text.trim().isNotEmpty
                        ? _admParentNameController.text.trim()
                        : 'Guardian';
                    final phone = _admPhoneController.text.trim().isNotEmpty
                        ? _admPhoneController.text.trim()
                        : '+91 98765 43210';

                    final newStudent = EnrolledStudentModel(
                      id: 'STU_${DateTime.now().millisecondsSinceEpoch}',
                      fullName: name,
                      classId: opt.id,
                      className: opt.name,
                      admissionNo: admNo,
                      rollNo: rollNo,
                      parentName: parent,
                      parentPhone: phone,
                      tuitionFee: fee,
                      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
                      admissionDate: DateFormat('yyyy-MM-dd').format(DateTime.now()),
                      bloodGroup: _admBloodGroup,
                    );

                    // Add student and add initial invoice
                    setState(() {
                      _enrolledStudents.insert(0, newStudent);
                      _invoices.insert(
                        0,
                        InvoiceModel(
                          invoiceId: 'INV-2026-ADM-${100 + _enrolledStudents.length}',
                          studentName: name,
                          classId: opt.id,
                          className: opt.name,
                          term: 'Quarter 2 (Jul - Sep 2026)',
                          lineItems: [
                            FeeLineItem(id: '1', title: 'Composite Admission & Tuition Fee', amount: fee),
                          ],
                          subtotal: fee,
                          dueDate: DateFormat('yyyy-MM-dd').format(DateTime.now().add(const Duration(days: 15))),
                          fineAccumulated: 0,
                          totalPayable: fee,
                          amountPaid: 0,
                          status: 'pending',
                        ),
                      );
                      _admNameController.clear();
                      _admRollController.clear();
                      _admParentNameController.clear();
                      _admCustomNoController.text = 'ADM-2026-${100 + _enrolledStudents.length + 5}';
                    });

                    _showToast('New student $name admitted and synced with ${opt.classTeacherName}!');
                    _showAdmissionSlipDialog(newStudent);
                  },
                  icon: const Icon(Icons.person_add, size: 16),
                  label: const Text('Confirm Admission & Sync to Class Teacher', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF059669),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 11),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Enrolled Students Roster Search
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Synchronized Institutional Roster (${filteredStudents.length})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(left: 12.0),
                  child: TextField(
                    onChanged: (val) => setState(() => _admSearchQuery = val),
                    decoration: InputDecoration(
                      hintText: 'Search roster...',
                      hintStyle: const TextStyle(fontSize: 11),
                      prefixIcon: const Icon(Icons.search, size: 14),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                      isDense: true,
                    ),
                    style: const TextStyle(fontSize: 11),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Students list
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: filteredStudents.length,
            separatorBuilder: (_, __) => const SizedBox(height: 6),
            itemBuilder: (context, idx) {
              final s = _enrolledStudents[idx];
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 16,
                      backgroundImage: NetworkImage(s.avatarUrl),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                          Text('${s.className} • ${s.admissionNo} • ${s.rollNo}', style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                          Text('Guardian: ${s.parentName} (${s.parentPhone})', style: const TextStyle(fontSize: 10, color: Color(0xFF475569))),
                        ],
                      ),
                    ),
                    OutlinedButton(
                      onPressed: () => _showAdmissionSlipDialog(s),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        minimumSize: const Size(0, 28),
                        foregroundColor: const Color(0xFF059669),
                        side: const BorderSide(color: Color(0xFF059669)),
                      ),
                      child: const Text('Admission Slip', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
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

  // =========================================================================
  // TAB 5: STAFF SALARY & PAYOUTS REPORT (KARMCHARI VETAN EVAM MAANDEY)
  // =========================================================================
  Widget _buildStaffSalaryTab() {
    final totalSalary = _salaryRecords.fold<double>(0, (sum, s) => sum + s.netSalary);
    final supportStaffTotal = _salaryRecords
        .where((s) => !['teacher', 'class_teacher', 'principal'].contains(s.role))
        .fold<double>(0, (sum, s) => sum + s.netSalary);
    final facultySalaryTotal = _salaryRecords
        .where((s) => ['teacher', 'class_teacher', 'principal'].contains(s.role))
        .fold<double>(0, (sum, s) => sum + s.netSalary);

    final filteredSalaries = _salaryRecords.where((s) {
      final matchesSearch = _salarySearch.isEmpty ||
          s.staffName.toLowerCase().contains(_salarySearch.toLowerCase()) ||
          s.voucherNo.toLowerCase().contains(_salarySearch.toLowerCase()) ||
          s.departmentOrClass.toLowerCase().contains(_salarySearch.toLowerCase()) ||
          s.employeeId.toLowerCase().contains(_salarySearch.toLowerCase());
      final matchesRole = _salaryRoleFilter == 'all' || s.role == _salaryRoleFilter;
      final matchesMonth = _salaryMonthFilter == 'all' || s.month == _salaryMonthFilter;
      return matchesSearch && matchesRole && matchesMonth;
    }).toList();

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header with + Disburse Staff Fee and + Add Staff
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.payments_rounded, color: Color(0xFF4F46E5), size: 18),
                  SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Staff Fees & Salary Payouts Report (कर्मचारी वेतन रिपोर्ट)',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                      ),
                      Text(
                        'Peon, Maid, Security Guard, Driver, Teachers & Administration.',
                        style: TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ],
              ),
              Row(
                children: [
                  ElevatedButton.icon(
                    onPressed: _showDisburseSalaryDialog,
                    icon: const Icon(Icons.add, size: 12),
                    label: const Text('Disburse Fee', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4F46E5),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      minimumSize: const Size(0, 28),
                    ),
                  ),
                  const SizedBox(width: 4),
                  ElevatedButton.icon(
                    onPressed: _showAddSupportStaffDialog,
                    icon: const Icon(Icons.person_add, size: 12),
                    label: const Text('Add Staff', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F172A),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      minimumSize: const Size(0, 28),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),

          // 4 KPI Summary Cards for Staff Salary
          Row(
            children: [
              Expanded(
                child: _buildMetricMiniCard(
                  title: 'Total Disbursed',
                  value: '₹${NumberFormat('#,##,###').format(totalSalary)}',
                  sub: '${_salaryRecords.length} vouchers issued',
                  color: const Color(0xFF4F46E5),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: _buildMetricMiniCard(
                  title: 'Support Staff Pay',
                  value: '₹${NumberFormat('#,##,###').format(supportStaffTotal)}',
                  sub: 'Peon, Maid, Driver, Guard',
                  color: const Color(0xFFD97706),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: _buildMetricMiniCard(
                  title: 'Faculty & Academics',
                  value: '₹${NumberFormat('#,##,###').format(facultySalaryTotal)}',
                  sub: 'Teachers & Principal',
                  color: const Color(0xFF2563EB),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: _buildMetricMiniCard(
                  title: 'Onboarded Staff',
                  value: '${_staffRoster.length} Staff',
                  sub: 'Active Roster',
                  color: const Color(0xFF059669),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Search & Filter for Salary
          Row(
            children: [
              Expanded(
                flex: 3,
                child: TextField(
                  onChanged: (val) => setState(() => _salarySearch = val),
                  decoration: InputDecoration(
                    hintText: 'Search staff, voucher, employee ID...',
                    hintStyle: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                    prefixIcon: const Icon(Icons.search, size: 14),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    isDense: true,
                  ),
                  style: const TextStyle(fontSize: 11),
                ),
              ),
              const SizedBox(width: 6),
              DropdownButton<String>(
                value: _salaryRoleFilter,
                underline: const SizedBox(),
                items: const [
                  DropdownMenuItem(value: 'all', child: Text('All Roles', style: TextStyle(fontSize: 10))),
                  DropdownMenuItem(value: 'peon', child: Text('Peon', style: TextStyle(fontSize: 10))),
                  DropdownMenuItem(value: 'maid', child: Text('Maid', style: TextStyle(fontSize: 10))),
                  DropdownMenuItem(value: 'security_guard', child: Text('Security', style: TextStyle(fontSize: 10))),
                  DropdownMenuItem(value: 'driver', child: Text('Driver', style: TextStyle(fontSize: 10))),
                  DropdownMenuItem(value: 'teacher', child: Text('Teacher', style: TextStyle(fontSize: 10))),
                  DropdownMenuItem(value: 'principal', child: Text('Principal', style: TextStyle(fontSize: 10))),
                ],
                onChanged: (v) => setState(() => _salaryRoleFilter = v ?? 'all'),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Salary records list
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: filteredSalaries.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, idx) {
              final sal = filteredSalaries[idx];
              return Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(sal.staffName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEEF2FF),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(sal.role.toUpperCase().replaceAll('_', ' '), style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Color(0xFF4F46E5))),
                              ),
                            ],
                          ),
                          Text('${sal.roleTitle} (${sal.employeeId}) • ${sal.month}', style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                          Text('Base: ₹${NumberFormat('#,##,###').format(sal.baseSalary)} | Bonus: +₹${sal.bonus.toInt()} | Net: ₹${NumberFormat('#,##,###').format(sal.netSalary)} (${sal.paymentMode})', style: const TextStyle(fontSize: 10, color: Color(0xFF4F46E5), fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () => _showSalaryVoucherDialog(sal),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4F46E5),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        minimumSize: const Size(0, 28),
                      ),
                      child: const Text('Salary Slip', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
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

  Widget _buildMetricMiniCard({
    required String title,
    required String value,
    required String sub,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 9, color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
          const SizedBox(height: 2),
          Text(value, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color, fontFamily: 'monospace')),
          const SizedBox(height: 1),
          Text(sub, style: const TextStyle(fontSize: 8, color: Color(0xFF94A3B8)), maxLines: 1, overflow: TextOverflow.ellipsis),
        ],
      ),
    );
  }

  // =========================================================================
  // TAB 6: DAY BOOK & PETTY CASH VAULT
  // =========================================================================
  Widget _buildDayBookTab(
    double opening,
    double receipts,
    double expenses,
    double current,
  ) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.account_balance_wallet_rounded, color: Color(0xFFE11D48), size: 18),
                  SizedBox(width: 8),
                  Text('Daily Cash Day Book & Physical Vault Reconciliation', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                ],
              ),
              Text(DateFormat('yyyy-MM-dd').format(DateTime.now()), style: const TextStyle(fontSize: 10, color: Color(0xFF64748B), fontFamily: 'monospace', fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 12),

          // 4 Drawer summary cards
          Row(
            children: [
              _buildVaultCard('Opening Vault', opening, const Color(0xFF0F172A)),
              const SizedBox(width: 6),
              _buildVaultCard('Receipts', receipts, const Color(0xFF059669)),
              const SizedBox(width: 6),
              _buildVaultCard('Petty Expenses', expenses, const Color(0xFFDC2626)),
              const SizedBox(width: 6),
              _buildVaultCard('Net Vault', current, const Color(0xFF059669), isHighlight: true),
            ],
          ),
          const SizedBox(height: 14),

          // Record New Petty Cash Expenditure Form
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Row(
                  children: [
                    Icon(Icons.add_circle_outline, size: 14, color: Color(0xFFE11D48)),
                    SizedBox(width: 6),
                    Text('Record New Petty Cash Expenditure', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: TextField(
                        controller: _pettyDescController,
                        decoration: InputDecoration(
                          hintText: 'Expense purpose (e.g. Science lab consumables)...',
                          hintStyle: const TextStyle(fontSize: 11),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          filled: true,
                          fillColor: Colors.white,
                        ),
                        style: const TextStyle(fontSize: 11),
                      ),
                    ),
                    const SizedBox(width: 6),
                    DropdownButton<String>(
                      value: _pettyCategory,
                      underline: const SizedBox(),
                      items: const [
                        DropdownMenuItem(value: 'office_supplies', child: Text('Office Supplies', style: TextStyle(fontSize: 10))),
                        DropdownMenuItem(value: 'refreshment', child: Text('Refreshment', style: TextStyle(fontSize: 10))),
                        DropdownMenuItem(value: 'maintenance', child: Text('Maintenance', style: TextStyle(fontSize: 10))),
                        DropdownMenuItem(value: 'courier', child: Text('Postage/Courier', style: TextStyle(fontSize: 10))),
                      ],
                      onChanged: (v) => setState(() => _pettyCategory = v ?? 'office_supplies'),
                    ),
                    const SizedBox(width: 6),
                    SizedBox(
                      width: 80,
                      child: TextField(
                        controller: _pettyAmountController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          hintText: '₹ Amount',
                          hintStyle: const TextStyle(fontSize: 11),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          filled: true,
                          fillColor: Colors.white,
                        ),
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                      ),
                    ),
                    const SizedBox(width: 6),
                    ElevatedButton(
                      onPressed: () {
                        final desc = _pettyDescController.text.trim();
                        final amt = double.tryParse(_pettyAmountController.text) ?? 0;
                        if (desc.isEmpty || amt <= 0) {
                          _showToast('Please enter expense purpose and valid amount!');
                          return;
                        }
                        setState(() {
                          _pettyCashList.insert(
                            0,
                            PettyCashModel(
                              id: 'PC_${DateTime.now().millisecondsSinceEpoch}',
                              time: DateFormat('hh:mm a').format(DateTime.now()),
                              description: desc,
                              category: _pettyCategory,
                              amount: amt,
                              voucherNo: 'VCH-2026-${100 + _pettyCashList.length + 1}',
                            ),
                          );
                          _pettyDescController.clear();
                          _pettyAmountController.clear();
                        });
                        _showToast('Petty cash expenditure of ₹$amt recorded into day book!');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0F172A),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      ),
                      child: const Text('Add', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          const Text('Petty Cash Expenditures Log', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 6),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _pettyCashList.length,
            separatorBuilder: (_, __) => const SizedBox(height: 6),
            itemBuilder: (context, idx) {
              final p = _pettyCashList[idx];
              return Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(p.description, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11)),
                        Text('${p.voucherNo} • ${p.time} • ${p.category.toUpperCase().replaceAll('_', ' ')}', style: const TextStyle(fontSize: 9, color: Color(0xFF94A3B8))),
                      ],
                    ),
                    Text('-₹${p.amount.toInt()}', style: const TextStyle(color: Color(0xFFDC2626), fontWeight: FontWeight.bold, fontSize: 12, fontFamily: 'monospace')),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildVaultCard(String title, double amount, Color color, {bool isHighlight = false}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isHighlight ? const Color(0xFFECFDF5) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isHighlight ? const Color(0xFFA7F3D0) : const Color(0xFFE2E8F0)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 8, color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
            const SizedBox(height: 2),
            Text(
              '₹${NumberFormat('#,##,###').format(amount)}',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: color, fontFamily: 'monospace'),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  // =========================================================================
  // TAB 7: FINANCIAL ANALYTICS
  // =========================================================================
  Widget _buildAnalyticsTab(double totalBilled, double totalCollected, double totalOutstanding) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Row(
            children: [
              Icon(Icons.trending_up_rounded, color: Color(0xFF2563EB), size: 18),
              SizedBox(width: 8),
              Text('Fee Heads & Revenue Distribution (Q2 Breakdown)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 12),
          _buildProgressBar('Tuition & Instruction (62%)', 0.62, '₹72,000', Colors.blue),
          const SizedBox(height: 8),
          _buildProgressBar('Bus & Transport Route #12 (17%)', 0.17, '₹19,500', Colors.teal),
          const SizedBox(height: 8),
          _buildProgressBar('Science, STEM & CS Consumables (12%)', 0.12, '₹13,500', Colors.purple),
          const SizedBox(height: 8),
          _buildProgressBar('Sports & Sensory Kit (9%)', 0.09, '₹10,500', Colors.amber),
          const SizedBox(height: 14),

          // Payment Gateway & Channels Breakdown
          const Text('Payment Gateway & Channels', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFFE2E8F0))),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Online UPI/Razorpay', style: TextStyle(fontSize: 9, color: Color(0xFF64748B))),
                      Text('₹63,000', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF059669), fontFamily: 'monospace')),
                      Text('Auto Settled', style: TextStyle(fontSize: 8, color: Color(0xFF059669))),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFFE2E8F0))),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Till Cash Counter', style: TextStyle(fontSize: 9, color: Color(0xFF64748B))),
                      Text('₹25,000', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A), fontFamily: 'monospace')),
                      Text('Vault Custody', style: TextStyle(fontSize: 8, color: Color(0xFF64748B))),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFFE2E8F0))),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Overdue Dues', style: TextStyle(fontSize: 9, color: Color(0xFF64748B))),
                      Text('₹${NumberFormat('#,##,###').format(totalOutstanding)}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFDC2626), fontFamily: 'monospace')),
                      const Text('Notice Active', style: TextStyle(fontSize: 8, color: Color(0xFFDC2626))),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildProgressBar(String label, double ratio, String amountLabel, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
            Text(amountLabel, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
          ],
        ),
        const SizedBox(height: 4),
        LinearProgressIndicator(
          value: ratio,
          backgroundColor: const Color(0xFFF1F5F9),
          valueColor: AlwaysStoppedAnimation<Color>(color),
          minHeight: 6,
          borderRadius: BorderRadius.circular(3),
        ),
      ],
    );
  }

  // =========================================================================
  // TAB 8: DIRECTIVES
  // =========================================================================
  Widget _buildDirectivesTab() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Row(
            children: [
              Icon(Icons.security_rounded, color: Color(0xFFE11D48), size: 18),
              SizedBox(width: 8),
              Text('Super Admin Directives & Mandates', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 10),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _directives.length,
            itemBuilder: (context, idx) {
              final d = _directives[idx];
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(d.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF2F2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(d.priority.toUpperCase(), style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFFDC2626))),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(d.instructions, style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                    const SizedBox(height: 8),
                    Align(
                      alignment: Alignment.centerRight,
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() => d.isCompleted = true);
                          _showToast('Directive marked as completed!');
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: d.isCompleted ? const Color(0xFF059669) : const Color(0xFF2563EB),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          minimumSize: const Size(0, 26),
                        ),
                        child: Text(d.isCompleted ? 'Completed ✓' : 'Mark Completed', style: const TextStyle(fontSize: 10)),
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

  // =========================================================================
  // 4 BOTTOM KPI SUMMARY CARDS (MATCHING PREVIEW APP)
  // Total Invoiced, Realized Collection, Outstanding Dues, Late Penalties
  // =========================================================================
  Widget _buildKpiSummaryCards({
    required double totalBilled,
    required double totalCollected,
    required double totalOutstanding,
    required double totalFines,
    required String collectionRate,
    required int paidCount,
    required int pendingCount,
  }) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildFinancialCard(
                title: 'Total Invoiced (Q2)',
                value: '₹${NumberFormat('#,##,###').format(totalBilled)}',
                subtitle: '${_invoices.length} Registered Accounts',
                icon: Icons.receipt_long_rounded,
                iconColor: const Color(0xFF2563EB),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildFinancialCard(
                title: 'Realized Collection',
                value: '₹${NumberFormat('#,##,###').format(totalCollected)}',
                subtitle: '$collectionRate% Settled ($paidCount Paid)',
                icon: Icons.check_circle_rounded,
                iconColor: const Color(0xFF059669),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: _buildFinancialCard(
                title: 'Outstanding Dues',
                value: '₹${NumberFormat('#,##,###').format(totalOutstanding)}',
                subtitle: '$pendingCount Pending Invoices',
                icon: Icons.pending_actions_rounded,
                iconColor: const Color(0xFFDC2626),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildFinancialCard(
                title: 'Late Penalties Accrued',
                value: '₹${NumberFormat('#,##,###').format(totalFines)}',
                subtitle: 'Fine Rule: ₹50 / Overdue Day',
                icon: Icons.warning_amber_rounded,
                iconColor: const Color(0xFFD97706),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildFinancialCard({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Color(0xFF64748B),
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.2,
                ),
              ),
              Icon(icon, size: 16, color: iconColor),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              color: Color(0xFF0F172A),
              fontSize: 15,
              fontWeight: FontWeight.w900,
              fontFamily: 'monospace',
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: const TextStyle(
              color: Color(0xFF94A3B8),
              fontSize: 10,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // DIALOG 1: OFFICIAL CBSE SCHOOL FEE E-RECEIPT MODAL
  // =========================================================================
  void _showReceiptDialog(InvoiceModel inv) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        contentPadding: const EdgeInsets.all(16),
        content: SizedBox(
          width: 360,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.verified, color: Color(0xFF059669), size: 18),
                        SizedBox(width: 6),
                        Text('OFFICIAL FEE E-RECEIPT', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF059669))),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 18),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const Divider(),
                Text('Receipt No: ${inv.receiptNumber ?? "REC-2026-0891"}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, fontFamily: 'monospace')),
                Text('Student: ${inv.studentName} (${inv.className})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                Text('Term: ${inv.term}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                if (inv.paymentMode != null)
                  Text('Payment Mode: ${inv.paymentMode} • Ref: ${inv.transactionRef ?? "OFFLINE_CSH"}', style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                const SizedBox(height: 8),
                ...inv.lineItems.map(
                  (item) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 2.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(item.title, style: const TextStyle(fontSize: 11)),
                        Text('₹${NumberFormat('#,##,###').format(item.amount)}', style: const TextStyle(fontSize: 11, fontFamily: 'monospace')),
                      ],
                    ),
                  ),
                ),
                if (inv.fineAccumulated > 0)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 2.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Late Penalty Fine', style: TextStyle(fontSize: 11, color: Color(0xFFDC2626))),
                        Text('+₹${inv.fineAccumulated.toInt()}', style: const TextStyle(fontSize: 11, color: Color(0xFFDC2626), fontFamily: 'monospace')),
                      ],
                    ),
                  ),
                const Divider(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('TOTAL PAID:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text('₹${NumberFormat('#,##,###').format(inv.totalPayable)}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: Color(0xFF059669), fontFamily: 'monospace')),
                  ],
                ),
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    _showToast('E-Receipt sent to student registered email and downloaded as PDF!');
                  },
                  icon: const Icon(Icons.print, size: 14),
                  label: const Text('Print Official Fee Receipt'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF059669),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // DIALOG 2: ADMISSION SLIP MODAL
  // =========================================================================
  void _showAdmissionSlipDialog(EnrolledStudentModel stu) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        contentPadding: const EdgeInsets.all(16),
        content: SizedBox(
          width: 360,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('OFFICIAL ADMISSION SLIP', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF2563EB))),
                    IconButton(
                      icon: const Icon(Icons.close, size: 18),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const Divider(),
                Row(
                  children: [
                    CircleAvatar(radius: 24, backgroundImage: NetworkImage(stu.avatarUrl)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(stu.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          Text(stu.className, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                          Text('Admission No: ${stu.admissionNo}', style: const TextStyle(fontSize: 10, fontFamily: 'monospace')),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text('Guardian: ${stu.parentName} (${stu.parentPhone})', style: const TextStyle(fontSize: 11)),
                Text('Blood Group: ${stu.bloodGroup} | Admitted: ${stu.admissionDate}', style: const TextStyle(fontSize: 11)),
                Text('Quarterly Composite Fee: ₹${NumberFormat('#,##,###').format(stu.tuitionFee)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    _showToast('Official Admission Slip PDF printed!');
                  },
                  icon: const Icon(Icons.print, size: 14),
                  label: const Text('Print Student Admission Slip'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2563EB),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // DIALOG 3: SALARY VOUCHER MODAL
  // =========================================================================
  void _showSalaryVoucherDialog(StaffSalaryRecord sal) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        contentPadding: const EdgeInsets.all(16),
        content: SizedBox(
          width: 360,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('EMPLOYEE MONTHLY PAYSLIP', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF4F46E5))),
                    IconButton(
                      icon: const Icon(Icons.close, size: 18),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const Divider(),
                Text('Voucher No: ${sal.voucherNo}', style: const TextStyle(fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold)),
                Text('Employee: ${sal.staffName} (${sal.employeeId})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Text('${sal.roleTitle} • ${sal.departmentOrClass}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                Text('Month: ${sal.month} | Mode: ${sal.paymentMode}', style: const TextStyle(fontSize: 11)),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Basic Pay:', style: TextStyle(fontSize: 11)),
                    Text('₹${NumberFormat('#,##,###').format(sal.baseSalary)}', style: const TextStyle(fontSize: 11, fontFamily: 'monospace')),
                  ],
                ),
                if (sal.bonus > 0)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Allowances & Bonus:', style: TextStyle(fontSize: 11, color: Color(0xFF059669))),
                      Text('+₹${NumberFormat('#,##,###').format(sal.bonus)}', style: const TextStyle(fontSize: 11, color: Color(0xFF059669), fontFamily: 'monospace')),
                    ],
                  ),
                if (sal.deductions > 0)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Statutory Deductions (TDS/PF):', style: TextStyle(fontSize: 11, color: Color(0xFFDC2626))),
                      Text('-₹${NumberFormat('#,##,###').format(sal.deductions)}', style: const TextStyle(fontSize: 11, color: Color(0xFFDC2626), fontFamily: 'monospace')),
                    ],
                  ),
                const Divider(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('NET SALARY TRANSFERRED:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    Text('₹${NumberFormat('#,##,###').format(sal.netSalary)}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: Color(0xFF4F46E5), fontFamily: 'monospace')),
                  ],
                ),
                if (sal.remarks.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Text('Remarks: "${sal.remarks}"', style: const TextStyle(fontSize: 10, fontStyle: FontStyle.italic, color: Color(0xFF64748B))),
                ],
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    _showToast('Pay slip issued and sent to ${sal.staffName}!');
                  },
                  icon: const Icon(Icons.print, size: 14),
                  label: const Text('Print Official Salary Slip'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4F46E5),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // DIALOG 4: CLERK DISBURSE SALARY MODAL
  // =========================================================================
  void _showDisburseSalaryDialog() {
    String selectedStaffId = _staffRoster.first.id;
    String month = 'October 2026';
    final baseController = TextEditingController(text: _staffRoster.first.defaultBaseSalary.toInt().toString());
    final bonusController = TextEditingController(text: '1000');
    final dedController = TextEditingController(text: '0');
    String mode = 'Bank Transfer (NEFT)';
    final refController = TextEditingController(text: 'NEFT-${DateTime.now().millisecondsSinceEpoch.toString().substring(6)}');
    final remarksController = TextEditingController(text: 'Monthly salary disbursement');

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          final targetStaff = _staffRoster.firstWhere((s) => s.id == selectedStaffId);
          final base = double.tryParse(baseController.text) ?? 0;
          final bonus = double.tryParse(bonusController.text) ?? 0;
          final ded = double.tryParse(dedController.text) ?? 0;
          final net = (base + bonus - ded).clamp(0, 9999999.0);

          return AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            contentPadding: const EdgeInsets.all(16),
            content: SizedBox(
              width: 360,
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.payments_rounded, color: Color(0xFF4F46E5), size: 18),
                            SizedBox(width: 6),
                            Text('Disburse Staff Salary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF4F46E5))),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, size: 18),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const Divider(),

                    // Staff member selector
                    const Text('Select Staff Member', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    DropdownButtonFormField<String>(
                      value: selectedStaffId,
                      decoration: InputDecoration(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      items: _staffRoster.map((s) {
                        return DropdownMenuItem(
                          value: s.id,
                          child: Text('${s.fullName} (${s.roleTitle})', style: const TextStyle(fontSize: 11)),
                        );
                      }).toList(),
                      onChanged: (v) {
                        if (v != null) {
                          setModalState(() {
                            selectedStaffId = v;
                            final s = _staffRoster.firstWhere((item) => item.id == v);
                            baseController.text = s.defaultBaseSalary.toInt().toString();
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 8),

                    // Month selector
                    const Text('Salary Month', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    DropdownButtonFormField<String>(
                      value: month,
                      decoration: InputDecoration(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'October 2026', child: Text('October 2026', style: TextStyle(fontSize: 11))),
                        DropdownMenuItem(value: 'November 2026', child: Text('November 2026', style: TextStyle(fontSize: 11))),
                        DropdownMenuItem(value: 'September 2026', child: Text('September 2026', style: TextStyle(fontSize: 11))),
                      ],
                      onChanged: (v) => setModalState(() => month = v ?? 'October 2026'),
                    ),
                    const SizedBox(height: 8),

                    // Base, Bonus, Deductions
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: baseController,
                            keyboardType: TextInputType.number,
                            onChanged: (_) => setModalState(() {}),
                            decoration: InputDecoration(
                              labelText: 'Base Pay (₹)',
                              labelStyle: const TextStyle(fontSize: 10),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: TextField(
                            controller: bonusController,
                            keyboardType: TextInputType.number,
                            onChanged: (_) => setModalState(() {}),
                            decoration: InputDecoration(
                              labelText: 'Bonus (₹)',
                              labelStyle: const TextStyle(fontSize: 10),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            style: const TextStyle(fontSize: 11, color: Color(0xFF059669), fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: TextField(
                            controller: dedController,
                            keyboardType: TextInputType.number,
                            onChanged: (_) => setModalState(() {}),
                            decoration: InputDecoration(
                              labelText: 'Deductions (₹)',
                              labelStyle: const TextStyle(fontSize: 10),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            style: const TextStyle(fontSize: 11, color: Color(0xFFDC2626), fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Calculated Net
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEEF2FF),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFFC7D2FE)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Net Salary to Disburse:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF3730A3))),
                          Text('₹${NumberFormat('#,##,###').format(net)}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: Color(0xFF4F46E5), fontFamily: 'monospace')),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Mode & Ref
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: mode,
                            decoration: InputDecoration(
                              labelText: 'Mode',
                              labelStyle: const TextStyle(fontSize: 10),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            items: const [
                              DropdownMenuItem(value: 'Bank Transfer (NEFT)', child: Text('Bank NEFT', style: TextStyle(fontSize: 10))),
                              DropdownMenuItem(value: 'Cash Register', child: Text('Cash', style: TextStyle(fontSize: 10))),
                              DropdownMenuItem(value: 'UPI Gateway', child: Text('UPI', style: TextStyle(fontSize: 10))),
                              DropdownMenuItem(value: 'Bank Cheque', child: Text('Cheque', style: TextStyle(fontSize: 10))),
                            ],
                            onChanged: (v) => setModalState(() => mode = v ?? 'Bank Transfer (NEFT)'),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: TextField(
                            controller: refController,
                            decoration: InputDecoration(
                              labelText: 'Txn Ref',
                              labelStyle: const TextStyle(fontSize: 10),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            style: const TextStyle(fontSize: 10, fontFamily: 'monospace'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    TextField(
                      controller: remarksController,
                      decoration: InputDecoration(
                        labelText: 'Remarks / Memo',
                        labelStyle: const TextStyle(fontSize: 10),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      style: const TextStyle(fontSize: 11),
                    ),
                    const SizedBox(height: 14),

                    ElevatedButton(
                      onPressed: () {
                        final voucher = StaffSalaryRecord(
                          id: 'SAL_${DateTime.now().millisecondsSinceEpoch}',
                          staffName: targetStaff.fullName,
                          role: targetStaff.role,
                          roleTitle: targetStaff.roleTitle,
                          departmentOrClass: targetStaff.department,
                          employeeId: targetStaff.employeeId,
                          baseSalary: base,
                          bonus: bonus,
                          deductions: ded,
                          netSalary: net.toDouble(),
                          month: month,
                          paymentMode: mode,
                          status: 'Paid',
                          paymentDate: DateFormat('yyyy-MM-dd').format(DateTime.now()),
                          voucherNo: 'VCH-SAL-2026-${100 + _salaryRecords.length + 1}',
                          remarks: remarksController.text.trim(),
                          disbursedBy: 'Mr. Vikram Goel (Accountant / Bursar)',
                        );

                        setState(() {
                          _salaryRecords.insert(0, voucher);
                        });
                        Navigator.pop(ctx);
                        _showToast('Salary disbursed to ${targetStaff.fullName}! Official voucher issued.');
                        _showSalaryVoucherDialog(voucher);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4F46E5),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const Text('Confirm Payout & Issue Voucher', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  // =========================================================================
  // DIALOG 5: ADD SUPPORT STAFF MODAL (PEON, MAID, GUARD, DRIVER, ETC.)
  // =========================================================================
  void _showAddSupportStaffDialog() {
    final nameController = TextEditingController();
    String role = 'peon';
    final deptController = TextEditingController(text: 'Support Services / Operations');
    final phoneController = TextEditingController(text: '+91 98000 00000');
    final salaryController = TextEditingController(text: '16000');

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            contentPadding: const EdgeInsets.all(16),
            content: SizedBox(
              width: 360,
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.person_add_alt_1_rounded, color: Color(0xFF0F172A), size: 18),
                            SizedBox(width: 6),
                            Text('Register Support Staff', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, size: 18),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const Divider(),

                    TextField(
                      controller: nameController,
                      decoration: InputDecoration(
                        labelText: 'Staff Full Name *',
                        labelStyle: const TextStyle(fontSize: 11),
                        hintText: 'e.g. Rameshwar Dayal',
                        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      style: const TextStyle(fontSize: 12),
                    ),
                    const SizedBox(height: 8),

                    DropdownButtonFormField<String>(
                      value: role,
                      decoration: InputDecoration(
                        labelText: 'Staff Role *',
                        labelStyle: const TextStyle(fontSize: 11),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'peon', child: Text('Peon / Office Attendant', style: TextStyle(fontSize: 11))),
                        DropdownMenuItem(value: 'maid', child: Text('Maid / Ayah / Caretaker', style: TextStyle(fontSize: 11))),
                        DropdownMenuItem(value: 'security_guard', child: Text('Security Guard', style: TextStyle(fontSize: 11))),
                        DropdownMenuItem(value: 'driver', child: Text('Bus Driver / Transport', style: TextStyle(fontSize: 11))),
                        DropdownMenuItem(value: 'lab_assistant', child: Text('Lab Assistant', style: TextStyle(fontSize: 11))),
                        DropdownMenuItem(value: 'librarian', child: Text('Library Assistant', style: TextStyle(fontSize: 11))),
                      ],
                      onChanged: (v) {
                        if (v != null) {
                          setModalState(() {
                            role = v;
                            if (v == 'peon') salaryController.text = '16000';
                            if (v == 'maid') salaryController.text = '14500';
                            if (v == 'security_guard') salaryController.text = '17500';
                            if (v == 'driver') salaryController.text = '19000';
                            if (v == 'lab_assistant') salaryController.text = '22000';
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 8),

                    TextField(
                      controller: deptController,
                      decoration: InputDecoration(
                        labelText: 'Department / Assignment',
                        labelStyle: const TextStyle(fontSize: 11),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      style: const TextStyle(fontSize: 11),
                    ),
                    const SizedBox(height: 8),

                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: phoneController,
                            decoration: InputDecoration(
                              labelText: 'Phone Number',
                              labelStyle: const TextStyle(fontSize: 10),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            style: const TextStyle(fontSize: 11, fontFamily: 'monospace'),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: TextField(
                            controller: salaryController,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              labelText: 'Base Salary (₹)',
                              labelStyle: const TextStyle(fontSize: 10),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    ElevatedButton(
                      onPressed: () {
                        final name = nameController.text.trim();
                        if (name.isEmpty) {
                          _showToast('Please enter the staff member name!');
                          return;
                        }
                        final sal = double.tryParse(salaryController.text) ?? 15000;
                        final newEmpId = 'EMP-${role.toUpperCase().substring(0, 3)}-${100 + _staffRoster.length + 1}';

                        setState(() {
                          _staffRoster.add(
                            StaffMemberModel(
                              id: 'STAFF_${DateTime.now().millisecondsSinceEpoch}',
                              fullName: name,
                              role: role,
                              roleTitle: '${role.toUpperCase().replaceAll('_', ' ')} Staff',
                              department: deptController.text.trim(),
                              employeeId: newEmpId,
                              defaultBaseSalary: sal,
                              phoneNumber: phoneController.text.trim(),
                              email: '${name.toLowerCase().replaceAll(' ', '.')}@edupulse.edu',
                              avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                            ),
                          );
                        });

                        Navigator.pop(ctx);
                        _showToast('New staff member "$name" registered! Now eligible for salary payout.');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0F172A),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const Text('Register Staff Member', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
