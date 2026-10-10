export type UserRole = 'super_admin' | 'principal' | 'teacher' | 'parent_student' | 'student' | 'parent' | 'accountant';

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

