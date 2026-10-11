import React, { useState } from 'react';
import { useSMS } from '../context/SMSContext';
import {
  GraduationCap,
  Smartphone,
  Monitor,
  Code2,
  Shield,
  UserCheck,
  Sparkles,
  Database,
  Flame,
  ShieldCheck,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { UserRole } from '../types';
import { SecurityAuditModal } from './security/SecurityAuditModal';
import { PhaseRoadmapModal } from './PhaseRoadmapModal';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    users,
    viewMode,
    setViewMode,
    deviceType,
    setDeviceType,
    isNetworkOnline,
    toggleNetworkOnline,
    offlineSyncQueue,
  } = useSMS();

  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showPhaseModal, setShowPhaseModal] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14 gap-1.5 sm:gap-2">
          {/* Logo & School Title */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-sm">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  EduPulse
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  K-12
                </span>
              </div>
            </div>
          </div>

          {/* View Mode Switcher (Desktop / Mobile / Code) */}
          <div className="flex items-center space-x-0.5 bg-slate-800/90 p-0.5 sm:p-1 rounded-lg border border-slate-700/60 shrink-0">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] sm:text-xs font-semibold transition-all ${
                viewMode === 'desktop'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>

            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] sm:text-xs font-semibold transition-all ${
                viewMode === 'mobile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Emulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>

            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] sm:text-xs font-semibold transition-all ${
                viewMode === 'code'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Flutter Code"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Code</span>
            </button>
          </div>

          {/* Current Active Persona & Controls */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Wi-Fi Toggle */}
            <button
              onClick={toggleNetworkOnline}
              className={`flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded text-[11px] transition-all border ${
                isNetworkOnline
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/80 border-amber-500/50 text-amber-300 animate-pulse'
              }`}
              title={isNetworkOnline ? 'Online' : 'Offline'}
            >
              {isNetworkOnline ? (
                <>
                  <Wifi className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                  <span className="hidden md:inline font-medium text-[11px]">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  <span className="hidden md:inline font-medium text-[11px]">Offline</span>
                </>
              )}
            </button>

            {/* Security Audit Modal Button */}
            <button
              onClick={() => setShowSecurityModal(true)}
              className="p-1 sm:px-2 sm:py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 flex items-center space-x-1"
              title="Security & RBAC Audit"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Security</span>
            </button>

            {/* Roadmap Status Button */}
            <button
              onClick={() => setShowPhaseModal(true)}
              className="p-1 sm:px-2 sm:py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 flex items-center space-x-1"
              title="Phase Delivery Roadmap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Roadmap</span>
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center space-x-1 pl-1 border-l border-slate-800">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-blue-400/40 object-cover"
              />
              <div className="hidden xl:block text-left">
                <div className="text-[11px] font-semibold text-slate-200 leading-tight">
                  {currentUser.fullName.split(' ')[0]}
                </div>
                <div className="text-[9px] text-blue-400 font-medium leading-tight">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Quick Switch Bar - Ultra Compact */}
      <div className="bg-slate-950/95 border-t border-slate-800/80 px-2.5 py-1">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 overflow-x-auto">
          <div className="flex items-center space-x-1 shrink-0 text-slate-400">
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="font-bold text-slate-300 text-[10px] sm:text-[11px]">Role:</span>
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto py-0.5">
            {users
              .filter((u) => u.role !== 'student')
              .map((u) => {
                const isSelected = currentUser.uid === u.uid;
                let roleBadge = '';
                let badgeColor = '';
                switch (u.role) {
                  case 'super_admin':
                    roleBadge = 'Super Admin';
                    badgeColor = 'from-rose-600 to-red-700';
                    break;
                  case 'principal':
                    roleBadge = 'Principal';
                    badgeColor = 'from-amber-500 to-orange-600';
                    break;
                  case 'teacher':
                    roleBadge = 'Teacher';
                    badgeColor = 'from-blue-600 to-indigo-600';
                    break;
                  case 'class_teacher':
                    roleBadge = 'Class Teacher';
                    badgeColor = 'from-teal-600 to-cyan-600';
                    break;
                  case 'parent_student':
                  case 'parent':
                    roleBadge = 'Parent';
                    badgeColor = 'from-purple-600 to-pink-600';
                    break;
                  case 'accountant':
                    roleBadge = 'Accountant';
                    badgeColor = 'from-rose-600 to-red-600';
                    break;
                }

                return (
                  <button
                    key={u.uid}
                    onClick={() => setCurrentUser(u)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? `bg-gradient-to-r ${badgeColor} text-white shadow-sm ring-1 ring-white/30 font-bold`
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{roleBadge}</span>
                  </button>
                );
              })}
          </div>

          {/* Device Frame selector if mobile view is chosen */}
          {viewMode === 'mobile' && (
            <div className="flex items-center space-x-0.5 text-xs text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
              <button
                onClick={() => setDeviceType('iphone')}
                className={`px-1 py-0.2 rounded text-[10px] ${
                  deviceType === 'iphone' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                iPhone
              </button>
              <button
                onClick={() => setDeviceType('pixel')}
                className={`px-1 py-0.2 rounded text-[10px] ${
                  deviceType === 'pixel' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pixel
              </button>
              <button
                onClick={() => setDeviceType('ipad')}
                className={`px-1 py-0.2 rounded text-[10px] ${
                  deviceType === 'ipad' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                iPad
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security Audit & Anti-Tamper RBAC Modal */}
      <SecurityAuditModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />

      {/* Phase 1 & Phase 2 Delivery Roadmap Modal */}
      <PhaseRoadmapModal
        isOpen={showPhaseModal}
        onClose={() => setShowPhaseModal(false)}
      />
    </header>
  );
};
