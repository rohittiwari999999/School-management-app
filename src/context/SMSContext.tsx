import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppUser,
  StudentProfile,
  AttendanceRecord,
  TimetableSlot,
  ExamResult,
  Invoice,
  DiaryEntry,
  ChatMessage,
  AttendanceStatus,
  LiveConferenceSession,
  DashboardStats,
  CloudFunctionTriggerLog,
  OfflineAttendanceBatch,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_TIMETABLE,
  INITIAL_EXAM_RESULTS,
  INITIAL_INVOICES,
  INITIAL_DIARY_ENTRIES,
  INITIAL_CHAT,
  INITIAL_CONFERENCES,
  INITIAL_DASHBOARD_STATS,
  INITIAL_CLOUD_FUNCTION_LOGS,
} from '../services/store';

interface SMSContextType {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  users: AppUser[];
  students: StudentProfile[];
  activeChild: StudentProfile;
  setActiveChildId: (id: string) => void;
  attendanceMap: Record<string, AttendanceStatus>;
  setStudentAttendance: (studentId: string, status: AttendanceStatus) => void;
  markAllAttendance: (status: AttendanceStatus) => void;
  saveAttendanceBatch: (classId?: string) => Promise<boolean>;
  isSavingAttendance: boolean;
  attendanceSavedNotice: boolean;
  lastSavedDelta: number;
  // Offline Persistence Cache & Wi-Fi Reconnect Queue (Firestore Settings & Hive Local State)
  isNetworkOnline: boolean;
  setIsNetworkOnline: (online: boolean) => void;
  toggleNetworkOnline: () => void;
  offlineSyncQueue: OfflineAttendanceBatch[];
  flushOfflineSyncQueue: () => Promise<void>;
  isSyncingQueue: boolean;
  lastSyncNotice: string | null;
  dashboardStats: DashboardStats;
  cloudFunctionLogs: CloudFunctionTriggerLog[];
  triggerCloudFunctionIncrement: (delta: number, sourceClass?: string) => void;
  timetable: TimetableSlot[];
  addTimetablePeriod: (slot: TimetableSlot) => { success: boolean; message?: string };
  examResults: ExamResult[];
  invoices: Invoice[];
  payInvoice: (invoiceId: string, paymentMethod: string) => Promise<boolean>;
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, 'entryId' | 'createdAt'>) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, recipientUid: string, studentId?: string) => void;
  conferences: LiveConferenceSession[];
  activeConference: LiveConferenceSession | null;
  joinConference: (session: LiveConferenceSession) => void;
  leaveConference: () => void;
  createConference: (data: Partial<LiveConferenceSession>) => LiveConferenceSession;
  endConference: (sessionId: string) => void;
  viewMode: 'desktop' | 'mobile' | 'code';
  setViewMode: (mode: 'desktop' | 'mobile' | 'code') => void;
  deviceType: 'iphone' | 'pixel' | 'ipad';
  setDeviceType: (dev: 'iphone' | 'pixel' | 'ipad') => void;
}

const SMSContext = createContext<SMSContextType | undefined>(undefined);

export const SMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<AppUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<AppUser>(INITIAL_USERS[0]); // default Principal
  const [students] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [activeChildId, setActiveChildId] = useState<string>('STU_CLASS11_01');

  // Attendance state for Class 11-A students
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({
    STU_CLASS11_01: 'P',
    STU_CLASS11_02: 'P',
    STU_CLASS11_03: 'A',
  });
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [attendanceSavedNotice, setAttendanceSavedNotice] = useState(false);
  const [lastSavedDelta, setLastSavedDelta] = useState<number>(0);
  const [lastClassPresents, setLastClassPresents] = useState<Record<string, number>>({});

  // Network Connectivity State (Wi-Fi Zone simulation & Offline-First Persistence Cache)
  const [isNetworkOnline, setIsNetworkOnlineState] = useState<boolean>(true);
  const [offlineSyncQueue, setOfflineSyncQueue] = useState<OfflineAttendanceBatch[]>([]);
  const [isSyncingQueue, setIsSyncingQueue] = useState<boolean>(false);
  const [lastSyncNotice, setLastSyncNotice] = useState<string | null>(null);

  // Real-time Dashboard Aggregated Stats (Synchronized silently by Cloud Functions)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(INITIAL_DASHBOARD_STATS);
  const [cloudFunctionLogs, setCloudFunctionLogs] = useState<CloudFunctionTriggerLog[]>(
    INITIAL_CLOUD_FUNCTION_LOGS
  );

  // Timetable
  const [timetable, setTimetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);

  // Exams & Invoices
  const [examResults] = useState<ExamResult[]>(INITIAL_EXAM_RESULTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

  // Diary & Chat
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(INITIAL_DIARY_ENTRIES);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);

  // Live Video Conferencing State
  const [conferences, setConferences] = useState<LiveConferenceSession[]>(INITIAL_CONFERENCES);
  const [activeConference, setActiveConference] = useState<LiveConferenceSession | null>(null);

  // Simulator UI State
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'code'>('desktop');
  const [deviceType, setDeviceType] = useState<'iphone' | 'pixel' | 'ipad'>('iphone');

  const activeChild =
    students.find((s) => s.studentId === activeChildId) || students[2];

  const setStudentAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAllAttendance = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    students
      .filter((s) => s.classId === 'CLS_11')
      .forEach((s) => {
        updated[s.studentId] = status;
      });
    setAttendanceMap(updated);
  };

  // Replay & Flush offline persistence cache when reconnecting to Wi-Fi
  const flushOfflineSyncQueue = async () => {
    if (offlineSyncQueue.length === 0) return;
    setIsSyncingQueue(true);
    await new Promise((res) => setTimeout(res, 800)); // Simulating Firestore background queue commit

    let totalDelta = 0;
    const queueSnapshot = [...offlineSyncQueue];
    queueSnapshot.forEach((item) => {
      totalDelta += item.delta;
    });

    const newPresentCount = dashboardStats.presentCount + totalDelta;

    setDashboardStats((prev) => ({
      ...prev,
      presentCount: newPresentCount,
      lastDelta: totalDelta,
      lastUpdated: new Date().toLocaleTimeString(),
      lastAggregatedRecordId: queueSnapshot[0].id,
    }));

    const syncLog: CloudFunctionTriggerLog = {
      id: `CF_LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      functionName: 'aggregateAttendanceOnWrite',
      triggerEvent: 'google.cloud.firestore.document.v1.written',
      sourceDocPath: `attendance/${queueSnapshot[0].id}`,
      delta: totalDelta,
      newPresentCount,
      executionDurationMs: Math.floor(45 + Math.random() * 25),
      status: 'SUCCESS',
      details: `[Wi-Fi Zone Connected] Synced ${queueSnapshot.length} offline batch(es) to Cloud Firestore! Cloud Function silently incremented dashboard_stats/today.presentCount by ${totalDelta >= 0 ? `+${totalDelta}` : totalDelta} (Total: ${newPresentCount}).`,
    };

    setCloudFunctionLogs((prev) => [syncLog, ...prev.slice(0, 19)]);
    setOfflineSyncQueue([]);
    setIsSyncingQueue(false);
    setLastSyncNotice(
      `🟢 Reconnected to Wi-Fi Zone! Synced ${queueSnapshot.length} offline attendance write(s) to Firebase. Cloud Function silently incremented dashboard_stats/today.presentCount (+${totalDelta}).`
    );
    setTimeout(() => setLastSyncNotice(null), 5500);
  };

  const setIsNetworkOnline = (online: boolean) => {
    setIsNetworkOnlineState(online);
    if (online && offlineSyncQueue.length > 0) {
      setTimeout(() => {
        flushOfflineSyncQueue();
      }, 400);
    }
  };

  const toggleNetworkOnline = () => {
    const nextState = !isNetworkOnline;
    setIsNetworkOnline(nextState);
  };

  const saveAttendanceBatch = async (classId: string = 'CLS_11'): Promise<boolean> => {
    setIsSavingAttendance(true);
    await new Promise((res) => setTimeout(res, 600));

    // Calculate presentCount for this batch
    const targetStudents = students.filter((s) => s.classId === classId);
    const currentBatchPresent = targetStudents.filter(
      (s) => (attendanceMap[s.studentId] || 'P') === 'P'
    ).length;

    const previousBatchPresent = lastClassPresents[classId];
    const delta =
      previousBatchPresent === undefined
        ? currentBatchPresent
        : currentBatchPresent - previousBatchPresent;

    const docId = `${new Date().toISOString().split('T')[0]}_${classId}_SEC_A`;

    // 1. OFFLINE PERSISTENCE BRANCH:
    if (!isNetworkOnline) {
      const queuedBatch: OfflineAttendanceBatch = {
        id: docId,
        queuedAt: new Date().toLocaleTimeString(),
        classId,
        className: classId === 'CLS_11' ? 'Class 11-A (Sr. Secondary)' : 'Nursery-A (Pre-Primary)',
        sectionId: 'SEC_A',
        presentCount: currentBatchPresent,
        totalStudents: targetStudents.length,
        records: { ...attendanceMap },
        delta,
        status: 'PENDING_OFFLINE',
      };

      setOfflineSyncQueue((prev) => [queuedBatch, ...prev]);
      setLastClassPresents((prev) => ({ ...prev, [classId]: currentBatchPresent }));
      setLastSavedDelta(delta);
      setIsSavingAttendance(false);
      setAttendanceSavedNotice(true);
      setTimeout(() => setAttendanceSavedNotice(false), 4500);
      return true;
    }

    // 2. ONLINE DIRECT FIRESTORE WRITE BRANCH:
    const newPresentCount = dashboardStats.presentCount + delta;

    // Silently increment dashboard_stats/today document (exact Cloud Function behavior)
    setDashboardStats((prev) => ({
      ...prev,
      presentCount: newPresentCount,
      lastDelta: delta,
      lastUpdated: new Date().toLocaleTimeString(),
      lastAggregatedRecordId: `ATT_${docId}`,
    }));

    setLastClassPresents((prev) => ({ ...prev, [classId]: currentBatchPresent }));
    setLastSavedDelta(delta);

    // Record Cloud Function execution log in real-time
    const newLog: CloudFunctionTriggerLog = {
      id: `CF_LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      functionName: 'aggregateAttendanceOnWrite',
      triggerEvent: 'google.cloud.firestore.document.v1.written',
      sourceDocPath: `attendance/${docId}`,
      delta,
      newPresentCount,
      executionDurationMs: Math.floor(35 + Math.random() * 20),
      status: 'SUCCESS',
      details:
        delta === 0
          ? `Roll-call re-submitted with 0 delta. dashboard_stats/today.presentCount held constant at ${newPresentCount}.`
          : `Cloud Function triggered on attendance write! Silently incremented dashboard_stats/today.presentCount by ${delta > 0 ? `+${delta}` : delta} (Total: ${newPresentCount}).`,
    };

    setCloudFunctionLogs((prev) => [newLog, ...prev.slice(0, 19)]);

    setIsSavingAttendance(false);
    setAttendanceSavedNotice(true);
    setTimeout(() => setAttendanceSavedNotice(false), 3500);
    return true;
  };

  const triggerCloudFunctionIncrement = (delta: number, sourceClass: string = 'Manual Roll Call') => {
    const newCount = dashboardStats.presentCount + delta;
    setDashboardStats((prev) => ({
      ...prev,
      presentCount: newCount,
      lastDelta: delta,
      lastUpdated: new Date().toLocaleTimeString(),
      lastAggregatedRecordId: `ATT_TEST_${Date.now().toString().slice(-4)}`,
    }));

    const newLog: CloudFunctionTriggerLog = {
      id: `CF_LOG_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      functionName: 'aggregateAttendanceOnWrite',
      triggerEvent: 'google.cloud.firestore.document.v1.written',
      sourceDocPath: `attendance/${new Date().toISOString().split('T')[0]}_${sourceClass.replace(/\s+/g, '_')}`,
      delta,
      newPresentCount: newCount,
      executionDurationMs: Math.floor(32 + Math.random() * 15),
      status: 'SUCCESS',
      details: `Silently incremented presentCount by ${delta > 0 ? `+${delta}` : delta} in dashboard_stats/today document.`,
    };
    setCloudFunctionLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const addTimetablePeriod = (candidate: TimetableSlot) => {
    // Check teacher conflict:
    const teacherConflict = timetable.find(
      (slot) =>
        slot.dayOfWeek === candidate.dayOfWeek &&
        slot.periodNumber === candidate.periodNumber &&
        slot.teacherUid === candidate.teacherUid &&
        slot.id !== candidate.id
    );

    if (teacherConflict) {
      return {
        success: false,
        message: `Teacher conflict: ${candidate.teacherName} is already assigned to ${teacherConflict.className}-${teacherConflict.sectionId} during Period ${candidate.periodNumber}.`,
      };
    }

    // Check room conflict:
    const roomConflict = timetable.find(
      (slot) =>
        slot.dayOfWeek === candidate.dayOfWeek &&
        slot.periodNumber === candidate.periodNumber &&
        slot.roomNumber.toLowerCase() === candidate.roomNumber.toLowerCase() &&
        slot.id !== candidate.id
    );

    if (roomConflict) {
      return {
        success: false,
        message: `Room conflict: ${candidate.roomNumber} is already occupied by ${roomConflict.className}.`,
      };
    }

    setTimetable((prev) => [...prev, candidate]);
    return { success: true };
  };

  const payInvoice = async (invoiceId: string, paymentMethod: string): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 800)); // Simulate gateway verification
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceId === invoiceId) {
          const paidAmount = inv.totalPayable;
          return {
            ...inv,
            status: 'paid',
            amountPaid: paidAmount,
            transactionRef: `TXN_${paymentMethod.toUpperCase()}_${Date.now().toString().slice(-8)}`,
            paymentDate: new Date().toISOString().split('T')[0],
            receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          };
        }
        return inv;
      })
    );
    return true;
  };

  const addDiaryEntry = (entry: Omit<DiaryEntry, 'entryId' | 'createdAt'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      entryId: `DRY_${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setDiaryEntries((prev) => [newEntry, ...prev]);
  };

  const sendChatMessage = (text: string, recipientUid: string, studentId?: string) => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: `MSG_${Date.now()}`,
      senderUid: currentUser.uid,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      recipientUid,
      studentId,
      message: text.trim(),
      timestamp: 'Just now',
    };
    setChatMessages((prev) => [...prev, msg]);
  };

  const joinConference = (session: LiveConferenceSession) => {
    setActiveConference(session);
  };

  const leaveConference = () => {
    setActiveConference(null);
  };

  const createConference = (data: Partial<LiveConferenceSession>): LiveConferenceSession => {
    const newSession: LiveConferenceSession = {
      sessionId: `CONF_${Date.now().toString().slice(-6)}`,
      title: data.title || 'Live Interactive Class',
      subjectName: data.subjectName || 'General Academic',
      classId: data.classId || 'CLS_11',
      className: data.className || 'Class 11-A',
      hostUid: currentUser.uid,
      hostName: currentUser.fullName,
      hostRole: (currentUser.role === 'principal' || currentUser.role === 'super_admin') ? 'principal' : 'teacher',
      status: 'live',
      startTime: 'Just started',
      durationMinutes: data.durationMinutes || 45,
      participantsCount: 1,
      meetingType: data.meetingType || 'class',
      roomCode: `EDU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      isRecording: data.isRecording || true,
      topicSummary: data.topicSummary || 'Live syllabus presentation and student Q&A.',
    };

    setConferences((prev) => [newSession, ...prev]);
    setActiveConference(newSession);
    return newSession;
  };

  const endConference = (sessionId: string) => {
    setConferences((prev) =>
      prev.map((c) => (c.sessionId === sessionId ? { ...c, status: 'ended' } : c))
    );
    if (activeConference?.sessionId === sessionId) {
      setActiveConference(null);
    }
  };

  return (
    <SMSContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        students,
        activeChild,
        setActiveChildId,
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
        triggerCloudFunctionIncrement,
        timetable,
        addTimetablePeriod,
        examResults,
        invoices,
        payInvoice,
        diaryEntries,
        addDiaryEntry,
        chatMessages,
        sendChatMessage,
        conferences,
        activeConference,
        joinConference,
        leaveConference,
        createConference,
        endConference,
        viewMode,
        setViewMode,
        deviceType,
        setDeviceType,
      }}
    >
      {children}
    </SMSContext.Provider>
  );
};

export const useSMS = () => {
  const context = useContext(SMSContext);
  if (!context) {
    throw new Error('useSMS must be used within an SMSProvider');
  }
  return context;
};
