import React from 'react';
import { useSMS } from '../context/SMSContext';
import { Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';
import { AdminDashboard } from './admin/AdminDashboard';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { ParentStudentDashboard } from './parent_student/ParentStudentDashboard';
import { AccountantDashboard } from './accountant/AccountantDashboard';

export const MobileFrame: React.FC = () => {
  const { currentUser, deviceType } = useSMS();

  // Pick device frame dimensions
  let frameWidth = 'w-[390px]';
  let frameHeight = 'min-h-[820px] max-h-[880px]';
  let deviceName = 'iPhone 16 Pro';
  let roundedCorners = 'rounded-[50px]';
  let borderThickness = 'border-[12px] border-slate-900';

  if (deviceType === 'pixel') {
    frameWidth = 'w-[400px]';
    frameHeight = 'min-h-[840px] max-h-[890px]';
    deviceName = 'Google Pixel 9';
    roundedCorners = 'rounded-[46px]';
    borderThickness = 'border-[10px] border-slate-800';
  } else if (deviceType === 'ipad') {
    frameWidth = 'w-[640px]';
    frameHeight = 'min-h-[900px] max-h-[960px]';
    deviceName = 'iPad Mini';
    roundedCorners = 'rounded-[38px]';
    borderThickness = 'border-[14px] border-slate-900';
  }

  const renderCurrentRoleScreen = () => {
    switch (currentUser.role) {
      case 'principal':
      case 'super_admin':
        return <AdminDashboard />;
      case 'teacher':
      case 'class_teacher':
        return <TeacherDashboard />;
      case 'parent_student':
      case 'student':
      case 'parent':
        return <ParentStudentDashboard />;
      case 'accountant':
        return <AccountantDashboard />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Device Label */}
      <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Flutter Mobile Runtime Emulator • {deviceName} • 60 FPS Material 3</span>
      </div>

      {/* Hardware Frame Wrapper */}
      <div
        className={`${frameWidth} ${frameHeight} ${roundedCorners} ${borderThickness} bg-slate-950 shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-slate-700/60`}
      >
        {/* Dynamic Island / Notch */}
        {deviceType === 'iphone' && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-end pr-2 space-x-1">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          </div>
        )}

        {/* Mobile Status Bar */}
        <div className="bg-slate-900 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs z-40 select-none">
          <span className="font-semibold text-[11px] font-mono">09:41</span>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Applet Mobile Viewport Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-4 text-slate-900">
          {renderCurrentRoleScreen()}
        </div>

        {/* Bottom Gesture Bar */}
        <div className="bg-white py-2 flex items-center justify-center border-t border-slate-200">
          <div className="w-32 h-1 bg-slate-400 rounded-full" />
        </div>
      </div>
    </div>
  );
};
