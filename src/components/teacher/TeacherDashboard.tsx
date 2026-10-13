import React, { useState } from 'react';
import { useSMS } from '../../context/SMSContext';
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  Sparkles,
  Baby,
  Calculator,
  Send,
  Save,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  Video,
  MonitorUp,
  Radio,
  Play,
  Zap,
  Database,
  Activity,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
  HardDrive,
  RotateCw,
  Compass,
  ShieldAlert,
  Users,
  GraduationCap,
  Camera,
  Upload,
} from 'lucide-react';
import { PhotoUploadField } from '../common/PhotoUploadField';
import { AttendanceStatus } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const {
    students,
    attendanceMap,
    setStudentAttendance,
    markAllAttendance,
    saveAttendanceBatch,
    isSavingAttendance,
    attendanceSavedNotice,
    lastSavedDelta,
    isNetworkOnline,
    setIsNetworkOnline,
    toggleNetworkOnline,
    offlineSyncQueue,
    flushOfflineSyncQueue,
    isSyncingQueue,
    lastSyncNotice,
    dashboardStats,
    cloudFunctionLogs,
    currentUser,
    updateUserAvatar,
    updateStudent,
    addDiaryEntry,
    conferences,
    joinConference,
    createConference,
    staffDirectives,
    updateDirectiveStatus,
  } = useSMS();

  // Photo Update Modals State
  const [showTeacherPhotoModal, setShowTeacherPhotoModal] = useState(false);
  const [teacherPhotoUrl, setTeacherPhotoUrl] = useState('');
  const [photoSavedNotice, setPhotoSavedNotice] = useState<string | null>(null);

  const [showStudentPhotoModal, setShowStudentPhotoModal] = useState(false);
  const [selectedStudentForPhotoId, setSelectedStudentForPhotoId] = useState('');
  const [studentPhotoUrl, setStudentPhotoUrl] = useState('');

  // Selected class for teacher
  const [selectedClassId, setSelectedClassId] = useState<'CLS_11' | 'CLS_NURSERY' | string>('CLS_11');
  const [activeTab, setActiveTab] = useState<'attendance' | 'live_class' | 'marks' | 'diary' | 'nursery'>(
    'attendance'
  );
  const [showFunctionAudit, setShowFunctionAudit] = useState(false);

  // Live class creation state
  const [liveTopic, setLiveTopic] = useState('Ray Optics & Optical Instruments');
  const [liveSubject, setLiveSubject] = useState('Physics');

  // Diary form state
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryDesc, setDiaryDesc] = useState('');
  const [diaryType, setDiaryType] = useState<'homework' | 'notice'>('homework');
  const [diaryNotice, setDiaryNotice] = useState(false);

  // Nursery Observation state for Ananya
  const [nurseryNap, setNurseryNap] = useState('1 hr 20 mins (Restful)');
  const [nurseryMeal, setNurseryMeal] = useState<'Eaten fully' | 'Half finished' | 'Fussy' | 'Had snacks'>('Eaten fully');
  const [nurseryFineMotor, setNurseryFineMotor] = useState<'Excellent' | 'Good' | 'Developing'>('Excellent');
  const [nurserySocial, setNurserySocial] = useState<'Cooperative' | 'Energetic' | 'Quiet'>('Cooperative');
  const [nurseryNote, setNurseryNote] = useState('Ananya was delighted during block-building and shared happily.');
  const [nurserySaved, setNurserySaved] = useState(false);

  // Dynamic Grading Calculator tool
  const [theoryScore, setTheoryScore] = useState<number>(65);
  const [practicalScore, setPracticalScore] = useState<number>(28);
  const maxTheory = 70;
  const maxPractical = 30;

  const totalScore = theoryScore + practicalScore;
  const totalMax = maxTheory + maxPractical;
  const scorePercent = ((totalScore / totalMax) * 100);

  const calculateGrade = (pct: number) => {
    if (pct >= 91) return { grade: 'A1', gpa: 10.0, color: 'text-emerald-700 bg-emerald-100' };
    if (pct >= 81) return { grade: 'A2', gpa: 9.0, color: 'text-emerald-600 bg-emerald-50' };
    if (pct >= 71) return { grade: 'B1', gpa: 8.0, color: 'text-blue-700 bg-blue-100' };
    if (pct >= 61) return { grade: 'B2', gpa: 7.0, color: 'text-blue-600 bg-blue-50' };
    if (pct >= 51) return { grade: 'C1', gpa: 6.0, color: 'text-amber-700 bg-amber-100' };
    if (pct >= 41) return { grade: 'C2', gpa: 5.0, color: 'text-amber-600 bg-amber-50' };
    if (pct >= 33) return { grade: 'D', gpa: 4.0, color: 'text-orange-700 bg-orange-100' };
    return { grade: 'E (Needs Support)', gpa: 0.0, color: 'text-rose-700 bg-rose-100' };
  };

  const calculatedResult = calculateGrade(scorePercent);

  // All students belonging to active class
  const allClassStudents = students.filter(
    (s) => selectedClassId === 'ALL' || s.classId === selectedClassId
  );

  // Filter students for attendance view
  const filteredStudents = students.filter(
    (s) => selectedClassId === 'ALL' || s.classId === selectedClassId
  );


  const handleDiarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryTitle.trim() || !diaryDesc.trim()) return;

    addDiaryEntry({
      schoolId: 'SCH_GLOBAL_001',
      classId: selectedClassId,
      className: selectedClassId === 'CLS_11' ? 'Class 11-A (Science)' : 'Nursery Pre-Primary',
      sectionId: 'SEC_A',
      title: diaryTitle,
      description: diaryDesc,
      type: diaryType,
      authorUid: currentUser.uid,
      authorName: currentUser.fullName,
      isEmergencyCircular: false,
    });

    setDiaryTitle('');
    setDiaryDesc('');
    setDiaryNotice(true);
    setTimeout(() => setDiaryNotice(false), 3000);
  };

  const handleSaveNurseryObservation = () => {
    setNurserySaved(true);
    setTimeout(() => setNurserySaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Header Banner - Simplified to Name, Short Designation, Photo & Photo Option */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-blue-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5 sm:space-x-4">
            {/* Teacher Photo */}
            <div className="relative group shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-400 shadow-md ring-2 ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => {
                  setTeacherPhotoUrl(currentUser.avatarUrl);
                  setShowTeacherPhotoModal(true);
                }}
                className="absolute -bottom-1 -right-1 p-1 sm:p-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md border-2 border-slate-900 transition cursor-pointer"
                title="Change Teacher Photo"
              >
                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            {/* Teacher Name & Short Designation */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {currentUser.fullName}
              </h1>
              <p className="text-blue-300 text-xs sm:text-sm font-medium mt-0.5">
                {currentUser.designation?.split('(')[0]?.trim() || 'Senior Faculty'}
              </p>
            </div>
          </div>

          {/* Quick Photo Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setTeacherPhotoUrl(currentUser.avatarUrl);
                setShowTeacherPhotoModal(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold border border-blue-400/40 shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Teacher Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const firstStudent = allClassStudents[0] || students[0];
                if (firstStudent) {
                  setSelectedStudentForPhotoId(firstStudent.studentId);
                  setStudentPhotoUrl(firstStudent.avatarUrl);
                }
                setShowStudentPhotoModal(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold border border-indigo-400/40 shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Student Photos</span>
            </button>
          </div>
        </div>

        {photoSavedNotice && (
          <div className="mt-3 p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{photoSavedNotice}</span>
          </div>
        )}
      </div>

      {/* Teacher Console Switcher - 2 Rows (3 Buttons Top, 3 Buttons Below) */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-2 sm:p-2.5 shadow-sm space-y-1.5">
        <div className="flex items-center justify-between px-2 pt-1 pb-0.5 border-b border-slate-100">
          <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] font-bold">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Teacher Console Switcher (शिक्षक कंसोल नेविगेशन)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Switch Active Module</span>
        </div>

        {/* Row 1: 3 Buttons on Top */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setActiveTab('attendance');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'attendance'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Attendance</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('live_class');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
            onClick={() => {
              setActiveTab('marks');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
              activeTab === 'marks'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Grading</span>
          </button>
        </div>

        {/* Row 2: 3 Buttons Below */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setActiveTab('diary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`py-2 px-1.5 sm:px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer text-center ${
              activeTab === 'diary'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Homework</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('nursery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`py-2 px-1.5 sm:px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer text-center ${
              activeTab === 'nursery'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Baby className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Nursery Care</span>
          </button>

          <button
            onClick={() => setShowFunctionAudit(!showFunctionAudit)}
            className={`py-2 px-1.5 sm:px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer text-center ${
              showFunctionAudit
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 shrink-0 text-cyan-600" />
            <span className="truncate">Cloud Functions</span>
          </button>
        </div>
      </div>

      {/* Super Admin Directives for Faculty - Uske theek neeche */}
      {staffDirectives.filter((d) => d.targetRole === 'teacher' || d.targetRole === 'class_teacher' || d.targetRole === 'all').length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-rose-200 p-3 sm:p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-900">
                Super Admin Directives for Teacher ({staffDirectives.filter((d) => d.targetRole === 'teacher' || d.targetRole === 'class_teacher' || d.targetRole === 'all').length})
              </h3>
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Institutional Mandates
            </span>
          </div>

          <div className="space-y-1.5">
            {staffDirectives
              .filter((d) => d.targetRole === 'teacher' || d.targetRole === 'class_teacher' || d.targetRole === 'all')
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


      {/* TAB 0: Live Virtual Classroom & Video Conferencing */}
      {activeTab === 'live_class' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Video className="w-5 h-5 text-rose-600" />
                <span>Live Virtual Classroom & Video Conferencing Console</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Host WebRTC live video lectures with camera, mic, screen share, interactive whiteboard, and student roll-call.
              </p>
            </div>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Broadcast Ready</span>
            </span>
          </div>

          {/* Quick Launch Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Interactive Live Class Host</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Target: Class 11-A
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Class 11-A Physics Live Class</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Ray Optics & Optical Instruments • 26 Students waiting in lobby.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    const physicsConf = conferences.find((c) => c.sessionId === 'CONF_001') || conferences[0];
                    joinConference(physicsConf);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Enter Live Classroom as Host</span>
                </button>

                <button
                  onClick={() => {
                    createConference({
                      title: `Class 11-A ${liveSubject}: ${liveTopic}`,
                      subjectName: liveSubject,
                      classId: 'CLS_11',
                      className: 'Class 11-A (Science)',
                      topicSummary: liveTopic,
                      meetingType: 'class',
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Create New Live Session</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">Class Enrolled</div>
                  <div className="font-bold text-white mt-0.5">32 Students</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">Cloud Rec</div>
                  <div className="font-bold text-emerald-400 mt-0.5">Enabled (1080p)</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">Whiteboard</div>
                  <div className="font-bold text-blue-400 mt-0.5">Interactive Ready</div>
                </div>
              </div>
            </div>

            {/* Quick Session Config */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                <MonitorUp className="w-4 h-4 text-indigo-600" />
                <span>Instant Live Session Setup</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  value={liveSubject}
                  onChange={(e) => setLiveSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lecture Topic</label>
                <input
                  type="text"
                  value={liveTopic}
                  onChange={(e) => setLiveTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    createConference({
                      title: `Class 11-A ${liveSubject}: ${liveTopic}`,
                      subjectName: liveSubject,
                      classId: 'CLS_11',
                      className: 'Class 11-A (Science)',
                      topicSummary: liveTopic,
                      meetingType: 'class',
                    });
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Launch Live Video Room Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active School Video Conferences List */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              All Active & Scheduled Video Conferences
            </div>

            <div className="space-y-2.5">
              {conferences.map((conf) => {
                const isLive = conf.status === 'live';
                return (
                  <div
                    key={conf.sessionId}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isLive ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{conf.title}</span>
                          {isLive && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                              LIVE NOW
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Host: {conf.hostName} • {conf.className} • Code: <span className="font-mono text-indigo-600">{conf.roomCode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-xs text-slate-500">{conf.participantsCount} Connected</span>
                      <button
                        onClick={() => joinConference(conf)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isLive
                            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isLive ? 'Join Room' : 'View Link'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Quick Roll-Call Attendance */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
          {/* Compact Cloud Function & Network Status Bar */}
          <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">Cloud Sync:</span>
              <span className="text-slate-600 font-mono text-[11px]">
                presentCount: <strong className="text-indigo-700">{dashboardStats.presentCount}</strong> / 1,480
              </span>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                type="button"
                onClick={toggleNetworkOnline}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                  isNetworkOnline
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                }`}
              >
                {isNetworkOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-600" />
                    <span>Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-600" />
                    <span>Offline ({offlineSyncQueue.length})</span>
                  </>
                )}
              </button>

              {offlineSyncQueue.length > 0 && (
                <button
                  type="button"
                  onClick={flushOfflineSyncQueue}
                  disabled={isSyncingQueue}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold transition flex items-center space-x-1 disabled:opacity-50"
                >
                  <RotateCw className={`w-3 h-3 ${isSyncingQueue ? 'animate-spin' : ''}`} />
                  <span>Sync ({offlineSyncQueue.length})</span>
                </button>
              )}
            </div>
          </div>

          {lastSyncNotice && (
            <div className="p-4 rounded-xl bg-emerald-100/90 text-emerald-950 text-xs font-semibold flex items-center space-x-2.5 border border-emerald-400 shadow-md animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{lastSyncNotice}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <CalendarCheck className="w-5 h-5 text-blue-600" />
                <span>Daily Roll-Call Attendance</span>
              </h2>
            </div>

            {/* Class filter & Batch actions */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value as any)}
                className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CLS_11">Class 11-A (Sr. Secondary)</option>
                <option value="CLS_NURSERY">Nursery-A (Pre-Primary)</option>
              </select>

              <button
                onClick={() => markAllAttendance('P')}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition-all cursor-pointer"
              >
                All Present
              </button>
            </div>
          </div>

          {/* Student Roll-Call List */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {filteredStudents.map((student) => {
              const currentStatus: AttendanceStatus = attendanceMap[student.studentId] || 'P';

              return (
                <div
                  key={student.studentId}
                  className="p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative group shrink-0">
                      <img
                        src={student.avatarUrl}
                        alt={student.fullName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudentForPhotoId(student.studentId);
                          setStudentPhotoUrl(student.avatarUrl);
                          setShowStudentPhotoModal(true);
                        }}
                        className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-blue-600 text-white shadow-xs opacity-75 hover:opacity-100 transition cursor-pointer"
                        title="Update Student Photo / फ़ोटो बदलें"
                      >
                        <Camera className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                        <span>{student.fullName}</span>
                        {student.boardRollNumber && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                            {student.boardRollNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Adm: <span className="font-mono">{student.admissionNumber}</span> • Parent: {student.parentContact}
                      </div>
                    </div>
                  </div>

                  {/* Toggle P, A, L */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setStudentAttendance(student.studentId, 'P')}
                      className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        currentStatus === 'P'
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-400'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                      title="Present"
                    >
                      P
                    </button>

                    <button
                      onClick={() => setStudentAttendance(student.studentId, 'A')}
                      className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        currentStatus === 'A'
                          ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30 ring-2 ring-rose-400'
                          : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                      title="Absent"
                    >
                      A
                    </button>

                    <button
                      onClick={() => setStudentAttendance(student.studentId, 'L')}
                      className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        currentStatus === 'L'
                          ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 ring-2 ring-amber-400'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                      title="Approved Leave"
                    >
                      L
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Batch Save Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <div className="text-xs text-slate-500 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Firestore Sync</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowFunctionAudit(!showFunctionAudit)}
                className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span>Logs ({cloudFunctionLogs.length})</span>
                {showFunctionAudit ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <button
                onClick={() => saveAttendanceBatch(selectedClassId)}
                disabled={isSavingAttendance || isSyncingQueue}
                className={`px-4 py-2 rounded-lg text-white text-xs font-bold shadow-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50 ${
                  !isNetworkOnline
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSavingAttendance ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : !isNetworkOnline ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>Save Offline</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Attendance</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {attendanceSavedNotice && (
            <div
              className={`p-4 rounded-xl text-xs font-medium space-y-1 border shadow-sm animate-fade-in ${
                !isNetworkOnline
                  ? 'bg-amber-50 text-amber-950 border-amber-300'
                  : 'bg-emerald-50 text-emerald-950 border-emerald-300'
              }`}
            >
              <div
                className={`font-bold flex items-center space-x-1.5 ${
                  !isNetworkOnline ? 'text-amber-800' : 'text-emerald-800'
                }`}
              >
                {!isNetworkOnline ? (
                  <HardDrive className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>
                  {!isNetworkOnline
                    ? 'Attendance Stored in Local Firestore Persistence Cache (Offline)!'
                    : 'Batch Attendance Committed to Firestore!'}
                </span>
              </div>
              <p
                className={`pl-5.5 leading-relaxed ${
                  !isNetworkOnline ? 'text-amber-900/90' : 'text-emerald-900/90'
                }`}
              >
                {!isNetworkOnline ? (
                  <>
                    Write successfully queued in local cache (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-[11px]">Settings(persistenceEnabled: true)</code> / Hive local storage).
                    The teacher can proceed with their day without connectivity. The app will immediately flush and sync this write to Firebase the second they walk into a Wi-Fi zone, triggering the Cloud Function to silently increment <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-[11px]">dashboard_stats/today.presentCount</code> (+{lastSavedDelta}).
                  </>
                ) : (
                  <>
                    Document <code className="font-mono bg-emerald-100/80 px-1 py-0.5 rounded text-[11px]">attendance/2026-10-10_{selectedClassId}_SEC_A</code> written.
                    Firebase Cloud Function <code className="font-mono bg-emerald-100/80 px-1 py-0.5 rounded text-[11px]">aggregateAttendanceOnWrite</code> silently executed, applying <span className="font-bold">{lastSavedDelta >= 0 ? `+${lastSavedDelta}` : lastSavedDelta}</span> to integer <code className="font-mono bg-emerald-100/80 px-1 py-0.5 rounded text-[11px]">dashboard_stats/today.presentCount</code>. Updated school-wide present: <span className="font-bold text-emerald-800">{dashboardStats.presentCount}</span> students.
                  </>
                )}
              </p>
            </div>
          )}

          {/* Collapsible Cloud Function Execution Logs Drawer */}
          {showFunctionAudit && (
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Firebase Cloud Functions • Real-Time Trigger Logs</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Trigger: attendance/{"{id}"}</span>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {cloudFunctionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-mono text-amber-300 font-bold">{log.functionName}</span>
                        <span className="text-[10px] text-slate-400">({log.executionDurationMs}ms)</span>
                        <span className="px-1.5 py-0.2 text-[9px] rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                          {log.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 font-mono">
                        {log.details}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-emerald-400 font-bold text-xs">
                        delta: {log.delta >= 0 ? `+${log.delta}` : log.delta}
                      </div>
                      <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Pre-Primary Observational Assessment (Nursery) */}
      {activeTab === 'nursery' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Baby className="w-5 h-5 text-pink-600" />
              <span>Pre-Primary (Nursery - UKG) Observational Care Log</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Child developmental milestones, dietary intake, and nap observation for Little Learners.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-200/60 flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
              alt="Ananya Sharma"
              className="w-12 h-12 rounded-full object-cover border-2 border-pink-300"
            />
            <div>
              <div className="text-sm font-bold text-slate-900">Ananya Sharma (Nursery Section A)</div>
              <div className="text-xs text-slate-600">
                Age: 3.5 Years • Blood Group: O+ • Parent: Rajesh Sharma (+91 99887 76655)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Meal Intake */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Meal & Nutrition Intake</label>
              <select
                value={nurseryMeal}
                onChange={(e) => setNurseryMeal(e.target.value as any)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Eaten fully">Eaten fully (100% finished fruit bowl & lunch)</option>
                <option value="Half finished">Half finished (Ate half lunch)</option>
                <option value="Had snacks">Had snacks only</option>
                <option value="Fussy">Fussy today (Encouraged water & milk)</option>
              </select>
            </div>

            {/* Nap Hours */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Rest / Nap Duration</label>
              <input
                type="text"
                value={nurseryNap}
                onChange={(e) => setNurseryNap(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                placeholder="e.g. 1 hr 15 mins peaceful rest"
              />
            </div>

            {/* Fine Motor Skills */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Fine Motor & Sensory Play</label>
              <select
                value={nurseryFineMotor}
                onChange={(e) => setNurseryFineMotor(e.target.value as any)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Excellent">Excellent (Grasping crayons, stacking blocks)</option>
                <option value="Good">Good (Shows steady coordination)</option>
                <option value="Developing">Developing (Practicing clay pinch)</option>
              </select>
            </div>

            {/* Social Emotional */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Social-Emotional Behavior</label>
              <select
                value={nurserySocial}
                onChange={(e) => setNurserySocial(e.target.value as any)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Cooperative">Cooperative (Warmly shares toys & circle time)</option>
                <option value="Energetic">Energetic (High physical movement)</option>
                <option value="Quiet">Quiet & Observant</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Teacher's Note to Parents</label>
            <textarea
              value={nurseryNote}
              onChange={(e) => setNurseryNote(e.target.value)}
              rows={3}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Highlight delightful accomplishments and mood..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Synced directly into Parent Portal under Ananya's Profile.
            </span>
            <button
              onClick={handleSaveNurseryObservation}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-sm flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Observation Record</span>
            </button>
          </div>

          {nurserySaved && (
            <div className="p-3 rounded-lg bg-pink-50 text-pink-800 text-xs font-semibold flex items-center space-x-2 border border-pink-200">
              <CheckCircle2 className="w-4 h-4 text-pink-600" />
              <span>Observational diary saved and updated on Parent portal!</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Dynamic Marks & Grading Engine */}
      {activeTab === 'marks' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>Senior Secondary Marks & CCE Grading Simulator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live validation of Theory (70) + Practical (30) marks with automatic GPA calculation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-700 uppercase">Input Scores (Physics - Class 11-A)</div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Theory Marks (Max {maxTheory})</span>
                  <span className="font-mono text-blue-600">{theoryScore} / {maxTheory}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxTheory}
                  value={theoryScore}
                  onChange={(e) => setTheoryScore(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Practical / Viva Marks (Max {maxPractical})</span>
                  <span className="font-mono text-blue-600">{practicalScore} / {maxPractical}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPractical}
                  value={practicalScore}
                  onChange={(e) => setPracticalScore(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Passing Threshold: Minimum 33% in Theory AND Practical individually per Board guidelines.
              </div>
            </div>

            {/* Live Computed Output Card */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Live Computed Grade & GPA
                </div>
                <div className="mt-4 flex items-baseline space-x-3">
                  <div className="text-4xl font-black text-white">{totalScore}</div>
                  <div className="text-sm text-slate-300 font-medium">/ {totalMax} Marks ({scorePercent.toFixed(1)}%)</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800">
                <div className="p-3 rounded-lg bg-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Standard Grade</div>
                  <div className="text-xl font-extrabold text-blue-400 mt-0.5">{calculatedResult.grade}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Grade Point (GPA)</div>
                  <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{calculatedResult.gpa.toFixed(1)} / 10.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Assignment & Homework Dispatcher */}
      {activeTab === 'diary' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Assignment & Diary Dispatcher</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Writes into collection <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-mono">diary_entries</code> with student & parent real-time broadcast.
            </p>
          </div>

          <form onSubmit={handleDiarySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Entry Title</label>
                <input
                  type="text"
                  value={diaryTitle}
                  onChange={(e) => setDiaryTitle(e.target.value)}
                  placeholder="e.g. Chemistry: Balancing Redox Equations Problem Set"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CLS_11">Class 11-A (Science PCM)</option>
                  <option value="CLS_NURSERY">Nursery-A (Pre-Primary)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Details & Problem Numbers</label>
              <textarea
                value={diaryDesc}
                onChange={(e) => setDiaryDesc(e.target.value)}
                rows={3}
                placeholder="List problems 1 through 10 from Chapter 4. Submit notebook on Thursday."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Automatically creates push alert for students and parents.</span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Assignment</span>
              </button>
            </div>

            {diaryNotice && (
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center space-x-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Assignment published and dispatched to student devices!</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TEACHER PROFILE PHOTO MODAL */}
      {/* ========================================================================= */}
      {showTeacherPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-4 sm:p-5 space-y-4 relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Update Teacher Photo (शिक्षक की फ़ोटो)
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Upload or choose profile photo for {currentUser.fullName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTeacherPhotoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <PhotoUploadField
                label="Teacher Profile Photo"
                value={teacherPhotoUrl}
                onChange={setTeacherPhotoUrl}
                entityType="staff"
                helperText="(Non-mandatory / वैकल्पिक)"
              />

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTeacherPhotoModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (teacherPhotoUrl.trim()) {
                      updateUserAvatar(currentUser.uid, teacherPhotoUrl.trim());
                      setPhotoSavedNotice('✓ Teacher profile photo updated successfully!');
                      setTimeout(() => setPhotoSavedNotice(null), 4000);
                    }
                    setShowTeacherPhotoModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Teacher Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STUDENT PHOTO UPDATE MODAL */}
      {/* ========================================================================= */}
      {showStudentPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-4 sm:p-5 space-y-4 relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Student Photo Manager (छात्र फ़ोटो)
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Update student photo for roll call, profiles and report cards
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStudentPhotoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Student
                </label>
                <select
                  value={selectedStudentForPhotoId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedStudentForPhotoId(id);
                    const stu = students.find((s) => s.studentId === id);
                    if (stu) setStudentPhotoUrl(stu.avatarUrl);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {students.map((stu) => (
                    <option key={stu.studentId} value={stu.studentId}>
                      {stu.fullName} ({stu.className} • Adm #{stu.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>

              <PhotoUploadField
                label="Student Photo"
                value={studentPhotoUrl}
                onChange={setStudentPhotoUrl}
                entityType="student"
                helperText="(Non-mandatory / वैकल्पिक)"
              />

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStudentPhotoModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedStudentForPhotoId && studentPhotoUrl.trim()) {
                      updateStudent(selectedStudentForPhotoId, { avatarUrl: studentPhotoUrl.trim() });
                      setPhotoSavedNotice('✓ Student photo updated successfully!');
                      setTimeout(() => setPhotoSavedNotice(null), 4000);
                    }
                    setShowStudentPhotoModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Student Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
