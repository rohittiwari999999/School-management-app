import React, { useState } from 'react';
import { useSMS } from '../../context/SMSContext';
import {
  Users,
  CreditCard,
  CalendarCheck,
  GraduationCap,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  BookOpen,
  Building,
  TrendingUp,
  ShieldAlert,
  Video,
  Radio,
  Play,
  MonitorUp,
  Zap,
  Database,
  Activity,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
  Lock,
  Wifi,
  WifiOff,
  Smartphone,
  Sparkles,
  LayoutDashboard,
  DollarSign,
  Receipt,
  UserPlus,
  KeyRound,
  Check,
  X,
  Camera,
  LogOut,
} from 'lucide-react';
import { TimetableSlot, StaffRole, StaffSalaryPayment } from '../../types';
import { PhaseRoadmapModal } from '../PhaseRoadmapModal';
import { PhotoUploadField } from '../common/PhotoUploadField';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    timetable,
    addTimetablePeriod,
    invoices,
    diaryEntries,
    addDiaryEntry,
    currentUser,
    conferences,
    joinConference,
    createConference,
    dashboardStats,
    cloudFunctionLogs,
    triggerCloudFunctionIncrement,
    isNetworkOnline,
    offlineSyncQueue,
    toggleNetworkOnline,
    staffDirectives,
    updateDirectiveStatus,
    staffMessages,
    staffCredentials,
    staffSalaryPayments,
    disburseStaffSalary,
    acceptStaffCredential,
    logout,
  } = useSMS();

  // Active Tab for Principal Dashboard Consoles
  const [activeTab, setActiveTab] = useState<'overview' | 'timetable' | 'circular' | 'attendance' | 'broadcast' | 'security'>('overview');

  // Principal Staff Salary Desk modal state
  const [showPrincipalSalaryModal, setShowPrincipalSalaryModal] = useState(false);
  const [pSelectedStaffId, setPSelectedStaffId] = useState('');
  const [pSalaryMonth, setPSalaryMonth] = useState('October 2026');
  const [pBaseSalary, setPBaseSalary] = useState('18000');
  const [pBonus, setPBonus] = useState('0');
  const [pDeduction, setPDeduction] = useState('0');
  const [pMode, setPMode] = useState<'bank_transfer' | 'cash' | 'upi' | 'cheque'>('bank_transfer');
  const [pTxnRef, setPTxnRef] = useState('');
  const [pRemarks, setPRemarks] = useState('');
  const [pSalaryNotice, setPSalaryNotice] = useState<string | null>(null);

  // Add new staff modal from Principal desk
  const [showAddStaffFromPrincipal, setShowAddStaffFromPrincipal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('peon');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffDept, setNewStaffDept] = useState('');
  const [newStaffAvatar, setNewStaffAvatar] = useState('');

  // Emergency circular form state
  const [circularTitle, setCircularTitle] = useState('');
  const [circularDesc, setCircularDesc] = useState('');
  const [isUrgent, setIsUrgent] = useState(true);
  const [circularSuccess, setCircularSuccess] = useState(false);
  const [showPhaseModal, setShowPhaseModal] = useState(false);

  // Timetable Conflict Tester state
  const [testConflictResult, setTestConflictResult] = useState<{
    hasRun: boolean;
    hasConflict: boolean;
    message: string;
  }>({ hasRun: false, hasConflict: false, message: '' });

  // Compute financial totals
  const totalReceivable = invoices.reduce((acc, inv) => acc + inv.totalPayable, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
  const collectionRate = ((totalCollected / totalReceivable) * 100).toFixed(1);

  const handleBroadcastCircular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circularTitle.trim() || !circularDesc.trim()) return;

    addDiaryEntry({
      schoolId: 'SCH_GLOBAL_001',
      classId: 'CLS_ALL',
      className: 'All Grades (K-12)',
      title: circularTitle,
      description: circularDesc,
      type: 'circular',
      authorUid: currentUser.uid,
      authorName: `${currentUser.fullName} (Principal)`,
      isEmergencyCircular: isUrgent,
    });

    setCircularTitle('');
    setCircularDesc('');
    setCircularSuccess(true);
    setTimeout(() => setCircularSuccess(false), 3500);
  };

  const handleSimulateConflict = (causeConflict: boolean) => {
    const candidate: TimetableSlot = causeConflict
      ? {
          id: 'TEST_CONFLICT',
          dayOfWeek: 1, // Monday
          periodNumber: 1, // clashes with Ms. Priya Sharma who already teaches Period 1
          startTime: '08:30 AM',
          endTime: '09:15 AM',
          classId: 'CLS_09',
          className: 'Class 9-B',
          sectionId: 'SEC_B',
          subjectCode: 'PHY-09',
          subjectName: 'Physics (Mechanics)',
          teacherUid: 'USR_TEACHER_01', // Ms. Priya Sharma
          teacherName: 'Ms. Priya Sharma',
          roomNumber: 'Room 304',
        }
      : {
          id: 'TEST_VALID',
          dayOfWeek: 2, // Tuesday
          periodNumber: 6,
          startTime: '01:30 PM',
          endTime: '02:15 PM',
          classId: 'CLS_09',
          className: 'Class 9-B',
          sectionId: 'SEC_B',
          subjectCode: 'BIO-09',
          subjectName: 'Biology (Cell Structure)',
          teacherUid: 'USR_TEACHER_02',
          teacherName: 'Dr. K. N. Rao',
          roomNumber: 'Room 102',
        };

    const res = addTimetablePeriod(candidate);
    if (!res.success) {
      setTestConflictResult({
        hasRun: true,
        hasConflict: true,
        message: res.message || 'Timetable engine detected a collision.',
      });
    } else {
      setTestConflictResult({
        hasRun: true,
        hasConflict: false,
        message: 'No conflicts detected! Period scheduled cleanly in timetable matrix.',
      });
    }
  };

  const handlePrincipalDisburseSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pSelectedStaffId) return;

    const staff = staffCredentials.find((s) => s.id === pSelectedStaffId);
    if (!staff) return;

    const base = Number(pBaseSalary) || 0;
    const bonus = Number(pBonus) || 0;
    const ded = Number(pDeduction) || 0;
    const net = Math.max(0, base + bonus - ded);

    const payment = disburseStaffSalary({
      paymentDate: new Date().toISOString().split('T')[0],
      monthYear: pSalaryMonth,
      staffId: staff.id,
      staffName: staff.fullName,
      staffRole: staff.role,
      staffDepartment: staff.departmentOrClass,
      employeeId: staff.employeeId,
      baseSalary: base,
      bonusOrAllowance: bonus,
      deductions: ded,
      netAmountPaid: net,
      paymentMode: pMode,
      transactionRef: pTxnRef.trim() || `TXN-${pMode.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`,
      remarks: pRemarks.trim() || `Staff wage payout for ${pSalaryMonth}`,
      disbursedBy: `${currentUser.fullName} (Principal)`,
      status: 'paid',
    });

    setPSalaryNotice(`Salary voucher ${payment.receiptVoucherNumber} issued! ₹${net.toLocaleString()} disbursed to ${staff.fullName} (${staff.role.replace('_', ' ')}).`);
    setShowPrincipalSalaryModal(false);
    setPTxnRef('');
    setPRemarks('');
    setTimeout(() => setPSalaryNotice(null), 5000);
  };

  const handleAddNewStaffFromPrincipal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const newStaffEmailVal = newStaffEmail.trim().toLowerCase() || `${newStaffName.toLowerCase().replace(/\s+/g, '.')}.${Date.now().toString().slice(-3)}@edupulse.edu`;
    const newEmpId = `EMP-${newStaffRole.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-4)}`;

    acceptStaffCredential({
      fullName: newStaffName.trim(),
      role: newStaffRole,
      email: newStaffEmailVal,
      tempPassword: `${newStaffName.split(' ')[0]}@Edu2026!`,
      phoneNumber: newStaffPhone.trim() || '+91 98000 00000',
      employeeId: newEmpId,
      departmentOrClass: newStaffDept.trim() || `${newStaffRole.toUpperCase()} Services & Support`,
      qualification: 'Verified Staff Professional',
      dateOfJoining: new Date().toISOString().split('T')[0],
      status: 'active',
      avatarUrl: newStaffAvatar.trim() || undefined,
    });

    setShowAddStaffFromPrincipal(false);
    setPSalaryNotice(`New staff profile created for "${newStaffName.trim()}" (${newStaffRole.replace('_', ' ')})! Available immediately for wage payments.`);
    setTimeout(() => setPSalaryNotice(null), 5000);
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setNewStaffDept('');
    setNewStaffAvatar('');
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Top Banner - Compact */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-3.5 sm:p-4 rounded-xl shadow-md border border-blue-900/40">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold mb-1 border border-blue-400/30">
              <span>Principal Console</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Dr. Alok Verma · Principal
            </h1>
            <p className="text-slate-300 text-xs">
              Academic governance, faculty allocation, and circulars.
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                if (staffCredentials.length > 0 && !pSelectedStaffId) {
                  setPSelectedStaffId(staffCredentials[0].id);
                }
                setShowPrincipalSalaryModal(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1 cursor-pointer shrink-0"
              title="Disburse Staff Fee / Salary"
            >
              <DollarSign className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Pay Staff Fees</span>
              <span className="sm:hidden">Pay Fee</span>
            </button>

            <button
              onClick={() => setShowPhaseModal(true)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Roadmap</span>
            </button>

            <button
              onClick={logout}
              className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-800/80 text-slate-300 hover:text-rose-200 text-xs font-bold transition-all shadow-sm flex items-center space-x-1 cursor-pointer shrink-0"
              title="Sign Out to Front Page Login Screen"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Salary Feedback Toast */}
      {pSalaryNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 sm:p-3 rounded-lg flex items-center justify-between animate-fade-in shadow-sm gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold truncate">{pSalaryNotice}</p>
          </div>
          <button
            onClick={() => setPSalaryNotice(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {/* Top Principal Navigation Switcher - 2 Rows (3 Buttons Top, 3 Buttons Below) */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs space-y-1.5">
        {/* Row 1: 3 Buttons on Top */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'timetable'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Timetable Board</span>
          </button>

          <button
            onClick={() => setActiveTab('circular')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'circular'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Circular Board</span>
          </button>
        </div>

        {/* Row 2: 3 Buttons Below */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'attendance'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Attendance Counter</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'broadcast'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">Live Broadcast</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0 hidden xs:inline-block" />
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">App Check Guard</span>
          </button>
        </div>
      </div>

      {/* Super Admin Directives for Principal */}
      {staffDirectives.filter((d) => d.targetRole === 'principal' || d.targetRole === 'all').length > 0 && (
        <div className="bg-white rounded-xl border border-rose-200 p-3 sm:p-3.5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-900">
                Super Admin Directives for Principal ({staffDirectives.filter((d) => d.targetRole === 'principal' || d.targetRole === 'all').length})
              </h3>
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Institutional Orders
            </span>
          </div>

          <div className="space-y-1.5">
            {staffDirectives
              .filter((d) => d.targetRole === 'principal' || d.targetRole === 'all')
              .map((d) => (
                <div
                  key={d.id}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5 min-w-0">
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
                      <span className="text-[10px] text-slate-500 font-medium">Due: {d.deadline}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{d.instructions}</p>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {d.status !== 'completed' ? (
                      <button
                        onClick={() => updateDirectiveStatus(d.id, 'completed')}
                        className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 transition cursor-pointer"
                      >
                        ✓ Mark Completed
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-700">Completed ✓</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-3 sm:space-y-4">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {/* Total Students */}
            <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Students
                </span>
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-xl sm:text-2xl font-black text-slate-900">1,480</div>
                <span className="text-[11px] text-emerald-600 font-semibold">+12%</span>
              </div>
            </div>

            {/* Fee Collection Rate */}
            <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Fee Realization
                </span>
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-xl sm:text-2xl font-black text-slate-900">{collectionRate}%</div>
                <span className="text-[11px] text-slate-500">
                  ₹{(totalCollected / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${collectionRate}%` }}
                />
              </div>
            </div>

            {/* Daily Attendance Rate */}
            <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Daily Present
                </span>
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <CalendarCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {dashboardStats.presentCount.toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  {((dashboardStats.presentCount / 1480) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (dashboardStats.presentCount / 1480) * 100)}%` }}
                />
              </div>
            </div>

            {/* Faculty & Staff */}
            <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Faculty & Staff
                </span>
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-xl sm:text-2xl font-black text-slate-900">72</div>
                <span className="text-[11px] text-blue-600 font-semibold">1:20 Ratio</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts to Consoles */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs space-y-2.5">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Principal Consoles & Quick Desks
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                onClick={() => setActiveTab('timetable')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-blue-600 font-bold text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timetable</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Schedule matrix & conflict check</div>
              </button>

              <button
                onClick={() => setActiveTab('circular')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-indigo-600 font-bold text-xs">
                  <Send className="w-3.5 h-3.5" />
                  <span>Circulars</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Push notices & K-12 tiers</div>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-teal-600 font-bold text-xs">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Attendance</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Cloud functions & live counters</div>
              </button>

              <button
                onClick={() => setActiveTab('broadcast')}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-rose-600 font-bold text-xs">
                  <Video className="w-3.5 h-3.5" />
                  <span>Broadcast</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Live classes & assembly feed</div>
              </button>

              <button
                onClick={() => {
                  if (staffCredentials.length > 0 && !pSelectedStaffId) {
                    setPSelectedStaffId(staffCredentials[0].id);
                  }
                  setShowPrincipalSalaryModal(true);
                }}
                className="p-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-left transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Staff Fees Desk</span>
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                  ₹{staffSalaryPayments.reduce((acc, p) => acc + p.netAmountPaid, 0).toLocaleString()} Paid
                </div>
              </button>
            </div>
          </div>

          {/* Staff Department Headcount & Role Distribution - Overview Only */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Staff Department Headcount & Role Distribution
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Institutional staff breakdown across Principal, Faculty, Attendance, Accounts, and Support Personnel.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full self-start sm:self-auto border border-slate-200">
                {staffCredentials.length} Total Verified Staff
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Principal</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {staffCredentials.filter((c) => c.role === 'principal').length}
                  </div>
                  <div className="text-[10px] text-amber-700 font-medium">Head of School</div>
                </div>
                <Building className="w-4 h-4 text-amber-600 shrink-0" />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Teachers</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {staffCredentials.filter((c) => c.role === 'teacher').length}
                  </div>
                  <div className="text-[10px] text-blue-700 font-medium">Subject Faculty</div>
                </div>
                <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Attendance</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {staffCredentials.filter((c) => c.role === 'class_teacher').length}
                  </div>
                  <div className="text-[10px] text-teal-700 font-medium">Class Teachers</div>
                </div>
                <CalendarCheck className="w-4 h-4 text-teal-600 shrink-0" />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Accountant</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {staffCredentials.filter((c) => c.role === 'accountant').length}
                  </div>
                  <div className="text-[10px] text-rose-700 font-medium">Fee Desk</div>
                </div>
                <DollarSign className="w-4 h-4 text-rose-600 shrink-0" />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Support Staff</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {staffCredentials.filter((c) => ['peon', 'maid', 'security_guard', 'driver', 'other'].includes(c.role)).length}
                  </div>
                  <div className="text-[10px] text-orange-700 font-medium">Peon, Maid, Driver</div>
                </div>
                <Users className="w-4 h-4 text-orange-600 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMETABLE & CONFLICT ENGINE */}
      {activeTab === 'timetable' && (
        <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Timetable & Conflict Resolution Engine</span>
              </h2>
              <p className="text-slate-500 text-xs">Detect period collisions, faculty double-booking, and room clashes.</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
              Live Matrix
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-2">
            <div className="text-[11px] font-bold text-slate-700 uppercase">
              Schedule Collision Simulator
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSimulateConflict(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 flex items-center space-x-1 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Test Conflict</span>
              </button>

              <button
                onClick={() => handleSimulateConflict(false)}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 flex items-center space-x-1 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Test Valid Slot</span>
              </button>
            </div>

            {testConflictResult.hasRun && (
              <div
                className={`mt-2 p-2.5 rounded-lg text-xs font-medium flex items-start space-x-2 border transition-all ${
                  testConflictResult.hasConflict
                    ? 'bg-rose-50/80 border-rose-300 text-rose-800'
                    : 'bg-emerald-50/80 border-emerald-300 text-emerald-800'
                }`}
              >
                {testConflictResult.hasConflict ? (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    {testConflictResult.hasConflict
                      ? 'Conflict Prevented'
                      : 'Slot Verified'}
                  </div>
                  <div className="text-[11px]">{testConflictResult.message}</div>
                </div>
              </div>
            )}
          </div>

          {/* Active Period Slots Table */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Active Monday Schedule (Class 11-A Science PCM)</span>
              <span className="text-slate-400 font-normal">5 Periods Loaded</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Period</th>
                    <th className="py-2 px-3">Time</th>
                    <th className="py-2 px-3">Subject</th>
                    <th className="py-2 px-3">Faculty</th>
                    <th className="py-2 px-3">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {timetable.map((slot) => (
                    <tr key={slot.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">P{slot.periodNumber}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        {slot.startTime} - {slot.endTime}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{slot.subjectName}</td>
                      <td className="py-2.5 px-3 text-blue-700 font-semibold">{slot.teacherName}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                          {slot.roomNumber}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CIRCULAR BOARD & K-12 TIERS */}
      {activeTab === 'circular' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Executive Circular Broadcast */}
          <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Send className="w-4 h-4 text-indigo-600" />
                <span>Executive Circular Broadcast</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispatches notice directly to parents and students via Firebase Cloud Messaging (FCM).
              </p>
            </div>

            <form onSubmit={handleBroadcastCircular} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Circular Title
                </label>
                <input
                  type="text"
                  value={circularTitle}
                  onChange={(e) => setCircularTitle(e.target.value)}
                  placeholder="e.g. Weather Alert: School Timing Adjusted"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Announcement Body
                </label>
                <textarea
                  value={circularDesc}
                  onChange={(e) => setCircularDesc(e.target.value)}
                  rows={3}
                  placeholder="Provide explicit instructions for transport buses, classes, and parents..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="font-semibold text-rose-700">High Priority FCM Push Alert</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast</span>
                </button>
              </div>

              {circularSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center space-x-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Circular broadcasted and pushed to 1,480 parent devices!</span>
                </div>
              )}
            </form>
          </div>

          {/* K-12 Academic Tiers Summary */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>K-12 Tier Governance</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Pre-Primary (Nursery - UKG)</div>
                  <div className="text-slate-500 text-[11px]">Observational rubric, nap & meals, sensory logs</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-700 font-bold text-[10px]">
                  Playway
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Primary & Middle (Class 1 - 8)</div>
                  <div className="text-slate-500 text-[11px]">Continuous Comprehensive Evaluation (CCE)</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">
                  CCE A1-D
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Senior Secondary (Class 9 - 12)</div>
                  <div className="text-slate-500 text-[11px]">
                    Streams (PCM, PCB, Commerce, Arts) • Board Roll
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                  Weighted GPA
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ATTENDANCE COUNTERS & CLOUD FUNCTIONS */}
      {activeTab === 'attendance' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Cloud Functions · Real-Time Attendance Counter
                  </h2>
                  <p className="text-xs text-slate-500">Atomic increment counter driven by Firebase background triggers.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => triggerCloudFunctionIncrement(30, 'Class 10-A Science Roll-Call')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  <span>+30 Present</span>
                </button>
                <button
                  onClick={() => triggerCloudFunctionIncrement(-2, 'Class 9-B Roll-Call Revision')}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>-2 Present</span>
                </button>
              </div>
            </div>

            {/* Live Document Visualizer: dashboard_stats/today */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-5 p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                  <span>dashboard_stats/today</span>
                  <span className="text-emerald-400 font-semibold">SYNCED</span>
                </div>
                <div className="p-2 rounded bg-slate-800/80 flex items-center justify-between">
                  <span className="text-amber-300 font-bold">presentCount:</span>
                  <span className="text-emerald-400 text-base font-black">{dashboardStats.presentCount}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>totalEnrolled: 1,480</span>
                  <span className="text-indigo-300">Updated: {dashboardStats.lastUpdated}</span>
                </div>
              </div>

              {/* Cloud Function Execution Stream */}
              <div className="lg:col-span-7 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Execution Logs</span>
                  <span className="text-[10px] text-slate-400 font-normal">Auto-triggers on roll-call</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {cloudFunctionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-1.5 rounded bg-white border border-slate-200 text-[11px] flex items-center justify-between gap-1"
                    >
                      <span className="font-mono font-bold text-slate-800">{log.functionName}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{log.executionDurationMs}ms</span>
                      <span className="text-[9px] px-1 rounded bg-emerald-50 text-emerald-700 font-bold">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Wi-Fi & Offline Persistence Status Bar */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              {isNetworkOnline ? (
                <Wifi className="w-4 h-4 text-emerald-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-amber-600" />
              )}
              <span>
                Wi-Fi Zone: <strong>{isNetworkOnline ? 'Connected' : 'Offline'}</strong> ({offlineSyncQueue.length} attendance batches in local cache queue)
              </span>
            </div>

            <button
              onClick={toggleNetworkOnline}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-300 transition cursor-pointer"
            >
              Toggle Connection
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: LIVE BROADCASTS & VIDEO CONFERENCING */}
      {activeTab === 'broadcast' && (
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 shadow-lg text-white space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/40 pb-3">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center space-x-1.5">
                  <Video className="w-4 h-4 text-rose-400" />
                  <span>Live Broadcasts & Class Observation Console</span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Principal school-wide address or ongoing class observation rooms.
              </p>
            </div>

            <button
              onClick={() => {
                const assemblyConf = conferences.find((c) => c.sessionId === 'CONF_002') || conferences[1];
                joinConference(assemblyConf);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Broadcast Assembly</span>
            </button>
          </div>

          {/* Live Active Classes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            {conferences.map((conf) => {
              const isLive = conf.status === 'live';
              return (
                <div
                  key={conf.sessionId}
                  className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center justify-between gap-2 hover:bg-slate-800 transition-all"
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isLive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="font-bold text-white text-xs truncate">{conf.title}</span>
                        {isLive && (
                          <span className="px-1 py-0.2 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {conf.hostName} · {conf.participantsCount} connected
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => joinConference(conf)}
                    className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 transition-all shadow-sm cursor-pointer"
                  >
                    {conf.hostRole === 'principal' ? 'Enter' : 'Observe'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: FIREBASE APP CHECK & INTEGRITY GUARD */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Firebase App Check • Play Integrity & DeviceCheck Guard
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                    Enforced
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Protects backend resources against unauthorized bot requests and sideloaded app clones.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleNetworkOnline}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
                  isNetworkOnline
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
              >
                {isNetworkOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Wi-Fi Zone: Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                    <span>Wi-Fi Zone: Offline ({offlineSyncQueue.length} queued)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Android Play Integrity */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Android Play Integrity</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Validates authentic Play Store APK signature hash. Blocks mod APKs and bots.
              </p>
              <div className="text-[10px] font-mono text-slate-500 bg-white p-1 rounded border border-slate-200">
                Provider: AndroidProvider.playIntegrity
              </div>
            </div>

            {/* iOS DeviceCheck */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Apple DeviceCheck</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Cryptographically attests legitimate Apple hardware & official App Store provisioning.
              </p>
              <div className="text-[10px] font-mono text-slate-500 bg-white p-1 rounded border border-slate-200">
                Provider: AppleProvider.deviceCheck
              </div>
            </div>

            {/* Offline Persistence Cache Status */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Offline Persistence Cache</span>
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    offlineSyncQueue.length > 0
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {offlineSyncQueue.length} Batches
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Teachers submit attendance offline anywhere. Write queues locally and auto-flushes on reconnect.
              </p>
              <div className="text-[10px] font-mono text-slate-500 bg-white p-1 rounded border border-slate-200">
                Engine: Settings(persistenceEnabled: true)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 1 & Phase 2 Roadmap Modal */}
      <PhaseRoadmapModal
        isOpen={showPhaseModal}
        onClose={() => setShowPhaseModal(false)}
      />

      {/* PRINCIPAL STAFF SALARY / FEES DESK MODAL */}
      {showPrincipalSalaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-5 space-y-4 relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Principal Staff Fees & Wages Desk
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Authorize fee payout for any staff member (Teacher, Peon, Maid, Driver, Guard).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrincipalSalaryModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePrincipalDisburseSalary} className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Select Staff Member *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPrincipalSalaryModal(false);
                      setShowAddStaffFromPrincipal(true);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-0.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Add New (Peon, Maid, etc)</span>
                  </button>
                </div>
                <select
                  required
                  value={pSelectedStaffId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setPSelectedStaffId(id);
                    const s = staffCredentials.find((st) => st.id === id);
                    if (s) {
                      let base = 18000;
                      if (s.role === 'principal') base = 125000;
                      else if (s.role === 'teacher') base = 65000;
                      else if (s.role === 'class_teacher') base = 55000;
                      else if (s.role === 'accountant') base = 48000;
                      else if (s.role === 'peon') base = 18000;
                      else if (s.role === 'maid') base = 16500;
                      else if (s.role === 'security_guard') base = 20000;
                      else if (s.role === 'driver') base = 22000;
                      setPBaseSalary(String(base));
                      setPBonus('0');
                      setPDeduction('0');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                >
                  <option value="">-- Choose Any Staff Personnel --</option>
                  {staffCredentials.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} · {s.role.replace('_', ' ').toUpperCase()} ({s.employeeId})
                    </option>
                  ))}
                </select>

                {(() => {
                  const selectedStaffObj = staffCredentials.find((st) => st.id === pSelectedStaffId);
                  if (!selectedStaffObj) return null;
                  return (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
                      <img
                        src={selectedStaffObj.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}
                        alt={selectedStaffObj.fullName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-indigo-400 shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {selectedStaffObj.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {selectedStaffObj.employeeId} · {selectedStaffObj.departmentOrClass}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                          ✓ Verified Institutional Personnel
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Month / Cycle *
                  </label>
                  <input
                    type="text"
                    required
                    value={pSalaryMonth}
                    onChange={(e) => setPSalaryMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Mode *
                  </label>
                  <select
                    value={pMode}
                    onChange={(e) => setPMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="bank_transfer">Direct Bank Transfer</option>
                    <option value="cash">Cash Desk</option>
                    <option value="upi">UPI / Online</option>
                    <option value="cheque">Bank Cheque</option>
                  </select>
                </div>
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Base Pay (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={pBaseSalary}
                    onChange={(e) => setPBaseSalary(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Bonus (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pBonus}
                    onChange={(e) => setPBonus(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-emerald-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Deductions (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pDeduction}
                    onChange={(e) => setPDeduction(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-rose-700 font-bold"
                  />
                </div>
              </div>

              {/* Net Payout */}
              <div className="bg-emerald-950 text-white p-3 rounded-xl flex items-center justify-between border border-emerald-900">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-300">Net Remuneration</div>
                  <div className="text-xl font-black font-mono text-emerald-100">
                    ₹{Math.max(0, (Number(pBaseSalary) || 0) + (Number(pBonus) || 0) - (Number(pDeduction) || 0)).toLocaleString()}
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-emerald-300 uppercase">
                  {pMode.replace('_', ' ')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Voucher / Txn Ref No
                </label>
                <input
                  type="text"
                  value={pTxnRef}
                  onChange={(e) => setPTxnRef(e.target.value)}
                  placeholder="e.g. CSH-VCH-801 or NEFT-REF-202"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Remarks / Purpose
                </label>
                <input
                  type="text"
                  value={pRemarks}
                  onChange={(e) => setPRemarks(e.target.value)}
                  placeholder="e.g. Monthly honorarium & wage payout"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPrincipalSalaryModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!pSelectedStaffId}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Authorize Payout (भुगतान करें)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW STAFF QUICK MODAL FROM PRINCIPAL */}
      {showAddStaffFromPrincipal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-5 space-y-4 relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Add Staff Personnel
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Quickly onboard peons, maids, drivers, guards, or teachers.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStaffFromPrincipal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewStaffFromPrincipal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Staff Role *
                </label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="peon">Peon / Attendant (चपरासी)</option>
                  <option value="maid">Maid / Housekeeping (आया)</option>
                  <option value="security_guard">Security Guard (सुरक्षा गार्ड)</option>
                  <option value="driver">School Bus Driver (ड्राइवर)</option>
                  <option value="teacher">Subject Teacher</option>
                  <option value="class_teacher">Class Teacher</option>
                  <option value="accountant">Accountant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar or Sunita Devi"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Staff Photo Upload (Optional / Non-mandatory) */}
              <PhotoUploadField
                label="Staff Photo (कर्मचारी की फ़ोटो)"
                value={newStaffAvatar}
                onChange={setNewStaffAvatar}
                entityType="staff"
                helperText="(Non-mandatory / वैकल्पिक)"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98000 00000"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department / Duty Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Junior Wing Sanitation or Bus Route #3"
                  value={newStaffDept}
                  onChange={(e) => setNewStaffDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStaffFromPrincipal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1 transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Save Staff Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
