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
  DollarSign,
  Heart,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ParentDashboard: React.FC = () => {
  const {
    students,
    activeChild,
    setActiveChildId,
    invoices,
    payInvoice,
    diaryEntries,
    chatMessages,
    sendChatMessage,
    currentUser,
  } = useSMS();

  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'chat' | 'leave'>('overview');
  const [chatInput, setChatInput] = useState('');
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<any | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState(false);

  // Leave application state
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  // Filter linked siblings for this parent
  const parentChildren = students.filter(
    (s) => currentUser.parentLinkedStudentIds?.includes(s.studentId)
  );

  // Active child's invoices
  const childInvoices = invoices.filter((inv) => inv.studentId === activeChild.studentId);
  const pendingInvoice = childInvoices.find((inv) => inv.status === 'pending');

  // Active child's diary entries
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

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
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
    <div className="space-y-6">
      {/* Sibling Switcher Header Bar */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-purple-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2 border border-purple-400/30">
              <Users className="w-3.5 h-3.5" />
              <span>Multi-Child Family Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sharma Family Parent Portal
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Select child to switch dynamic K-12 academic views (Nursery, Primary, or Sr. Secondary):
            </p>
          </div>

          {/* Child Switcher Cards */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {parentChildren.map((child) => {
              const isSelected = activeChild.studentId === child.studentId;
              let tierBadge = 'Nursery';
              if (child.tier === 'primary') tierBadge = 'Class 5 CCE';
              if (child.tier === 'senior_sec') tierBadge = 'Class 11 PCM';

              return (
                <button
                  key={child.studentId}
                  onClick={() => setActiveChildId(child.studentId)}
                  className={`flex items-center space-x-3 p-2.5 rounded-xl border text-left transition-all shrink-0 ${
                    isSelected
                      ? 'bg-purple-600/90 border-purple-400 text-white shadow-lg ring-2 ring-purple-300/40'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80'
                  }`}
                >
                  <img
                    src={child.avatarUrl}
                    alt={child.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-white/30"
                  />
                  <div>
                    <div className="text-xs font-bold">{child.fullName}</div>
                    <div className="text-[10px] opacity-80">{tierBadge}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-purple-900/60">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'bg-white text-purple-950 shadow-md'
                : 'bg-purple-900/40 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>Academic & Care Log</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'fees'
                ? 'bg-white text-purple-950 shadow-md'
                : 'bg-purple-900/40 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Fee Payments & Dues {pendingInvoice && '(1 Pending)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'chat'
                ? 'bg-white text-purple-950 shadow-md'
                : 'bg-purple-900/40 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Teacher Communication</span>
          </button>

          <button
            onClick={() => setActiveTab('leave')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'leave'
                ? 'bg-white text-purple-950 shadow-md'
                : 'bg-purple-900/40 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Leave Application</span>
          </button>
        </div>
      </div>

      {paymentSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>
              Fee payment confirmed! Official e-receipt generated and emailed to{' '}
              <span className="font-bold">{currentUser.email}</span>.
            </span>
          </div>
          <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
            STATUS: SETTLED
          </span>
        </div>
      )}

      {/* TAB 1: ACADEMIC & CARE OVERVIEW (Tier-Specific Logic) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* CASE A: Pre-Primary Nursery Tier */}
          {activeChild.tier === 'pre_primary' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <Baby className="w-5 h-5 text-pink-600" />
                    <span>Nursery Daily Care & Developmental Journal</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time observational updates from Ms. Priya Sharma
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold">
                  Pre-Primary Rubric
                </span>
              </div>

              {/* Today's Care Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-200/80">
                  <div className="text-[11px] font-bold text-pink-800 uppercase">Nap & Sleep</div>
                  <div className="text-sm font-black text-slate-900 mt-2">
                    {activeChild.nurseryObservation?.napHours}
                  </div>
                  <div className="text-[11px] text-pink-700 mt-1">Calm rest after lunch</div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
                  <div className="text-[11px] font-bold text-amber-800 uppercase">Meal & Nutrition</div>
                  <div className="text-sm font-black text-slate-900 mt-2">
                    {activeChild.nurseryObservation?.mealIntake}
                  </div>
                  <div className="text-[11px] text-amber-700 mt-1">Finished fruit bowl</div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80">
                  <div className="text-[11px] font-bold text-blue-800 uppercase">Fine Motor Skills</div>
                  <div className="text-sm font-black text-slate-900 mt-2">
                    {activeChild.nurseryObservation?.fineMotorSkills}
                  </div>
                  <div className="text-[11px] text-blue-700 mt-1">Block-tower stacking</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase">Social-Emotional</div>
                  <div className="text-sm font-black text-slate-900 mt-2">
                    {activeChild.nurseryObservation?.socialBehavior}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1">Shared crayons warmly</div>
                </div>
              </div>

              {/* Teacher Daily Reflection Note */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-bold text-slate-700 uppercase flex items-center space-x-1.5 mb-1.5">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span>Teacher's Daily Note to Parents</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  "{activeChild.nurseryObservation?.teacherDailyNote}"
                </p>
                <div className="text-[11px] text-slate-400 mt-2">Logged by Ms. Priya Sharma at 12:30 PM</div>
              </div>
            </div>
          )}

          {/* CASE B: Primary & Senior Secondary Tiers */}
          {activeChild.tier !== 'pre_primary' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span>Academic Standing: {activeChild.className}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Attendance Percentage: <span className="font-bold text-emerald-600">{activeChild.attendancePercentage}%</span>
                  </p>
                </div>
                {activeChild.boardRollNumber && (
                  <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200">
                    Roll: {activeChild.boardRollNumber}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Admission Number</div>
                  <div className="text-lg font-black text-slate-900 mt-1 font-mono">{activeChild.admissionNumber}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Curriculum Stream</div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {activeChild.stream === 'science_pcm' ? 'Science PCM' : 'General CCE'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Blood Group</div>
                  <div className="text-lg font-black text-slate-900 mt-1">{activeChild.bloodGroup}</div>
                </div>
              </div>
            </div>
          )}

          {/* Child's Diary & Homework feed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Homework & Circulars for {activeChild.fullName}</span>
            </h3>

            <div className="space-y-3">
              {childDiary.map((item) => (
                <div key={item.entryId} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                  </div>
                  <p className="text-slate-600 mt-1 text-xs">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FEE PAYMENTS & INVOICING */}
      {activeTab === 'fees' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>Quarterly Fee Invoicing & Online Checkout</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Schema: <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-mono">invoices/{"{invoiceId}"}</code>
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

                  {/* Line items breakdown */}
                  <div className="py-3 divide-y divide-slate-100 text-xs">
                    {inv.lineItems.map((item) => (
                      <div key={item.id} className="py-1.5 flex items-center justify-between text-slate-600">
                        <span>{item.title}</span>
                        <span className="font-mono font-semibold text-slate-800">
                          ₹{item.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}

                    {/* Overdue fine display */}
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

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    {isPending ? (
                      <>
                        <span className="text-xs text-rose-700 font-semibold">
                          Payment required to maintain bus service and exam clearance.
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
                          <span>Receipt {inv.receiptNumber}</span>
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

      {/* TAB 3: TEACHER COMMUNICATION (Chat thread) */}
      {activeTab === 'chat' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>Parent-Teacher Chat: Ms. Priya Sharma</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct encrypted messaging thread regarding {activeChild.fullName}
              </p>
            </div>
            <span className="flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Teacher Active</span>
            </span>
          </div>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            {chatMessages.map((msg) => {
              const isMe = msg.senderRole === 'parent';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.senderName}</div>
                  <div
                    className={`max-w-md p-3 rounded-2xl shadow-sm ${
                      isMe
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
              placeholder={`Type message to Ms. Priya about ${activeChild.fullName}...`}
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

      {/* TAB 4: LEAVE APPLICATION */}
      {activeTab === 'leave' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Submit Leave Application for {activeChild.fullName}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Leave requests are approved by the class teacher and marked as 'L' on the attendance roll-call.
            </p>
          </div>

          <form onSubmit={handleLeaveSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Absence</label>
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                rows={3}
                placeholder="e.g. Family wedding / fever and rest advised by pediatrician..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
            >
              Submit Leave Request
            </button>

            {leaveSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center space-x-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Leave request submitted! Teacher notified.</span>
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
                <h3 className="text-base font-black text-slate-900 mt-0.5">Razorpay / Stripe Checkout</h3>
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
                <span className="text-slate-500">Student:</span>
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
              <div className="text-xs font-bold text-slate-700">Select Payment Mode:</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl border border-blue-500 bg-blue-50 text-center text-xs font-bold text-blue-700 cursor-pointer">
                  UPI / GPay
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50">
                  Credit Card
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50">
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
    </div>
  );
};
