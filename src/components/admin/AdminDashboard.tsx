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
          <button
            onClick={() => setShowPhaseModal(true)}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Roadmap</span>
          </button>
        </div>
      </div>

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

      {/* Cloud Functions Console */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Cloud Functions · Attendance Counter
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => triggerCloudFunctionIncrement(30, 'Class 10-A Science Roll-Call')}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-all flex items-center space-x-1"
            >
              <Zap className="w-3 h-3" />
              <span>+30 Present</span>
            </button>
            <button
              onClick={() => triggerCloudFunctionIncrement(-2, 'Class 9-B Roll-Call Revision')}
              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-all flex items-center space-x-1"
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
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
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

      {/* Live Video Conferencing */}
      <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 shadow-lg text-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/40 pb-3">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center space-x-1.5">
                <Video className="w-4 h-4 text-rose-400" />
                <span>Live Broadcasts & Class Observation</span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Principal school-wide address or ongoing class observation.
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
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 transition-all shadow-sm"
                >
                  {conf.hostRole === 'principal' ? 'Enter' : 'Observe'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Timetable Conflict Engine & Emergency Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column (7 Cols): Timetable Conflict Resolution Engine */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Timetable & Conflict Engine</span>
              </h2>
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
                className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 flex items-center space-x-1 transition-all"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Test Conflict</span>
              </button>

              <button
                onClick={() => handleSimulateConflict(false)}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 flex items-center space-x-1 transition-all"
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
