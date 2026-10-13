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
  StaffCredential,
  StaffActivityLog,
  StaffDirective,
  StaffCommunicationMessage,
  StaffSalaryPayment,
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
  INITIAL_STAFF_CREDENTIALS,
  INITIAL_STAFF_ACTIVITIES,
  INITIAL_STAFF_DIRECTIVES,
  INITIAL_STAFF_MESSAGES,
  INITIAL_STAFF_SALARY_PAYMENTS,
} from '../services/store';

interface SMSContextType {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  users: AppUser[];
  staffCredentials: StaffCredential[];
  acceptStaffCredential: (credential: Omit<StaffCredential, 'id' | 'acceptedAt' | 'acceptedBySuperAdmin'>) => void;
  updateUserAvatar: (uid: string, avatarUrl: string) => void;
  updateStaffAvatar: (staffId: string, avatarUrl: string) => void;
  updateStaffCredentialStatus: (id: string, status: 'active' | 'pending' | 'suspended') => void;
  deleteStaffCredential: (id: string) => void;
  staffActivities: StaffActivityLog[];
  addStaffActivity: (activity: Omit<StaffActivityLog, 'id' | 'timestamp' | 'timeAgo'>) => void;
  staffDirectives: StaffDirective[];
  issueStaffDirective: (directive: Omit<StaffDirective, 'id' | 'issuedAt' | 'status'>) => void;
  updateDirectiveStatus: (id: string, status: 'pending' | 'in_progress' | 'completed') => void;
  deleteDirective: (id: string) => void;
  staffMessages: StaffCommunicationMessage[];
  sendStaffMessage: (toStaffId: string, toStaffName: string, message: string, isBroadcast?: boolean, priority?: 'normal' | 'urgent') => void;
  markStaffMessageRead: (id: string) => void;
  staffSalaryPayments: StaffSalaryPayment[];
  disburseStaffSalary: (payment: Omit<StaffSalaryPayment, 'id' | 'createdAt' | 'receiptVoucherNumber'>) => StaffSalaryPayment;
  deleteStaffSalaryPayment: (id: string) => void;
  students: StudentProfile[];
  addStudent: (student: Omit<StudentProfile, 'studentId'> & { studentId?: string; initialTuitionFee?: number }) => StudentProfile;
  updateStudent: (studentId: string, updates: Partial<StudentProfile>) => void;
  deleteStudent: (studentId: string) => void;
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
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<AppUser>(INITIAL_USERS[0]); // default Super Admin
  const [staffCredentials, setStaffCredentials] = useState<StaffCredential[]>(INITIAL_STAFF_CREDENTIALS);
  const [staffActivities, setStaffActivities] = useState<StaffActivityLog[]>(INITIAL_STAFF_ACTIVITIES);
  const [staffDirectives, setStaffDirectives] = useState<StaffDirective[]>(INITIAL_STAFF_DIRECTIVES);
  const [staffMessages, setStaffMessages] = useState<StaffCommunicationMessage[]>(INITIAL_STAFF_MESSAGES);
  const [staffSalaryPayments, setStaffSalaryPayments] = useState<StaffSalaryPayment[]>(
    INITIAL_STAFF_SALARY_PAYMENTS
  );
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
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

  const acceptStaffCredential = (data: Omit<StaffCredential, 'id' | 'acceptedAt' | 'acceptedBySuperAdmin'>) => {
    const newId = `CRED_${data.role.toUpperCase().slice(0, 4)}_${Date.now().toString().slice(-4)}`;

    const avatarMap: Record<string, string> = {
      principal: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      teacher: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      class_teacher: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
      accountant: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      peon: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      maid: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      security_guard: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      driver: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    };

    const finalAvatar = data.avatarUrl || avatarMap[data.role] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';

    const newCredential: StaffCredential = {
      ...data,
      id: newId,
      avatarUrl: finalAvatar,
      acceptedAt: new Date().toISOString(),
      acceptedBySuperAdmin: true,
    };
    setStaffCredentials((prev) => [newCredential, ...prev]);

    const roleNameMap: Record<string, string> = {
      principal: 'Principal',
      teacher: 'Subject Faculty',
      class_teacher: 'Class Teacher',
      accountant: 'Accountant',
      peon: 'Peon / Office Attendant',
      maid: 'Maid / Housekeeping',
      security_guard: 'Security Guard',
      driver: 'Bus Driver',
      lab_assistant: 'Lab Assistant',
      librarian: 'Librarian',
      other: 'Support Staff',
    };

    const newUser: AppUser = {
      uid: `USR_${newId}`,
      email: data.email,
      fullName: data.fullName,
      role: data.role === 'principal' || data.role === 'teacher' || data.role === 'class_teacher' || data.role === 'accountant' ? data.role : 'teacher',
      schoolId: 'SCH_GLOBAL_001',
      avatarUrl: finalAvatar,
      phoneNumber: data.phoneNumber,
      designation: `${roleNameMap[data.role] || 'Staff'} • ${data.departmentOrClass}`,
    };

    setUsers((prev) => {
      const filtered = prev.filter((u) => u.email.toLowerCase() !== data.email.toLowerCase());
      return [...filtered, newUser];
    });
  };

  const updateUserAvatar = (uid: string, avatarUrl: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, avatarUrl } : u))
    );
    if (currentUser.uid === uid) {
      setCurrentUser((prev) => ({ ...prev, avatarUrl }));
    }
    // Also sync to matching staff credential if exists
    setStaffCredentials((prev) =>
      prev.map((c) =>
        c.email.toLowerCase() === currentUser.email.toLowerCase() || c.fullName === currentUser.fullName
          ? { ...c, avatarUrl }
          : c
      )
    );
  };

  const updateStaffAvatar = (staffId: string, avatarUrl: string) => {
    setStaffCredentials((prev) =>
      prev.map((c) => (c.id === staffId ? { ...c, avatarUrl } : c))
    );
    const target = staffCredentials.find((c) => c.id === staffId);
    if (target) {
      setUsers((prev) =>
        prev.map((u) =>
          u.email.toLowerCase() === target.email.toLowerCase() || u.fullName === target.fullName
            ? { ...u, avatarUrl }
            : u
        )
      );
      if (
        currentUser.email.toLowerCase() === target.email.toLowerCase() ||
        currentUser.fullName === target.fullName
      ) {
        setCurrentUser((prev) => ({ ...prev, avatarUrl }));
      }
    }
  };

  const disburseStaffSalary = (
    payment: Omit<StaffSalaryPayment, 'id' | 'createdAt' | 'receiptVoucherNumber'>
  ): StaffSalaryPayment => {
    const voucherSeq = Math.floor(100 + staffSalaryPayments.length + 1);
    const newPayment: StaffSalaryPayment = {
      ...payment,
      id: `SAL_PAY_${Date.now()}`,
      receiptVoucherNumber: `VCH-SAL-2026-${voucherSeq}`,
      createdAt: new Date().toISOString(),
    };

    setStaffSalaryPayments((prev) => [newPayment, ...prev]);

    // Also record in staff activity log so it is audited across the system
    addStaffActivity({
      staffId: payment.staffId,
      staffName: payment.staffName,
      role: payment.staffRole,
      action: `Disbursed Salary / Fee: ₹${payment.netAmountPaid.toLocaleString()} (${payment.monthYear})`,
      category: 'finance',
      status: 'completed',
      details: `${payment.remarks || 'Salary disbursement processed'} | Mode: ${payment.paymentMode.toUpperCase()} | Voucher: ${newPayment.receiptVoucherNumber} | Auth: ${payment.disbursedBy}`,
    });

    return newPayment;
  };

  const deleteStaffSalaryPayment = (id: string) => {
    setStaffSalaryPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStaffCredentialStatus = (id: string, status: 'active' | 'pending' | 'suspended') => {
    setStaffCredentials((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const deleteStaffCredential = (id: string) => {
    setStaffCredentials((prev) => prev.filter((c) => c.id !== id));
  };

  const addStaffActivity = (act: Omit<StaffActivityLog, 'id' | 'timestamp' | 'timeAgo'>) => {
    const newActivity: StaffActivityLog = {
      ...act,
      id: `ACT_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
    };
    setStaffActivities((prev) => [newActivity, ...prev]);
  };

  const issueStaffDirective = (dir: Omit<StaffDirective, 'id' | 'issuedAt' | 'status'>) => {
    const newDirective: StaffDirective = {
      ...dir,
      id: `DIR_${Date.now()}`,
      issuedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setStaffDirectives((prev) => [newDirective, ...prev]);

    // Also record in activity log
    addStaffActivity({
      staffId: dir.targetStaffId,
      staffName: dir.targetStaffName,
      role: dir.targetRole === 'all' ? 'principal' : dir.targetRole,
      action: `Super Admin Directive: "${dir.title}"`,
      category: 'administration',
      status: 'in_progress',
      details: dir.instructions,
    });
  };

  const updateDirectiveStatus = (id: string, status: 'pending' | 'in_progress' | 'completed') => {
    setStaffDirectives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };

  const deleteDirective = (id: string) => {
    setStaffDirectives((prev) => prev.filter((d) => d.id !== id));
  };

  const sendStaffMessage = (
    toStaffId: string,
    toStaffName: string,
    message: string,
    isBroadcast = false,
    priority: 'normal' | 'urgent' = 'normal'
  ) => {
    const newMsg: StaffCommunicationMessage = {
      id: `MSG_${Date.now()}`,
      fromUid: currentUser.uid,
      fromName: `${currentUser.fullName} (Super Admin)`,
      toStaffId,
      toStaffName,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBroadcast,
      priority,
      isRead: false,
    };
    setStaffMessages((prev) => [newMsg, ...prev]);

    // Also record in activity log
    addStaffActivity({
      staffId: toStaffId,
      staffName: toStaffName,
      role: 'principal',
      action: isBroadcast ? 'Broadcast Institutional Circular' : `Direct Super Admin Message to ${toStaffName}`,
      category: 'communication',
      status: 'completed',
      details: message,
    });
  };

  const markStaffMessageRead = (id: string) => {
    setStaffMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  const addStudent = (
    studentData: Omit<StudentProfile, 'studentId'> & { studentId?: string; initialTuitionFee?: number }
  ): StudentProfile => {
    const newStudentId =
      studentData.studentId || `STU_ENR_${Date.now().toString().slice(-6)}`;
    const newStudent: StudentProfile = {
      ...studentData,
      studentId: newStudentId,
      avatarUrl:
        studentData.avatarUrl ||
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      attendancePercentage: studentData.attendancePercentage ?? 100,
      parentUid: studentData.parentUid || `USR_PAR_${Date.now().toString().slice(-4)}`,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Initialize attendance status as Present
    setAttendanceMap((prev) => ({
      ...prev,
      [newStudentId]: 'P',
    }));

    // If initial admission/tuition fee specified, generate initial invoice
    if (studentData.initialTuitionFee && studentData.initialTuitionFee > 0) {
      const compositeFee = studentData.initialTuitionFee;
      const registrationFee = 1500;
      const totalAmount = compositeFee + registrationFee;
      const newInvoice: Invoice = {
        invoiceId: `INV_${new Date().getFullYear()}_${Date.now().toString().slice(-4)}`,
        schoolId: 'SCH_GLOBAL_001',
        studentId: newStudentId,
        studentName: newStudent.fullName,
        classId: newStudent.classId,
        className: newStudent.className,
        term: 'Annual / Admission Term 2026-27',
        lineItems: [
          {
            id: `FEE_COMP_${Date.now()}`,
            feeType: 'tuition',
            title: 'Admission & Composite Academic Fee',
            amount: compositeFee,
          },
          {
            id: `FEE_REG_${Date.now()}`,
            feeType: 'examination',
            title: 'Registration & Smart Student ID Dossier',
            amount: registrationFee,
          },
        ],
        subtotal: totalAmount,
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        finePerDay: 50,
        fineAccumulated: 0,
        totalPayable: totalAmount,
        amountPaid: 0,
        status: 'pending',
      };
      setInvoices((prev) => [newInvoice, ...prev]);
    }

    // Record in staff activity log so admin/clerk/principal see enrollment audit
    addStaffActivity({
      staffId: currentUser.uid,
      staffName: currentUser.fullName,
      role: currentUser.role === 'accountant' ? 'accountant' : 'principal',
      action: `New Student Admission: ${newStudent.fullName} (${newStudent.className})`,
      category: 'administration',
      status: 'completed',
      details: `Adm #${newStudent.admissionNumber}, Roll: ${newStudent.boardRollNumber || 'Auto-assigned'}, Parent: ${newStudent.parentContact}. Synced in Class Teacher console.`,
    });

    return newStudent;
  };

  const updateStudent = (studentId: string, updates: Partial<StudentProfile>) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, ...updates } : s))
    );
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.studentId !== studentId));
  };

  return (
    <SMSContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        staffCredentials,
        acceptStaffCredential,
        updateUserAvatar,
        updateStaffAvatar,
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
        students,
        addStudent,
        updateStudent,
        deleteStudent,
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
