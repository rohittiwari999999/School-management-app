import React from 'react';
import { SMSProvider, useSMS } from './context/SMSContext';
import { Header } from './components/Header';
import { SuperAdminDashboard } from './components/super_admin/SuperAdminDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ParentStudentDashboard } from './components/parent_student/ParentStudentDashboard';
import { AccountantDashboard } from './components/accountant/AccountantDashboard';
import { MobileFrame } from './components/MobileFrame';
import { CodeViewer } from './components/CodeViewer';
import { VideoConferenceRoom } from './components/conference/VideoConferenceRoom';

const MainContent: React.FC = () => {
  const { currentUser, viewMode, activeConference } = useSMS();

  return (
    <>
      {activeConference && <VideoConferenceRoom />}

      {viewMode === 'mobile' && <MobileFrame />}

      {viewMode === 'code' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CodeViewer />
        </main>
      )}

      {viewMode === 'desktop' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentUser.role === 'super_admin' && <SuperAdminDashboard />}
          {currentUser.role === 'principal' && <AdminDashboard />}
          {(currentUser.role === 'teacher' || currentUser.role === 'class_teacher') && <TeacherDashboard />}
          {(currentUser.role === 'parent_student' || currentUser.role === 'parent' || currentUser.role === 'student') && (
            <ParentStudentDashboard />
          )}
          {currentUser.role === 'accountant' && <AccountantDashboard />}
        </main>
      )}
    </>
  );
};

export default function App() {
  return (
    <SMSProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white">
        <Header />
        <div className="flex-1">
          <MainContent />
        </div>
      </div>
    </SMSProvider>
  );
}
