import React, { useState } from 'react';
import { useSMS } from '../../context/SMSContext';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Users,
  Building,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Briefcase,
  DollarSign,
  Lock,
  ArrowRight,
  RefreshCw,
  Clock,
  Send,
  Phone,
  Mail,
  Award,
  X,
  Activity,
  Compass,
  MessageSquare,
  Plus,
  SendHorizontal,
  Bell,
  CheckSquare,
  Radio,
  FileCheck,
  Trash2,
  Calendar,
  MessageCircle,
  Receipt,
  Download,
  Printer,
  Wallet,
  CreditCard,
  TrendingUp,
  Truck,
  Shield,
  FileText,
  Camera,
} from 'lucide-react';
import {
  StaffRole,
  StaffCredential,
  StaffDirective,
  StaffActivityLog,
  StaffSalaryPayment,
} from '../../types';
import { PhotoUploadField } from '../common/PhotoUploadField';

export const SuperAdminDashboard: React.FC = () => {
  const {
    staffCredentials,
    acceptStaffCredential,
    updateStaffCredentialStatus,
    deleteStaffCredential,
    staffActivities,
    addStaffActivity,
    staffDirectives,
    issueStaffDirective,
    updateDirectiveStatus,
    deleteDirective,
    staffMessages,
    sendStaffMessage,
    markStaffMessageRead,
    staffSalaryPayments,
    disburseStaffSalary,
    deleteStaffSalaryPayment,
    users,
    setCurrentUser,
    students,
    dashboardStats,
  } = useSMS();

  // Modal window state for Staff Login Credentials
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  // Tab state (defaults to roster)
  const [activeTab, setActiveTab] = useState<
    'roster' | 'salary' | 'activities' | 'directives' | 'communication' | 'rbac'
  >('roster');

  // Staff Salary / Fees Disbursement State
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [selectedSalaryStaffId, setSelectedSalaryStaffId] = useState<string>('');
  const [salaryMonth, setSalaryMonth] = useState<string>('October 2026');
  const [salaryBaseAmount, setSalaryBaseAmount] = useState<string>('18000');
  const [salaryBonusAllowance, setSalaryBonusAllowance] = useState<string>('0');
  const [salaryDeductions, setSalaryDeductions] = useState<string>('0');
  const [salaryPaymentMode, setSalaryPaymentMode] = useState<
    'bank_transfer' | 'cash' | 'upi' | 'cheque'
  >('bank_transfer');
  const [salaryTxnRef, setSalaryTxnRef] = useState<string>('');
  const [salaryRemarks, setSalaryRemarks] = useState<string>('');
  const [salaryFilterRole, setSalaryFilterRole] = useState<string>('all');
  const [salarySearch, setSalarySearch] = useState<string>('');
  const [viewingSalarySlip, setViewingSalarySlip] = useState<StaffSalaryPayment | null>(null);

  // Role filter in roster
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Activity filter state
  const [activityCategoryFilter, setActivityCategoryFilter] = useState<string>('all');
  const [activityStaffFilter, setActivityStaffFilter] = useState<string>('all');

  // Directives creation modal & form state
  const [showDirectiveModal, setShowDirectiveModal] = useState(false);
  const [directiveFilter, setDirectiveFilter] = useState<'all' | 'urgent' | 'in_progress' | 'pending' | 'completed'>('all');
  const [dirTitle, setDirTitle] = useState('');
  const [dirInstructions, setDirInstructions] = useState('');
  const [dirTargetStaffId, setDirTargetStaffId] = useState<string>('ALL_STAFF');
  const [dirPriority, setDirPriority] = useState<'urgent' | 'high' | 'normal'>('high');
  const [dirCategory, setDirCategory] = useState<'administrative' | 'academic' | 'compliance' | 'finance'>('academic');
  const [dirDeadline, setDirDeadline] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );

  // Communication message form state
  const [commRecipientId, setCommRecipientId] = useState<string>('ALL_STAFF');
  const [commMessageText, setCommMessageText] = useState('');
  const [commPriority, setCommPriority] = useState<'normal' | 'urgent'>('normal');
  const [commNotice, setCommNotice] = useState<string | null>(null);
  const [commFilter, setCommFilter] = useState<'all' | 'broadcast' | 'direct' | 'urgent'>('all');

  // Form state for creating/accepting new credentials
  const [selectedRole, setSelectedRole] = useState<StaffRole>('principal');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [departmentOrClass, setDepartmentOrClass] = useState('');
  const [qualification, setQualification] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState(new Date().toISOString().split('T')[0]);
  const [staffAvatar, setStaffAvatar] = useState('');

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Generate randomized strong password
  const generateStrongPassword = () => {
    const rolePrefix =
      selectedRole === 'principal'
        ? 'Prin'
        : selectedRole === 'class_teacher'
        ? 'ClsTch'
        : selectedRole === 'teacher'
        ? 'Teach'
        : selectedRole === 'accountant'
        ? 'Acc'
        : selectedRole === 'peon'
        ? 'Peon'
        : selectedRole === 'maid'
        ? 'Maid'
        : selectedRole === 'security_guard'
        ? 'Sec'
        : selectedRole === 'driver'
        ? 'Drv'
        : selectedRole === 'lab_assistant'
        ? 'Lab'
        : selectedRole === 'librarian'
        ? 'Lib'
        : 'Stf';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const generated = `${rolePrefix}@Edu${randNum}!`;
    setPassword(generated);
  };

  // Generate default employee ID when role changes
  const handleRoleChange = (role: StaffRole) => {
    setSelectedRole(role);
    const prefix =
      role === 'principal'
        ? 'EMP-PRIN'
        : role === 'class_teacher'
        ? 'EMP-CT'
        : role === 'teacher'
        ? 'EMP-TCH'
        : role === 'accountant'
        ? 'EMP-ACC'
        : role === 'peon'
        ? 'EMP-PEON'
        : role === 'maid'
        ? 'EMP-MAID'
        : role === 'security_guard'
        ? 'EMP-SEC'
        : role === 'driver'
        ? 'EMP-DRV'
        : role === 'lab_assistant'
        ? 'EMP-LAB'
        : role === 'librarian'
        ? 'EMP-LIB'
        : 'EMP-STF';
    const count = staffCredentials.filter((c) => c.role === role).length + 1;
    setEmployeeId(`${prefix}-${String(count).padStart(3, '0')}`);

    // Suggest department
    if (role === 'principal') setDepartmentOrClass('Head of School / Executive Administration');
    if (role === 'class_teacher') setDepartmentOrClass('Class 10-A In-Charge & Academic Mentor');
    if (role === 'teacher') setDepartmentOrClass('Senior Secondary Mathematics & Faculty');
    if (role === 'accountant') setDepartmentOrClass('Finance Desk, Fee Bursar & Accounts');
    if (role === 'peon') setDepartmentOrClass('Office Attendant & Bell Operations');
    if (role === 'maid') setDepartmentOrClass('Housekeeping, Sanitation & Nursery Care');
    if (role === 'security_guard') setDepartmentOrClass('Main Gate Security & Campus Safety');
    if (role === 'driver') setDepartmentOrClass('Transport Dept / School Bus Fleet');
    if (role === 'lab_assistant') setDepartmentOrClass('Science Laboratory Support & Equipment Care');
    if (role === 'librarian') setDepartmentOrClass('Central Library & Archives Desk');
    if (role === 'other') setDepartmentOrClass('General Campus Operations & Support');
  };

  const handleSelectStaffForSalary = (staffId: string) => {
    setSelectedSalaryStaffId(staffId);
    const staff = staffCredentials.find((s) => s.id === staffId);
    if (!staff) return;

    let defaultBase = 18000;
    if (staff.role === 'principal') defaultBase = 125000;
    else if (staff.role === 'teacher') defaultBase = 65000;
    else if (staff.role === 'class_teacher') defaultBase = 55000;
    else if (staff.role === 'accountant') defaultBase = 48000;
    else if (staff.role === 'peon') defaultBase = 18000;
    else if (staff.role === 'maid') defaultBase = 16500;
    else if (staff.role === 'security_guard') defaultBase = 20000;
    else if (staff.role === 'driver') defaultBase = 22000;
    else if (staff.role === 'lab_assistant') defaultBase = 25000;
    else if (staff.role === 'librarian') defaultBase = 35000;

    setSalaryBaseAmount(String(defaultBase));
    setSalaryBonusAllowance('0');
    setSalaryDeductions('0');
    setSalaryRemarks(`Monthly salary and wage settlement for ${salaryMonth}`);
  };

  const handleDisburseSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSalaryStaffId) {
      return;
    }

    const staff = staffCredentials.find((s) => s.id === selectedSalaryStaffId);
    if (!staff) return;

    const base = Number(salaryBaseAmount) || 0;
    const bonus = Number(salaryBonusAllowance) || 0;
    const ded = Number(salaryDeductions) || 0;
    const net = Math.max(0, base + bonus - ded);

    const newPayment = disburseStaffSalary({
      paymentDate: new Date().toISOString().split('T')[0],
      monthYear: salaryMonth,
      staffId: staff.id,
      staffName: staff.fullName,
      staffRole: staff.role,
      staffDepartment: staff.departmentOrClass,
      employeeId: staff.employeeId,
      baseSalary: base,
      bonusOrAllowance: bonus,
      deductions: ded,
      netAmountPaid: net,
      paymentMode: salaryPaymentMode,
      transactionRef: salaryTxnRef.trim() || `TXN-${salaryPaymentMode.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`,
      remarks: salaryRemarks.trim() || `Staff wage payout for ${salaryMonth}`,
      disbursedBy: 'Super Admin Management Board',
      status: 'paid',
    });

    setSuccessNotice(`Salary voucher ${newPayment.receiptVoucherNumber} generated! ₹${net.toLocaleString()} disbursed to ${staff.fullName} (${staff.role.replace('_', ' ')}).`);
    setShowSalaryModal(false);
    setSalaryTxnRef('');
    setSalaryRemarks('');
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const handleAcceptCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      return;
    }

    acceptStaffCredential({
      fullName: fullName.trim(),
      role: selectedRole,
      email: email.trim().toLowerCase(),
      tempPassword: password,
      phoneNumber: phoneNumber.trim() || '+91 98000 00000',
      employeeId: employeeId.trim() || `EMP-${Date.now().toString().slice(-4)}`,
      departmentOrClass: departmentOrClass.trim() || 'General Faculty',
      qualification: qualification.trim() || 'Qualified Professional',
      dateOfJoining: dateOfJoining || new Date().toISOString().split('T')[0],
      status: 'active',
      avatarUrl: staffAvatar.trim() || undefined,
    });

    setSuccessNotice(`New ${selectedRole.replace('_', ' ')} login credentials accepted for "${fullName.trim()}"!`);
    
    // Reset form and close modal
    setFullName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setDepartmentOrClass('');
    setQualification('');
    setStaffAvatar('');
    setShowCredentialsModal(false);

    setTimeout(() => {
      setSuccessNotice(null);
    }, 5000);
  };

  const handleCreateDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirTitle.trim() || !dirInstructions.trim()) return;

    let targetName = 'All Staff Members';
    let targetRole: StaffRole | 'all' = 'all';

    if (dirTargetStaffId !== 'ALL_STAFF') {
      const foundStaff = staffCredentials.find((s) => s.id === dirTargetStaffId);
      if (foundStaff) {
        targetName = `${foundStaff.fullName} (${foundStaff.role.replace('_', ' ')})`;
        targetRole = foundStaff.role;
      }
    }

    issueStaffDirective({
      title: dirTitle.trim(),
      instructions: dirInstructions.trim(),
      targetStaffId: dirTargetStaffId,
      targetStaffName: targetName,
      targetRole,
      priority: dirPriority,
      deadline: dirDeadline,
      category: dirCategory,
    });

    setDirTitle('');
    setDirInstructions('');
    setShowDirectiveModal(false);
    setSuccessNotice(`Directive "${dirTitle.trim()}" dispatched successfully!`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleSendStaffMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commMessageText.trim()) return;

    let targetName = 'All Institutional Staff (Broadcast)';
    const isBroadcast = commRecipientId === 'ALL_STAFF';

    if (!isBroadcast) {
      const foundStaff = staffCredentials.find((s) => s.id === commRecipientId);
      if (foundStaff) {
        targetName = `${foundStaff.fullName} (${foundStaff.role.replace('_', ' ')})`;
      }
    }

    sendStaffMessage(commRecipientId, targetName, commMessageText.trim(), isBroadcast, commPriority);
    setCommMessageText('');
    setCommNotice(`Message dispatched to ${targetName}!`);
    setTimeout(() => setCommNotice(null), 3500);
  };

  const handleSimulateLiveActivity = () => {
    const randomStaff = staffCredentials[Math.floor(Math.random() * staffCredentials.length)];
    const sampleActions = [
      {
        action: 'Completed Period 3 Physics Lab Optical Experiment',
        category: 'academic' as const,
        details: 'Verified light refraction angles with 24 student experiment notebooks.',
      },
      {
        action: 'Verified Daily Fee Collection & Cash Counter Register',
        category: 'finance' as const,
        details: 'Reconciled ₹24,500 cash receipts against bank counter deposit scroll.',
      },
      {
        action: 'Updated Pre-Primary Nutrition & Rest Observation Sheet',
        category: 'academic' as const,
        details: 'Logged motor skills activity and afternoon rest period metrics for Nursery.',
      },
      {
        action: 'Audited Weekly Faculty Absence & Substitution Roster',
        category: 'administration' as const,
        details: 'Assigned zero period substitution smoothly without instructional disruption.',
      },
    ];
    const picked = sampleActions[Math.floor(Math.random() * sampleActions.length)];

    addStaffActivity({
      staffId: randomStaff ? randomStaff.id : 'CRED_PRIN_01',
      staffName: randomStaff ? randomStaff.fullName : 'Dr. Alok Verma',
      role: randomStaff ? randomStaff.role : 'principal',
      action: picked.action,
      category: picked.category,
      status: 'completed',
      details: picked.details,
    });
    setSuccessNotice('New live activity logged in real-time stream!');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleDirectSpecificStaff = (staffId: string) => {
    setDirTargetStaffId(staffId);
    setShowDirectiveModal(true);
  };

  const handleMessageSpecificStaff = (staffId: string) => {
    setCommRecipientId(staffId);
    setActiveTab('communication');
  };

  const toggleRevealPassword = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredCredentials = staffCredentials.filter((cred) => {
    const matchesRole = roleFilter === 'all' || cred.role === roleFilter;
    const matchesSearch =
      cred.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.departmentOrClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const roleColorBadge = (role: StaffRole) => {
    switch (role) {
      case 'principal':
        return 'bg-amber-500/10 text-amber-700 border-amber-300';
      case 'teacher':
        return 'bg-blue-500/10 text-blue-700 border-blue-300';
      case 'class_teacher':
        return 'bg-teal-500/10 text-teal-700 border-teal-300';
      case 'accountant':
        return 'bg-rose-500/10 text-rose-700 border-rose-300';
      case 'peon':
        return 'bg-orange-500/10 text-orange-700 border-orange-300';
      case 'maid':
        return 'bg-pink-500/10 text-pink-700 border-pink-300';
      case 'security_guard':
        return 'bg-purple-500/10 text-purple-700 border-purple-300';
      case 'driver':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-300';
      case 'lab_assistant':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-300';
      case 'librarian':
        return 'bg-indigo-500/10 text-indigo-700 border-indigo-300';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-300';
    }
  };

  const roleNameLabel = (role: StaffRole) => {
    switch (role) {
      case 'principal':
        return 'Principal';
      case 'teacher':
        return 'Subject Teacher';
      case 'class_teacher':
        return 'Class Teacher';
      case 'accountant':
        return 'Accountant';
      case 'peon':
        return 'Peon / Attendant';
      case 'maid':
        return 'Maid / Housekeeping';
      case 'security_guard':
        return 'Security Guard';
      case 'driver':
        return 'Bus Driver';
      case 'lab_assistant':
        return 'Lab Assistant';
      case 'librarian':
        return 'Librarian';
      default:
        return 'Support Staff';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Super Admin Top Executive Banner - Compact */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-3.5 sm:p-4 rounded-xl shadow-md border border-rose-900/40">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold mb-1 border border-rose-500/30">
              <ShieldAlert className="w-3 h-3" />
              <span>Super Admin</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Institutional Admin Console
            </h1>
            <p className="text-slate-300 text-xs">
              Staff onboarding and credential issuance.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                if (staffCredentials.length > 0 && !selectedSalaryStaffId) {
                  handleSelectStaffForSalary(staffCredentials[0].id);
                }
                setActiveTab('salary');
                setShowSalaryModal(true);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-sm"
              title="Disburse Staff Fee / Salary"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Pay Staff Fees / Salary</span>
              <span className="xs:hidden">Pay Salary</span>
            </button>

            <button
              onClick={() => setShowCredentialsModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-sm"
              title="Add New Staff Credentials (Peon, Maid, Teachers)"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Add Staff</span>
            </button>

            <div className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-right shrink-0">
              <div className="text-[10px] text-slate-400">Staff Count</div>
              <div className="text-sm sm:text-base font-black text-rose-300">{staffCredentials.length} Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 sm:p-3 rounded-lg flex items-center justify-between animate-fade-in shadow-sm gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold truncate">{successNotice}</p>
          </div>
          <button
            onClick={() => setActiveTab('salary')}
            className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded hover:bg-emerald-700 transition shrink-0"
          >
            Ledger →
          </button>
        </div>
      )}

      {/* Super Admin Navigation Switcher - 2 Rows (3 Buttons Top, 3 Buttons Below) */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs space-y-1.5">
        {/* Row 1: 3 Buttons on Top */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('roster')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'roster'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Staff Roster ({staffCredentials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('salary')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'salary'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Staff Fees / Salary ({staffSalaryPayments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'activities'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">Staff Activity ({staffActivities.length})</span>
          </button>
        </div>

        {/* Row 2: 3 Buttons Below */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('directives')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'directives'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              Directives ({staffDirectives.filter((d) => d.status !== 'completed').length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('communication')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'communication'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Communication ({staffMessages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rbac')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'rbac'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Permissions</span>
          </button>
        </div>
      </div>


      {/* STAFF LOGIN CREDENTIALS MODAL WINDOW */}
      {showCredentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Staff Login Credentials
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCredentialsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAcceptCredential} className="space-y-4">
              {/* Step 1: Select Staff Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Role *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { role: 'principal' as StaffRole, label: 'Principal', icon: Building },
                    { role: 'teacher' as StaffRole, label: 'Teacher', icon: BookOpen },
                    { role: 'class_teacher' as StaffRole, label: 'Class Teacher', icon: GraduationCap },
                    { role: 'accountant' as StaffRole, label: 'Accountant', icon: DollarSign },
                    { role: 'peon' as StaffRole, label: 'Peon / Attendant', icon: Bell },
                    { role: 'maid' as StaffRole, label: 'Maid / Housekeeping', icon: Sparkles },
                    { role: 'security_guard' as StaffRole, label: 'Security Guard', icon: Shield },
                    { role: 'driver' as StaffRole, label: 'Bus Driver', icon: Truck },
                    { role: 'lab_assistant' as StaffRole, label: 'Lab Assistant', icon: Briefcase },
                    { role: 'librarian' as StaffRole, label: 'Librarian', icon: BookOpen },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedRole === item.role;
                    return (
                      <button
                        type="button"
                        key={item.role}
                        onClick={() => handleRoleChange(item.role)}
                        className={`py-2 px-3 rounded-lg border text-left transition-all cursor-pointer flex items-center space-x-2 ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50 text-rose-900 ring-1 ring-rose-500 font-bold'
                            : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Chander"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Official Email (Login ID) *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="staff@edupulse.edu"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={generateStrongPassword}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Generate</span>
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Staff ID
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="EMP-PRIN-001"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Department / Class
                  </label>
                  <input
                    type="text"
                    value={departmentOrClass}
                    onChange={(e) => setDepartmentOrClass(e.target.value)}
                    placeholder="Department or Class"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                  />
                </div>
              </div>

              {/* Staff Photo Upload (Non-mandatory / Optional) */}
              <PhotoUploadField
                label="Staff Profile Photo (कर्मचारी की फ़ोटो)"
                value={staffAvatar}
                onChange={setStaffAvatar}
                entityType="staff"
                helperText="(Non-mandatory / वैकल्पिक)"
              />

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCredentialsModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIRECTIVE & MANDATE CREATION MODAL */}
      {showDirectiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Issue Staff Directive / Executive Order
                  </h2>
                  <p className="text-slate-500 text-xs">Direct faculty or specific staff with official mandates & deadlines.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDirectiveModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Template Chips */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                Quick Mandate Templates (1-Click Fill)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  {
                    label: 'CBSE Affiliation Audit',
                    title: 'CBSE Affiliation Standard Compliance Audit',
                    category: 'compliance' as const,
                    priority: 'urgent' as const,
                    instructions: 'Prepare complete laboratory records, safety compliance certificates, and faculty attendance logs for board review.',
                  },
                  {
                    label: 'Lab Practical Verification',
                    title: 'Senior Secondary Physics & Chemistry Practical File Verification',
                    category: 'academic' as const,
                    priority: 'high' as const,
                    instructions: 'Ensure all Class 11 & 12 students have completed experiment apparatus readings and journals before term exam.',
                  },
                  {
                    label: 'Fee Defaulters Reminders',
                    title: 'Quarter 2 Fee Defaulters Notice & Payment Link Dispatch',
                    category: 'finance' as const,
                    priority: 'high' as const,
                    instructions: 'Send automated WhatsApp and SMS reminders to parents with overdue fee invoices exceeding 30 days.',
                  },
                  {
                    label: 'Monthly PTM Scheduling',
                    title: 'Parent-Teacher Conference Scheduling (Class 10 & 11)',
                    category: 'administrative' as const,
                    priority: 'normal' as const,
                    instructions: 'Set up 1-on-1 video call slots for parents of students with attendance below 75% threshold.',
                  },
                ].map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDirTitle(tmpl.title);
                      setDirCategory(tmpl.category);
                      setDirPriority(tmpl.priority);
                      setDirInstructions(tmpl.instructions);
                    }}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-200 transition cursor-pointer"
                  >
                    + {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateDirective} className="space-y-3.5">
              {/* Target Staff Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Recipient / Staff Member *
                </label>
                <select
                  value={dirTargetStaffId}
                  onChange={(e) => setDirTargetStaffId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/50"
                >
                  <option value="ALL_STAFF">📢 All Institutional Staff (Campus-Wide Directive)</option>
                  {staffCredentials.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} — {roleNameLabel(c.role)} ({c.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Directive Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Directive Title *
                </label>
                <input
                  type="text"
                  required
                  value={dirTitle}
                  onChange={(e) => setDirTitle(e.target.value)}
                  placeholder="e.g. Term 2 Practical File Verification & Roll Review"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Category, Priority & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={dirCategory}
                    onChange={(e) => setDirCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  >
                    <option value="academic">Academic</option>
                    <option value="compliance">Compliance</option>
                    <option value="administrative">Administrative</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={dirPriority}
                    onChange={(e) => setDirPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  >
                    <option value="urgent">🔴 Urgent / High Alert</option>
                    <option value="high">🟠 High Priority</option>
                    <option value="normal">🔵 Normal Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Completion Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={dirDeadline}
                    onChange={(e) => setDirDeadline(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                </div>
              </div>

              {/* Instructions text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Instructions & Guidelines *
                </label>
                <textarea
                  required
                  rows={3}
                  value={dirInstructions}
                  onChange={(e) => setDirInstructions(e.target.value)}
                  placeholder="Detail step-by-step instructions, submission criteria, or documentation requirements..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDirectiveModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Directive</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 1: AUTHORIZED STAFF ROSTER & CREDENTIALS DIRECTORY */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Staff Credentials Roster
              </h2>
              <p className="text-slate-500 text-xs">
                Active login credentials approved by Super Admin.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCredentialsModal(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0 shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Staff Login Credentials</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff, email, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All' },
                { id: 'principal', label: 'Principal' },
                { id: 'teacher', label: 'Teacher' },
                { id: 'class_teacher', label: 'Class Teacher' },
                { id: 'accountant', label: 'Accountant' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setRoleFilter(pill.id)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition ${
                    roleFilter === pill.id
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5">
            {filteredCredentials.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No staff credentials found.
              </div>
            ) : (
              filteredCredentials.map((cred) => {
                const isPasswordRevealed = revealedPasswords[cred.id] || false;
                const isCopied = copiedId === cred.id;

                const matchedUser = users.find(
                  (u) => u.email.toLowerCase() === cred.email.toLowerCase() || u.fullName === cred.fullName
                );

                return (
                  <div
                    key={cred.id}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {cred.avatarUrl || matchedUser?.avatarUrl ? (
                          <img
                            src={cred.avatarUrl || matchedUser?.avatarUrl}
                            alt={cred.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-300 shadow-2xs shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {cred.fullName.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {cred.fullName}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${roleColorBadge(
                                cred.role
                              )}`}
                            >
                              {roleNameLabel(cred.role)}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {cred.employeeId} · {cred.departmentOrClass}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        {matchedUser && (
                          <button
                            onClick={() => setCurrentUser(matchedUser)}
                            className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition flex items-center space-x-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Test Login</span>
                          </button>
                        )}

                        <button
                          onClick={() =>
                            updateStaffCredentialStatus(
                              cred.id,
                              cred.status === 'active' ? 'suspended' : 'active'
                            )
                          }
                          className={`text-xs px-2 py-1 rounded border font-medium ${
                            cred.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {cred.status === 'active' ? 'Active' : 'Suspended'}
                        </button>
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded-lg text-xs border border-slate-100">
                      <div className="text-slate-600 truncate max-w-xs">
                        <span className="text-slate-400 mr-1.5">Email:</span>
                        <span className="font-medium">{cred.email}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Pass:</span>
                        <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-xs">
                          {isPasswordRevealed ? cred.tempPassword : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleRevealPassword(cred.id)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          {isPasswordRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              `Email: ${cred.email}\nPassword: ${cred.tempPassword}`,
                              cred.id
                            )
                          }
                          className="text-rose-600 hover:text-rose-800 flex items-center space-x-0.5"
                          title="Copy"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[10px] font-bold">{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB: STAFF FEES & SALARY DISBURSEMENT (वेतन व फीस रजिस्टर) */}
      {activeTab === 'salary' && (
        <div className="space-y-4">
          {/* Top Quick Actions Bar */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  <span>Staff Salary & Wages Register (स्टाफ वेतन व फीस)</span>
                </h2>
                <p className="text-slate-500 text-xs">
                  Pay, calculate, and disburse monthly wages & honorariums for all teaching faculty, administrators, and support personnel (Peon, Maid, Driver, Guard).
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (staffCredentials.length > 0 && !selectedSalaryStaffId) {
                      handleSelectStaffForSalary(staffCredentials[0].id);
                    }
                    setShowSalaryModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Disburse Salary</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCredentialsModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add New Staff</span>
                </button>
              </div>
            </div>

            {/* Financial Aggregate Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  Total Disbursed (Net)
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  ₹{staffSalaryPayments.reduce((acc, p) => acc + p.netAmountPaid, 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  {staffSalaryPayments.length} Payout Vouchers
                </div>
              </div>

              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200">
                <div className="text-[10px] font-bold text-orange-800 uppercase tracking-wide">
                  Support Staff Wages
                </div>
                <div className="text-lg sm:text-xl font-black text-orange-950 mt-0.5">
                  ₹{staffSalaryPayments
                    .filter((p) => ['peon', 'maid', 'security_guard', 'driver', 'other'].includes(p.staffRole))
                    .reduce((acc, p) => acc + p.netAmountPaid, 0)
                    .toLocaleString()}
                </div>
                <div className="text-[10px] text-orange-700 font-semibold mt-0.5">
                  Peons, Maids, Guards, Drivers
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
                <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                  Teaching Faculty Pay
                </div>
                <div className="text-lg sm:text-xl font-black text-blue-950 mt-0.5">
                  ₹{staffSalaryPayments
                    .filter((p) => ['teacher', 'class_teacher'].includes(p.staffRole))
                    .reduce((acc, p) => acc + p.netAmountPaid, 0)
                    .toLocaleString()}
                </div>
                <div className="text-[10px] text-blue-700 font-semibold mt-0.5">
                  PGT, TGT & Class Mentors
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200">
                <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wide">
                  Admin & Exec Payroll
                </div>
                <div className="text-lg sm:text-xl font-black text-purple-950 mt-0.5">
                  ₹{staffSalaryPayments
                    .filter((p) => ['principal', 'accountant'].includes(p.staffRole))
                    .reduce((acc, p) => acc + p.netAmountPaid, 0)
                    .toLocaleString()}
                </div>
                <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                  Principal & Accounts Desk
                </div>
              </div>
            </div>
          </div>

          {/* Quick Salary Payout Station (Disburse Form) */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Disburse Staff Remuneration / Wage Voucher
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Select any staff member (Teacher, Peon, Maid, Driver) or add a new staff profile directly.
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Central Disbursement Desk
              </span>
            </div>

            <form onSubmit={handleDisburseSalary} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Select Staff Member */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Select Staff Member *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCredentialsModal(true)}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Staff (Peon/Maid/etc)</span>
                    </button>
                  </div>
                  <select
                    required
                    value={selectedSalaryStaffId}
                    onChange={(e) => handleSelectStaffForSalary(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white font-medium"
                  >
                    <option value="">-- Choose Any Staff Member --</option>
                    {staffCredentials.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.fullName} · {roleNameLabel(staff.role)} ({staff.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Salary Month / Cycle */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Cycle / Month *
                  </label>
                  <input
                    type="text"
                    required
                    value={salaryMonth}
                    onChange={(e) => setSalaryMonth(e.target.value)}
                    placeholder="e.g. October 2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Disbursement Mode *
                  </label>
                  <select
                    value={salaryPaymentMode}
                    onChange={(e) => setSalaryPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  >
                    <option value="bank_transfer">Direct Bank Transfer (NEFT / IMPS)</option>
                    <option value="cash">Cash Desk Counter</option>
                    <option value="upi">UPI / Digital Gateway</option>
                    <option value="cheque">Bank Account Cheque</option>
                  </select>
                </div>
              </div>

              {/* Salary Figures Calculation Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Base Salary / Wage (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={salaryBaseAmount}
                    onChange={(e) => setSalaryBaseAmount(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Bonus / Allowances (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={salaryBonusAllowance}
                    onChange={(e) => setSalaryBonusAllowance(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono font-bold text-emerald-700 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Deductions / Advances (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={salaryDeductions}
                    onChange={(e) => setSalaryDeductions(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono font-bold text-rose-700 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                </div>

                {/* Net Payable Box */}
                <div className="bg-emerald-900 text-white p-2.5 rounded-lg flex flex-col justify-between border border-emerald-800">
                  <span className="text-[10px] font-bold uppercase text-emerald-200">
                    Net Payout Amount
                  </span>
                  <div className="text-lg sm:text-xl font-black font-mono">
                    ₹{Math.max(
                      0,
                      (Number(salaryBaseAmount) || 0) +
                        (Number(salaryBonusAllowance) || 0) -
                        (Number(salaryDeductions) || 0)
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Reference & Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Txn / Cheque / Voucher Ref
                  </label>
                  <input
                    type="text"
                    value={salaryTxnRef}
                    onChange={(e) => setSalaryTxnRef(e.target.value)}
                    placeholder="e.g. NEFT-HDFC-9912048 or CSH-VCH-801"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Disbursement Remarks / Description
                  </label>
                  <input
                    type="text"
                    value={salaryRemarks}
                    onChange={(e) => setSalaryRemarks(e.target.value)}
                    placeholder="e.g. Monthly wage settlement with festival incentive"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={!selectedSalaryStaffId}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Disburse Salary (वेतन भुगतान करें)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Salary Records Ledger & Audit Table */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Staff Remuneration Records & Vouchers ({staffSalaryPayments.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Audited register of all staff fees and wages paid. Synchronized in real time with the clerk/bursar accounts report.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search voucher, staff..."
                    value={salarySearch}
                    onChange={(e) => setSalarySearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Roles' },
                { id: 'peon', label: 'Peons (चपरासी)' },
                { id: 'maid', label: 'Maids (आया)' },
                { id: 'security_guard', label: 'Guards (गार्ड)' },
                { id: 'driver', label: 'Drivers (ड्राइवर)' },
                { id: 'teacher', label: 'Teachers' },
                { id: 'class_teacher', label: 'Class Teachers' },
                { id: 'principal', label: 'Principal' },
                { id: 'accountant', label: 'Accountant' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSalaryFilterRole(pill.id)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    salaryFilterRole === pill.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Voucher # / Date</th>
                    <th className="py-2.5 px-3">Staff Personnel</th>
                    <th className="py-2.5 px-3">Role & Dept</th>
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3 text-right">Net Amount</th>
                    <th className="py-2.5 px-3">Mode & Ref</th>
                    <th className="py-2.5 px-3">Authorized By</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {staffSalaryPayments
                    .filter((p) => {
                      const matchesRole = salaryFilterRole === 'all' || p.staffRole === salaryFilterRole;
                      const matchesSearch =
                        !salarySearch ||
                        p.staffName.toLowerCase().includes(salarySearch.toLowerCase()) ||
                        p.employeeId.toLowerCase().includes(salarySearch.toLowerCase()) ||
                        p.receiptVoucherNumber.toLowerCase().includes(salarySearch.toLowerCase()) ||
                        p.remarks.toLowerCase().includes(salarySearch.toLowerCase());
                      return matchesRole && matchesSearch;
                    })
                    .map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-slate-900 block">
                            {pay.receiptVoucherNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">{pay.paymentDate}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{pay.staffName}</div>
                          <div className="text-[10px] font-mono text-slate-500">{pay.employeeId}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded border inline-block ${roleColorBadge(
                              pay.staffRole
                            )}`}
                          >
                            {roleNameLabel(pay.staffRole)}
                          </span>
                          <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                            {pay.staffDepartment}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">{pay.monthYear}</td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="font-mono font-black text-xs sm:text-sm text-emerald-700">
                            ₹{pay.netAmountPaid.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Base ₹{pay.baseSalary} + ₹{pay.bonusOrAllowance} - ₹{pay.deductions}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {pay.paymentMode.replace('_', ' ')}
                          </span>
                          <div className="text-[10px] font-mono text-slate-400 truncate max-w-[110px]">
                            {pay.transactionRef}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">{pay.disbursedBy}</td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => setViewingSalarySlip(pay)}
                              className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 transition cursor-pointer flex items-center space-x-1"
                              title="Print / View Payslip"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Slip</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Void salary voucher ${pay.receiptVoucherNumber}?`)) {
                                  deleteStaffSalaryPayment(pay.id);
                                }
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Void Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REAL-TIME STAFF ACTIVITY MONITOR */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Institutional Staff Activity Stream
                </h2>
              </div>
              <p className="text-slate-500 text-xs">
                Live audit of attendance commits, lectures, exam scoring, and accounts collections across all staff.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSimulateLiveActivity}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Live Event</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Total Activity Logs</div>
              <div className="text-base sm:text-lg font-black text-slate-900">{staffActivities.length}</div>
            </div>
            <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-200 text-center">
              <div className="text-[10px] font-bold text-blue-700 uppercase">Academic & Teaching</div>
              <div className="text-base sm:text-lg font-black text-blue-900">
                {staffActivities.filter((a) => a.category === 'academic').length}
              </div>
            </div>
            <div className="bg-teal-50/50 p-2.5 rounded-lg border border-teal-200 text-center">
              <div className="text-[10px] font-bold text-teal-700 uppercase">Attendance Commits</div>
              <div className="text-base sm:text-lg font-black text-teal-900">
                {staffActivities.filter((a) => a.category === 'attendance').length}
              </div>
            </div>
            <div className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-200 text-center">
              <div className="text-[10px] font-bold text-rose-700 uppercase">Finance Reconciled</div>
              <div className="text-base sm:text-lg font-black text-rose-900">
                {staffActivities.filter((a) => a.category === 'finance').length}
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff, action, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/50"
              />
            </div>

            {/* Staff Filter Dropdown & Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={activityStaffFilter}
                onChange={(e) => setActivityStaffFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="all">All Staff Members</option>
                {staffCredentials.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({roleNameLabel(c.role)})
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'attendance', label: 'Attendance' },
                  { id: 'academic', label: 'Academic' },
                  { id: 'finance', label: 'Finance' },
                  { id: 'administration', label: 'Admin' },
                  { id: 'communication', label: 'Circulars' },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setActivityCategoryFilter(pill.id)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      activityCategoryFilter === pill.id
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Cards Feed */}
          <div className="space-y-2.5">
            {staffActivities
              .filter((act) => {
                const matchesCat = activityCategoryFilter === 'all' || act.category === activityCategoryFilter;
                const matchesStaff = activityStaffFilter === 'all' || act.staffId === activityStaffFilter;
                const matchesSearch =
                  !searchQuery ||
                  act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  act.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (act.details && act.details.toLowerCase().includes(searchQuery.toLowerCase()));
                return matchesCat && matchesStaff && matchesSearch;
              })
              .map((act) => {
                return (
                  <div
                    key={act.id}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {act.staffName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {act.staffName}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${roleColorBadge(
                                act.role
                              )}`}
                            >
                              {roleNameLabel(act.role)}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                              {act.category.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-800 mt-0.5">
                            {act.action}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
                        <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{act.timestamp}</span>
                          <span className="text-slate-300">({act.timeAgo})</span>
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            act.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : act.status === 'in_progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {act.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {act.details && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600 flex items-start space-x-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span>{act.details}</span>
                      </div>
                    )}

                    {/* Quick Direct Super Admin Interventions */}
                    <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-50">
                      <button
                        type="button"
                        onClick={() => handleDirectSpecificStaff(act.staffId)}
                        className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <Compass className="w-3 h-3" />
                        <span>Direct Staff</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMessageSpecificStaff(act.staffId)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 3: STAFF DIRECTIVES & EXECUTIVE MANDATES */}
      {activeTab === 'directives' && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Compass className="w-4 h-4 text-rose-600" />
                <span>Staff Directives & Executive Orders</span>
              </h2>
              <p className="text-slate-500 text-xs">
                Assign compliance mandates, academic goals, and instructions with strict deadlines.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDirectiveModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Directive</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1">
            {[
              { id: 'all', label: `All (${staffDirectives.length})` },
              {
                id: 'urgent',
                label: `Urgent (${staffDirectives.filter((d) => d.priority === 'urgent').length})`,
              },
              {
                id: 'in_progress',
                label: `In Progress (${staffDirectives.filter((d) => d.status === 'in_progress').length})`,
              },
              {
                id: 'pending',
                label: `Pending (${staffDirectives.filter((d) => d.status === 'pending').length})`,
              },
              {
                id: 'completed',
                label: `Completed (${staffDirectives.filter((d) => d.status === 'completed').length})`,
              },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setDirectiveFilter(pill.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  directiveFilter === pill.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Directives Cards List */}
          <div className="space-y-3">
            {staffDirectives
              .filter((d) => {
                if (directiveFilter === 'all') return true;
                if (directiveFilter === 'urgent') return d.priority === 'urgent';
                return d.status === directiveFilter;
              })
              .map((dir) => {
                return (
                  <div
                    key={dir.id}
                    className={`p-4 rounded-xl border transition-all space-y-2.5 bg-white ${
                      dir.priority === 'urgent'
                        ? 'border-rose-300 shadow-rose-100/50 shadow-sm'
                        : 'border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                              dir.priority === 'urgent'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : dir.priority === 'high'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-blue-100 text-blue-800 border-blue-300'
                            }`}
                          >
                            {dir.priority} Priority
                          </span>

                          <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                            {dir.category}
                          </span>

                          <span className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Deadline: {dir.deadline}</span>
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {dir.title}
                        </h3>
                      </div>

                      {/* Status Badges & Controls */}
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {dir.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => updateDirectiveStatus(dir.id, 'in_progress')}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition cursor-pointer"
                          >
                            ▶ Mark In-Progress
                          </button>
                        )}

                        {dir.status === 'in_progress' && (
                          <button
                            type="button"
                            onClick={() => updateDirectiveStatus(dir.id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>
                        )}

                        {dir.status === 'completed' && (
                          <button
                            type="button"
                            onClick={() => updateDirectiveStatus(dir.id, 'in_progress')}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-medium transition cursor-pointer"
                          >
                            Re-open
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteDirective(dir.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Directive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Assigned Target Staff & Instructions */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>Assigned To: <strong>{dir.targetStaffName}</strong></span>
                        </span>
                        <span className="text-[11px] text-slate-400">Issued: {dir.issuedAt}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{dir.instructions}</p>
                    </div>

                    {/* Follow up communication trigger */}
                    <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-50">
                      <button
                        type="button"
                        onClick={() => handleMessageSpecificStaff(dir.targetStaffId)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3 text-slate-500" />
                        <span>Follow-up Message</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 4: DIRECT COMMUNICATION & FACULTY BROADCAST DESK */}
      {activeTab === 'communication' && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-rose-600" />
              <span>Staff Communication & Notice Desk</span>
            </h2>
            <p className="text-slate-500 text-xs">
              Direct institutional communication with principals, teachers, and accountants. Send 1-on-1 memos or campus-wide broadcasts.
            </p>
          </div>

          {/* Feedback notice toast */}
          {commNotice && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 rounded-lg flex items-center space-x-2 animate-fade-in shadow-xs text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{commNotice}</span>
            </div>
          )}

          {/* Composer Console */}
          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase flex items-center space-x-1.5">
                <Send className="w-3 h-3 text-rose-600" />
                <span>Compose Staff Message / Circular</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Logged as: Super Admin</span>
            </div>

            {/* Quick Template Chips */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 mb-1">Quick Executive Messages:</div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Urgent Faculty Briefing at 2:00 PM today in Main Auditorium.',
                  'Reminder: Commit daily roll-call attendance before 10:30 AM.',
                  'Please submit monthly expenditure vouchers and fee collection summary.',
                  'Commendation: Outstanding laboratory safety & student engagement.',
                ].map((msgText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCommMessageText(msgText)}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-200 transition cursor-pointer truncate max-w-xs"
                    title={msgText}
                  >
                    + {msgText}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendStaffMessage} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Recipient
                  </label>
                  <select
                    value={commRecipientId}
                    onChange={(e) => setCommRecipientId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="ALL_STAFF">📢 All Institutional Staff (Campus Broadcast)</option>
                    {staffCredentials.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} — {roleNameLabel(c.role)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Alert
                  </label>
                  <select
                    value={commPriority}
                    onChange={(e) => setCommPriority(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="normal">🔵 Normal Institutional Memo</option>
                    <option value="urgent">🔴 Urgent Emergency Circular</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  required
                  value={commMessageText}
                  onChange={(e) => setCommMessageText(e.target.value)}
                  placeholder="Type official message, directive instructions, or circular announcement..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {commRecipientId === 'ALL_STAFF'
                    ? 'Broadcast will be delivered to Principal, Teachers, and Accountants.'
                    : 'Confidential 1-to-1 dispatch to selected staff member.'}
                </span>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  <span>Dispatch Message</span>
                </button>
              </div>
            </form>
          </div>

          {/* Messages Feed Header & Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Communication Feed ({staffMessages.length})
            </h3>

            <div className="flex items-center space-x-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'broadcast', label: 'Broadcasts' },
                { id: 'direct', label: '1-to-1 Direct' },
                { id: 'urgent', label: 'Urgent' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setCommFilter(pill.id as any)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    commFilter === pill.id
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Stream Cards */}
          <div className="space-y-2.5">
            {staffMessages
              .filter((m) => {
                if (commFilter === 'all') return true;
                if (commFilter === 'broadcast') return m.isBroadcast;
                if (commFilter === 'direct') return !m.isBroadcast;
                if (commFilter === 'urgent') return m.priority === 'urgent';
                return true;
              })
              .map((msg) => {
                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl border transition-all space-y-2 bg-white ${
                      msg.priority === 'urgent'
                        ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            msg.isBroadcast
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {msg.isBroadcast ? '📢 BROADCAST' : '1-ON-1 DIRECT'}
                        </span>

                        <span className="text-xs font-bold text-slate-900">
                          To: {msg.toStaffName}
                        </span>

                        {msg.priority === 'urgent' && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-300">
                            URGENT
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{msg.timestamp}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => markStaffMessageRead(msg.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border transition cursor-pointer ${
                            msg.isRead
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {msg.isRead ? 'Read ✓' : 'Mark Read'}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                      {msg.message}
                    </p>

                    {!msg.isBroadcast && (
                      <div className="flex items-center justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setCommRecipientId(msg.toStaffId);
                            setCommMessageText(`Re: `);
                          }}
                          className="text-[11px] text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Follow up message</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 3: ROLE PERMISSIONS MATRIX */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Role Authority Matrix
            </h2>
            <p className="text-slate-500 text-xs">
              Role-Based Access Control privileges across modules.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-2.5 font-bold rounded-l-lg">Authority</th>
                  <th className="p-2.5 font-bold text-rose-300">Super Admin</th>
                  <th className="p-2.5 font-bold text-amber-300">Principal</th>
                  <th className="p-2.5 font-bold text-blue-300">Teacher</th>
                  <th className="p-2.5 font-bold text-teal-300">Class Teacher</th>
                  <th className="p-2.5 font-bold text-emerald-300 rounded-r-lg">Accountant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { feature: 'Create/Accept Staff Credentials', sa: '✓ Full', prin: '✗ None', tch: '✗ None', ct: '✗ None', acc: '✗ None' },
                  { feature: 'School Governance & Policy', sa: '✓ Full', prin: '✗ Executive', tch: '✗ None', ct: '✗ None', acc: '✗ None' },
                  { feature: 'Academics & Circulars', sa: '✓ Oversight', prin: '✓ Full', tch: '✗ Read', ct: '✗ Read', acc: '✗ Read' },
                  { feature: 'Report Cards & Exams', sa: '✓ Oversight', prin: '✓ Approve', tch: '✓ Grades', ct: '✓ Grades', acc: '✗ None' },
                  { feature: 'Daily Attendance Marking', sa: '✓ Audit', prin: '✓ Overview', tch: '✓ Subject', ct: '✓ Section', acc: '✗ None' },
                  { feature: 'Fees & Invoicing Desk', sa: '✓ Audit', prin: '✓ Overview', tch: '✗ None', ct: '✗ None', acc: '✓ Full' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-medium text-slate-800">{row.feature}</td>
                    <td className="p-2.5 font-bold text-rose-700 bg-rose-50/20">{row.sa}</td>
                    <td className="p-2.5 text-amber-800">{row.prin}</td>
                    <td className="p-2.5 text-blue-800">{row.tch}</td>
                    <td className="p-2.5 text-teal-800">{row.ct}</td>
                    <td className="p-2.5 text-emerald-800">{row.acc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Headcount Metrics Footer - Principal, Teachers, Attendance & Accountant (Moved to bottom of Admin section) */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3.5 sm:p-5 shadow-xs space-y-3 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Staff Department Headcount & Role Distribution
              </h3>
              <p className="text-[11px] text-slate-500">
                Institutional staff breakdown across Principal, Faculty, Attendance, and Bursar.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full self-start sm:self-auto border border-slate-200">
            {staffCredentials.length} Total Verified Staff
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          <div
            onClick={() => {
              setActiveTab('roster');
              setSelectedRole('principal');
            }}
            className="bg-slate-50 hover:bg-amber-50/70 p-3 rounded-xl border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wide">
              <span>Principal</span>
              <Building className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between mt-1.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {staffCredentials.filter((c) => c.role === 'principal').length}
              </div>
              <span className="text-[10px] text-amber-700 bg-amber-100/60 font-bold px-1.5 py-0.2 rounded">Active</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">Executive Head</div>
          </div>

          <div
            onClick={() => {
              setActiveTab('roster');
              setSelectedRole('teacher');
            }}
            className="bg-slate-50 hover:bg-blue-50/70 p-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wide">
              <span>Teachers</span>
              <BookOpen className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between mt-1.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {staffCredentials.filter((c) => c.role === 'teacher').length}
              </div>
              <span className="text-[10px] text-blue-700 bg-blue-100/60 font-bold px-1.5 py-0.2 rounded">Active</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">Subject Faculty</div>
          </div>

          <div
            onClick={() => {
              setActiveTab('roster');
              setSelectedRole('class_teacher');
            }}
            className="bg-slate-50 hover:bg-teal-50/70 p-3 rounded-xl border border-slate-200 hover:border-teal-300 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wide">
              <span>Attendance (Class)</span>
              <GraduationCap className="w-3.5 h-3.5 text-teal-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between mt-1.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {staffCredentials.filter((c) => c.role === 'class_teacher').length}
              </div>
              <span className="text-[10px] text-teal-700 bg-teal-100/60 font-bold px-1.5 py-0.2 rounded">Active</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">Roll & Register</div>
          </div>

          <div
            onClick={() => {
              setActiveTab('roster');
              setSelectedRole('accountant');
            }}
            className="bg-slate-50 hover:bg-rose-50/70 p-3 rounded-xl border border-slate-200 hover:border-rose-300 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wide">
              <span>Accountant</span>
              <DollarSign className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between mt-1.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {staffCredentials.filter((c) => c.role === 'accountant').length}
              </div>
              <span className="text-[10px] text-rose-700 bg-rose-100/60 font-bold px-1.5 py-0.2 rounded">Active</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">Fee Desk & Bursar</div>
          </div>

          <div
            onClick={() => {
              setActiveTab('roster');
              setRoleFilter('peon');
            }}
            className="bg-slate-50 hover:bg-orange-50/70 p-3 rounded-xl border border-slate-200 hover:border-orange-300 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wide">
              <span>Support Staff</span>
              <Users className="w-3.5 h-3.5 text-orange-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline justify-between mt-1.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {staffCredentials.filter((c) => ['peon', 'maid', 'security_guard', 'driver', 'other'].includes(c.role)).length}
              </div>
              <span className="text-[10px] text-orange-700 bg-orange-100/60 font-bold px-1.5 py-0.2 rounded">Active</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">Peon, Maid, Driver, Guard</div>
          </div>
        </div>
      </div>

      {/* SALARY DISBURSEMENT POPUP MODAL */}
      {showSalaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Pay Staff Fees / Remuneration Voucher
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Issue salary or wages to any staff member (Teacher, Peon, Maid, Driver, Guard).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSalaryModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDisburseSalary} className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Select Staff Member *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSalaryModal(false);
                      setShowCredentialsModal(true);
                    }}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add New (Peon/Maid/etc)</span>
                  </button>
                </div>
                <select
                  required
                  value={selectedSalaryStaffId}
                  onChange={(e) => handleSelectStaffForSalary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white font-medium"
                >
                  <option value="">-- Choose Staff Personnel --</option>
                  {staffCredentials.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.fullName} · {roleNameLabel(staff.role)} ({staff.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Salary Month / Cycle *
                  </label>
                  <input
                    type="text"
                    required
                    value={salaryMonth}
                    onChange={(e) => setSalaryMonth(e.target.value)}
                    placeholder="e.g. October 2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Disbursement Mode *
                  </label>
                  <select
                    value={salaryPaymentMode}
                    onChange={(e) => setSalaryPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  >
                    <option value="bank_transfer">Direct Bank Transfer (NEFT/IMPS)</option>
                    <option value="cash">Cash Counter</option>
                    <option value="upi">UPI / Digital Payment</option>
                    <option value="cheque">Bank Account Cheque</option>
                  </select>
                </div>
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Base Pay (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={salaryBaseAmount}
                    onChange={(e) => setSalaryBaseAmount(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Bonus / Allowance (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={salaryBonusAllowance}
                    onChange={(e) => setSalaryBonusAllowance(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-emerald-700 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Deduction (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={salaryDeductions}
                    onChange={(e) => setSalaryDeductions(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-rose-700 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                </div>
              </div>

              {/* Net Payout Banner */}
              <div className="bg-emerald-950 text-white p-3 rounded-xl flex items-center justify-between border border-emerald-900">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-300">
                    Net Authorized Payout
                  </div>
                  <div className="text-xl font-black font-mono text-emerald-100">
                    ₹{Math.max(
                      0,
                      (Number(salaryBaseAmount) || 0) +
                        (Number(salaryBonusAllowance) || 0) -
                        (Number(salaryDeductions) || 0)
                    ).toLocaleString()}
                  </div>
                </div>
                <div className="text-right text-[11px] text-emerald-300">
                  {salaryPaymentMode.toUpperCase().replace('_', ' ')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Voucher / Txn Ref No
                </label>
                <input
                  type="text"
                  value={salaryTxnRef}
                  onChange={(e) => setSalaryTxnRef(e.target.value)}
                  placeholder="e.g. NEFT-HDFC-9912048 or CSH-VCH-801"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Remarks / Purpose
                </label>
                <input
                  type="text"
                  value={salaryRemarks}
                  onChange={(e) => setSalaryRemarks(e.target.value)}
                  placeholder="e.g. Monthly salary and wage settlement"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSalaryModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!selectedSalaryStaffId}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Disburse Salary (भुगतान करें)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL SALARY VOUCHER & PAYSLIP MODAL */}
      {viewingSalarySlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 relative my-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                    EduPulse K-12 Academy
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Official Remuneration & Wage Payment Voucher
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingSalarySlip(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Meta */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Voucher Number:</span>
                <span className="font-mono font-bold text-slate-900">{viewingSalarySlip.receiptVoucherNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Date of Payment:</span>
                <span className="font-medium text-slate-800">{viewingSalarySlip.paymentDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Salary Cycle / Month:</span>
                <span className="font-bold text-emerald-800">{viewingSalarySlip.monthYear}</span>
              </div>
            </div>

            {/* Staff Details */}
            <div className="border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 bg-white">
              <div className="text-[10px] font-bold uppercase text-slate-400">Personnel Profile</div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Staff Name:</span>
                <span className="font-bold text-slate-900">{viewingSalarySlip.staffName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Employee ID:</span>
                <span className="font-mono text-slate-800">{viewingSalarySlip.employeeId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Role / Designation:</span>
                <span className="font-semibold text-rose-700 capitalize">
                  {roleNameLabel(viewingSalarySlip.staffRole)} ({viewingSalarySlip.staffDepartment})
                </span>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 p-2 font-bold text-slate-700 border-b border-slate-200">
                Payment Computation Breakdown
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Base Salary / Standard Wage:</span>
                  <span className="font-mono font-semibold text-slate-900">₹{viewingSalarySlip.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Bonus, Allowances & Incentives:</span>
                  <span className="font-mono font-semibold text-emerald-700">+₹{viewingSalarySlip.bonusOrAllowance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Deductions (Advance, Absences, PF):</span>
                  <span className="font-mono font-semibold text-rose-700">-₹{viewingSalarySlip.deductions.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between bg-emerald-50/70 p-2 rounded-lg">
                  <span className="font-bold text-emerald-950">Net Disbursed Remuneration:</span>
                  <span className="font-mono font-black text-emerald-900 text-sm sm:text-base">
                    ₹{viewingSalarySlip.netAmountPaid.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Mode & Authorization */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Disbursement Method:</span>
                <span className="font-bold text-slate-800 uppercase">{viewingSalarySlip.paymentMode.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Transaction Reference:</span>
                <span className="font-mono text-slate-700">{viewingSalarySlip.transactionRef}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Authorized By:</span>
                <span className="font-semibold text-slate-800">{viewingSalarySlip.disbursedBy}</span>
              </div>
              {viewingSalarySlip.remarks && (
                <div className="pt-1 text-[11px] text-slate-500 italic">
                  Note: "{viewingSalarySlip.remarks}"
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Status: PAID & SETTLED ✓
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingSalarySlip(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
