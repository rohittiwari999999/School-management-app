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
} from 'lucide-react';
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
    currentUser,
    addDiaryEntry,
    conferences,
    joinConference,
    createConference,
  } = useSMS();

  // Selected class for teacher
  const [selectedClassId, setSelectedClassId] = useState<'CLS_11' | 'CLS_NURSERY'>('CLS_11');
  const [activeTab, setActiveTab] = useState<'attendance' | 'nursery' | 'marks' | 'diary' | 'live_class'>('live_class');

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

  // Filter students for attendance
  const filteredStudents = students.filter(
    (s) => s.classId === selectedClassId
  );

  const presentCount = filteredStudents.filter((s) => (attendanceMap[s.studentId] || 'P') === 'P').length;
  const absentCount = filteredStudents.filter((s) => attendanceMap[s.studentId] === 'A').length;
  const leaveCount = filteredStudents.filter((s) => attendanceMap[s.studentId] === 'L').length;

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
      {/* Teacher Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-blue-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
              <span>Teacher Academic Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ms. Priya Sharma's Faculty Desk
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Class Teacher: Class 11-A (Science PCM) & Co-Lead: Nursery Pre-Primary Foundation.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex flex-wrap gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('live_class')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'live_class'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Live Classroom</span>
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse ml-0.5" />
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'attendance'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Roll-Call Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('nursery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'nursery'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Baby className="w-3.5 h-3.5" />
              <span>Pre-Primary Log</span>
            </button>

            <button
              onClick={() => setActiveTab('marks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'marks'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Marks & GPA Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('diary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'diary'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Assignment Dispatch</span>
            </button>
          </div>
        </div>
      </div>

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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <CalendarCheck className="w-5 h-5 text-blue-600" />
                <span>Daily Roll-Call Attendance</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Schema: <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-mono">attendance/{"{date_classId_sectionId}"}</code>
              </p>
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
                className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition-all"
              >
                Mark All Present
              </button>
            </div>
          </div>

          {/* Real-time Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Total Enrolled</div>
              <div className="text-xl font-black text-slate-900 mt-1">{filteredStudents.length} Students</div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <div className="text-[11px] font-bold text-emerald-700 uppercase">Present (P)</div>
              <div className="text-xl font-black text-emerald-900 mt-1">{presentCount}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
              <div className="text-[11px] font-bold text-rose-700 uppercase">Absent (A)</div>
              <div className="text-xl font-black text-rose-900 mt-1">{absentCount}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
              <div className="text-[11px] font-bold text-amber-700 uppercase">On Leave (L)</div>
              <div className="text-xl font-black text-amber-900 mt-1">{leaveCount}</div>
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
                    <img
                      src={student.avatarUrl}
                      alt={student.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Atomic batch commit with <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">writeBatch()</code> to Firestore
              </span>
            </div>

            <button
              onClick={() => saveAttendanceBatch()}
              disabled={isSavingAttendance}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isSavingAttendance ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Committing to Firestore...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Batch Roll-Call</span>
                </>
              )}
            </button>
          </div>

          {attendanceSavedNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold flex items-center space-x-2 border border-emerald-300 shadow-sm animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Roll-call record updated successfully for {selectedClassId === 'CLS_11' ? 'Class 11-A' : 'Nursery-A'}. Offline cache synced.</span>
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
    </div>
  );
};
