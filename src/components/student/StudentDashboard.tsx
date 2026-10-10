import React, { useState } from 'react';
import { useSMS } from '../../context/SMSContext';
import {
  Calendar,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { students, timetable, examResults, diaryEntries } = useSMS();
  const [showReportModal, setShowReportModal] = useState(false);

  // Active student is Aarav Sharma (Class 11 Science PCM)
  const student = students.find((s) => s.studentId === 'STU_CLASS11_01') || students[2];
  const examResult = examResults.find((e) => e.studentId === student.studentId) || examResults[0];

  const homeworkEntries = diaryEntries.filter(
    (d) => d.classId === 'CLS_11' || d.classId === 'CLS_ALL'
  );

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={student.avatarUrl}
              alt={student.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg"
            />
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1 border border-emerald-400/30">
                <span>Class 11-A • Science PCM Stream</span>
              </div>
              <h1 className="text-2xl font-black text-white">{student.fullName}</h1>
              <div className="text-xs text-slate-300 mt-0.5">
                Adm: <span className="font-mono text-emerald-300">{student.admissionNumber}</span> • Board Roll:{' '}
                <span className="font-mono text-emerald-300">{student.boardRollNumber}</span>
              </div>
            </div>
          </div>

          {/* Attendance KPI Pill */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 flex items-center space-x-4">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Attendance Metric</div>
              <div className="text-2xl font-black text-emerald-400">{student.attendancePercentage}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">CBSE 75% Requirement Met</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center font-bold text-xs">
              ✓
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Timetable & Report Card Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Today's Timetable */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Today's Class Schedule (Monday)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Class 11 Section A • Physics, Chemistry, Math, CS & English</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              In Session
            </span>
          </div>

          <div className="space-y-2.5">
            {timetable.map((slot, index) => {
              const isCurrent = slot.periodNumber === 2; // e.g. currently Math
              return (
                <div
                  key={slot.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20'
                      : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isCurrent ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      P{slot.periodNumber}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                        <span>{slot.subjectName}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white animate-pulse">
                            NOW
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {slot.teacherName} • Room: <span className="font-semibold text-slate-700">{slot.roomNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-slate-800">{slot.startTime}</div>
                    <div className="text-[10px] text-slate-500">{slot.endTime}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 Cols): Academic Performance & Report Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Report Card (Term 1)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Comprehensive Board Evaluation</p>
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                Grade {examResult.overallGrade}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Cumulative GPA</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1">{examResult.cumulativeGpa} / 10.0</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Overall Marks</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {examResult.totalObtained} / {examResult.totalMaximum}
                  </div>
                  <div className="text-xs text-blue-300 font-semibold">{examResult.percentage}%</div>
                </div>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {examResult.subjects.map((sub) => (
                <div key={sub.subjectCode} className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-900">{sub.subjectName}</div>
                    <div className="text-[11px] text-slate-500">
                      Theory: {sub.theoryMarks}/{sub.maxTheoryMarks} • Prac: {sub.practicalMarks}/{sub.maxPracticalMarks}
                    </div>
                  </div>
                  <span className="font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {sub.theoryMarks + sub.practicalMarks} Mks
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>View & Print Official Report Card</span>
            </button>
          </div>

          {/* Homework & Diary Feed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Assignments & Notice Board</span>
            </h3>

            <div className="space-y-2.5">
              {homeworkEntries.map((entry) => (
                <div key={entry.entryId} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{entry.title}</span>
                    <span className="text-[10px] text-slate-400">{entry.createdAt}</span>
                  </div>
                  <p className="text-slate-600 mt-1 text-[11px]">{entry.description}</p>
                  {entry.attachmentName && (
                    <div className="mt-2 inline-flex items-center space-x-1 text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      <Download className="w-3 h-3" />
                      <span>{entry.attachmentName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Official Report Card Printable Modal */}
      {showReportModal && (
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
                  <span className="font-bold text-slate-900">{student.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Class & Section: </span>
                  <span className="font-bold text-slate-900">Class 11 - Section A (Science PCM)</span>
                </div>
                <div>
                  <span className="text-slate-500">Admission No: </span>
                  <span className="font-mono font-bold text-slate-900">{student.admissionNumber}</span>
                </div>
              </div>

              <div>
                <div>
                  <span className="text-slate-500">Board Roll No: </span>
                  <span className="font-mono font-bold text-blue-700">{student.boardRollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500">Parent / Guardian: </span>
                  <span className="font-bold text-slate-900">{student.parentContact}</span>
                </div>
                <div>
                  <span className="text-slate-500">Attendance: </span>
                  <span className="font-bold text-emerald-600">{student.attendancePercentage}% (Eligible)</span>
                </div>
              </div>
            </div>

            {/* Marks Breakdown Table */}
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
                {examResult.subjects.map((sub) => {
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

            {/* Performance Footer */}
            <div className="p-4 rounded-xl bg-slate-100 text-xs flex items-center justify-between font-semibold">
              <div>
                <span>Total Obtained: </span>
                <span className="font-bold text-slate-900">{examResult.totalObtained} / 500 ({examResult.percentage}%)</span>
              </div>
              <div>
                <span>Overall Grade: </span>
                <span className="font-bold text-emerald-700 text-sm">{examResult.overallGrade} (Passed)</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
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
