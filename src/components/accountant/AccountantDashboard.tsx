import React, { useState } from 'react';
import { useSMS } from '../../context/SMSContext';
import { Invoice, StudentProfile, StaffRole, StaffSalaryPayment, StaffCredential } from '../../types';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Plus,
  Building,
  ShieldAlert,
  Send,
  Printer,
  FileText,
  Wallet,
  QrCode,
  ArrowUpRight,
  Percent,
  Calendar,
  Check,
  X,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Smartphone,
  Scale,
  UserPlus,
  Users,
  GraduationCap,
  Eye,
  BookOpen,
  Tag,
  BadgeCheck,
  Shield,
  Truck,
  Camera,
  LogOut,
} from 'lucide-react';
import { PhotoUploadField } from '../common/PhotoUploadField';

interface PettyCashEntry {
  id: string;
  time: string;
  description: string;
  category: 'office_supplies' | 'refreshment' | 'maintenance' | 'courier';
  amount: number;
  voucherNo: string;
}

export const AccountantDashboard: React.FC = () => {
  const {
    invoices,
    payInvoice,
    staffDirectives,
    updateDirectiveStatus,
    students,
    addStudent,
    staffSalaryPayments,
    disburseStaffSalary,
    staffCredentials,
    currentUser,
    acceptStaffCredential,
    logout,
  } = useSMS();

  // Navigation tab state: 8 distinct functional consoles
  const [activeTab, setActiveTab] = useState<
    'ledger' | 'pos' | 'defaulters' | 'admissions' | 'staff_salary' | 'daybook' | 'analytics' | 'directives'
  >('ledger');

  // Search & filter for Fee Ledger
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);

  // New Student Admission Form state
  const CLASS_OPTIONS = [
    {
      id: 'CLS_11',
      name: 'Class 11-A (Sr. Secondary)',
      section: 'SEC_A',
      tier: 'senior_sec' as const,
      stream: 'science_pcm' as const,
      defaultFee: 24000,
      label: 'Class 11-A (PCM Science · Sr. Sec)',
      classTeacherName: 'Mrs. Sunita Rao',
    },
    {
      id: 'CLS_NURSERY',
      name: 'Nursery (Pre-Primary)',
      section: 'SEC_A',
      tier: 'pre_primary' as const,
      stream: 'none' as const,
      defaultFee: 14000,
      label: 'Nursery (Pre-Primary Early Childhood)',
      classTeacherName: 'Mrs. Sunita Rao',
    },
    {
      id: 'CLS_05',
      name: 'Class 5-B (Primary CCE)',
      section: 'SEC_B',
      tier: 'primary' as const,
      stream: 'none' as const,
      defaultFee: 18000,
      label: 'Class 5-B (Primary Foundation)',
      classTeacherName: 'Mr. Arvind Verma',
    },
    {
      id: 'CLS_09',
      name: 'Class 9-A (Secondary)',
      section: 'SEC_A',
      tier: 'secondary' as const,
      stream: 'none' as const,
      defaultFee: 20000,
      label: 'Class 9-A (Secondary CBSE)',
      classTeacherName: 'Dr. K. N. Rao',
    },
    {
      id: 'CLS_10',
      name: 'Class 10-A (Secondary)',
      section: 'SEC_A',
      tier: 'secondary' as const,
      stream: 'none' as const,
      defaultFee: 22000,
      label: 'Class 10-A (Secondary Board)',
      classTeacherName: 'Mrs. Neha Sinha',
    },
    {
      id: 'CLS_12',
      name: 'Class 12-A (Sr. Secondary)',
      section: 'SEC_A',
      tier: 'senior_sec' as const,
      stream: 'commerce' as const,
      defaultFee: 25000,
      label: 'Class 12-A (Commerce · Sr. Sec)',
      classTeacherName: 'Mr. Rajesh Mehra',
    },
  ];

  const [admFullName, setAdmFullName] = useState('');
  const [admClassId, setAdmClassId] = useState('CLS_11');
  const [admRoll, setAdmRoll] = useState('');
  const [admParentName, setAdmParentName] = useState('');
  const [admParentPhone, setAdmParentPhone] = useState('+91 ');
  const [admBloodGroup, setAdmBloodGroup] = useState('B+');
  const [admFee, setAdmFee] = useState('24000');
  const [admAvatarUrl, setAdmAvatarUrl] = useState('');
  const [admCustomNo, setAdmCustomNo] = useState(`ADM-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [admSearchQuery, setAdmSearchQuery] = useState('');
  const [viewingAdmissionSlip, setViewingAdmissionSlip] = useState<StudentProfile | null>(null);

  // Staff Salary Report & Payout State
  const [salarySearchTerm, setSalarySearchTerm] = useState('');
  const [salaryRoleFilter, setSalaryRoleFilter] = useState<string>('all');
  const [salaryMonthFilter, setSalaryMonthFilter] = useState<string>('all');
  const [viewingSalaryVoucher, setViewingSalaryVoucher] = useState<StaffSalaryPayment | null>(null);

  // Clerk Staff Salary Payout Modal State
  const [showClerkPayoutModal, setShowClerkPayoutModal] = useState(false);
  const [clerkSelectedStaffId, setClerkSelectedStaffId] = useState('');
  const [clerkSalaryMonth, setClerkSalaryMonth] = useState('October 2026');
  const [clerkBaseSalary, setClerkBaseSalary] = useState('18000');
  const [clerkBonus, setClerkBonus] = useState('0');
  const [clerkDeduction, setClerkDeduction] = useState('0');
  const [clerkMode, setClerkMode] = useState<'bank_transfer' | 'cash' | 'upi' | 'cheque'>('bank_transfer');
  const [clerkTxnRef, setClerkTxnRef] = useState('');
  const [clerkRemarks, setClerkRemarks] = useState('');

  // Add Support Staff Modal State (Peon, Maid, Guard, Driver, etc.)
  const [showAddSupportStaffModal, setShowAddSupportStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('peon');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffDept, setNewStaffDept] = useState('Support Services');
  const [newStaffAvatar, setNewStaffAvatar] = useState('');

  // E-Receipt Modal
  const [viewingReceiptInvoice, setViewingReceiptInvoice] = useState<Invoice | null>(null);

  // Quick Counter POS State
  const [selectedStudentInvoiceId, setSelectedStudentInvoiceId] = useState<string>('');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'cash' | 'upi' | 'card' | 'cheque'>('cash');
  const [tenderedCash, setTenderedCash] = useState<string>('');
  const [posNotes, setPosNotes] = useState<string>('');
  const [isProcessingPos, setIsProcessingPos] = useState<boolean>(false);

  // Notice dispatched state
  const [sentNoticeNotice, setSentNoticeNotice] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Petty Cash / Day Book state
  const [pettyCashList, setPettyCashList] = useState<PettyCashEntry[]>([
    {
      id: 'PC_01',
      time: '09:45 AM',
      description: 'CBSE Secondary Exam Circular Printing Paper & Toner',
      category: 'office_supplies',
      amount: 1450,
      voucherNo: 'VCH-2026-042',
    },
    {
      id: 'PC_02',
      time: '11:15 AM',
      description: 'Faculty Meeting Refreshment & Drinking Water Cans',
      category: 'refreshment',
      amount: 680,
      voucherNo: 'VCH-2026-043',
    },
    {
      id: 'PC_03',
      time: '02:00 PM',
      description: 'Speed Post Dispatch: CBSE Affiliation Compliance Dossier',
      category: 'courier',
      amount: 320,
      voucherNo: 'VCH-2026-044',
    },
  ]);
  const [newPettyDesc, setNewPettyDesc] = useState('');
  const [newPettyAmount, setNewPettyAmount] = useState('');
  const [newPettyCategory, setNewPettyCategory] = useState<'office_supplies' | 'refreshment' | 'maintenance' | 'courier'>('office_supplies');

  // Key Financial Aggregates
  const totalBilled = invoices.reduce((acc, i) => acc + i.totalPayable, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOutstanding = totalBilled - totalCollected;
  const totalFines = invoices.reduce((acc, i) => acc + i.fineAccumulated, 0);
  const pendingCount = invoices.filter((i) => i.status === 'pending').length;
  const paidCount = invoices.filter((i) => i.status === 'paid').length;
  const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0';

  const totalPettyDisbursed = pettyCashList.reduce((acc, p) => acc + p.amount, 0);
  const cashVaultOpening = 25000;
  const cashVaultCurrent = cashVaultOpening + totalCollected - totalPettyDisbursed;

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.receiptNumber && inv.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesClass = classFilter === 'all' || inv.classId === classFilter;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const defaultersList = invoices.filter((inv) => inv.status === 'pending');

  // Actions
  const handleManualReconcile = async (invId: string) => {
    setReconcilingId(invId);
    await payInvoice(invId, 'cash_counter');
    setReconcilingId(null);
    setSuccessToast(`Invoice ${invId} successfully marked SETTLED via Cash Counter!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handlePosSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentInvoiceId) return;

    const targetInv = invoices.find((i) => i.invoiceId === selectedStudentInvoiceId);
    if (!targetInv) return;

    setIsProcessingPos(true);
    await payInvoice(selectedStudentInvoiceId, posPaymentMethod);
    setIsProcessingPos(false);

    // Open receipt modal
    const updatedInv = {
      ...targetInv,
      status: 'paid' as const,
      amountPaid: targetInv.totalPayable,
      transactionRef: `TXN_${posPaymentMethod.toUpperCase()}_${Date.now().toString().slice(-6)}`,
      paymentDate: new Date().toISOString().split('T')[0],
      receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setViewingReceiptInvoice(updatedInv);
    setSelectedStudentInvoiceId('');
    setTenderedCash('');
    setSuccessToast(`Payment collected for ${targetInv.studentName}! Official E-Receipt generated.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleSendReminder = (studentName: string, amount: number) => {
    setSentNoticeNotice(`Automated fee reminder notice transmitted to parent of ${studentName} for ₹${amount.toLocaleString()}!`);
    setTimeout(() => setSentNoticeNotice(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = [
      'Invoice ID',
      'Student Name',
      'Class Name',
      'Term',
      'Subtotal (INR)',
      'Late Fine (INR)',
      'Total Payable (INR)',
      'Amount Paid (INR)',
      'Status',
      'Payment Date',
      'Receipt No',
      'Transaction Ref',
    ];

    const rows = invoices.map((i) => [
      i.invoiceId,
      `"${i.studentName}"`,
      `"${i.className}"`,
      `"${i.term}"`,
      i.subtotal,
      i.fineAccumulated,
      i.totalPayable,
      i.amountPaid,
      i.status.toUpperCase(),
      i.paymentDate || 'N/A',
      i.receiptNumber || 'N/A',
      i.transactionRef || 'N/A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `DPS_Fee_Ledger_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessToast('Official Fee Ledger CSV downloaded successfully!');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleAddPettyCash = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newPettyAmount);
    if (!newPettyDesc.trim() || isNaN(amt) || amt <= 0) return;

    const newEntry: PettyCashEntry = {
      id: `PC_${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: newPettyDesc.trim(),
      category: newPettyCategory,
      amount: amt,
      voucherNo: `VCH-2026-${Math.floor(100 + Math.random() * 900)}`,
    };

    setPettyCashList((prev) => [newEntry, ...prev]);
    setNewPettyDesc('');
    setNewPettyAmount('');
    setSuccessToast(`Petty cash voucher ${newEntry.voucherNo} recorded!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Handle New Student Admission Enrollment
  const handleNewAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admFullName.trim()) return;

    const selectedClassMeta =
      CLASS_OPTIONS.find((c) => c.id === admClassId) || CLASS_OPTIONS[0];

    const admissionNum =
      admCustomNo.trim() || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`;
    const studentRollNum =
      admRoll.trim() || `ROLL-${Date.now().toString().slice(-4)}`;
    const feeNum = parseFloat(admFee) || selectedClassMeta.defaultFee;

    const parentContactCombined = admParentName.trim()
      ? `${admParentName.trim()} · ${admParentPhone.trim()}`
      : admParentPhone.trim();

    const createdStudent = addStudent({
      admissionNumber: admissionNum,
      fullName: admFullName.trim(),
      avatarUrl:
        admAvatarUrl.trim() ||
        (selectedClassMeta.tier === 'pre_primary'
          ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'),
      classId: selectedClassMeta.id,
      className: selectedClassMeta.name,
      sectionId: selectedClassMeta.section,
      tier: selectedClassMeta.tier,
      stream: selectedClassMeta.stream,
      boardRollNumber: studentRollNum,
      parentUid: `USR_PAR_${Date.now().toString().slice(-4)}`,
      parentContact: parentContactCombined,
      bloodGroup: admBloodGroup,
      attendancePercentage: 100,
      initialTuitionFee: feeNum,
    });

    setViewingAdmissionSlip(createdStudent);
    setSuccessToast(
      `✓ New Student Enrolled! "${createdStudent.fullName}" admitted to ${createdStudent.className}. Synced live to Class Teacher (${selectedClassMeta.classTeacherName}) console!`
    );
    setTimeout(() => setSuccessToast(null), 6000);

    // Reset admission form
    setAdmFullName('');
    setAdmAvatarUrl('');
    setAdmRoll('');
    setAdmParentName('');
    setAdmParentPhone('+91 ');
    setAdmCustomNo(`ADM-2026-${Math.floor(100 + Math.random() * 900)}`);
  };

  // Handle Clerk Staff Salary Disbursement
  const handleClerkDisburseSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkSelectedStaffId) return;

    const staff = staffCredentials.find((s) => s.id === clerkSelectedStaffId);
    if (!staff) return;

    const base = Number(clerkBaseSalary) || 0;
    const bonus = Number(clerkBonus) || 0;
    const ded = Number(clerkDeduction) || 0;
    const net = Math.max(0, base + bonus - ded);

    const payment = disburseStaffSalary({
      paymentDate: new Date().toISOString().split('T')[0],
      monthYear: clerkSalaryMonth,
      staffId: staff.id,
      staffName: staff.fullName,
      staffRole: staff.role,
      staffDepartment: staff.departmentOrClass,
      employeeId: staff.employeeId,
      baseSalary: base,
      bonusOrAllowance: bonus,
      deductions: ded,
      netAmountPaid: net,
      paymentMode: clerkMode,
      transactionRef:
        clerkTxnRef.trim() ||
        `TXN-${clerkMode.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`,
      remarks: clerkRemarks.trim() || `Staff wage payout for ${clerkSalaryMonth}`,
      disbursedBy: `${currentUser.fullName} (Accounts & Bursar)`,
      status: 'paid',
    });

    setShowClerkPayoutModal(false);
    setViewingSalaryVoucher(payment);
    setSuccessToast(
      `Salary voucher ${payment.receiptVoucherNumber} issued! ₹${net.toLocaleString()} disbursed to ${staff.fullName} (${staff.role.replace('_', ' ')}).`
    );
    setTimeout(() => setSuccessToast(null), 5000);
    setClerkTxnRef('');
    setClerkRemarks('');
  };

  // Handle Add Support Staff from Clerk Desk
  const handleAddNewSupportStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const newStaffEmailVal =
      newStaffEmail.trim().toLowerCase() ||
      `${newStaffName.toLowerCase().replace(/\s+/g, '.')}.${Date.now().toString().slice(-3)}@edupulse.edu`;
    const newEmpId = `EMP-${newStaffRole.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-4)}`;

    acceptStaffCredential({
      fullName: newStaffName.trim(),
      role: newStaffRole,
      email: newStaffEmailVal,
      tempPassword: `${newStaffName.split(' ')[0]}@Edu2026!`,
      phoneNumber: newStaffPhone.trim() || '+91 98000 00000',
      employeeId: newEmpId,
      departmentOrClass: newStaffDept.trim() || `${newStaffRole.toUpperCase()} Support Services`,
      qualification: 'Verified Institutional Staff',
      dateOfJoining: new Date().toISOString().split('T')[0],
      status: 'active',
      avatarUrl: newStaffAvatar.trim() || undefined,
    });

    setShowAddSupportStaffModal(false);
    setSuccessToast(
      `New staff member "${newStaffName.trim()}" (${newStaffRole.replace('_', ' ')}) registered! Now eligible for salary payout.`
    );
    setTimeout(() => setSuccessToast(null), 5000);
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setNewStaffAvatar('');
  };

  // Filtered salary payments
  const filteredSalaryPayments = staffSalaryPayments.filter((p) => {
    const matchesSearch =
      p.staffName.toLowerCase().includes(salarySearchTerm.toLowerCase()) ||
      p.receiptVoucherNumber.toLowerCase().includes(salarySearchTerm.toLowerCase()) ||
      p.staffDepartment.toLowerCase().includes(salarySearchTerm.toLowerCase()) ||
      (p.employeeId && p.employeeId.toLowerCase().includes(salarySearchTerm.toLowerCase()));
    const matchesRole = salaryRoleFilter === 'all' || p.staffRole === salaryRoleFilter;
    const matchesMonth = salaryMonthFilter === 'all' || p.monthYear === salaryMonthFilter;
    return matchesSearch && matchesRole && matchesMonth;
  });

  const totalSalaryDisbursed = staffSalaryPayments.reduce((acc, p) => acc + p.netAmountPaid, 0);
  const facultySalaryTotal = staffSalaryPayments
    .filter((p) => ['teacher', 'class_teacher', 'principal'].includes(p.staffRole))
    .reduce((acc, p) => acc + p.netAmountPaid, 0);
  const supportStaffSalaryTotal = staffSalaryPayments
    .filter((p) => !['teacher', 'class_teacher', 'principal'].includes(p.staffRole))
    .reduce((acc, p) => acc + p.netAmountPaid, 0);

  // Filtered students for admission desk
  const filteredStudentsForDesk = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(admSearchQuery.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(admSearchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(admSearchQuery.toLowerCase()) ||
      (s.boardRollNumber && s.boardRollNumber.toLowerCase().includes(admSearchQuery.toLowerCase()))
  );

  const selectedInvoiceForPos = invoices.find((i) => i.invoiceId === selectedStudentInvoiceId);
  const tenderedNum = parseFloat(tenderedCash);
  const changeToReturn =
    selectedInvoiceForPos && !isNaN(tenderedNum)
      ? Math.max(0, tenderedNum - selectedInvoiceForPos.totalPayable)
      : 0;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Professional Executive Bursar Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 text-white p-3.5 sm:p-4 rounded-xl shadow-md border border-rose-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-semibold mb-1 border border-rose-400/30">
              <Receipt className="w-3 h-3" />
              <span>Central Bursar & Finance Desk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Institutional Accounts Console
            </h1>
            <p className="text-slate-300 text-xs">
              Fee collection, cash register, real-time ledger & parent invoicing.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700 text-right">
              <div className="text-[10px] text-slate-400">Till #1 Vault</div>
              <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                ₹{cashVaultCurrent.toLocaleString()}
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={logout}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-800/80 text-slate-300 hover:text-rose-200 text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-xs shrink-0"
              title="Sign Out to Front Page Login Screen"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Feedback Notification */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 sm:p-3 rounded-lg flex items-center justify-between animate-fade-in shadow-sm gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold truncate">{successToast}</p>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Reminder Dispatched Notification */}
      {sentNoticeNotice && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-2.5 sm:p-3 rounded-lg flex items-center justify-between animate-fade-in shadow-sm gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <Send className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs font-semibold truncate">{sentNoticeNotice}</p>
          </div>
          <button
            onClick={() => setSentNoticeNotice(null)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}



      {/* Top Accountant Navigation Switcher - 2 Rows (4 Buttons Top, 4 Buttons Below) */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs space-y-1.5">
        {/* Row 1: 4 Buttons on Top */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'ledger'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Fee Ledger ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'pos'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Counter POS</span>
          </button>

          <button
            onClick={() => setActiveTab('defaulters')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'defaulters'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">Defaulters ({defaultersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('admissions')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'admissions'
                ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 shrink-0 text-emerald-600 active:text-white" />
            <span className="truncate font-extrabold">New Admission ({students.length})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5 shrink-0" />
          </button>
        </div>

        {/* Row 2: 4 Buttons Below */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('staff_salary')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'staff_salary'
                ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 shrink-0 text-indigo-600 active:text-white" />
            <span className="truncate font-extrabold">Staff Salary Report ({staffSalaryPayments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('daybook')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'daybook'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Day Book & Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'analytics'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Financial Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('directives')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'directives'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              Directives ({staffDirectives.filter((d) => d.targetRole === 'accountant' || d.targetRole === 'all').length})
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WINDOW 1: STUDENT INVOICES & FEE LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'ledger' && (
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <Receipt className="w-4 h-4 text-rose-600" />
                <span>Student Fee Invoices & Collection Ledger</span>
              </h2>
              <p className="text-slate-500 text-xs">
                Filter by status, search admission numbers, or settle pending fees at counter.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student, invoice..."
                  className="text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 w-40 sm:w-48"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Only</option>
                <option value="paid">Settled Only</option>
              </select>

              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="all">All Grades</option>
                <option value="CLS_NURSERY">Nursery</option>
                <option value="CLS_05">Class 5-B</option>
                <option value="CLS_11">Class 11-A</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Subtotal</th>
                  <th className="py-2.5 px-3">Late Fine</th>
                  <th className="py-2.5 px-3">Total Payable</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-slate-400">
                      No invoices match the selected search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const isPending = inv.status === 'pending';
                    return (
                      <tr key={inv.invoiceId} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {inv.invoiceId}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {inv.studentName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{inv.className}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{inv.dueDate}</td>
                        <td className="py-2.5 px-3 font-mono">₹{inv.subtotal.toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-mono text-rose-600">
                          {inv.fineAccumulated > 0 ? `+₹${inv.fineAccumulated}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          ₹{inv.totalPayable.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              isPending
                                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                          {isPending ? (
                            <button
                              onClick={() => handleManualReconcile(inv.invoiceId)}
                              disabled={reconcilingId === inv.invoiceId}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] shadow-xs transition-all cursor-pointer"
                            >
                              {reconcilingId === inv.invoiceId ? 'Settling...' : 'Counter Settle'}
                            </button>
                          ) : (
                            <button
                              onClick={() => setViewingReceiptInvoice(inv)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] border border-slate-300 transition-all inline-flex items-center space-x-1 cursor-pointer"
                            >
                              <Printer className="w-3 h-3 text-slate-500" />
                              <span>View Receipt</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WINDOW 2: QUICK COUNTER POS TERMINAL */}
      {/* ========================================================================= */}
      {activeTab === 'pos' && (
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-rose-600" />
                <span>Counter POS Cashier Terminal</span>
              </h2>
              <p className="text-slate-500 text-xs">
                Direct walk-in payment collection desk for parents and students with instant printed E-Receipt.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              POS Till Active
            </span>
          </div>

          <form onSubmit={handlePosSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Student & Invoice Selection */}
              <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Student with Pending Dues
                  </label>
                  <select
                    value={selectedStudentInvoiceId}
                    onChange={(e) => {
                      setSelectedStudentInvoiceId(e.target.value);
                      const inv = invoices.find((i) => i.invoiceId === e.target.value);
                      if (inv) setTenderedCash(inv.totalPayable.toString());
                    }}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  >
                    <option value="">-- Choose student with outstanding balance --</option>
                    {invoices
                      .filter((i) => i.status === 'pending')
                      .map((inv) => (
                        <option key={inv.invoiceId} value={inv.invoiceId}>
                          {inv.studentName} ({inv.className}) • Due: ₹{inv.totalPayable.toLocaleString()}
                        </option>
                      ))}
                  </select>
                </div>

                {selectedInvoiceForPos && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-1.5">
                      <span className="font-bold text-slate-900">{selectedInvoiceForPos.studentName}</span>
                      <span className="font-mono text-slate-600 text-[11px]">{selectedInvoiceForPos.invoiceId}</span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      {selectedInvoiceForPos.lineItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-slate-600">
                          <span>{item.title}</span>
                          <span className="font-mono">₹{item.amount.toLocaleString()}</span>
                        </div>
                      ))}

                      {selectedInvoiceForPos.fineAccumulated > 0 && (
                        <div className="flex justify-between text-rose-600 font-semibold">
                          <span>Accumulated Late Fine</span>
                          <span className="font-mono">+₹{selectedInvoiceForPos.fineAccumulated}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1.5 flex justify-between text-xs font-bold text-slate-900">
                      <span>Total Net Payable</span>
                      <span className="text-sm font-black text-rose-700 font-mono">
                        ₹{selectedInvoiceForPos.totalPayable.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Payment Details & Tendered Calculation */}
              <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPosPaymentMethod('cash')}
                      className={`p-2 rounded-lg border text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        posPaymentMethod === 'cash'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Cash Counter</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPosPaymentMethod('upi')}
                      className={`p-2 rounded-lg border text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        posPaymentMethod === 'upi'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>UPI Dynamic QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPosPaymentMethod('card')}
                      className={`p-2 rounded-lg border text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        posPaymentMethod === 'card'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>POS Debit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPosPaymentMethod('cheque')}
                      className={`p-2 rounded-lg border text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        posPaymentMethod === 'cheque'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Bank Cheque / DD</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Amount Tendered (₹)
                    </label>
                    <input
                      type="number"
                      value={tenderedCash}
                      onChange={(e) => setTenderedCash(e.target.value)}
                      placeholder="e.g. 55000"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Change to Return
                    </label>
                    <div className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-100 font-mono font-bold text-emerald-700">
                      ₹{changeToReturn.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Bursar Internal Remarks
                  </label>
                  <input
                    type="text"
                    value={posNotes}
                    onChange={(e) => setPosNotes(e.target.value)}
                    placeholder="e.g. Parent paid via HDFC card swipe terminal"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={isProcessingPos || !selectedStudentInvoiceId}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center space-x-2 transition cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>
                  {isProcessingPos
                    ? 'Processing Payment...'
                    : 'Collect Payment & Print E-Receipt'}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WINDOW 3: DEFAULTERS & OUTSTANDING DUES */}
      {/* ========================================================================= */}
      {activeTab === 'defaulters' && (
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Defaulters List & Automated Reminder Dispatch</span>
              </h2>
              <p className="text-slate-500 text-xs">
                Track overdue invoices, calculated fine penalties, and transmit payment reminder notices.
              </p>
            </div>
            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200">
              {defaultersList.length} Outstanding Account{defaultersList.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-2">
            {defaultersList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <div className="font-bold text-slate-700 text-sm">All Accounts Settled!</div>
                <div className="text-xs text-slate-500 mt-0.5">There are no pending student dues currently.</div>
              </div>
            ) : (
              defaultersList.map((inv) => (
                <div
                  key={inv.invoiceId}
                  className="p-3 sm:p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">{inv.studentName}</span>
                      <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-600">
                        {inv.invoiceId}
                      </span>
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                        {inv.className}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center space-x-3">
                      <span>Due Date: <strong className="font-mono text-slate-800">{inv.dueDate}</strong></span>
                      <span>Late Fine: <strong className="font-mono text-rose-700">+₹{inv.fineAccumulated}</strong></span>
                      <span>Total Owed: <strong className="font-mono text-slate-900 text-xs">₹{inv.totalPayable.toLocaleString()}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleSendReminder(inv.studentName, inv.totalPayable)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center space-x-1 transition cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Notice</span>
                    </button>

                    <button
                      onClick={() => handleManualReconcile(inv.invoiceId)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      Counter Settle
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WINDOW 4: FINANCIAL ANALYTICS & BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Fee Categories Distribution */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Fee Heads Revenue Distribution</span>
                </h3>
                <span className="text-[10px] font-semibold text-slate-500">Q2 Allocations</span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Tuition & Instruction (62%)</span>
                    <span className="font-mono font-bold text-slate-900">₹72,000</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Bus & Transport Route #12 (17%)</span>
                    <span className="font-mono font-bold text-slate-900">₹19,500</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: '17%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Science, STEM & CS Consumables (12%)</span>
                    <span className="font-mono font-bold text-slate-900">₹13,500</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Sports & Sensory Play Kit (9%)</span>
                    <span className="font-mono font-bold text-slate-900">₹10,500</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '9%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Collection Channel Breakdown */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Payment Gateway & Channels</span>
                </h3>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Reconciliation: 100%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Online Razorpay / UPI</div>
                  <div className="text-base font-black text-slate-900 font-mono mt-1">₹63,000</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Auto Bank Settled</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Till Cash Counter</div>
                  <div className="text-base font-black text-slate-900 font-mono mt-1">₹0</div>
                  <div className="text-[10px] text-slate-500 font-medium">Safe Vault Custody</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Bank Cheque / DD</div>
                  <div className="text-base font-black text-slate-900 font-mono mt-1">₹0</div>
                  <div className="text-[10px] text-slate-500 font-medium">Clearance in 2 Days</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Overdue Receivables</div>
                  <div className="text-base font-black text-rose-600 font-mono mt-1">₹52,950</div>
                  <div className="text-[10px] text-rose-600 font-medium">Notice Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WINDOW 5: DAY BOOK, PETTY CASH & CASH DRAWER */}
      {/* ========================================================================= */}
      {activeTab === 'daybook' && (
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <Wallet className="w-4 h-4 text-teal-600" />
                <span>Daily Cash Day Book & Physical Vault Reconciliation</span>
              </h2>
              <p className="text-slate-500 text-xs">
                Physical cash register, petty cash vouchers, and closing drawer balance.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-mono font-bold">
                Date: {new Date().toISOString().split('T')[0]}
              </span>
            </div>
          </div>

          {/* Drawer Ledger Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Opening Vault</div>
              <div className="text-sm sm:text-base font-black text-slate-900 font-mono">
                ₹{cashVaultOpening.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Counter Receipts</div>
              <div className="text-sm sm:text-base font-black text-emerald-600 font-mono">
                +₹{totalCollected.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Petty Cash Vouchers</div>
              <div className="text-sm sm:text-base font-black text-rose-600 font-mono">
                -₹{totalPettyDisbursed.toLocaleString()}
              </div>
            </div>

            <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              <div className="text-[10px] text-emerald-800 font-bold uppercase">Current Net Balance</div>
              <div className="text-sm sm:text-base font-black text-emerald-700 font-mono">
                ₹{cashVaultCurrent.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Petty Cash Voucher Form & Log */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Record New Petty Cash Expenditure</span>
            </h3>

            <form onSubmit={handleAddPettyCash} className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={newPettyDesc}
                onChange={(e) => setNewPettyDesc(e.target.value)}
                placeholder="Expense purpose (e.g. Science lab chemical restocking)..."
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 flex-1 min-w-[200px]"
                required
              />

              <select
                value={newPettyCategory}
                onChange={(e) => setNewPettyCategory(e.target.value as any)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="office_supplies">Office Supplies</option>
                <option value="refreshment">Refreshment</option>
                <option value="maintenance">Maintenance</option>
                <option value="courier">Postage / Courier</option>
              </select>

              <input
                type="number"
                value={newPettyAmount}
                onChange={(e) => setNewPettyAmount(e.target.value)}
                placeholder="Amount (₹)"
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 w-28 font-mono"
                required
              />

              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                Log Voucher
              </button>
            </form>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Voucher #</th>
                    <th className="py-2 px-3">Time</th>
                    <th className="py-2 px-3">Purpose</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3 text-right">Amount Disbursed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {pettyCashList.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-800">{entry.voucherNo}</td>
                      <td className="py-2 px-3 font-mono text-slate-500">{entry.time}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{entry.description}</td>
                      <td className="py-2 px-3 capitalize text-slate-600">{entry.category.replace('_', ' ')}</td>
                      <td className="py-2 px-3 font-mono font-bold text-rose-600 text-right">
                        -₹{entry.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WINDOW 6: SUPER ADMIN DIRECTIVES */}
      {/* ========================================================================= */}
      {activeTab === 'directives' && (
        <div className="bg-white rounded-xl border border-rose-200 p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Super Admin Institutional Directives & Mandates
                </h3>
                <p className="text-[11px] text-slate-500">
                  Executive governance instructions dispatched to the Finance and Accounts desk.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Official Orders
            </span>
          </div>

          <div className="space-y-2">
            {staffDirectives.filter((d) => d.targetRole === 'accountant' || d.targetRole === 'all')
              .length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                No active directives assigned to the Accounts desk currently.
              </div>
            ) : (
              staffDirectives
                .filter((d) => d.targetRole === 'accountant' || d.targetRole === 'all')
                .map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <span className="font-bold text-xs text-slate-900">{d.title}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            d.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {d.priority}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Due: {d.deadline}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{d.instructions}</p>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {d.status !== 'completed' ? (
                        <button
                          onClick={() => updateDirectiveStatus(d.id, 'completed')}
                          className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 transition cursor-pointer"
                        >
                          ✓ Mark Completed
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Completed ✓
                        </span>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WINDOW 7: NEW STUDENT ADMISSION DESK (CLERK ENROLLMENT) */}
      {/* ========================================================================= */}
      {activeTab === 'admissions' && (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 mb-1">
                <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Student Admissions & Enrollment Desk</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                New Student Admission & Class Sync (नवीन छात्र प्रवेश)
              </h2>
              <p className="text-slate-500 text-xs">
                Save new admissions here. Enrolled students are immediately added to the assigned Class Teacher's roster, attendance register, and billing system.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
                Total Enrolled: <strong className="text-slate-900 font-mono font-bold">{students.length}</strong> Students
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Enrollment Form (Left / 5 Cols) */}
            <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>Admission Entry Form</span>
                  </h3>
                  <p className="text-slate-400 text-[11px]">Fill student particulars & guardian details</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  2026-27 Session
                </span>
              </div>

              <form onSubmit={handleNewAdmissionSubmit} className="space-y-3">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={admFullName}
                    onChange={(e) => setAdmFullName(e.target.value)}
                    placeholder="e.g. Devansh V. Sharma"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                {/* Student Photo Upload (Non-mandatory / Optional) */}
                <PhotoUploadField
                  label="Student Photo (छात्र की फ़ोटो)"
                  value={admAvatarUrl}
                  onChange={setAdmAvatarUrl}
                  entityType="student"
                  helperText="(Non-mandatory / वैकल्पिक)"
                />

                {/* Target Class & Section */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Enrolling Class & Stream <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={admClassId}
                    onChange={(e) => {
                      setAdmClassId(e.target.value);
                      const opt = CLASS_OPTIONS.find((c) => c.id === e.target.value);
                      if (opt) setAdmFee(opt.defaultFee.toString());
                    }}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} • In-Charge: {c.classTeacherName}
                      </option>
                    ))}
                  </select>
                  {/* Class Teacher Indicator */}
                  <div className="mt-1 text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-md border border-emerald-200 flex items-center justify-between">
                    <span>
                      Class Teacher In-Charge:{' '}
                      <strong>
                        {CLASS_OPTIONS.find((c) => c.id === admClassId)?.classTeacherName || 'Class In-Charge'}
                      </strong>
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-200/60 px-1.5 py-0.2 rounded text-emerald-900">
                      Auto-Sync
                    </span>
                  </div>
                </div>

                {/* Admission No & Roll No */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Admission Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={admCustomNo}
                      onChange={(e) => setAdmCustomNo(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Roll / Board Roll No.
                    </label>
                    <input
                      type="text"
                      value={admRoll}
                      onChange={(e) => setAdmRoll(e.target.value)}
                      placeholder="e.g. ROLL-042"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Guardian Details */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Parent / Guardian Name
                    </label>
                    <input
                      type="text"
                      value={admParentName}
                      onChange={(e) => setAdmParentName(e.target.value)}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Parent Mobile / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={admParentPhone}
                      onChange={(e) => setAdmParentPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Blood Group & Composite Admission Fee */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={admBloodGroup}
                      onChange={(e) => setAdmBloodGroup(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Composite Admission Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={admFee}
                      onChange={(e) => setAdmFee(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Confirm Admission & Sync to Class Teacher</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-1.5">
                    Generates official admission dossier & initial composite fee voucher
                  </p>
                </div>
              </form>
            </div>

            {/* Enrolled Students Directory (Right / 7 Cols) */}
            <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-slate-700" />
                    <span>Synchronized Institutional Roster ({filteredStudentsForDesk.length})</span>
                  </h3>
                  <p className="text-slate-400 text-[11px]">
                    All students synced with Class Teacher dashboards
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={admSearchQuery}
                    onChange={(e) => setAdmSearchQuery(e.target.value)}
                    placeholder="Search student, adm #..."
                    className="text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44 sm:w-56"
                  />
                </div>
              </div>

              {/* Students List */}
              <div className="overflow-x-auto rounded-lg border border-slate-200 max-h-[460px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="py-2 px-3">Adm #</th>
                      <th className="py-2 px-3">Student Name</th>
                      <th className="py-2 px-3">Class & Section</th>
                      <th className="py-2 px-3">Roll No.</th>
                      <th className="py-2 px-3">Parent Contact</th>
                      <th className="py-2 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredStudentsForDesk.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No students matching your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudentsForDesk.map((stu) => (
                        <tr key={stu.studentId} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-emerald-800">
                            {stu.admissionNumber}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center space-x-2">
                              <img
                                src={stu.avatarUrl}
                                alt={stu.fullName}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block leading-tight">
                                  {stu.fullName}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  Blood: {stu.bloodGroup}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                              {stu.className}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                            {stu.boardRollNumber || 'N/A'}
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-600">
                            {stu.parentContact}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setViewingAdmissionSlip(stu)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition flex items-center space-x-1 ml-auto cursor-pointer"
                              title="View Admission Certificate & Slip"
                            >
                              <Eye className="w-3 h-3 text-slate-600" />
                              <span>Slip</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WINDOW 8: STAFF SALARY & PAYOUTS REPORT (ALL STAFF ROLES: PEON, MAID, ETC.) */}
      {/* ========================================================================= */}
      {activeTab === 'staff_salary' && (
        <div className="space-y-4">
          {/* Header & Controls */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-bold border border-indigo-200 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                <span>Executive Payroll & Disbursement Report</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse ml-1" />
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Staff Fees & Salary Payouts Report (कर्मचारी वेतन एवं मानदेय रिपोर्ट)
              </h2>
              <p className="text-slate-500 text-xs">
                Audited disbursement records for all staff roles (Peon, Maid, Security Guard, Driver, Teachers, Principal, Accounts).
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => {
                  if (staffCredentials.length > 0 && !clerkSelectedStaffId) {
                    setClerkSelectedStaffId(staffCredentials[0].id);
                  }
                  setShowClerkPayoutModal(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Disburse Staff Fee</span>
              </button>

              <button
                onClick={() => setShowAddSupportStaffModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Staff</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Total Salary Disbursed</span>
                <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="text-base sm:text-xl font-black text-indigo-700 mt-0.5 font-mono">
                ₹{totalSalaryDisbursed.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {staffSalaryPayments.length} payment vouchers issued
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Support Staff Payouts</span>
                <Shield className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-base sm:text-xl font-black text-amber-600 mt-0.5 font-mono">
                ₹{supportStaffSalaryTotal.toLocaleString()}
              </div>
              <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                Peon, Maid, Driver, Guard, Lab
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Faculty & Academic Pay</span>
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="text-base sm:text-xl font-black text-blue-700 mt-0.5 font-mono">
                ₹{facultySalaryTotal.toLocaleString()}
              </div>
              <div className="text-[10px] text-blue-700 font-semibold mt-0.5">
                Teachers & Principal Payouts
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Onboarded Staff</span>
                <Users className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-base sm:text-xl font-black text-emerald-600 mt-0.5 font-mono">
                {staffCredentials.length} Staff
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                Active Staff Payroll Roster
              </div>
            </div>
          </div>

          {/* Table Card with Filter & Search */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Receipt className="w-4 h-4 text-indigo-600" />
                  <span>Salary & Fee Disbursement Ledger ({filteredSalaryPayments.length})</span>
                </h3>
                <p className="text-slate-500 text-xs">
                  Showing vouchers issued by Admin, Super Admin, and Bursar.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={salarySearchTerm}
                    onChange={(e) => setSalarySearchTerm(e.target.value)}
                    placeholder="Search staff, voucher..."
                    className="text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40 sm:w-48"
                  />
                </div>

                <select
                  value={salaryRoleFilter}
                  onChange={(e) => setSalaryRoleFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Roles</option>
                  <option value="peon">Peon (Office Attendant)</option>
                  <option value="maid">Maid (Housekeeping)</option>
                  <option value="security_guard">Security Guard</option>
                  <option value="driver">Driver</option>
                  <option value="teacher">Teacher</option>
                  <option value="class_teacher">Class Teacher</option>
                  <option value="principal">Principal</option>
                  <option value="accountant">Accountant / Clerk</option>
                </select>

                <select
                  value={salaryMonthFilter}
                  onChange={(e) => setSalaryMonthFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Months</option>
                  <option value="October 2026">October 2026</option>
                  <option value="September 2026">September 2026</option>
                  <option value="August 2026">August 2026</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Voucher #</th>
                    <th className="py-2.5 px-3">Date & Month</th>
                    <th className="py-2.5 px-3">Staff Name</th>
                    <th className="py-2.5 px-3">Role & Dept</th>
                    <th className="py-2.5 px-3">Base Pay</th>
                    <th className="py-2.5 px-3">Bonus / Ded</th>
                    <th className="py-2.5 px-3">Net Disbursed</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Disbursed By</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredSalaryPayments.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">
                        No staff fee payment records matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSalaryPayments.map((p) => {
                      const getRoleBadge = (role: string) => {
                        switch (role) {
                          case 'principal':
                            return 'bg-amber-100 text-amber-800 border-amber-200';
                          case 'teacher':
                          case 'class_teacher':
                            return 'bg-blue-100 text-blue-800 border-blue-200';
                          case 'peon':
                            return 'bg-orange-100 text-orange-800 border-orange-200';
                          case 'maid':
                            return 'bg-purple-100 text-purple-800 border-purple-200';
                          case 'security_guard':
                            return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                          case 'driver':
                            return 'bg-cyan-100 text-cyan-800 border-cyan-200';
                          default:
                            return 'bg-slate-100 text-slate-800 border-slate-200';
                        }
                      };

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">
                            {p.receiptVoucherNumber}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            <div>{p.paymentDate}</div>
                            <div className="text-[10px] text-slate-400">{p.monthYear}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{p.staffName}</div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {p.employeeId || 'EMP-STAFF'}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleBadge(
                                p.staffRole
                              )}`}
                            >
                              {p.staffRole.replace('_', ' ')}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[130px]">
                              {p.staffDepartment}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">
                            ₹{p.baseSalary.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">
                            {p.bonusOrAllowance > 0 && (
                              <span className="text-emerald-600 block">+₹{p.bonusOrAllowance}</span>
                            )}
                            {p.deductions > 0 && (
                              <span className="text-rose-600 block">-₹{p.deductions}</span>
                            )}
                            {p.bonusOrAllowance === 0 && p.deductions === 0 && (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-black text-slate-900">
                            ₹{p.netAmountPaid.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {p.paymentMode.replace('_', ' ')}
                            </span>
                            <div className="text-[9px] font-mono text-slate-400 truncate max-w-[90px]">
                              {p.transactionRef}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-600">
                            {p.disbursedBy}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setViewingSalaryVoucher(p)}
                              className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-bold transition flex items-center space-x-1 ml-auto cursor-pointer"
                              title="View & Print Official Voucher"
                            >
                              <Printer className="w-3 h-3 text-indigo-600" />
                              <span>Voucher</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* KPI Financial Metric Summary Cards - Total Invoiced, Realized Collection, Outstanding Dues, Late Penalties */}
      {/* Placed at the bottom as requested: sabse neeche */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-4">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Total Invoiced</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-base sm:text-xl font-black text-slate-900 mt-0.5 font-mono">
            ₹{totalBilled.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">3 Academic Tiers active</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Realized Collection</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-base sm:text-xl font-black text-emerald-600 mt-0.5 font-mono">
            ₹{totalCollected.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center space-x-1">
            <span>{collectionRate}% Realization</span>
            <span className="text-[9px] text-slate-400">({paidCount} Paid)</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Outstanding Dues</span>
            <Clock className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-base sm:text-xl font-black text-rose-600 mt-0.5 font-mono">
            ₹{totalOutstanding.toLocaleString()}
          </div>
          <div className="text-[10px] text-rose-700 font-semibold mt-0.5">
            {pendingCount} Pending Invoice{pendingCount !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Late Penalties</span>
            <Scale className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-base sm:text-xl font-black text-amber-600 mt-0.5 font-mono">
            ₹{totalFines.toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">
            ₹50/day grace policy
          </div>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* OFFICIAL CBSE SCHOOL FEE E-RECEIPT MODAL WINDOW */}
      {/* ========================================================================= */}
      {viewingReceiptInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 relative my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Official Fee E-Receipt
                  </h2>
                  <p className="text-slate-500 text-[11px]">
                    Authorized Institutional Tax Invoice & Receipt
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingReceiptInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Authentic Printable Receipt Body */}
            <div className="border border-slate-300 rounded-xl p-4 sm:p-5 space-y-3.5 bg-slate-50/40 text-xs">
              {/* School Branding */}
              <div className="text-center border-b border-slate-200 pb-3">
                <div className="text-sm font-black uppercase text-slate-900 tracking-wide">
                  DELHI PUBLIC ACADEMY & SENIOR SECONDARY SCHOOL
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Affiliated to Central Board of Secondary Education (CBSE), New Delhi • Affiliation No. 2130842
                </div>
                <div className="text-[10px] text-slate-500">
                  Plot 14, Institutional Area, Sector 5, Vasant Kunj • accounts@dpsacademy.edu.in
                </div>
                <div className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold">
                  STUDENT FEE RECEIPT • ACADEMIC SESSION 2026-27
                </div>
              </div>

              {/* Receipt Metadata */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500">Receipt No: </span>
                  <strong className="font-mono text-slate-900">
                    {viewingReceiptInvoice.receiptNumber || 'REC-2026-0891'}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Date: </span>
                  <strong className="font-mono text-slate-900">
                    {viewingReceiptInvoice.paymentDate || new Date().toISOString().split('T')[0]}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Student Name: </span>
                  <strong className="text-slate-900">{viewingReceiptInvoice.studentName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Class & Section: </span>
                  <strong className="text-slate-900">{viewingReceiptInvoice.className}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Term: </span>
                  <strong className="text-slate-900">{viewingReceiptInvoice.term}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Invoice ID: </span>
                  <strong className="font-mono text-slate-900">{viewingReceiptInvoice.invoiceId}</strong>
                </div>
              </div>

              {/* Fee Heads Breakdown */}
              <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-1.5 px-2.5">S.No.</th>
                      <th className="py-1.5 px-2.5">Particulars / Fee Head</th>
                      <th className="py-1.5 px-2.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {viewingReceiptInvoice.lineItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="py-1.5 px-2.5 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-1.5 px-2.5 font-medium">{item.title}</td>
                        <td className="py-1.5 px-2.5 font-mono text-right">₹{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    {viewingReceiptInvoice.fineAccumulated > 0 && (
                      <tr className="text-rose-700">
                        <td className="py-1.5 px-2.5 font-mono text-slate-400">#</td>
                        <td className="py-1.5 px-2.5 font-medium">Late Payment Fee Grace Penalty</td>
                        <td className="py-1.5 px-2.5 font-mono text-right">+₹{viewingReceiptInvoice.fineAccumulated}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <tr>
                      <td colSpan={2} className="py-2 px-2.5 text-right">
                        TOTAL AMOUNT SETTLED:
                      </td>
                      <td className="py-2 px-2.5 font-mono text-right text-xs text-rose-700 font-black">
                        ₹{viewingReceiptInvoice.totalPayable.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Transaction & Signature Box */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] items-end">
                <div className="space-y-0.5 text-slate-600">
                  <div>
                    Payment Mode: <strong className="font-semibold text-slate-900">Counter Cash & Electronic Ledger</strong>
                  </div>
                  <div>
                    Txn Ref: <strong className="font-mono text-slate-900">{viewingReceiptInvoice.transactionRef || 'TXN_ONLINE_88192039'}</strong>
                  </div>
                  <div className="text-emerald-700 font-bold mt-1">
                    ✓ Computer generated receipt; requires no physical signature.
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block border-t border-slate-400 pt-1 text-slate-800 font-bold">
                    Authorized Signatory / Bursar
                  </div>
                  <div className="text-[9px] text-slate-500">School Accounts Office</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingReceiptInvoice(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. OFFICIAL STUDENT ADMISSION DOSSIER & SLIP MODAL */}
      {/* ========================================================================= */}
      {viewingAdmissionSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 relative my-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Official Student Admission Certificate & Slip
                  </h2>
                  <p className="text-slate-500 text-[11px]">
                    Institutional Enrollment Dossier • Synced to Class Teacher
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingAdmissionSlip(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Body */}
            <div className="border border-slate-300 rounded-xl p-4 sm:p-5 space-y-3.5 bg-slate-50/40 text-xs">
              <div className="text-center border-b border-slate-200 pb-3">
                <div className="text-sm font-black uppercase text-slate-900 tracking-wide">
                  DELHI PUBLIC ACADEMY & SENIOR SECONDARY SCHOOL
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Affiliated to Central Board of Secondary Education (CBSE), New Delhi • Affiliation No. 2130842
                </div>
                <div className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-emerald-900 text-white font-mono text-[10px] font-bold">
                  STUDENT ADMISSION CERTIFICATE • SESSION 2026-27
                </div>
              </div>

              {/* Student Particulars with Photo */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-3 bg-white p-3 rounded-lg border border-slate-200">
                <img
                  src={viewingAdmissionSlip.avatarUrl}
                  alt={viewingAdmissionSlip.fullName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-xs shrink-0"
                />
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] w-full">
                  <div>
                    <span className="text-slate-500">Admission No: </span>
                    <strong className="font-mono text-emerald-800 font-bold">
                      {viewingAdmissionSlip.admissionNumber}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Enrollment Date: </span>
                    <strong className="font-mono text-slate-900">
                      {new Date().toISOString().split('T')[0]}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Student Name: </span>
                    <strong className="text-slate-900 text-xs">{viewingAdmissionSlip.fullName}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Roll / Board Roll: </span>
                    <strong className="font-mono text-slate-900">
                      {viewingAdmissionSlip.boardRollNumber || 'N/A'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Class & Section: </span>
                    <strong className="text-slate-900">{viewingAdmissionSlip.className}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Blood Group: </span>
                    <strong className="text-slate-900">{viewingAdmissionSlip.bloodGroup}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Parent / Guardian Contact: </span>
                    <strong className="text-slate-900">{viewingAdmissionSlip.parentContact}</strong>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  <span>Real-Time Multi-Console Synchronization Confirmed</span>
                </div>
                <p className="text-[10px] text-emerald-700">
                  This student record has been committed to the central school database and is immediately active on the Class Teacher's class console, timetable seat, and attendance roll.
                </p>
              </div>

              {/* Signature Block */}
              <div className="grid grid-cols-2 gap-3 pt-3 text-[10px] items-end border-t border-slate-200">
                <div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                    Accounts Clerk / Bursar
                  </div>
                  <div className="text-[9px] text-slate-500">Office of Admissions & Finance</div>
                </div>
                <div className="text-right">
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                    Class Teacher / In-Charge
                  </div>
                  <div className="text-[9px] text-slate-500">Academic Verification</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Admission Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingAdmissionSlip(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. OFFICIAL STAFF SALARY VOUCHER MODAL */}
      {/* ========================================================================= */}
      {viewingSalaryVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 relative my-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Official Staff Salary Payment Voucher
                  </h2>
                  <p className="text-slate-500 text-[11px]">
                    Institutional Payroll Disbursement & Wage Slip
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingSalaryVoucher(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Body */}
            <div className="border border-slate-300 rounded-xl p-4 sm:p-5 space-y-3.5 bg-slate-50/40 text-xs">
              <div className="text-center border-b border-slate-200 pb-3">
                <div className="text-sm font-black uppercase text-slate-900 tracking-wide">
                  DELHI PUBLIC ACADEMY & SENIOR SECONDARY SCHOOL
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Central Accounts & Bursar Wing • Sector 5, Vasant Kunj
                </div>
                <div className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-indigo-900 text-white font-mono text-[10px] font-bold">
                  STAFF SALARY / FEE DISBURSEMENT VOUCHER • {viewingSalaryVoucher.monthYear.toUpperCase()}
                </div>
              </div>

              {/* Voucher Metadata */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500">Voucher No: </span>
                  <strong className="font-mono text-indigo-700 font-bold">
                    {viewingSalaryVoucher.receiptVoucherNumber}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Disbursement Date: </span>
                  <strong className="font-mono text-slate-900">
                    {viewingSalaryVoucher.paymentDate}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Staff Name: </span>
                  <strong className="text-slate-900 text-xs">{viewingSalaryVoucher.staffName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Employee ID: </span>
                  <strong className="font-mono text-slate-900">
                    {viewingSalaryVoucher.employeeId || 'EMP-STAFF'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Role / Designation: </span>
                  <strong className="text-slate-900 capitalize">
                    {viewingSalaryVoucher.staffRole.replace('_', ' ')}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Department: </span>
                  <strong className="text-slate-900">{viewingSalaryVoucher.staffDepartment}</strong>
                </div>
              </div>

              {/* Salary Breakdown Table */}
              <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-1.5 px-2.5">Salary Head / Component</th>
                      <th className="py-1.5 px-2.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-1.5 px-2.5">Base Remuneration / Wage</td>
                      <td className="py-1.5 px-2.5 font-mono text-right">
                        ₹{viewingSalaryVoucher.baseSalary.toLocaleString()}
                      </td>
                    </tr>
                    {viewingSalaryVoucher.bonusOrAllowance > 0 && (
                      <tr className="text-emerald-700">
                        <td className="py-1.5 px-2.5">Special Duty Allowance / Bonus (+)</td>
                        <td className="py-1.5 px-2.5 font-mono text-right">
                          +₹{viewingSalaryVoucher.bonusOrAllowance.toLocaleString()}
                        </td>
                      </tr>
                    )}
                    {viewingSalaryVoucher.deductions > 0 && (
                      <tr className="text-rose-700">
                        <td className="py-1.5 px-2.5">Statutory / Leave Deductions (-)</td>
                        <td className="py-1.5 px-2.5 font-mono text-right">
                          -₹{viewingSalaryVoucher.deductions.toLocaleString()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <tr>
                      <td className="py-2 px-2.5 text-right">NET AMOUNT DISBURSED:</td>
                      <td className="py-2 px-2.5 font-mono text-right text-xs text-indigo-700 font-black">
                        ₹{viewingSalaryVoucher.netAmountPaid.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Transaction Particulars */}
              <div className="text-[10px] space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                <div>
                  Payment Mode: <strong className="uppercase">{viewingSalaryVoucher.paymentMode.replace('_', ' ')}</strong>
                </div>
                <div>
                  Transaction Ref: <strong className="font-mono">{viewingSalaryVoucher.transactionRef}</strong>
                </div>
                <div>
                  Disbursed By: <strong>{viewingSalaryVoucher.disbursedBy}</strong>
                </div>
                {viewingSalaryVoucher.remarks && (
                  <div className="text-slate-500 italic">"{viewingSalaryVoucher.remarks}"</div>
                )}
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-3 pt-3 text-[10px] items-end border-t border-slate-200">
                <div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                    Staff Member Signature
                  </div>
                  <div className="text-[9px] text-slate-500">Receiver Acknowledgment</div>
                </div>
                <div className="text-right">
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                    Bursar / Cashier
                  </div>
                  <div className="text-[9px] text-slate-500">School Finance Officer</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Voucher</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingSalaryVoucher(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CLERK DISBURSE STAFF SALARY / FEE MODAL */}
      {/* ========================================================================= */}
      {showClerkPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Disburse Staff Fees & Remuneration
                  </h2>
                  <p className="text-slate-500 text-[11px]">
                    Pay Peon, Maid, Driver, Guard, Teacher, or Principal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowClerkPayoutModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClerkDisburseSalary} className="space-y-3">
              {/* Select Staff Member */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Select Staff Member <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowClerkPayoutModal(false);
                      setShowAddSupportStaffModal(true);
                    }}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add New Support Staff</span>
                  </button>
                </div>
                <select
                  value={clerkSelectedStaffId}
                  onChange={(e) => {
                    setClerkSelectedStaffId(e.target.value);
                    const st = staffCredentials.find((s) => s.id === e.target.value);
                    if (st) {
                      if (st.role === 'peon' || st.role === 'maid') setClerkBaseSalary('12000');
                      else if (st.role === 'driver' || st.role === 'security_guard') setClerkBaseSalary('15000');
                      else if (st.role === 'teacher' || st.role === 'class_teacher') setClerkBaseSalary('35000');
                      else if (st.role === 'principal') setClerkBaseSalary('65000');
                      else setClerkBaseSalary('20000');
                    }
                  }}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {staffCredentials.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.role.replace('_', ' ').toUpperCase()}) • {st.departmentOrClass}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Salary Month / Cycle
                </label>
                <select
                  value={clerkSalaryMonth}
                  onChange={(e) => setClerkSalaryMonth(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="October 2026">October 2026</option>
                  <option value="September 2026">September 2026</option>
                  <option value="November 2026">November 2026</option>
                </select>
              </div>

              {/* Financials: Base, Bonus, Deductions */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Base Salary (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={clerkBaseSalary}
                    onChange={(e) => setClerkBaseSalary(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Allowances (₹)
                  </label>
                  <input
                    type="number"
                    value={clerkBonus}
                    onChange={(e) => setClerkBonus(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Deductions (₹)
                  </label>
                  <input
                    type="number"
                    value={clerkDeduction}
                    onChange={(e) => setClerkDeduction(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Net Payout Banner */}
              <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">Calculated Net Payout:</span>
                <span className="text-base font-mono font-black text-indigo-700">
                  ₹{Math.max(
                    0,
                    (Number(clerkBaseSalary) || 0) + (Number(clerkBonus) || 0) - (Number(clerkDeduction) || 0)
                  ).toLocaleString()}
                </span>
              </div>

              {/* Payment Mode & Ref */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Disbursement Mode
                  </label>
                  <select
                    value={clerkMode}
                    onChange={(e) => setClerkMode(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="bank_transfer">Bank Direct Transfer</option>
                    <option value="cash">Counter Cash</option>
                    <option value="upi">UPI / IMPS</option>
                    <option value="cheque">Bank Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Txn Ref / Cheque No
                  </label>
                  <input
                    type="text"
                    value={clerkTxnRef}
                    onChange={(e) => setClerkTxnRef(e.target.value)}
                    placeholder="Auto-generated if blank"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={clerkRemarks}
                  onChange={(e) => setClerkRemarks(e.target.value)}
                  placeholder="e.g. Regular monthly stipend / overtime bonus"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowClerkPayoutModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Payout & Issue Voucher</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ADD SUPPORT STAFF MODAL (PEON, MAID, GUARD, DRIVER) */}
      {/* ========================================================================= */}
      {showAddSupportStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-slate-900 text-white">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Add Staff Member (सपोर्ट स्टाफ जोड़ें)
                  </h2>
                  <p className="text-slate-500 text-[11px]">
                    Register Peon, Maid, Security, Driver or Lab Staff
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSupportStaffModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewSupportStaff} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Staff Role / Designation <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newStaffRole}
                  onChange={(e) => {
                    const r = e.target.value as StaffRole;
                    setNewStaffRole(r);
                    if (r === 'peon') setNewStaffDept('Office Attendant & Facilities');
                    else if (r === 'maid') setNewStaffDept('Housekeeping & Nursery Care');
                    else if (r === 'security_guard') setNewStaffDept('Campus Security');
                    else if (r === 'driver') setNewStaffDept('Transport Services');
                    else if (r === 'lab_assistant') setNewStaffDept('Science Laboratory');
                    else if (r === 'librarian') setNewStaffDept('Library & Media');
                  }}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                >
                  <option value="peon">Peon (Office Attendant)</option>
                  <option value="maid">Maid (Housekeeping & Nursery Care)</option>
                  <option value="security_guard">Security Guard</option>
                  <option value="driver">School Bus / Van Driver</option>
                  <option value="lab_assistant">Lab Assistant</option>
                  <option value="librarian">Librarian</option>
                  <option value="teacher">Faculty Teacher</option>
                  <option value="class_teacher">Class Teacher</option>
                </select>
              </div>

              {/* Staff Photo Upload (Non-mandatory / Optional) */}
              <PhotoUploadField
                label="Staff Photo (कर्मचारी की फ़ोटो)"
                value={newStaffAvatar}
                onChange={setNewStaffAvatar}
                entityType="staff"
                helperText="(Non-mandatory / वैकल्पिक)"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Department / Area
                  </label>
                  <input
                    type="text"
                    value={newStaffDept}
                    onChange={(e) => setNewStaffDept(e.target.value)}
                    placeholder="e.g. Transport Wing"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="Auto-generated if empty"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupportStaffModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Register Staff Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
