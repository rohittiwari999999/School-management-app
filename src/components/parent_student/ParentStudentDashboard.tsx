import React, { useState } from 'react';
import { useSMS } from '../../context/SMSContext';
import {
  Users,
  CreditCard,
  MessageSquare,
  FileText,
  Baby,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Download,
  Printer,
  Heart,
  Award,
  Sparkles,
  BookOpen,
  Bell,
  ChevronRight,
  ShieldCheck,
  Video,
  Radio,
  Play,
  MonitorUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ParentStudentDashboard: React.FC = () => {
  const {
    students,
    activeChild,
    setActiveChildId,
    timetable,
    examResults,
    invoices,
    payInvoice,
    diaryEntries,
    chatMessages,
    sendChatMessage,
    currentUser,
    conferences,
    joinConference,
  } = useSMS();

  // Unified tabs combining parent & student workflows
  const [activeTab, setActiveTab] = useState<
    'overview' | 'timetable' | 'live_class' | 'report_card' | 'fees' | 'chat' | 'leave'
  >('overview');

  const [chatInput, setChatInput] = useState('');
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState(false);
  const [showReportCardModal, setShowReportCardModal] = useState(false);

  // Leave application state
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  // Siblings list (Aarav, Rohan, Ananya)
  const familyStudents = students.filter(
    (s) => currentUser.parentLinkedStudentIds?.includes(s.studentId) || ['STU_CLASS11_01', 'STU_CLASS5_01', 'STU_NURSERY_01'].includes(s.studentId)
  );

  // Active child's data
  const childInvoices = invoices.filter((inv) => inv.studentId === activeChild.studentId);
  const pendingInvoice = childInvoices.find((inv) => inv.status === 'pending');
  const childExamResult = examResults.find((e) => e.studentId === activeChild.studentId) || examResults[0];

  const childDiary = diaryEntries.filter(
    (d) => d.classId === activeChild.classId || d.classId === 'CLS_ALL'
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput, 'USR_TEACHER_01', activeChild.studentId);
    setChatInput('');
  };

  const handleExecutePayment = async (invId: string) => {
    setIsProcessingPayment(true);
    await payInvoice(invId, 'razorpay');
    setIsProcessingPayment(false);
    setSelectedInvoiceForPayment(null);
    setPaymentSuccessNotice(true);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    setTimeout(() => setPaymentSuccessNotice(false), 5000);
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason || !leaveStartDate) return;
    setLeaveSubmitted(true);
    setTimeout(() => {
      setLeaveSubmitted(false);
      setLeaveReason('');
      setLeaveStartDate('');
      setLeaveEndDate('');
    }, 4000);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Unified Parent & Student Header Banner - Compact */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-3.5 sm:p-4 rounded-xl shadow-md border border-indigo-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-semibold mb-1 border border-purple-400/30">
              <Users className="w-3 h-3" />
              <span>Parent Portal</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Family & Ward Access
            </h1>
            <p className="text-slate-300 text-xs">
              Daily diary, attendance, report cards, fees, and teacher messages.
            </p>
          </div>

          {/* Sibling Child Switcher - Compact */}
          <div className="bg-slate-900/80 p-1.5 rounded-xl border border-indigo-800/40 shrink-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
              Student:
            </div>
            <div className="flex items-center space-x-1.5 overflow-x-auto">
              {familyStudents.map((child) => {
                const isSelected = activeChild.studentId === child.studentId;
                let tierTag = 'Nursery';
                if (child.tier === 'primary') tierTag = 'Class 5';
                if (child.tier === 'senior_sec') tierTag = 'Class 11';

                return (
                  <button
                    key={child.studentId}
                    onClick={() => setActiveChildId(child.studentId)}
                    className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border text-left transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 border-purple-400 text-white shadow-sm font-semibold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <img
                      src={child.avatarUrl}
                      alt={child.fullName}
                      className="w-6 h-6 rounded-full object-cover border border-white/40"
                    />
                    <div>
                      <div className="text-xs font-bold leading-tight">{child.fullName.split(' ')[0]}</div>
                      <div className="text-[9px] opacity-75">{tierTag}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Student/Parent Navigation Switcher - 2 Rows (3 Buttons Top, 3 Buttons Below) */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs space-y-1.5">
        {/* Row 1: 3 Buttons on Top */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('live_class')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'live_class'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">Live Class</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0 hidden xs:inline-block" />
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'timetable'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Timetable</span>
          </button>
        </div>

        {/* Row 2: 3 Buttons Below */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('report_card')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'report_card'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Report Card</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'fees'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Fees {pendingInvoice && '(1)'}</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'leave' ? 'leave' : 'chat')}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'chat' || activeTab === 'leave'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Chat & Leave</span>
          </button>
        </div>
      </div>
      {paymentSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>
              Fee payment confirmed! Official e-receipt generated and recorded in school ledger.
            </span>
          </div>
          <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
            SETTLED
          </span>
        </div>
      )}

      {/* TAB 1: OVERVIEW & DIARY */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Live Class In Session Alert Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-800/60 shadow-lg text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-white">Live Physics Class In Session!</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white animate-pulse">
                    LIVE NOW
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Class 11-A Ray Optics & Optical Instruments • Ms. Priya Sharma is presenting.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const conf = conferences.find((c) => c.sessionId === 'CONF_001') || conferences[0];
                joinConference(conf);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center space-x-2 shrink-0 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Join Live Classroom</span>
            </button>
          </div>

          {/* Active Profile Snapshot Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={activeChild.avatarUrl}
                alt={activeChild.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-black text-slate-900">{activeChild.fullName}</h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {activeChild.className}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Adm No: <span className="font-mono font-bold text-slate-800">{activeChild.admissionNumber}</span>
                  {activeChild.boardRollNumber && (
                    <> • Board Roll: <span className="font-mono font-bold text-blue-700">{activeChild.boardRollNumber}</span></>
                  )}
                  {activeChild.stream !== 'none' && (
                    <> • Stream: <span className="font-bold text-purple-700">Science PCM</span></>
                  )}
                </div>
              </div>
            </div>

            {/* Attendance Compliance Meter */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center space-x-4">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Attendance Metric</div>
                <div className="text-2xl font-black text-emerald-600 mt-0.5">{activeChild.attendancePercentage}%</div>
                <div className="text-[10px] text-slate-500">CBSE Minimum 75% Requirement Met</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center font-bold text-emerald-600 text-sm">
                ✓
              </div>
            </div>
          </div>

          {/* If Pre-Primary Nursery: Show Early Learning & Care Journal */}
          {activeChild.tier === 'pre_primary' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Baby className="w-5 h-5 text-pink-600" />
                  <span>Nursery Daily Care & Developmental Journal</span>
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-pink-50 text-pink-700">
                  Playway Observational Rubric
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-pink-50/70 border border-pink-200">
                  <div className="text-[10px] font-bold text-pink-800 uppercase">Nap & Sleep</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {activeChild.nurseryObservation?.napHours}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="text-[10px] font-bold text-amber-800 uppercase">Meal & Nutrition</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {activeChild.nurseryObservation?.mealIntake}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="text-[10px] font-bold text-blue-800 uppercase">Fine Motor Skills</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {activeChild.nurseryObservation?.fineMotorSkills}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Social Behavior</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {activeChild.nurseryObservation?.socialBehavior}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-700 flex items-center space-x-1.5 mb-1">
                  <Heart className="w-3.5 h-3.5 text-pink-500" />
                  <span>Class Teacher's Daily Observation</span>
                </div>
                <p className="text-slate-600 leading-relaxed italic">
                  "{activeChild.nurseryObservation?.teacherDailyNote}"
                </p>
              </div>
            </div>
          )}

          {/* Quick Notice Board & Homework Diary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Active Assignments, Homework & School Circulars</span>
            </h3>

            <div className="space-y-3">
              {childDiary.map((item) => (
                <div key={item.entryId} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.createdAt}</span>
                  </div>
                  <p className="text-slate-600 mt-1.5 leading-relaxed">{item.description}</p>
                  {item.attachmentName && (
                    <div className="mt-2 inline-flex items-center space-x-1.5 text-[11px] text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      <Download className="w-3.5 h-3.5" />
                      <span>{item.attachmentName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: LIVE VIRTUAL CLASSES & VIDEO CONFERENCING */}
      {activeTab === 'live_class' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Video className="w-5 h-5 text-rose-600" />
                <span>Live Interactive Classrooms & Video Meetings</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Join high-definition WebRTC video classrooms with live microphone, digital blackboard, chat, and automated session attendance.
              </p>
            </div>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>1 Class Live Now</span>
            </span>
          </div>

          {/* Featured Live Class Hero Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center space-x-1.5">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Broadcasting Live From School Science Lab</span>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 font-bold">
                CLASS 11-A PCM
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Physics: Ray Optics & Lens Maker Formula Derivations
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Instructor <span className="font-bold text-white">Ms. Priya Sharma</span> is presenting the derivation
                for refraction through spherical surfaces and paraxial ray calculations. Digital blackboard is active.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const conf = conferences.find((c) => c.sessionId === 'CONF_001') || conferences[0];
                  joinConference(conf);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-xs shadow-lg shadow-rose-600/40 flex items-center space-x-2 transition-all transform hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Join Live Classroom (WebRTC Room)</span>
              </button>

              <div className="text-xs text-slate-400 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>26 classmates currently in lecture</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/60 flex items-center space-x-2">
                <MonitorUp className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Teacher Digital Slides</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 flex items-center space-x-2">
                <span className="text-amber-400 font-bold text-sm">✋</span>
                <span>Raise Hand for Doubts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time In-Class Chat</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Instant Attendance Log</span>
              </div>
            </div>
          </div>

          {/* List of Available Conferences & Meetings */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              All Scheduled & Live School Conferences
            </div>

            <div className="space-y-3">
              {conferences.map((conf) => {
                const isLive = conf.status === 'live';
                return (
                  <div
                    key={conf.sessionId}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shadow-sm"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isLive ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">{conf.title}</span>
                          {isLive && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                              LIVE NOW
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Conducted by <span className="font-semibold text-slate-700">{conf.hostName}</span> ({conf.hostRole}) • Room Code:{' '}
                          <span className="font-mono text-indigo-600 font-bold">{conf.roomCode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-xs text-slate-500">{conf.participantsCount} Connected</span>
                      <button
                        onClick={() => joinConference(conf)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          isLive
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                        }`}
                      >
                        {isLive ? 'Join Live Room' : 'View Link'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Daily Class Schedule & Periods ({activeChild.className})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Classroom allocation, teacher periods, and laboratory sessions.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live School Timetable
            </span>
          </div>

          <div className="space-y-3">
            {timetable.map((slot) => {
              const isCurrent = slot.periodNumber === 2;
              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                      : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isCurrent ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      P{slot.periodNumber}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                        <span>{slot.subjectName}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white animate-pulse">
                            ACTIVE NOW
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Faculty: <span className="font-semibold text-slate-700">{slot.teacherName}</span> • Room:{' '}
                        <span className="font-semibold text-slate-700">{slot.roomNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-slate-800">{slot.startTime}</div>
                    <div className="text-[11px] text-slate-500">{slot.endTime}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REPORT CARD & ACADEMIC GRADES */}
      {activeTab === 'report_card' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Term-1 Cumulative Performance Report Card</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                CBSE Grading System (A1 to E) • Cumulative Grade Point Average (CGPA)
              </p>
            </div>

            <button
              onClick={() => setShowReportCardModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official PDF</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Overall Cumulative GPA
              </div>
              <div className="text-4xl font-black text-emerald-400 mt-1">
                {childExamResult.cumulativeGpa} / 10.0
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Total Marks: {childExamResult.totalObtained} / {childExamResult.totalMaximum} ({childExamResult.percentage}%)
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-sm font-extrabold">
                Overall Grade: {childExamResult.overallGrade} (Passed)
              </span>
              <div className="text-xs text-slate-400 mt-2">Passed all subjects with distinction</div>
            </div>
          </div>

          {/* Subject Marks Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Subject Name</th>
                  <th className="py-3 px-3 text-center">Theory Score</th>
                  <th className="py-3 px-3 text-center">Practical / Viva</th>
                  <th className="py-3 px-3 text-center">Total (100)</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {childExamResult.subjects.map((sub) => {
                  const total = sub.theoryMarks + sub.practicalMarks;
                  return (
                    <tr key={sub.subjectCode} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-800">{sub.subjectName}</td>
                      <td className="py-3 px-3 text-center font-mono">
                        {sub.theoryMarks} / {sub.maxTheoryMarks}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        {sub.practicalMarks} / {sub.maxPracticalMarks}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">{total}</td>
                      <td className="py-3 px-3 text-center font-extrabold text-blue-700">A1</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FEES & INVOICING */}
      {activeTab === 'fees' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>Quarterly Fee Payments & Statements for {activeChild.fullName}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tuition, Laboratory, Sports, and Transport fee breakdown.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {childInvoices.map((inv) => {
              const isPending = inv.status === 'pending';

              return (
                <div
                  key={inv.invoiceId}
                  className={`p-5 rounded-2xl border transition-all ${
                    isPending
                      ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-400/20'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{inv.term}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                            isPending
                              ? 'bg-rose-100 text-rose-700 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        Invoice ID: {inv.invoiceId} • Due Date: {inv.dueDate}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400 uppercase font-bold">Total Amount</div>
                      <div className="text-xl font-black text-slate-900">₹{inv.totalPayable.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Line items */}
                  <div className="py-3 divide-y divide-slate-100 text-xs">
                    {inv.lineItems.map((item) => (
                      <div key={item.id} className="py-1.5 flex items-center justify-between text-slate-600">
                        <span>{item.title}</span>
                        <span className="font-mono font-semibold text-slate-800">
                          ₹{item.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}

                    {inv.fineAccumulated > 0 && (
                      <div className="py-1.5 flex items-center justify-between text-rose-700 font-semibold">
                        <span className="flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Overdue Late Fee (₹50/day penalty)</span>
                        </span>
                        <span className="font-mono">+₹{inv.fineAccumulated}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    {isPending ? (
                      <>
                        <span className="text-xs text-rose-700 font-semibold">
                          Please settle before examination hall ticket clearance.
                        </span>
                        <button
                          onClick={() => setSelectedInvoiceForPayment(inv)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center space-x-2 transition-all"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay ₹{inv.totalPayable.toLocaleString()} Online</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-emerald-700 font-semibold flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>
                            Settled via {inv.transactionRef} on {inv.paymentDate}
                          </span>
                        </div>
                        <button
                          onClick={() => alert(`Downloading official e-receipt ${inv.receiptNumber}...`)}
                          className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center space-x-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Receipt {inv.receiptNumber}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: CLASS TEACHER CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>Class Teacher Messaging: Ms. Priya Sharma</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct inquiry channel regarding academic progress and classroom feedback.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveTab('leave')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center space-x-1 cursor-pointer transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Apply for Leave</span>
              </button>
              <span className="flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Teacher Online</span>
              </span>
            </div>
          </div>

          <div className="h-64 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            {chatMessages.map((msg) => {
              const isFamily = msg.senderRole === 'parent' || msg.senderRole === 'student' || msg.senderRole === 'parent_student';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isFamily ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.senderName}</div>
                  <div
                    className={`max-w-md p-3 rounded-2xl shadow-sm ${
                      isFamily
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.message}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Ask Ms. Priya about ${activeChild.fullName}'s progress or homework...`}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: APPLY LEAVE */}
      {activeTab === 'leave' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Submit Leave Application for {activeChild.fullName}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Leaves submitted here will be acknowledged by Class Teacher Ms. Priya Sharma and recorded in daily attendance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center space-x-1 cursor-pointer transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Back to Teacher Chat</span>
            </button>
          </div>

          <form onSubmit={handleLeaveSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Leave From Date</label>
                <input
                  type="date"
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Until Date</label>
                <input
                  type="date"
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Reason</label>
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                rows={3}
                placeholder="Specify reason for absence (e.g., Medical fever rest / family commitment)..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
            >
              Submit Application
            </button>

            {leaveSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center space-x-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Leave application transmitted directly to Ms. Priya Sharma!</span>
              </div>
            )}
          </form>
        </div>
      )}
      {/* RAZORPAY / STRIPE CHECKOUT MODAL */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Secure Payment Gateway
                </div>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Razorpay / UPI Checkout</h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate:</span>
                <span className="font-bold text-slate-800">{selectedInvoiceForPayment.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono text-slate-800">{selectedInvoiceForPayment.invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Term:</span>
                <span className="text-slate-800">{selectedInvoiceForPayment.term}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-sm text-slate-900">
                <span>Total Payable:</span>
                <span className="text-blue-600">₹{selectedInvoiceForPayment.totalPayable.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Select Mode:</div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                <div className="p-2.5 rounded-xl border border-blue-500 bg-blue-50 text-blue-700 cursor-pointer">
                  UPI / GPay
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-50">
                  Credit Card
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-50">
                  NetBanking
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleExecutePayment(selectedInvoiceForPayment.invoiceId)}
                disabled={isProcessingPayment}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying with Bank Gateway...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Authorize Payment of ₹{selectedInvoiceForPayment.totalPayable.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL PRINTABLE REPORT CARD MODAL */}
      {showReportCardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <div className="text-xs uppercase tracking-widest font-black text-slate-500">
                CBSE Affiliated Senior Secondary School
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                EduPulse Public School, New Delhi
              </h2>
              <div className="text-xs text-slate-600 mt-0.5">
                Official Term-1 Cumulative Evaluation Record • Session 2026-2027
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <div>
                  <span className="text-slate-500">Candidate Name: </span>
                  <span className="font-bold text-slate-900">{activeChild.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Class & Section: </span>
                  <span className="font-bold text-slate-900">{activeChild.className}</span>
                </div>
                <div>
                  <span className="text-slate-500">Admission No: </span>
                  <span className="font-mono font-bold text-slate-900">{activeChild.admissionNumber}</span>
                </div>
              </div>

              <div>
                <div>
                  <span className="text-slate-500">Board Roll No: </span>
                  <span className="font-mono font-bold text-blue-700">
                    {activeChild.boardRollNumber || 'N/A (Junior)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Parent / Guardian: </span>
                  <span className="font-bold text-slate-900">{activeChild.parentContact}</span>
                </div>
                <div>
                  <span className="text-slate-500">Attendance: </span>
                  <span className="font-bold text-emerald-600">{activeChild.attendancePercentage}% (Eligible)</span>
                </div>
              </div>
            </div>

            <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Subject</th>
                  <th className="p-2.5 text-center">Theory (Max)</th>
                  <th className="p-2.5 text-center">Practical (Max)</th>
                  <th className="p-2.5 text-center">Total (100)</th>
                  <th className="p-2.5 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {childExamResult.subjects.map((sub) => {
                  const tot = sub.theoryMarks + sub.practicalMarks;
                  return (
                    <tr key={sub.subjectCode} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-800">{sub.subjectName}</td>
                      <td className="p-2.5 text-center font-mono">
                        {sub.theoryMarks} / {sub.maxTheoryMarks}
                      </td>
                      <td className="p-2.5 text-center font-mono">
                        {sub.practicalMarks} / {sub.maxPracticalMarks}
                      </td>
                      <td className="p-2.5 text-center font-bold text-slate-900">{tot}</td>
                      <td className="p-2.5 text-center font-bold text-blue-700">A1</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="p-4 rounded-xl bg-slate-100 text-xs flex items-center justify-between font-semibold">
              <div>
                <span>Total Obtained: </span>
                <span className="font-bold text-slate-900">
                  {childExamResult.totalObtained} / {childExamResult.totalMaximum} ({childExamResult.percentage}%)
                </span>
              </div>
              <div>
                <span>Overall Grade: </span>
                <span className="font-bold text-emerald-700 text-sm">
                  {childExamResult.overallGrade} (Passed)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowReportCardModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
