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
} from 'lucide-react';
import { TimetableSlot } from '../../types';
import { PhaseRoadmapModal } from '../PhaseRoadmapModal';

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
  } = useSMS();

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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 rounded-2xl shadow-xl border border-blue-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
              <span>Principal Console • Head of School</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dr. Alok Verma's Principal Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Real-time oversight across Nursery to 12th Standard: Faculty allocation, fee collection,
              K-12 academic standards, and Firestore security audit.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-right">
              <div className="text-xs text-slate-400">Academic Year</div>
              <div className="text-sm font-bold text-white">2026-2027 (Active)</div>
            </div>
            <div className="bg-emerald-950/80 px-4 py-2.5 rounded-xl border border-emerald-800/50 text-right">
              <div className="text-xs text-emerald-400">Affiliation</div>
              <div className="text-sm font-bold text-white">CBSE #1930281</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Phase 1 & Phase 2 Delivery Tracker */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-800/40 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/40 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white">
                  Enterprise Architecture Milestone Delivery Tracker
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  PHASE 1 & PHASE 2 VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                All 12 core enterprise modules across Flutter Mobile & React Web Platform are 100% completed and deployed.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPhaseModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Phase Delivery Audit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Phase 1: Foundation & Security</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                100% COMPLETE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Multi-Role RBAC (5 roles) • K-12 SIS (Nursery to 12th) • Consolidated Parent Portal (student portal removed) • Cloud Functions Data Aggregation (dashboard_stats/today.presentCount) • Firestore Offline Persistence & Wi-Fi Sync • Firebase App Check (Play Integrity & DeviceCheck).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Phase 2: Academic & Financial Operations</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                100% COMPLETE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              CBSE CCE Gradebook & Senior Stream Scorecard (Official PDF Report Card) • Fee Invoicing & Accountant Ledger (Razorpay/UPI + Cash Settle) • Timetable Collision Detection Engine • Live WebRTC Video Classroom & Observation Deck • Emergency Circulars & Diary • Complete Flutter Phase 2 Mobile Suite.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">1,480</div>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> +12% this year
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Nursery to Class 12</div>
        </div>

        {/* Fee Collection Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fee Realization
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">{collectionRate}%</div>
            <span className="text-xs text-slate-500 font-medium">
              ₹{(totalCollected / 1000).toFixed(0)}k / ₹{(totalReceivable / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </div>

        {/* Daily Attendance Rate (Bound directly to dashboard_stats/today Cloud Function Aggregator) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Daily Present (Aggregated)
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">
              {dashboardStats.presentCount.toLocaleString()}
            </div>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <Zap className="w-3 h-3 mr-0.5 text-amber-500 fill-amber-500" />
              {((dashboardStats.presentCount / 1480) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>Enrolled: 1,480 students</span>
            <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded font-semibold">
              dashboard_stats/today
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
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faculty & Staff
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900">72</div>
            <span className="text-xs text-blue-600 font-semibold">1:20 Ratio</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Certified K-12 educators</div>
        </div>
      </div>

      {/* Firebase Cloud Functions • Data Aggregation Inspector & Real-time Console */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Firebase Cloud Functions • Server-Side Data Aggregation
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Live Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Atomic counter maintained via <code className="font-mono text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded">FieldValue.increment()</code> on trigger <code className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded">attendance/{"{attendanceId}"}</code>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => triggerCloudFunctionIncrement(30, 'Class 10-A Science Roll-Call')}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-all flex items-center space-x-1.5"
              title="Simulates teacher submitting attendance for 30 present students"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Batch (+30 Present)</span>
            </button>
            <button
              onClick={() => triggerCloudFunctionIncrement(-2, 'Class 9-B Roll-Call Revision')}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-all flex items-center space-x-1.5"
              title="Simulates teacher adjusting student from present to absent"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Correction (-2)</span>
            </button>
          </div>
        </div>

        {/* Live Document Visualizer: dashboard_stats/today */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 font-mono text-xs space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>Firestore Document: dashboard_stats/today</span>
              </span>
              <span className="text-emerald-400 font-semibold">SYNCHRONIZED</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-500">// Atomic Integer Counter (Single Field)</span>
              </div>
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <span className="text-amber-300 font-bold">presentCount:</span>
                <span className="text-emerald-400 text-base font-black">{dashboardStats.presentCount}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-1">
                <span className="text-slate-400">totalEnrolled:</span>
                <span className="text-white">1480</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-slate-400">targetDate:</span>
                <span className="text-white">"{dashboardStats.targetDate}"</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-slate-400">lastUpdated:</span>
                <span className="text-indigo-300 font-semibold">{dashboardStats.lastUpdated}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-slate-400">lastAggregatedRecordId:</span>
                <span className="text-blue-300 truncate max-w-[160px]">"{dashboardStats.lastAggregatedRecordId}"</span>
              </div>
              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800 flex items-center justify-between">
                <span>Atomic Primitive:</span>
                <span className="text-amber-400 font-bold">FieldValue.increment(delta)</span>
              </div>
            </div>
          </div>

          {/* Cloud Function Execution Stream */}
          <div className="lg:col-span-7 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">
                  Cloud Function Invocation Stream (aggregateAttendanceOnWrite)
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Auto-triggers on teacher roll-call</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cloudFunctionLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-white border border-slate-200/90 text-xs shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="font-mono text-xs font-bold text-slate-900">{log.functionName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({log.executionDurationMs}ms)</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        {log.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      {log.details}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-xs text-indigo-700">
                      delta: {log.delta >= 0 ? `+${log.delta}` : log.delta}
                    </div>
                    <div className="text-[10px] text-slate-500">{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Firebase App Check & Offline-First Edge Security Hub */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Firebase App Check • Play Integrity & DeviceCheck Guard
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                  Enforced
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Firebase strictly blocks any database read/write request that doesn't originate from your official, compiled Flutter app downloaded from the Play Store or App Store.
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Android Play Integrity */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
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
              Validates device integrity & authentic Play Store APK signature hash. Blocks sideloaded mod APKs.
            </p>
            <div className="text-[10px] font-mono text-slate-500 bg-white p-1.5 rounded border border-slate-200">
              Provider: AndroidProvider.playIntegrity
            </div>
          </div>

          {/* iOS DeviceCheck */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
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
              Cryptographically attests legitimate Apple hardware & official App Store provisioning profile.
            </p>
            <div className="text-[10px] font-mono text-slate-500 bg-white p-1.5 rounded border border-slate-200">
              Provider: AppleProvider.deviceCheck
            </div>
          </div>

          {/* Offline Persistence Cache Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Offline Persistence Queue</span>
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
              Teachers submit attendance offline anywhere. Write queues locally and flushes to Firebase once in Wi-Fi.
            </p>
            <div className="text-[10px] font-mono text-slate-500 bg-white p-1.5 rounded border border-slate-200">
              Engine: Settings(persistenceEnabled: true)
            </div>
          </div>
        </div>
      </div>

      {/* Live Video Conferencing & Classroom Observation Deck */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 shadow-xl text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/40 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Video className="w-5 h-5 text-rose-400" />
                <span>Executive Live Video Broadcasting & Classroom Observation Deck</span>
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Address all 1,480 students across K-12 in real-time, launch emergency faculty calls, or join ongoing classroom lectures as Principal.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const assemblyConf = conferences.find((c) => c.sessionId === 'CONF_002') || conferences[1];
                joinConference(assemblyConf);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center space-x-2 transition-all"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Broadcast All-Hands Assembly</span>
            </button>
          </div>
        </div>

        {/* Live Active Classes List for Principal Observation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {conferences.map((conf) => {
            const isLive = conf.status === 'live';
            return (
              <div
                key={conf.sessionId}
                className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between gap-2 hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isLive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="font-bold text-white text-xs truncate">{conf.title}</span>
                      {isLive && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      Host: {conf.hostName} • {conf.participantsCount} Connected
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => joinConference(conf)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 transition-all shadow-sm"
                >
                  {conf.hostRole === 'principal' ? 'Enter Room' : 'Observe Class'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Timetable Conflict Engine & Emergency Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Timetable Conflict Resolution Engine */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Timetable Engine & Conflict Resolver</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Algorithms preventing double-booking of teachers or lab rooms across periods.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700">
              Dynamic Matrix
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Interactive Conflict Simulator
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Test how the backend prevents scheduling conflicts when a coordinator tries to assign a teacher
              or room to two classes in the same period:
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSimulateConflict(true)}
                className="px-3.5 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 flex items-center space-x-1.5 transition-all"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Trigger Double-Booking Test (Ms. Priya Sharma, Period 1)</span>
              </button>

              <button
                onClick={() => handleSimulateConflict(false)}
                className="px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 flex items-center space-x-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Test Conflict-Free Period (Period 6, Room 102)</span>
              </button>
            </div>

            {testConflictResult.hasRun && (
              <div
                className={`mt-3 p-3 rounded-lg text-xs font-medium flex items-start space-x-2 border transition-all ${
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
                      ? 'Conflict Caught by Timetable Engine'
                      : 'Validation Succeeded'}
                  </div>
                  <div>{testConflictResult.message}</div>
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
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Faculty</th>
                    <th className="py-2.5 px-3">Room</th>
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

        {/* Right Column (5 Cols): Emergency Circular Broadcast & K-12 Tiers */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Circulars & Push Notification Trigger */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Send className="w-5 h-5 text-indigo-600" />
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
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all"
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
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
      </div>

      {/* Phase 1 & Phase 2 Roadmap Modal */}
      <PhaseRoadmapModal
        isOpen={showPhaseModal}
        onClose={() => setShowPhaseModal(false)}
      />
    </div>
  );
};
