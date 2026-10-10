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
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  EduPulse K-12 ERP
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  CBSE/ICSE Standard
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Nursery to 12th Senior Secondary • Clean Flutter Architecture & Live Firebase
              </p>
            </div>
          </div>

          {/* View Mode Switcher (Desktop / Mobile / Code) */}
          <div className="flex items-center space-x-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'desktop'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
              title="Full Screen ERP Management Dashboard"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden md:inline">Desktop ERP</span>
            </button>

            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'mobile'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
              title="Test Flutter Mobile App in Device Simulator"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline">Flutter Mobile</span>
            </button>

            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'code'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
              title="Inspect Production-Grade Flutter Source Files & Riverpod Architecture"
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden md:inline">Flutter Code Hub</span>
            </button>
          </div>

          {/* Current Active Persona & Role Indicator */}
          <div className="flex items-center space-x-3">
            {/* Wi-Fi Zone & Offline Persistence Toggle */}
            <button
              onClick={toggleNetworkOnline}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all shadow-sm cursor-pointer ${
                isNetworkOnline
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80'
                  : 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900/90 animate-pulse'
              }`}
              title={
                isNetworkOnline
                  ? 'Campus Wi-Fi Zone Active • Direct sync to Firebase'
                  : `Offline Mode • ${offlineSyncQueue.length} batches queued in Firestore persistence cache. Click to simulate walking into Wi-Fi zone!`
              }
            >
              {isNetworkOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold hidden sm:inline">Wi-Fi Zone</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold hidden sm:inline">
                    Offline {offlineSyncQueue.length > 0 ? `(${offlineSyncQueue.length} Queued)` : ''}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowSecurityModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs transition-all shadow-sm cursor-pointer"
              title="Inspect Zero-Trust Firestore Security Rules & Anti-Tamper RBAC"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono font-medium hidden sm:inline">Firestore ABAC Active</span>
              <span className="font-mono font-medium sm:hidden">ABAC</span>
            </button>

            {/* Phase 1 & Phase 2 Roadmap Status Button */}
            <button
              onClick={() => setShowPhaseModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-950/80 to-blue-950/80 hover:from-emerald-900/80 hover:to-blue-900/80 border border-indigo-500/40 text-indigo-300 text-xs transition-all shadow-sm cursor-pointer"
              title="Inspect Phase 1 and Phase 2 Architecture Milestones & Live Status"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold hidden sm:inline">Phase 1 & 2: 100%</span>
              <span className="font-semibold sm:hidden">Ph 1&2</span>
            </button>

            <div className="flex items-center space-x-2 pl-2 border-l border-slate-700">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full border border-blue-400/40 object-cover"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-100 flex items-center space-x-1">
                  <span>{currentUser.fullName}</span>
                </div>
                <div className="text-[10px] text-blue-400 font-medium">
                  {currentUser.designation || currentUser.role.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Quick Switch Bar - RBAC Persona Selector */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-slate-300">RBAC Switcher:</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Select persona to test role-guarded permissions:
            </span>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {users
              .filter((u) => u.role !== 'student')
              .map((u) => {
                const isSelected = currentUser.uid === u.uid;
                let roleBadge = '';
                let badgeColor = '';
                switch (u.role) {
                  case 'principal':
                  case 'super_admin':
                    roleBadge = 'Principal';
                    badgeColor = 'from-amber-500 to-orange-600';
                    break;
                  case 'teacher':
                    roleBadge = 'Teacher Dashboard';
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
                    className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? `bg-gradient-to-r ${badgeColor} text-white shadow-md ring-2 ring-white/30 font-bold scale-[1.02]`
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                    }`}
                    title={`Switch to ${roleBadge}: ${u.fullName} (${u.designation || u.role})`}
                  >
                    <span className="font-semibold">{roleBadge}</span>
                    <span className="text-[10px] opacity-80 hidden xl:inline">({u.fullName.split(' ')[0]})</span>
                  </button>
                );
              })}
          </div>

          {/* Device Frame selector if mobile view is chosen */}
          {viewMode === 'mobile' && (
            <div className="flex items-center space-x-1 text-xs text-slate-300 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400">Frame:</span>
              <button
                onClick={() => setDeviceType('iphone')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  deviceType === 'iphone' ? 'bg-blue-600 text-white' : 'hover:text-white'
                }`}
              >
                iPhone 16
              </button>
              <button
                onClick={() => setDeviceType('pixel')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  deviceType === 'pixel' ? 'bg-blue-600 text-white' : 'hover:text-white'
                }`}
              >
                Pixel 9
              </button>
              <button
                onClick={() => setDeviceType('ipad')}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  deviceType === 'ipad' ? 'bg-blue-600 text-white' : 'hover:text-white'
                }`}
              >
                iPad Mini
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
