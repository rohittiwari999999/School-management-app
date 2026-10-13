export type UserRole =
  | 'super_admin'
  | 'principal'
  | 'teacher'
  | 'class_teacher'
  | 'parent_student'
  | 'student'
  | 'parent'
  | 'accountant';

export type AcademicTier = 'pre_primary' | 'primary' | 'middle' | 'secondary' | 'senior_sec';

export type AcademicStream = 'none' | 'science_pcm' | 'science_pcb' | 'commerce' | 'arts';

export type AttendanceStatus = 'P' | 'A' | 'L'; // Present, Absent, Leave

export interface AppUser {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  schoolId: string;
  avatarUrl: string;
  phoneNumber?: string;
  studentClassId?: string;
  studentSectionId?: string;
  parentLinkedStudentIds?: string[];
  designation?: string;
}

export interface StudentProfile {
  studentId: string;
  admissionNumber: string;
  fullName: string;
  avatarUrl: string;
  classId: string;
  className: string;
  sectionId: string;
  tier: AcademicTier;
  stream: AcademicStream;
  boardRollNumber?: string;
  parentUid: string;
  parentContact: string;
  bloodGroup: string;
  attendancePercentage: number;
  // Pre-primary specific
  nurseryObservation?: {
    napHours: string;
    mealIntake: 'Eaten fully' | 'Half finished' | 'Fussy' | 'Had snacks';
    fineMotorSkills: 'Excellent' | 'Good' | 'Developing';
    socialBehavior: 'Cooperative' | 'Energetic' | 'Quiet';
    teacherDailyNote: string;
  };
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  classId: string;
  sectionId: string;
  recordedBy: string;
  records: Record<string, AttendanceStatus>; // studentId -> P/A/L
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  updatedAt: string;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: number; // 1 Mon to 6 Sat
  periodNumber: number;
  startTime: string;
  endTime: string;
  classId: string;
  className: string;
  sectionId: string;
  subjectCode: string;
  subjectName: string;
  teacherUid: string;
  teacherName: string;
  roomNumber: string;
}

export interface SubjectMark {
  subjectCode: string;
  subjectName: string;
  theoryMarks: number;
  maxTheoryMarks: number;
  practicalMarks: number;
  maxPracticalMarks: number;
  creditHours: number;
}

export interface ExamResult {
  examId: string;
  examName: string;
  term: string;
  studentId: string;
  classId: string;
  subjects: SubjectMark[];
  totalObtained: number;
  totalMaximum: number;
  percentage: number;
  cumulativeGpa: number;
  overallGrade: string;
  passed: boolean;
  remarks: string;
}

export interface FeeItem {
  id: string;
  feeType: 'tuition' | 'lab' | 'sports' | 'transport' | 'library' | 'examination';
  title: string;
  amount: number;
}

export interface Invoice {
  invoiceId: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  term: string;
  lineItems: FeeItem[];
  subtotal: number;
  dueDate: string;
  finePerDay: number;
  fineAccumulated: number;
  totalPayable: number;
  amountPaid: number;
  status: 'pending' | 'paid' | 'partial';
  transactionRef?: string;
  paymentDate?: string;
  receiptNumber?: string;
}

export interface DiaryEntry {
  entryId: string;
  schoolId: string;
  classId: string;
  className: string;
  sectionId?: string;
  title: string;
  description: string;
  type: 'homework' | 'notice' | 'circular' | 'observation';
  authorUid: string;
  authorName: string;
  createdAt: string;
  submissionDeadline?: string;
  attachmentName?: string;
  isEmergencyCircular: boolean;
  mealLog?: string;
  napLog?: string;
}

export interface ChatMessage {
  id: string;
  senderUid: string;
  senderName: string;
  senderRole: UserRole;
  recipientUid: string;
  studentId?: string;
  message: string;
  timestamp: string;
}

export interface LiveConferenceSession {
  sessionId: string;
  title: string;
  subjectName: string;
  classId: string;
  className: string;
  hostUid: string;
  hostName: string;
  hostRole: 'principal' | 'teacher';
  status: 'live' | 'scheduled' | 'ended';
  startTime: string;
  durationMinutes: number;
  participantsCount: number;
  meetingType: 'class' | 'assembly' | 'ptm' | 'faculty';
  roomCode: string;
  isRecording: boolean;
  topicSummary?: string;
}

export interface ConferenceParticipant {
  id: string;
  name: string;
  role: 'host' | 'teacher' | 'student' | 'parent' | 'principal';
  avatarUrl: string;
  isAudioOn: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
  isScreenSharing?: boolean;
}

export interface DashboardStats {
  id: string; // 'today'
  presentCount: number;
  totalEnrolled: number;
  targetDate: string;
  lastUpdated: string;
  lastAggregatedRecordId: string;
  lastDelta: number;
  aggregationStrategy: string;
}

export interface CloudFunctionTriggerLog {
  id: string;
  timestamp: string;
  functionName: string;
  triggerEvent: string;
  sourceDocPath: string;
  delta: number;
  newPresentCount: number;
  executionDurationMs: number;
  status: 'SUCCESS' | 'EXECUTING';
  details: string;
}

export interface OfflineAttendanceBatch {
  id: string;
  queuedAt: string;
  classId: string;
  className: string;
  sectionId: string;
  presentCount: number;
  totalStudents: number;
  records: Record<string, AttendanceStatus>;
  delta: number;
  status: 'PENDING_OFFLINE' | 'SYNCING' | 'SYNCED';
}

export type StaffRole =
  | 'principal'
  | 'teacher'
  | 'class_teacher'
  | 'accountant'
  | 'peon'
  | 'maid'
  | 'security_guard'
  | 'driver'
  | 'lab_assistant'
  | 'librarian'
  | 'other';

export interface StaffSalaryPayment {
  id: string;
  paymentDate: string; // YYYY-MM-DD
  monthYear: string; // e.g. "October 2026"
  staffId: string;
  staffName: string;
  staffRole: StaffRole;
  staffDepartment: string;
  employeeId: string;
  baseSalary: number;
  bonusOrAllowance: number;
  deductions: number;
  netAmountPaid: number;
  paymentMode: 'bank_transfer' | 'cash' | 'upi' | 'cheque';
  transactionRef: string;
  remarks: string;
  disbursedBy: string; // e.g. "Super Admin" or "Dr. Alok Verma (Principal)"
  status: 'paid' | 'pending';
  receiptVoucherNumber: string;
  createdAt: string;
}

export interface StaffCredential {
  id: string;
  fullName: string;
  role: StaffRole;
  email: string;
  tempPassword: string;
  phoneNumber: string;
  employeeId: string;
  departmentOrClass: string;
  qualification?: string;
  dateOfJoining?: string;
  acceptedBySuperAdmin: boolean;
  acceptedAt: string;
  status: 'active' | 'pending' | 'suspended';
  avatarUrl?: string;
}

export interface StaffActivityLog {
  id: string;
  staffId: string;
  staffName: string;
  role: StaffRole;
  action: string;
  category: 'attendance' | 'academic' | 'finance' | 'administration' | 'communication';
  timestamp: string;
  timeAgo: string;
  status: 'completed' | 'in_progress' | 'flagged';
  details?: string;
}

export interface StaffDirective {
  id: string;
  title: string;
  instructions: string;
  targetStaffId: string; // specific staff id or 'ALL_STAFF'
  targetStaffName: string;
  targetRole: StaffRole | 'all';
  priority: 'urgent' | 'high' | 'normal';
  deadline: string;
  issuedAt: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'administrative' | 'academic' | 'compliance' | 'finance';
}

export interface StaffCommunicationMessage {
  id: string;
  fromUid: string;
  fromName: string;
  toStaffId: string; // specific staff id or 'ALL_STAFF'
  toStaffName: string;
  message: string;
  timestamp: string;
  isBroadcast: boolean;
  priority: 'normal' | 'urgent';
  isRead: boolean;
}

