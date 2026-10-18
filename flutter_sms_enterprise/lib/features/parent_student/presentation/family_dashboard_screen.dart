import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:edupulse_sms/core/utils/auth_dialog_utils.dart';
import 'package:edupulse_sms/features/conference/domain/conference_models.dart';
import 'package:edupulse_sms/features/conference/presentation/live_conference_screen.dart';

// =========================================================================
// DATA MODELS MATCHING PREVIEW DATA SCHEMA
// =========================================================================

class FamilyChildModel {
  final String studentId;
  final String fullName;
  final String className;
  final String tierTag;
  final String admissionNumber;
  final String? boardRollNumber;
  final String stream;
  final String avatarUrl;
  final double attendancePercentage;
  final String tier; // 'senior_sec', 'primary', 'pre_primary'
  final String parentContact;
  final Map<String, String>? nurseryObservation;

  const FamilyChildModel({
    required this.studentId,
    required this.fullName,
    required this.className,
    required this.tierTag,
    required this.admissionNumber,
    this.boardRollNumber,
    this.stream = 'none',
    required this.avatarUrl,
    required this.attendancePercentage,
    required this.tier,
    required this.parentContact,
    this.nurseryObservation,
  });
}

class FamilyInvoiceLineItem {
  final String id;
  final String title;
  final double amount;

  const FamilyInvoiceLineItem({
    required this.id,
    required this.title,
    required this.amount,
  });
}

class FamilyInvoiceModel {
  final String invoiceId;
  final String studentId;
  final String studentName;
  final String term;
  final List<FamilyInvoiceLineItem> lineItems;
  final double subtotal;
  final String dueDate;
  final double fineAccumulated;
  final double totalPayable;
  double amountPaid;
  String status; // 'paid' or 'pending'
  String? receiptNumber;
  String? paymentDate;
  String? transactionRef;

  FamilyInvoiceModel({
    required this.invoiceId,
    required this.studentId,
    required this.studentName,
    required this.term,
    required this.lineItems,
    required this.subtotal,
    required this.dueDate,
    required this.fineAccumulated,
    required this.totalPayable,
    required this.amountPaid,
    required this.status,
    this.receiptNumber,
    this.paymentDate,
    this.transactionRef,
  });
}

class FamilyDiaryItem {
  final String entryId;
  final String title;
  final String description;
  final String createdAt;
  final String? attachmentName;
  final String classId;

  const FamilyDiaryItem({
    required this.entryId,
    required this.title,
    required this.description,
    required this.createdAt,
    this.attachmentName,
    required this.classId,
  });
}

class FamilyTimetableSlot {
  final String id;
  final int periodNumber;
  final String subjectName;
  final String teacherName;
  final String roomNumber;
  final String startTime;
  final String endTime;
  final bool isCurrent;
  final String classId;

  const FamilyTimetableSlot({
    required this.id,
    required this.periodNumber,
    required this.subjectName,
    required this.teacherName,
    required this.roomNumber,
    required this.startTime,
    required this.endTime,
    this.isCurrent = false,
    required this.classId,
  });
}

class FamilySubjectGrade {
  final String subjectCode;
  final String subjectName;
  final int theoryMarks;
  final int maxTheoryMarks;
  final int practicalMarks;
  final int maxPracticalMarks;
  final String grade;

  const FamilySubjectGrade({
    required this.subjectCode,
    required this.subjectName,
    required this.theoryMarks,
    required this.maxTheoryMarks,
    required this.practicalMarks,
    required this.maxPracticalMarks,
    required this.grade,
  });

  int get total => theoryMarks + practicalMarks;
}

class FamilyExamResultModel {
  final String studentId;
  final String examName;
  final String term;
  final List<FamilySubjectGrade> subjects;
  final int totalObtained;
  final int totalMaximum;
  final double percentage;
  final double cumulativeGpa;
  final String overallGrade;
  final String remarks;

  const FamilyExamResultModel({
    required this.studentId,
    required this.examName,
    required this.term,
    required this.subjects,
    required this.totalObtained,
    required this.totalMaximum,
    required this.percentage,
    required this.cumulativeGpa,
    required this.overallGrade,
    required this.remarks,
  });
}

class FamilyChatMessage {
  final String id;
  final String senderName;
  final bool isFamily;
  final String message;
  final String timestamp;

  const FamilyChatMessage({
    required this.id,
    required this.senderName,
    required this.isFamily,
    required this.message,
    required this.timestamp,
  });
}

// =========================================================================
// SCREEN COMPONENT
// =========================================================================

class FamilyDashboardScreen extends ConsumerStatefulWidget {
  const FamilyDashboardScreen({super.key});

  @override
  ConsumerState<FamilyDashboardScreen> createState() =>
      _FamilyDashboardScreenState();
}

class _FamilyDashboardScreenState extends ConsumerState<FamilyDashboardScreen> {
  // Sibling switcher state:
  // 0: Ananya (Nursery), 1: Rohan (Class 5), 2: Aarav (Class 11)
  // Default to Aarav (index 2) matching the preview app
  int _selectedChildIndex = 2;

  // 6 Unified navigation tabs matching preview app:
  // 'overview', 'live_class', 'timetable', 'report_card', 'fees', 'chat', 'leave'
  String _activeTab = 'overview';

  // Chat input controller
  final _chatController = TextEditingController();

  // Leave application state
  DateTime? _leaveStartDate;
  DateTime? _leaveEndDate;
  final _leaveReasonController = TextEditingController();
  bool _leaveSubmitted = false;

  // Toast / Payment notification states
  bool _paymentSuccessNotice = false;
  String? _toastMessage;

  // 3 Siblings matching preview app (Ananya, Rohan, Aarav)
  final List<FamilyChildModel> _children = const [
    FamilyChildModel(
      studentId: 'STU_NURSERY_01',
      fullName: 'Ananya Sharma',
      className: 'Nursery (Pre-Primary)',
      tierTag: 'Nursery',
      admissionNumber: 'ADM-2026-0089',
      avatarUrl:
          'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
      attendancePercentage: 94.0,
      tier: 'pre_primary',
      parentContact: 'Mr. & Mrs. Sharma (+91 99887 76655)',
      nurseryObservation: {
        'napHours': '1 Hr 45 Mins (Quiet rest)',
        'mealIntake': '100% (Warm oatmeal & fruits)',
        'fineMotorSkills': 'Pincer grasp with wooden pegs',
        'socialBehavior': 'Cooperative sharing during block play',
        'teacherDailyNote':
            'Ananya was very cheerful today and recited rhymes with enthusiastic expressions!',
      },
    ),
    FamilyChildModel(
      studentId: 'STU_CLASS5_01',
      fullName: 'Rohan Sharma',
      className: 'Class 5-B (Primary)',
      tierTag: 'Class 5',
      admissionNumber: 'ADM-2026-0342',
      avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      attendancePercentage: 96.0,
      tier: 'primary',
      parentContact: 'Mr. & Mrs. Sharma (+91 99887 76655)',
    ),
    FamilyChildModel(
      studentId: 'STU_CLASS11_01',
      fullName: 'Aarav Sharma',
      className: 'Class 11-A',
      tierTag: 'Class 11',
      admissionNumber: 'ADM-2015-112',
      boardRollNumber: 'CBSE-2027-88910',
      stream: 'Science PCM',
      avatarUrl:
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      attendancePercentage: 88.0,
      tier: 'senior_sec',
      parentContact: 'Mr. & Mrs. Sharma (+91 99887 76655)',
    ),
  ];

  // Invoices list for family matching preview app
  late List<FamilyInvoiceModel> _invoices;

  // Timetable periods for all grades
  final List<FamilyTimetableSlot> _allTimetableSlots = const [
    // Class 11-A (Aarav)
    FamilyTimetableSlot(
      id: 'TT_11_1',
      periodNumber: 1,
      subjectName: 'Physics (Optics & Wave)',
      teacherName: 'Ms. Priya Sharma',
      roomNumber: 'Room 304 (Science Block)',
      startTime: '08:30 AM',
      endTime: '09:15 AM',
      classId: 'CLS_11',
    ),
    FamilyTimetableSlot(
      id: 'TT_11_2',
      periodNumber: 2,
      subjectName: 'Mathematics (Calculus)',
      teacherName: 'Mr. Rajesh Khanna',
      roomNumber: 'Room 304',
      startTime: '09:15 AM',
      endTime: '10:00 AM',
      isCurrent: true,
      classId: 'CLS_11',
    ),
    FamilyTimetableSlot(
      id: 'TT_11_3',
      periodNumber: 3,
      subjectName: 'Chemistry (Organic)',
      teacherName: 'Dr. Sunita Rao',
      roomNumber: 'Chem Lab 2',
      startTime: '10:15 AM',
      endTime: '11:00 AM',
      classId: 'CLS_11',
    ),
    FamilyTimetableSlot(
      id: 'TT_11_4',
      periodNumber: 4,
      subjectName: 'English Core',
      teacherName: 'Mrs. Neha Gupta',
      roomNumber: 'Room 304',
      startTime: '11:00 AM',
      endTime: '11:45 AM',
      classId: 'CLS_11',
    ),
    FamilyTimetableSlot(
      id: 'TT_11_5',
      periodNumber: 5,
      subjectName: 'Computer Science (Python)',
      teacherName: 'Mr. Amit Roy',
      roomNumber: 'CS Lab 1',
      startTime: '12:30 PM',
      endTime: '01:15 PM',
      classId: 'CLS_11',
    ),

    // Class 5-B (Rohan)
    FamilyTimetableSlot(
      id: 'TT_5_1',
      periodNumber: 1,
      subjectName: 'English Grammar & Reading',
      teacherName: 'Mrs. Shweta Singh',
      roomNumber: 'Room 102',
      startTime: '08:30 AM',
      endTime: '09:15 AM',
      classId: 'CLS_05',
    ),
    FamilyTimetableSlot(
      id: 'TT_5_2',
      periodNumber: 2,
      subjectName: 'Mathematics (Fractions & Shapes)',
      teacherName: 'Mr. Vikas Anand',
      roomNumber: 'Room 102',
      startTime: '09:15 AM',
      endTime: '10:00 AM',
      isCurrent: true,
      classId: 'CLS_05',
    ),
    FamilyTimetableSlot(
      id: 'TT_5_3',
      periodNumber: 3,
      subjectName: 'Environmental Studies',
      teacherName: 'Dr. Ananya Sen',
      roomNumber: 'EVS Lab',
      startTime: '10:15 AM',
      endTime: '11:00 AM',
      classId: 'CLS_05',
    ),
    FamilyTimetableSlot(
      id: 'TT_5_4',
      periodNumber: 4,
      subjectName: 'Hindi Literature',
      teacherName: 'Mrs. Kamla Devi',
      roomNumber: 'Room 102',
      startTime: '11:00 AM',
      endTime: '11:45 AM',
      classId: 'CLS_05',
    ),
    FamilyTimetableSlot(
      id: 'TT_5_5',
      periodNumber: 5,
      subjectName: 'Computer Basics',
      teacherName: 'Mr. Amit Roy',
      roomNumber: 'Jr. IT Lab',
      startTime: '12:30 PM',
      endTime: '01:15 PM',
      classId: 'CLS_05',
    ),

    // Nursery (Ananya)
    FamilyTimetableSlot(
      id: 'TT_N_1',
      periodNumber: 1,
      subjectName: 'Morning Circle & Rhymes',
      teacherName: 'Ms. Ritu Kapoor',
      roomNumber: 'Activity Hall',
      startTime: '09:00 AM',
      endTime: '09:45 AM',
      classId: 'CLS_NURSERY',
    ),
    FamilyTimetableSlot(
      id: 'TT_N_2',
      periodNumber: 2,
      subjectName: 'Sensory Play & Phonics',
      teacherName: 'Ms. Ritu Kapoor',
      roomNumber: 'Montessori Room',
      startTime: '09:45 AM',
      endTime: '10:30 AM',
      isCurrent: true,
      classId: 'CLS_NURSERY',
    ),
    FamilyTimetableSlot(
      id: 'TT_N_3',
      periodNumber: 3,
      subjectName: 'Healthy Snack & Milk Break',
      teacherName: 'Care Staff',
      roomNumber: 'Dining Area',
      startTime: '10:30 AM',
      endTime: '11:00 AM',
      classId: 'CLS_NURSERY',
    ),
    FamilyTimetableSlot(
      id: 'TT_N_4',
      periodNumber: 4,
      subjectName: 'Free Play & Storytelling',
      teacherName: 'Ms. Pooja Verma',
      roomNumber: 'Play Zone',
      startTime: '11:00 AM',
      endTime: '11:45 AM',
      classId: 'CLS_NURSERY',
    ),
    FamilyTimetableSlot(
      id: 'TT_N_5',
      periodNumber: 5,
      subjectName: 'Quiet Rest & Nap Time',
      teacherName: 'Nurse & Caregivers',
      roomNumber: 'Quiet Bay',
      startTime: '11:45 AM',
      endTime: '12:30 PM',
      classId: 'CLS_NURSERY',
    ),
  ];

  // Exam Results for each sibling matching preview store
  final Map<String, FamilyExamResultModel> _examResults = const {
    'STU_CLASS11_01': FamilyExamResultModel(
      studentId: 'STU_CLASS11_01',
      examName: 'Mid-Term Comprehensive Evaluation',
      term: 'Term 1 (2026-2027)',
      subjects: [
        FamilySubjectGrade(
          subjectCode: 'PHY-101',
          subjectName: 'Physics (Theory + Practical)',
          theoryMarks: 65,
          maxTheoryMarks: 70,
          practicalMarks: 28,
          maxPracticalMarks: 30,
          grade: 'A1',
        ),
        FamilySubjectGrade(
          subjectCode: 'CHM-101',
          subjectName: 'Chemistry',
          theoryMarks: 63,
          maxTheoryMarks: 70,
          practicalMarks: 29,
          maxPracticalMarks: 30,
          grade: 'A1',
        ),
        FamilySubjectGrade(
          subjectCode: 'MTH-101',
          subjectName: 'Mathematics',
          theoryMarks: 76,
          maxTheoryMarks: 80,
          practicalMarks: 19,
          maxPracticalMarks: 20,
          grade: 'A1',
        ),
        FamilySubjectGrade(
          subjectCode: 'CSC-101',
          subjectName: 'Computer Science',
          theoryMarks: 68,
          maxTheoryMarks: 70,
          practicalMarks: 30,
          maxPracticalMarks: 30,
          grade: 'A1',
        ),
        FamilySubjectGrade(
          subjectCode: 'ENG-101',
          subjectName: 'English Core',
          theoryMarks: 74,
          maxTheoryMarks: 80,
          practicalMarks: 18,
          maxPracticalMarks: 20,
          grade: 'A1',
        ),
      ],
      totalObtained: 467,
      totalMaximum: 500,
      percentage: 93.4,
      cumulativeGpa: 9.8,
      overallGrade: 'A1',
      remarks:
          'Outstanding analytical capability and practical execution. Commendable performance in PCM core.',
    ),
    'STU_CLASS5_01': FamilyExamResultModel(
      studentId: 'STU_CLASS5_01',
      examName: 'CCE Periodic Assessment 1',
      term: 'Term 1 (2026-2027)',
      subjects: [
        FamilySubjectGrade(
          subjectCode: 'ENG-05',
          subjectName: 'English Grammar & Reading',
          theoryMarks: 45,
          maxTheoryMarks: 50,
          practicalMarks: 0,
          maxPracticalMarks: 0,
          grade: 'A1',
        ),
        FamilySubjectGrade(
          subjectCode: 'MTH-05',
          subjectName: 'Mathematics (Fractions & Shapes)',
          theoryMarks: 48,
          maxTheoryMarks: 50,
          practicalMarks: 0,
          maxPracticalMarks: 0,
          grade: 'A1',
        ),
        FamilySubjectGrade(
          subjectCode: 'EVS-05',
          subjectName: 'Environmental Studies',
          theoryMarks: 44,
          maxTheoryMarks: 50,
          practicalMarks: 0,
          maxPracticalMarks: 0,
          grade: 'A1',
        ),
        FamilySubjectGrade(
          subjectCode: 'HIN-05',
          subjectName: 'Hindi Language & Literature',
          theoryMarks: 43,
          maxTheoryMarks: 50,
          practicalMarks: 0,
          maxPracticalMarks: 0,
          grade: 'A1',
        ),
      ],
      totalObtained: 180,
      totalMaximum: 200,
      percentage: 90.0,
      cumulativeGpa: 9.2,
      overallGrade: 'A1',
      remarks:
          'Consistent homework submission and enthusiastic classroom participation in EVS activities.',
    ),
    'STU_NURSERY_01': FamilyExamResultModel(
      studentId: 'STU_NURSERY_01',
      examName: 'Foundational Stage Observational Rubric',
      term: 'Term 1 (2026-2027)',
      subjects: [
        FamilySubjectGrade(
          subjectCode: 'NUR-LIT',
          subjectName: 'Pre-Literacy & Rhyme Recitation',
          theoryMarks: 24,
          maxTheoryMarks: 25,
          practicalMarks: 0,
          maxPracticalMarks: 0,
          grade: 'A1',
        ),
        FamilySubjectGrade(
          subjectCode: 'NUR-NUM',
          subjectName: 'Number Sense & Shape Sorting',
          theoryMarks: 25,
          maxTheoryMarks: 25,
          practicalMarks: 0,
          maxPracticalMarks: 0,
          grade: 'A1',
        ),
        FamilySubjectGrade(
          subjectCode: 'NUR-MOT',
          subjectName: 'Gross & Fine Motor Coordination',
          theoryMarks: 23,
          maxTheoryMarks: 25,
          practicalMarks: 0,
          maxPracticalMarks: 0,
          grade: 'A1',
        ),
        FamilySubjectGrade(
          subjectCode: 'NUR-SOC',
          subjectName: 'Social Play & Daily Habits',
          theoryMarks: 24,
          maxTheoryMarks: 25,
          practicalMarks: 0,
          maxPracticalMarks: 0,
          grade: 'A1',
        ),
      ],
      totalObtained: 96,
      totalMaximum: 100,
      percentage: 96.0,
      cumulativeGpa: 9.8,
      overallGrade: 'A1',
      remarks:
          'Delightful curiosity, creative rhythm expression, and cooperative attitude with peers.',
    ),
  };

  // Homework & Circular Diary Items
  final List<FamilyDiaryItem> _diaryItems = const [
    FamilyDiaryItem(
      entryId: 'DRY_001',
      classId: 'CLS_11',
      title: 'Physics Lab: Ray Optics Verification & Journal Submission',
      description:
          'Complete Experiment 4 (Focal length of convex lens using u-v method) with error percentage calculations in the lab manual.',
      createdAt: '2026-10-09 14:30',
      attachmentName: 'Ray_Optics_Experiment_Protocol.pdf',
    ),
    FamilyDiaryItem(
      entryId: 'DRY_002',
      classId: 'CLS_ALL',
      title: 'URGENT: Annual Inter-School Science & Robotic Conclave Circular',
      description:
          'Registration for CBSE Regional Science Exhibition is now open. Students from Classes 6 to 12 can submit project briefs to Department Heads.',
      createdAt: '2026-10-08 10:00',
      attachmentName: 'Inter_School_Conclave_Circular.pdf',
    ),
    FamilyDiaryItem(
      entryId: 'DRY_003',
      classId: 'CLS_05',
      title: 'Class 5 Mathematics: Fractions & Equivalent Decimals Sheet',
      description:
          'Solve worksheet questions 1 to 15 on page 48. Practice drawing fraction strip models in the homework notebook.',
      createdAt: '2026-10-09 12:00',
      attachmentName: 'Fractions_Practice_Worksheet.pdf',
    ),
    FamilyDiaryItem(
      entryId: 'DRY_004',
      classId: 'CLS_NURSERY',
      title: 'Pre-Primary Daily Activity Log: Sensory Colours & Motor Play',
      description:
          'Little explorers mixed primary water colors today to make green and orange! Participated in rhythm songs and alphabet phonics.',
      createdAt: '2026-10-09 11:15',
    ),
  ];

  // Chat message thread with Class Teacher
  final List<FamilyChatMessage> _chatHistory = [
    const FamilyChatMessage(
      id: 'MSG_001',
      senderName: 'Ms. Priya Sharma (Class Teacher)',
      isFamily: false,
      message:
          'Namaste Sharma ji, Aarav scored brilliantly in his physics numericals yesterday! Very proud of his progress.',
      timestamp: 'Today, 10:15 AM',
    ),
    const FamilyChatMessage(
      id: 'MSG_002',
      senderName: 'Sharma Family (Parent)',
      isFamily: true,
      message:
          'Thank you Ms. Priya! He was practicing the lens maker derivations diligently over the weekend.',
      timestamp: 'Today, 10:20 AM',
    ),
    const FamilyChatMessage(
      id: 'MSG_003',
      senderName: 'Ms. Priya Sharma (Class Teacher)',
      isFamily: false,
      message:
          'Please ensure he completes the CBSE practical record book verification before Friday.',
      timestamp: 'Today, 10:22 AM',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _initInvoices();
  }

  void _initInvoices() {
    _invoices = [
      FamilyInvoiceModel(
        invoiceId: 'INV-2026-Q2-101',
        studentId: 'STU_CLASS11_01',
        studentName: 'Aarav Sharma',
        term: 'Quarter 2 (Jul - Sep 2026)',
        lineItems: const [
          FamilyInvoiceLineItem(
              id: '1',
              title: 'Tuition Fee (Sr. Secondary Science)',
              amount: 32000),
          FamilyInvoiceLineItem(
              id: '2',
              title: 'Physics, Chem & CS Lab Consumables',
              amount: 7500),
          FamilyInvoiceLineItem(
              id: '3', title: 'CBSE Board Reg & Exam Fee', amount: 4500),
          FamilyInvoiceLineItem(
              id: '4', title: 'AC Transport Route #12', amount: 6500),
        ],
        subtotal: 50500,
        dueDate: '2026-10-01',
        fineAccumulated: 450,
        totalPayable: 50950,
        amountPaid: 0,
        status: 'pending',
      ),
      FamilyInvoiceModel(
        invoiceId: 'INV-2026-Q2-342',
        studentId: 'STU_CLASS5_01',
        studentName: 'Rohan Sharma',
        term: 'Quarter 2 (Jul - Sep 2026)',
        lineItems: const [
          FamilyInvoiceLineItem(
              id: '1', title: 'Primary Tuition Fee', amount: 22000),
          FamilyInvoiceLineItem(
              id: '2', title: 'Junior Science & STEM Lab', amount: 4000),
          FamilyInvoiceLineItem(
              id: '3',
              title: 'Digital Library & Sports Council',
              amount: 2500),
          FamilyInvoiceLineItem(
              id: '4', title: 'Bus Route #12', amount: 6500),
        ],
        subtotal: 35000,
        dueDate: '2026-10-15',
        fineAccumulated: 0,
        totalPayable: 35000,
        amountPaid: 35000,
        status: 'paid',
        receiptNumber: 'REC-2026-0892',
        paymentDate: '2026-10-06',
        transactionRef: 'RZP_TXN_99120485',
      ),
      FamilyInvoiceModel(
        invoiceId: 'INV-2026-Q2-089',
        studentId: 'STU_NURSERY_01',
        studentName: 'Ananya Sharma',
        term: 'Quarter 2 (Jul - Sep 2026)',
        lineItems: const [
          FamilyInvoiceLineItem(
              id: '1',
              title: 'Pre-Primary Tuition & Montessori Care',
              amount: 18000),
          FamilyInvoiceLineItem(
              id: '2', title: 'Activity & Sensory Play Kit', amount: 3500),
          FamilyInvoiceLineItem(
              id: '3', title: 'Air-Conditioned Bus Route #12', amount: 6500),
        ],
        subtotal: 28000,
        dueDate: '2026-10-15',
        fineAccumulated: 0,
        totalPayable: 28000,
        amountPaid: 28000,
        status: 'paid',
        receiptNumber: 'REC-2026-0891',
        paymentDate: '2026-10-05',
        transactionRef: 'RZP_TXN_88192039',
      ),
    ];
  }

  void _showToast(String message) {
    setState(() => _toastMessage = message);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: const Color(0xFF0F172A),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 3),
      ),
    );
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) setState(() => _toastMessage = null);
    });
  }

  void _joinLiveClass() {
    final activeChild = _children[_selectedChildIndex];
    final conf = LiveConferenceModel(
      sessionId: 'CONF_001',
      title: 'Class 11-A Physics • Ray Optics & Lens Maker Formula',
      subjectName: 'Physics (Optics & Wave)',
      classId: 'CLS_11',
      className: activeChild.className,
      hostUid: 'USR_TEACHER_01',
      hostName: 'Ms. Priya Sharma',
      hostRole: 'Class Teacher',
      status: ConferenceStatus.live,
      startTime: DateTime.now(),
      durationMinutes: 45,
      participantsCount: 26,
      meetingType: MeetingType.classLesson,
      roomCode: 'PHY-11A-LIVE',
      isRecording: true,
      topicSummary:
          'Derivation for refraction through spherical surfaces and paraxial ray calculations. Digital blackboard is active.',
    );

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => LiveConferenceScreen(
          conference: conf,
          isHost: false, // Student joining
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final activeChild = _children[_selectedChildIndex];
    final childInvoices = _invoices
        .where((inv) => inv.studentId == activeChild.studentId)
        .toList();
    final hasPendingDues =
        childInvoices.any((i) => i.status == 'pending');
    final pendingCount =
        childInvoices.where((i) => i.status == 'pending').length;

    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) {
        if (!didPop) {
          AuthDialogUtils.showSignOutOrExitBottomSheet(context, ref);
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFF1F5F9),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // =========================================================
                // 1. TOP EXECUTIVE FAMILY & WARD ACCESS BANNER
                // (Matches preview app dark gradient & sibling switcher)
                // =========================================================
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [
                        Color(0xFF0F172A),
                        Color(0xFF2E1065),
                        Color(0xFF1E1B4B),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: const Color(0xFF6B21A8).withOpacity(0.5),
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black26,
                        blurRadius: 10,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Badge Pill
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFF9333EA).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: const Color(0xFFD8B4FE).withOpacity(0.3),
                          ),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.family_restroom_rounded,
                                size: 12, color: Color(0xFFD8B4FE)),
                            SizedBox(width: 4),
                            Text(
                              'Parent Portal',
                              style: TextStyle(
                                color: Color(0xFFD8B4FE),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 6),

                      // Title & Subtitle + Sibling Switcher
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Family & Ward Access',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: -0.3,
                                  ),
                                ),
                                SizedBox(height: 2),
                                Text(
                                  'Daily diary, attendance, report cards, fees, and teacher messages.',
                                  style: TextStyle(
                                    color: Color(0xFFCBD5E1),
                                    fontSize: 11,
                                    height: 1.25,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 6),

                          // Sibling child switcher box
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0F172A).withOpacity(0.85),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: const Color(0xFF3730A3).withOpacity(0.5),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Padding(
                                  padding: EdgeInsets.only(left: 4, bottom: 3),
                                  child: Text(
                                    'STUDENT:',
                                    style: TextStyle(
                                      color: Color(0xFF94A3B8),
                                      fontSize: 8,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ),
                                Row(
                                  children: [
                                    ...List.generate(_children.length, (idx) {
                                      final child = _children[idx];
                                      final isSelected =
                                          _selectedChildIndex == idx;
                                      return Padding(
                                        padding:
                                            const EdgeInsets.only(right: 4.0),
                                        child: InkWell(
                                          onTap: () => setState(() =>
                                              _selectedChildIndex = idx),
                                          borderRadius:
                                              BorderRadius.circular(8),
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 6, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: isSelected
                                                  ? const Color(0xFF9333EA)
                                                  : const Color(0xFF1E293B),
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                              border: Border.all(
                                                color: isSelected
                                                  ? const Color(0xFFC084FC)
                                                  : const Color(0xFF334155),
                                              ),
                                            ),
                                            child: Row(
                                              children: [
                                                CircleAvatar(
                                                  radius: 9,
                                                  backgroundImage:
                                                      NetworkImage(child.avatarUrl),
                                                ),
                                                const SizedBox(width: 4),
                                                Column(
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                  children: [
                                                    Text(
                                                      child.fullName.split(' ')[0],
                                                      style: const TextStyle(
                                                        color: Colors.white,
                                                        fontSize: 10,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                      ),
                                                    ),
                                                    Text(
                                                      child.tierTag,
                                                      style: TextStyle(
                                                        color: isSelected
                                                            ? const Color(
                                                                0xFFF3E8FF)
                                                            : const Color(
                                                                0xFF94A3B8),
                                                        fontSize: 8,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      );
                                    }),
                                    // Sign Out Icon Button
                                    IconButton(
                                      icon: const Icon(Icons.logout_rounded,
                                          color: Colors.white70, size: 18),
                                      tooltip: 'Sign Out / Exit App',
                                      padding: EdgeInsets.zero,
                                      constraints: const BoxConstraints(),
                                      onPressed: () {
                                        AuthDialogUtils
                                            .showSignOutOrExitBottomSheet(
                                                context, ref);
                                      },
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Payment Success Notice (Matches preview green banner)
                if (_paymentSuccessNotice) ...[
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFA7F3D0)),
                      boxShadow: const [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 4,
                          offset: Offset(0, 1),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.check_circle_rounded,
                                color: Color(0xFF059669), size: 18),
                            SizedBox(width: 8),
                            Text(
                              'Fee payment confirmed! Official e-receipt generated and recorded in school ledger.',
                              style: TextStyle(
                                color: Color(0xFF065F46),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFD1FAE5),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'SETTLED',
                            style: TextStyle(
                              color: Color(0xFF047857),
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              fontFamily: 'monospace',
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

                // Toast Feedback Notice
                if (_toastMessage != null) ...[
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFA7F3D0)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle_rounded,
                            color: Color(0xFF059669), size: 16),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _toastMessage!,
                            style: const TextStyle(
                              color: Color(0xFF065F46),
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

                const SizedBox(height: 12),

                // =========================================================
                // 2. 6-BUTTON NAVIGATION SWITCHER (2 ROWS OF 3)
                // (Matches preview app layout: Overview, Live Class, Timetable,
                // Report Card, Fees, Chat & Leave)
                // =========================================================
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: const [
                      BoxShadow(
                          color: Colors.black12,
                          blurRadius: 4,
                          offset: Offset(0, 1)),
                    ],
                  ),
                  child: Column(
                    children: [
                      // Row 1: 3 Buttons
                      Row(
                        children: [
                          Expanded(
                            child: _buildNavButton(
                              id: 'overview',
                              label: 'Overview',
                              icon: Icons.auto_awesome_rounded,
                              activeColor: const Color(0xFF9333EA),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _buildNavButton(
                              id: 'live_class',
                              label: 'Live Class',
                              icon: Icons.videocam_rounded,
                              activeColor: const Color(0xFFE11D48),
                              hasRedDot: true,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _buildNavButton(
                              id: 'timetable',
                              label: 'Timetable',
                              icon: Icons.access_time_filled_rounded,
                              activeColor: const Color(0xFF9333EA),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),

                      // Row 2: 3 Buttons
                      Row(
                        children: [
                          Expanded(
                            child: _buildNavButton(
                              id: 'report_card',
                              label: 'Report Card',
                              icon: Icons.military_tech_rounded,
                              activeColor: const Color(0xFF9333EA),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _buildNavButton(
                              id: 'fees',
                              label:
                                  'Fees ${hasPendingDues ? "($pendingCount)" : ""}',
                              icon: Icons.credit_card_rounded,
                              activeColor: const Color(0xFF9333EA),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _buildNavButton(
                              id: 'chat',
                              label: 'Chat & Leave',
                              icon: Icons.chat_bubble_rounded,
                              activeColor: const Color(0xFF9333EA),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 14),

                // =========================================================
                // 3. TAB VIEWS (EXACT MATCH WITH PREVIEW APP)
                // =========================================================
                if (_activeTab == 'overview')
                  _buildOverviewTab(activeChild)
                else if (_activeTab == 'live_class')
                  _buildLiveClassTab(activeChild)
                else if (_activeTab == 'timetable')
                  _buildTimetableTab(activeChild)
                else if (_activeTab == 'report_card')
                  _buildReportCardTab(activeChild)
                else if (_activeTab == 'fees')
                  _buildFeesTab(activeChild, childInvoices)
                else if (_activeTab == 'chat' || _activeTab == 'leave')
                  _buildChatAndLeaveTab(activeChild),

                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // HELPER: NAVIGATION BUTTON
  // =========================================================================
  Widget _buildNavButton({
    required String id,
    required String label,
    required IconData icon,
    required Color activeColor,
    bool hasRedDot = false,
  }) {
    final isSelected =
        _activeTab == id || (_activeTab == 'leave' && id == 'chat');
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => setState(() => _activeTab = id),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? activeColor : const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? activeColor : const Color(0xFFE2E8F0),
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: activeColor.withOpacity(0.3),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 14,
                color: isSelected
                    ? Colors.white
                    : (id == 'live_class'
                        ? const Color(0xFFE11D48)
                        : const Color(0xFF475569)),
              ),
              const SizedBox(width: 4),
              Flexible(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: isSelected ? Colors.white : const Color(0xFF334155),
                    fontSize: 11,
                    fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                  ),
                ),
              ),
              if (hasRedDot && !isSelected) ...[
                const SizedBox(width: 3),
                Container(
                  width: 5,
                  height: 5,
                  decoration: const BoxDecoration(
                    color: Color(0xFFEF4444),
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // TAB 1: OVERVIEW TAB (SNAPSHOT, LIVE ALERT, ATTENDANCE, HOMEWORK)
  // =========================================================================
  Widget _buildOverviewTab(FamilyChildModel child) {
    final diaryForChild = _diaryItems
        .where((d) =>
            d.classId == 'CLS_ALL' ||
            (child.tier == 'senior_sec' && d.classId == 'CLS_11') ||
            (child.tier == 'primary' && d.classId == 'CLS_05') ||
            (child.tier == 'pre_primary' && d.classId == 'CLS_NURSERY'))
        .toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Live Physics Class In Session Alert Banner
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [
                Color(0xFF4C0519),
                Color(0xFF0F172A),
                Color(0xFF1E1B4B),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: const Color(0xFFBE123C).withOpacity(0.6),
            ),
            boxShadow: const [
              BoxShadow(
                color: Colors.black26,
                blurRadius: 8,
                offset: Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE11D48).withOpacity(0.25),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: const Color(0xFFFDA4AF).withOpacity(0.4),
                      ),
                    ),
                    child: const Icon(
                      Icons.sensors_rounded,
                      color: Color(0xFFFB7185),
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Text(
                              'Live Physics Class In Session!',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                fontSize: 13,
                              ),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 5, vertical: 1),
                              decoration: BoxDecoration(
                                color: const Color(0xFFE11D48),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Text(
                                'LIVE NOW',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 8,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          'Class 11-A Ray Optics & Optical Instruments • Ms. Priya Sharma is presenting.',
                          style: TextStyle(
                            color: Color(0xFFCBD5E1),
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              ElevatedButton.icon(
                onPressed: _joinLiveClass,
                icon: const Icon(Icons.play_arrow_rounded,
                    size: 16, color: Colors.white),
                label: const Text(
                  'Join Live Classroom',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: Colors.white,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE11D48),
                  foregroundColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  elevation: 2,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Active Student Profile Snapshot Card
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
            boxShadow: const [
              BoxShadow(
                  color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
            ],
          ),
          child: Column(
            children: [
              Row(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                          color: const Color(0xFF6366F1), width: 2),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        child.avatarUrl,
                        width: 56,
                        height: 56,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              child.fullName,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFFEFF6FF),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                    color: const Color(0xFFBFDBFE)),
                              ),
                              child: Text(
                                child.className,
                                style: const TextStyle(
                                  color: Color(0xFF1D4ED8),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Wrap(
                          spacing: 6,
                          runSpacing: 2,
                          children: [
                            Text(
                              'Adm No: ${child.admissionNumber}',
                              style: const TextStyle(
                                fontSize: 11,
                                color: Color(0xFF64748B),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            if (child.boardRollNumber != null)
                              Text(
                                '• Board Roll: ${child.boardRollNumber}',
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF2563EB),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            if (child.stream != 'none')
                              Text(
                                '• Stream: ${child.stream}',
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF7C3AED),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Attendance Compliance Meter
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'ATTENDANCE METRIC',
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF64748B),
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${child.attendancePercentage.toInt()}%',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF059669),
                            fontFamily: 'monospace',
                          ),
                        ),
                        const Text(
                          'CBSE Minimum 75% Requirement Met',
                          style: TextStyle(
                            fontSize: 10,
                            color: Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                            color: const Color(0xFF10B981), width: 3),
                        color: const Color(0xFFECFDF5),
                      ),
                      child: const Center(
                        child: Icon(Icons.check,
                            color: Color(0xFF059669), size: 22),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Pre-Primary Developmental Journal (If Nursery)
        if (child.tier == 'pre_primary' && child.nurseryObservation != null) ...[
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFFBCFE8)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.child_care_rounded,
                        color: Color(0xFFDB2777), size: 18),
                    SizedBox(width: 8),
                    Text(
                      'Nursery Daily Care & Developmental Journal',
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                          color: Color(0xFF9D174D)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: _buildNurseryMetric(
                        'Nap & Sleep',
                        child.nurseryObservation!['napHours'] ?? '',
                        const Color(0xFFFDF2F8),
                        const Color(0xFFBE185D),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: _buildNurseryMetric(
                        'Meal & Nutrition',
                        child.nurseryObservation!['mealIntake'] ?? '',
                        const Color(0xFFFFFBEB),
                        const Color(0xFFB45309),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Expanded(
                      child: _buildNurseryMetric(
                        'Fine Motor Skills',
                        child.nurseryObservation!['fineMotorSkills'] ?? '',
                        const Color(0xFFEFF6FF),
                        const Color(0xFF1D4ED8),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: _buildNurseryMetric(
                        'Social Behavior',
                        child.nurseryObservation!['socialBehavior'] ?? '',
                        const Color(0xFFECFDF5),
                        const Color(0xFF047857),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Teacher Note: "${child.nurseryObservation!['teacherDailyNote']}"',
                  style: const TextStyle(
                    fontSize: 11,
                    fontStyle: FontStyle.italic,
                    color: Color(0xFF475569),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
        ],

        // Active Assignments, Homework & School Circulars
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE2E8F0)),
            boxShadow: const [
              BoxShadow(
                  color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.menu_book_rounded,
                      color: Color(0xFF4F46E5), size: 18),
                  SizedBox(width: 8),
                  Text(
                    'Active Assignments, Homework & School Circulars',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: diaryForChild.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, idx) {
                  final item = diaryForChild[idx];
                  return Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                item.title,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                            ),
                            Text(
                              item.createdAt,
                              style: const TextStyle(
                                fontSize: 10,
                                color: Color(0xFF94A3B8),
                                fontFamily: 'monospace',
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.description,
                          style: const TextStyle(
                            fontSize: 11,
                            color: Color(0xFF475569),
                            height: 1.3,
                          ),
                        ),
                        if (item.attachmentName != null) ...[
                          const SizedBox(height: 8),
                          InkWell(
                            onTap: () {
                              _showToast(
                                  'Downloading ${item.attachmentName} to your device...');
                            },
                            borderRadius: BorderRadius.circular(8),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(
                                color: const Color(0xFFEEF2FF),
                                borderRadius: BorderRadius.circular(8),
                                border:
                                    Border.all(color: const Color(0xFFC7D2FE)),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.download_rounded,
                                      size: 14, color: Color(0xFF4F46E5)),
                                  const SizedBox(width: 4),
                                  Text(
                                    item.attachmentName!,
                                    style: const TextStyle(
                                      color: Color(0xFF4F46E5),
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildNurseryMetric(
      String title, String val, Color bg, Color textColor) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: TextStyle(
                  fontSize: 9, fontWeight: FontWeight.bold, color: textColor)),
          const SizedBox(height: 2),
          Text(val,
              style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A))),
        ],
      ),
    );
  }

  // =========================================================================
  // TAB 2: LIVE VIRTUAL CLASSES & VIDEO CONFERENCING
  // =========================================================================
  Widget _buildLiveClassTab(FamilyChildModel child) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(
              color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.videocam_rounded,
                      color: Color(0xFFE11D48), size: 18),
                  SizedBox(width: 8),
                  Text(
                    'Live Interactive Classrooms & Video Meetings',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF1F2),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFFECDD3)),
                ),
                child: const Text('1 Class Live Now',
                    style: TextStyle(
                        fontSize: 9,
                        color: Color(0xFFE11D48),
                        fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Hero Video Classroom Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [
                  Color(0xFF0F172A),
                  Color(0xFF1E1B4B),
                  Color(0xFF311042),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(14),
              boxShadow: const [
                BoxShadow(
                    color: Colors.black26, blurRadius: 8, offset: Offset(0, 3)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.sensors_rounded,
                            size: 14, color: Color(0xFFFB7185)),
                        SizedBox(width: 4),
                        Text(
                          'BROADCASTING LIVE FROM SCIENCE LAB',
                          style: TextStyle(
                            color: Color(0xFFFDA4AF),
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF4C0519),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: const Color(0xFF9F1239)),
                      ),
                      child: const Text(
                        'CLASS 11-A PCM',
                        style: TextStyle(
                          color: Color(0xFFFECDD3),
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'Physics: Ray Optics & Lens Maker Formula Derivations',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Instructor Ms. Priya Sharma is presenting the derivation for refraction through spherical surfaces and paraxial ray calculations. Digital blackboard is active.',
                  style: TextStyle(
                    color: Color(0xFFCBD5E1),
                    fontSize: 11,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    ElevatedButton.icon(
                      onPressed: _joinLiveClass,
                      icon: const Icon(Icons.play_arrow_rounded,
                          size: 16, color: Colors.white),
                      label: const Text(
                        'Join Live Classroom (WebRTC Room)',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFE11D48),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 10),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Row(
                      children: [
                        Icon(Icons.circle, color: Color(0xFF10B981), size: 8),
                        SizedBox(width: 4),
                        Text('26 classmates in lecture',
                            style: TextStyle(
                                fontSize: 10, color: Color(0xFF94A3B8))),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // 4 Interactive Capabilities matching preview app
                Container(
                  padding: const EdgeInsets.only(top: 10),
                  decoration: const BoxDecoration(
                    border: Border(
                      top: BorderSide(color: Color(0xFF334155)),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildCapabilityChip(
                          Icons.present_to_all_rounded, 'Teacher Slides'),
                      _buildCapabilityChip(
                          Icons.pan_tool_rounded, 'Raise Hand'),
                      _buildCapabilityChip(
                          Icons.chat_bubble_outline_rounded, 'In-Class Chat'),
                      _buildCapabilityChip(
                          Icons.check_circle_outline_rounded, 'Auto Attendance'),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // All Scheduled & Live School Conferences list
          const Text('All Scheduled & Live School Conferences',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 8),

          // Conference 1: Live Physics Class
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFFECDD3)),
              boxShadow: const [
                BoxShadow(
                    color: Colors.black12, blurRadius: 2, offset: Offset(0, 1)),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF1F2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.videocam_rounded,
                          color: Color(0xFFE11D48), size: 20),
                    ),
                    const SizedBox(width: 10),
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              'Class 11-A Physics • Ray Optics',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                            SizedBox(width: 6),
                            Text(
                              'LIVE NOW',
                              style: TextStyle(
                                color: Color(0xFFE11D48),
                                fontSize: 9,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          'Host: Ms. Priya Sharma • Room: PHY-11A-LIVE',
                          style: TextStyle(
                              fontSize: 10, color: Color(0xFF64748B)),
                        ),
                      ],
                    ),
                  ],
                ),
                ElevatedButton(
                  onPressed: _joinLiveClass,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE11D48),
                    foregroundColor: Colors.white,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    minimumSize: const Size(0, 28),
                  ),
                  child: const Text('Join Room',
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Conference 2: PTA Meet
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Icon(Icons.groups_rounded, color: Color(0xFF4F46E5), size: 20),
                    SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Parent-Teacher Association (PTA) Meet',
                            style: TextStyle(
                                fontWeight: FontWeight.bold, fontSize: 12)),
                        Text('Host: Dr. Alok Verma • Tomorrow, 04:00 PM',
                            style: TextStyle(
                                fontSize: 10, color: Color(0xFF64748B))),
                      ],
                    ),
                  ],
                ),
                OutlinedButton(
                  onPressed: () {
                    _showToast(
                        'PTA Room will become active at 03:50 PM tomorrow!');
                  },
                  style: OutlinedButton.styleFrom(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    minimumSize: const Size(0, 28),
                  ),
                  child: const Text('View Link', style: TextStyle(fontSize: 10)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCapabilityChip(IconData icon, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 12, color: const Color(0xFF94A3B8)),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFFCBD5E1),
            fontSize: 9,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  // =========================================================================
  // TAB 3: STUDENT TIMETABLE (DYNAMIC FOR EACH SIBLING)
  // =========================================================================
  Widget _buildTimetableTab(FamilyChildModel child) {
    // Filter slots for the active child's class
    final targetClassId = child.tier == 'senior_sec'
        ? 'CLS_11'
        : (child.tier == 'primary' ? 'CLS_05' : 'CLS_NURSERY');
    final childSlots = _allTimetableSlots
        .where((s) => s.classId == targetClassId)
        .toList();

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(
              color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.access_time_filled_rounded,
                      color: Color(0xFF4F46E5), size: 18),
                  const SizedBox(width: 8),
                  Text(
                    'Daily Class Schedule (${child.className})',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text('Live School Timetable',
                    style: TextStyle(
                        fontSize: 9,
                        color: Color(0xFF059669),
                        fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 12),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: childSlots.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, idx) {
              final slot = childSlots[idx];
              return Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: slot.isCurrent
                      ? const Color(0xFFEFF6FF)
                      : const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: slot.isCurrent
                        ? const Color(0xFF93C5FD)
                        : const Color(0xFFE2E8F0),
                    width: slot.isCurrent ? 1.5 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: slot.isCurrent
                            ? const Color(0xFF2563EB)
                            : const Color(0xFFE2E8F0),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text(
                          'P${slot.periodNumber}',
                          style: TextStyle(
                            color: slot.isCurrent
                                ? Colors.white
                                : const Color(0xFF334155),
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                slot.subjectName,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              if (slot.isCurrent) ...[
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 4, vertical: 1),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF2563EB),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: const Text(
                                    'ACTIVE NOW',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 8,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Faculty: ${slot.teacherName} • Room: ${slot.roomNumber}',
                            style: const TextStyle(
                              fontSize: 10,
                              color: Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          slot.startTime,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'monospace',
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        Text(
                          slot.endTime,
                          style: const TextStyle(
                            fontSize: 9,
                            color: Color(0xFF94A3B8),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // TAB 4: REPORT CARD & ACADEMIC GRADES (DYNAMIC FOR EACH SIBLING)
  // =========================================================================
  Widget _buildReportCardTab(FamilyChildModel child) {
    final result = _examResults[child.studentId] ??
        _examResults['STU_CLASS11_01']!;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(
              color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.military_tech_rounded,
                      color: Color(0xFFD97706), size: 18),
                  SizedBox(width: 8),
                  Text(
                    'Term-1 Cumulative Performance Report Card',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () => _showOfficialReportCardModal(child),
                icon: const Icon(Icons.print_rounded, size: 14),
                label: const Text('Print PDF',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F172A),
                  foregroundColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  minimumSize: const Size(0, 28),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // GPA Banner Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F172A), Color(0xFF1E1B4B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Overall Cumulative GPA',
                      style: TextStyle(
                          color: Color(0xFF94A3B8),
                          fontSize: 10,
                          fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${result.cumulativeGpa} / 10.0',
                      style: const TextStyle(
                        color: Color(0xFF34D399),
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        fontFamily: 'monospace',
                      ),
                    ),
                    Text(
                      'Total Marks: ${result.totalObtained} / ${result.totalMaximum} (${result.percentage}%)',
                      style:
                          const TextStyle(color: Color(0xFFCBD5E1), fontSize: 10),
                    ),
                  ],
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF059669).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                        color: const Color(0xFF34D399).withOpacity(0.4)),
                  ),
                  child: Column(
                    children: [
                      Text('Grade: ${result.overallGrade}',
                          style: const TextStyle(
                              color: Color(0xFF34D399),
                              fontSize: 13,
                              fontWeight: FontWeight.w900)),
                      const Text('Passed with Distinction',
                          style:
                              TextStyle(color: Colors.white70, fontSize: 8)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Subject Marks Table
          const Text('Scholastic Evaluation Breakdown',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 8),

          Table(
            border: TableBorder.all(color: const Color(0xFFE2E8F0)),
            children: [
              const TableRow(
                decoration: BoxDecoration(color: Color(0xFFF1F5F9)),
                children: [
                  Padding(
                      padding: EdgeInsets.all(8),
                      child: Text('Subject',
                          style: TextStyle(
                              fontSize: 10, fontWeight: FontWeight.bold))),
                  Padding(
                      padding: EdgeInsets.all(8),
                      child: Text('Theory',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 10, fontWeight: FontWeight.bold))),
                  Padding(
                      padding: EdgeInsets.all(8),
                      child: Text('Practical',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 10, fontWeight: FontWeight.bold))),
                  Padding(
                      padding: EdgeInsets.all(8),
                      child: Text('Total',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 10, fontWeight: FontWeight.bold))),
                  Padding(
                      padding: EdgeInsets.all(8),
                      child: Text('Grade',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 10, fontWeight: FontWeight.bold))),
                ],
              ),
              ...result.subjects.map((sub) {
                return TableRow(
                  children: [
                    Padding(
                        padding: const EdgeInsets.all(8),
                        child: Text(sub.subjectName,
                            style: const TextStyle(
                                fontSize: 10, fontWeight: FontWeight.w600))),
                    Padding(
                        padding: const EdgeInsets.all(8),
                        child: Text('${sub.theoryMarks}/${sub.maxTheoryMarks}',
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                                fontSize: 10, fontFamily: 'monospace'))),
                    Padding(
                        padding: const EdgeInsets.all(8),
                        child: Text(
                            '${sub.practicalMarks}/${sub.maxPracticalMarks}',
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                                fontSize: 10, fontFamily: 'monospace'))),
                    Padding(
                        padding: const EdgeInsets.all(8),
                        child: Text('${sub.total}',
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                fontFamily: 'monospace'))),
                    Padding(
                        padding: const EdgeInsets.all(8),
                        child: Text(sub.grade,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF2563EB)))),
                  ],
                );
              }),
            ],
          ),
          const SizedBox(height: 12),

          // Remarks
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                const Icon(Icons.format_quote_rounded,
                    color: Color(0xFF4F46E5), size: 16),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Teacher Remarks: "${result.remarks}"',
                    style: const TextStyle(
                      fontSize: 11,
                      fontStyle: FontStyle.italic,
                      color: Color(0xFF475569),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // TAB 5: FEES & INVOICING
  // =========================================================================
  Widget _buildFeesTab(
      FamilyChildModel child, List<FamilyInvoiceModel> invoices) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(
              color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              const Icon(Icons.credit_card_rounded,
                  color: Color(0xFF4F46E5), size: 18),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Quarterly Fee Payments & Statements (${child.fullName})',
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: invoices.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, idx) {
              final inv = invoices[idx];
              final isPending = inv.status == 'pending';

              return Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isPending
                      ? const Color(0xFFFFFBEB)
                      : const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isPending
                        ? const Color(0xFFFCD34D)
                        : const Color(0xFFE2E8F0),
                    width: isPending ? 1.5 : 1,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Text(
                              inv.term,
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: isPending
                                    ? const Color(0xFFFEE2E2)
                                    : const Color(0xFFD1FAE5),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                inv.status.toUpperCase(),
                                style: TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold,
                                  color: isPending
                                      ? const Color(0xFFB91C1C)
                                      : const Color(0xFF047857),
                                ),
                              ),
                            ),
                          ],
                        ),
                        Text(
                          '₹${NumberFormat('#,##,###').format(inv.totalPayable)}',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w900,
                            fontFamily: 'monospace',
                            color: isPending
                                ? const Color(0xFFB91C1C)
                                : const Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Invoice ID: ${inv.invoiceId} • Due Date: ${inv.dueDate}',
                      style: const TextStyle(
                          fontSize: 10, color: Color(0xFF64748B)),
                    ),
                    const Divider(),

                    // Line items breakdown
                    ...inv.lineItems.map((item) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 2.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(item.title,
                                style: const TextStyle(
                                    fontSize: 11, color: Color(0xFF475569))),
                            Text(
                              '₹${NumberFormat('#,##,###').format(item.amount)}',
                              style: const TextStyle(
                                  fontSize: 11, fontFamily: 'monospace'),
                            ),
                          ],
                        ),
                      );
                    }),
                    if (inv.fineAccumulated > 0)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 2.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Overdue Late Fee (₹50/day penalty)',
                              style: TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFFB91C1C),
                                  fontWeight: FontWeight.bold),
                            ),
                            Text(
                              '+₹${inv.fineAccumulated.toInt()}',
                              style: const TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFFB91C1C),
                                  fontFamily: 'monospace',
                                  fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    const Divider(),

                    // Actions
                    if (isPending) ...[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Please settle before hall ticket clearance.',
                            style: TextStyle(
                                fontSize: 10, color: Color(0xFFB91C1C)),
                          ),
                          ElevatedButton.icon(
                            onPressed: () => _showPaymentModal(inv),
                            icon: const Icon(Icons.payment_rounded, size: 14),
                            label: Text(
                              'Pay ₹${NumberFormat('#,##,###').format(inv.totalPayable)} Online',
                              style: const TextStyle(
                                  fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF2563EB),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 8),
                            ),
                          ),
                        ],
                      ),
                    ] else ...[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.check_circle,
                                  color: Color(0xFF059669), size: 14),
                              const SizedBox(width: 4),
                              Text(
                                'Settled via ${inv.transactionRef} on ${inv.paymentDate}',
                                style: const TextStyle(
                                    fontSize: 10,
                                    color: Color(0xFF059669),
                                    fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                          OutlinedButton.icon(
                            onPressed: () {
                              _showToast(
                                  'Downloading official e-receipt ${inv.receiptNumber}...');
                            },
                            icon: const Icon(Icons.download_rounded, size: 14),
                            label: Text('Receipt ${inv.receiptNumber}',
                                style: const TextStyle(fontSize: 10)),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 2),
                              minimumSize: const Size(0, 28),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // TAB 6: CHAT & LEAVE APPLICATION
  // =========================================================================
  Widget _buildChatAndLeaveTab(FamilyChildModel child) {
    final isLeave = _activeTab == 'leave';

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: const [
          BoxShadow(
              color: Colors.black12, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(
                    isLeave
                        ? Icons.description_rounded
                        : Icons.chat_bubble_rounded,
                    color: const Color(0xFF4F46E5),
                    size: 18,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    isLeave
                        ? 'Apply for Student Leave (${child.fullName})'
                        : 'Class Teacher Messaging: Ms. Priya Sharma',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ],
              ),
              Row(
                children: [
                  OutlinedButton.icon(
                    onPressed: () {
                      setState(() {
                        _activeTab = isLeave ? 'chat' : 'leave';
                      });
                    },
                    icon: Icon(
                        isLeave
                            ? Icons.chat_bubble_outline
                            : Icons.note_add_outlined,
                        size: 14),
                    label: Text(
                      isLeave ? 'Teacher Chat' : 'Apply for Leave',
                      style: const TextStyle(
                          fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      minimumSize: const Size(0, 28),
                    ),
                  ),
                  if (!isLeave) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFECFDF5),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFA7F3D0)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.circle,
                              size: 6, color: Color(0xFF10B981)),
                          SizedBox(width: 4),
                          Text(
                            'Teacher Online',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF047857),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),

          if (!isLeave) ...[
            // Chat history box
            Container(
              height: 240,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: ListView.separated(
                itemCount: _chatHistory.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, idx) {
                  final msg = _chatHistory[idx];
                  return Align(
                    alignment: msg.isFamily
                        ? Alignment.centerRight
                        : Alignment.centerLeft,
                    child: Container(
                      constraints: const BoxConstraints(maxWidth: 280),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: msg.isFamily
                            ? const Color(0xFF9333EA)
                            : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: msg.isFamily
                              ? const Color(0xFF9333EA)
                              : const Color(0xFFE2E8F0),
                        ),
                        boxShadow: const [
                          BoxShadow(
                              color: Colors.black12,
                              blurRadius: 2,
                              offset: Offset(0, 1)),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            msg.senderName,
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: msg.isFamily
                                  ? const Color(0xFFF3E8FF)
                                  : const Color(0xFF64748B),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            msg.message,
                            style: TextStyle(
                              fontSize: 11,
                              color: msg.isFamily
                                  ? Colors.white
                                  : const Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Align(
                            alignment: Alignment.bottomRight,
                            child: Text(
                              msg.timestamp,
                              style: TextStyle(
                                fontSize: 8,
                                color: msg.isFamily
                                    ? Colors.white70
                                    : const Color(0xFF94A3B8),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 10),

            // Message sender input
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _chatController,
                    decoration: InputDecoration(
                      hintText:
                          'Ask Ms. Priya about ${child.fullName}\'s progress or homework...',
                      hintStyle: const TextStyle(fontSize: 11),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 10),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                    ),
                    style: const TextStyle(fontSize: 12),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () {
                    final text = _chatController.text.trim();
                    if (text.isEmpty) return;
                    setState(() {
                      _chatHistory.add(
                        FamilyChatMessage(
                          id: 'MSG_${DateTime.now().millisecondsSinceEpoch}',
                          senderName: 'Sharma Family (Parent)',
                          isFamily: true,
                          message: text,
                          timestamp: 'Just now',
                        ),
                      );
                      _chatController.clear();
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF9333EA),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Icon(Icons.send_rounded, size: 16),
                ),
              ],
            ),
          ] else ...[
            // Leave Application Form
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Leave Start Date *',
                              style: TextStyle(
                                  fontSize: 11, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          OutlinedButton.icon(
                            onPressed: () async {
                              final d = await showDatePicker(
                                context: context,
                                initialDate: DateTime.now(),
                                firstDate: DateTime.now()
                                    .subtract(const Duration(days: 7)),
                                lastDate: DateTime.now()
                                    .add(const Duration(days: 90)),
                              );
                              if (d != null) {
                                setState(() => _leaveStartDate = d);
                              }
                            },
                            icon: const Icon(Icons.calendar_today, size: 14),
                            label: Text(
                              _leaveStartDate != null
                                  ? DateFormat('yyyy-MM-dd')
                                      .format(_leaveStartDate!)
                                  : 'Select Date',
                              style: const TextStyle(fontSize: 11),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Leave End Date',
                              style: TextStyle(
                                  fontSize: 11, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          OutlinedButton.icon(
                            onPressed: () async {
                              final d = await showDatePicker(
                                context: context,
                                initialDate:
                                    _leaveStartDate ?? DateTime.now(),
                                firstDate: DateTime.now(),
                                lastDate: DateTime.now()
                                    .add(const Duration(days: 90)),
                              );
                              if (d != null) {
                                setState(() => _leaveEndDate = d);
                              }
                            },
                            icon: const Icon(Icons.calendar_today, size: 14),
                            label: Text(
                              _leaveEndDate != null
                                  ? DateFormat('yyyy-MM-dd')
                                      .format(_leaveEndDate!)
                                  : 'Select Date',
                              style: const TextStyle(fontSize: 11),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                const Text('Reason for Absence *',
                    style:
                        TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                TextField(
                  controller: _leaveReasonController,
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText:
                        'Specify reason (e.g. Medical viral fever / family out-of-town event)...',
                    hintStyle: const TextStyle(fontSize: 11),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10)),
                  ),
                  style: const TextStyle(fontSize: 12),
                ),
                const SizedBox(height: 12),

                ElevatedButton(
                  onPressed: () {
                    final reason = _leaveReasonController.text.trim();
                    if (_leaveStartDate == null || reason.isEmpty) {
                      _showToast(
                          'Please choose start date and specify the reason!');
                      return;
                    }
                    setState(() {
                      _leaveSubmitted = true;
                    });
                    _showToast(
                        'Leave application transmitted to Class Teacher Ms. Priya Sharma!');
                    Future.delayed(const Duration(seconds: 4), () {
                      if (mounted) setState(() => _leaveSubmitted = false);
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF9333EA),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text('Submit Application',
                      style:
                          TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ),

                if (_leaveSubmitted) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFA7F3D0)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.check_circle,
                            color: Color(0xFF059669), size: 16),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Leave application transmitted directly to Ms. Priya Sharma and logged into school attendance register.',
                            style: TextStyle(
                                fontSize: 11,
                                color: Color(0xFF065F46),
                                fontWeight: FontWeight.w600),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ],
        ],
      ),
    );
  }

  // =========================================================================
  // DIALOG 1: RAZORPAY / UPI CHECKOUT MODAL
  // =========================================================================
  void _showPaymentModal(FamilyInvoiceModel inv) {
    String paymentMode = 'upi';
    bool isProcessing = false;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return AlertDialog(
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            contentPadding: const EdgeInsets.all(16),
            content: SizedBox(
              width: 360,
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'SECURE PAYMENT GATEWAY',
                              style: TextStyle(
                                  color: Color(0xFF2563EB),
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.5),
                            ),
                            Text(
                              'Razorpay / UPI Checkout',
                              style: TextStyle(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 14,
                                  color: Color(0xFF0F172A)),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, size: 18),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const Divider(),

                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Candidate:',
                                  style: TextStyle(
                                      fontSize: 11, color: Color(0xFF64748B))),
                              Text(inv.studentName,
                                  style: const TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Invoice ID:',
                                  style: TextStyle(
                                      fontSize: 11, color: Color(0xFF64748B))),
                              Text(inv.invoiceId,
                                  style: const TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      fontFamily: 'monospace')),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Term:',
                                  style: TextStyle(
                                      fontSize: 11, color: Color(0xFF64748B))),
                              Text(inv.term,
                                  style: const TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const Divider(),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Total Net Payable:',
                                  style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold)),
                              Text(
                                '₹${NumberFormat('#,##,###').format(inv.totalPayable)}',
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF2563EB),
                                  fontFamily: 'monospace',
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    const Text('Select Payment Mode',
                        style: TextStyle(
                            fontSize: 11, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () =>
                                setModalState(() => paymentMode = 'upi'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              decoration: BoxDecoration(
                                color: paymentMode == 'upi'
                                    ? const Color(0xFFEFF6FF)
                                    : const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: paymentMode == 'upi'
                                      ? const Color(0xFF2563EB)
                                      : const Color(0xFFE2E8F0),
                                ),
                              ),
                              child: const Column(
                                children: [
                                  Icon(Icons.qr_code_rounded,
                                      size: 16, color: Color(0xFF2563EB)),
                                  SizedBox(height: 2),
                                  Text('UPI / GPay',
                                      style: TextStyle(
                                          fontSize: 9,
                                          fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: InkWell(
                            onTap: () =>
                                setModalState(() => paymentMode = 'card'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              decoration: BoxDecoration(
                                color: paymentMode == 'card'
                                    ? const Color(0xFFEFF6FF)
                                    : const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: paymentMode == 'card'
                                      ? const Color(0xFF2563EB)
                                      : const Color(0xFFE2E8F0),
                                ),
                              ),
                              child: const Column(
                                children: [
                                  Icon(Icons.credit_card,
                                      size: 16, color: Color(0xFF2563EB)),
                                  SizedBox(height: 2),
                                  Text('Credit Card',
                                      style: TextStyle(
                                          fontSize: 9,
                                          fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: InkWell(
                            onTap: () =>
                                setModalState(() => paymentMode = 'netbanking'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              decoration: BoxDecoration(
                                color: paymentMode == 'netbanking'
                                    ? const Color(0xFFEFF6FF)
                                    : const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: paymentMode == 'netbanking'
                                      ? const Color(0xFF2563EB)
                                      : const Color(0xFFE2E8F0),
                                ),
                              ),
                              child: const Column(
                                children: [
                                  Icon(Icons.account_balance,
                                      size: 16, color: Color(0xFF2563EB)),
                                  SizedBox(height: 2),
                                  Text('NetBanking',
                                      style: TextStyle(
                                          fontSize: 9,
                                          fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),

                    ElevatedButton(
                      onPressed: isProcessing
                          ? null
                          : () async {
                              setModalState(() => isProcessing = true);
                              await Future.delayed(
                                  const Duration(milliseconds: 1200));

                              setState(() {
                                inv.status = 'paid';
                                inv.amountPaid = inv.totalPayable;
                                inv.paymentDate = DateFormat('yyyy-MM-dd')
                                    .format(DateTime.now());
                                inv.receiptNumber =
                                    'REC-2026-${1000 + DateTime.now().millisecond}';
                                inv.transactionRef =
                                    'RZP_TXN_${DateTime.now().millisecondsSinceEpoch.toString().substring(6)}';
                                _paymentSuccessNotice = true;
                              });

                              Navigator.pop(ctx);
                              _showToast(
                                  'Payment of ₹${NumberFormat('#,##,###').format(inv.totalPayable)} authorized! Official E-Receipt generated.');

                              Future.delayed(const Duration(seconds: 5), () {
                                if (mounted) {
                                  setState(() => _paymentSuccessNotice = false);
                                }
                              });
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2563EB),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10)),
                      ),
                      child: isProcessing
                          ? const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                SizedBox(
                                  width: 14,
                                  height: 14,
                                  child: CircularProgressIndicator(
                                      color: Colors.white, strokeWidth: 2),
                                ),
                                SizedBox(width: 8),
                                Text('Verifying with Razorpay...',
                                    style: TextStyle(fontSize: 11)),
                              ],
                            )
                          : Text(
                              'Authorize Payment of ₹${NumberFormat('#,##,###').format(inv.totalPayable)}',
                              style: const TextStyle(
                                  fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  // =========================================================================
  // DIALOG 2: OFFICIAL CBSE REPORT CARD MODAL
  // =========================================================================
  void _showOfficialReportCardModal(FamilyChildModel child) {
    final result = _examResults[child.studentId] ??
        _examResults['STU_CLASS11_01']!;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        contentPadding: const EdgeInsets.all(16),
        content: SizedBox(
          width: 400,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.school_rounded,
                            color: Color(0xFF1E1B4B), size: 20),
                        SizedBox(width: 6),
                        Text(
                          'EduPulse Public School, New Delhi',
                          style: TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 13,
                              color: Color(0xFF1E1B4B)),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 18),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const Center(
                  child: Text(
                    'CBSE AFFILIATED SENIOR SECONDARY EVALUATION RECORD',
                    style: TextStyle(
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF64748B),
                        letterSpacing: 0.5),
                  ),
                ),
                const Divider(),

                Text('Candidate: ${child.fullName}',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 13)),
                Text(
                    'Class: ${child.className} • Board Roll: ${child.boardRollNumber ?? "N/A (Junior)"}',
                    style: const TextStyle(
                        fontSize: 11, color: Color(0xFF475569))),
                Text('Admission ID: ${child.admissionNumber} • Attendance: ${child.attendancePercentage.toInt()}%',
                    style: const TextStyle(
                        fontSize: 10,
                        fontFamily: 'monospace',
                        color: Color(0xFF64748B))),
                const SizedBox(height: 8),

                // Table
                Table(
                  border: TableBorder.all(color: const Color(0xFFE2E8F0)),
                  children: [
                    const TableRow(
                      decoration: BoxDecoration(color: Color(0xFFF1F5F9)),
                      children: [
                        Padding(
                            padding: EdgeInsets.all(6),
                            child: Text('Subject',
                                style: TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold))),
                        Padding(
                            padding: EdgeInsets.all(6),
                            child: Text('Theory',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold))),
                        Padding(
                            padding: EdgeInsets.all(6),
                            child: Text('Practical',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold))),
                        Padding(
                            padding: EdgeInsets.all(6),
                            child: Text('Total',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold))),
                        Padding(
                            padding: EdgeInsets.all(6),
                            child: Text('Grade',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold))),
                      ],
                    ),
                    ...result.subjects.map((sub) {
                      return TableRow(
                        children: [
                          Padding(
                              padding: const EdgeInsets.all(6),
                              child: Text(sub.subjectName,
                                  style: const TextStyle(fontSize: 9))),
                          Padding(
                              padding: const EdgeInsets.all(6),
                              child: Text('${sub.theoryMarks}/${sub.maxTheoryMarks}',
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                      fontSize: 9, fontFamily: 'monospace'))),
                          Padding(
                              padding: const EdgeInsets.all(6),
                              child: Text('${sub.practicalMarks}/${sub.maxPracticalMarks}',
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                      fontSize: 9, fontFamily: 'monospace'))),
                          Padding(
                              padding: const EdgeInsets.all(6),
                              child: Text('${sub.total}',
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                      fontSize: 9,
                                      fontWeight: FontWeight.bold,
                                      fontFamily: 'monospace'))),
                          Padding(
                              padding: const EdgeInsets.all(6),
                              child: Text(sub.grade,
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                      fontSize: 9,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF2563EB)))),
                        ],
                      );
                    }),
                  ],
                ),
                const SizedBox(height: 8),

                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFFA7F3D0)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Result: PASSED (Grade ${result.overallGrade})',
                        style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF065F46)),
                      ),
                      Text(
                        'CGPA: ${result.cumulativeGpa} / 10.0',
                        style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF047857),
                            fontFamily: 'monospace'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    _showToast(
                        'Official PDF Report Card generated and downloaded!');
                  },
                  icon: const Icon(Icons.print_rounded, size: 14),
                  label: const Text('Print Official Report Card PDF'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0F172A),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
