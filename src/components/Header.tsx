import React, { useState } from 'react';
import { useSMS } from '../context/SMSContext';
import {
  GraduationCap,
  Smartphone,
  Monitor,
  Code2,
  Sparkles,
  ShieldCheck,
  Wifi,
  WifiOff,
  LogOut,
  Lock,
} from 'lucide-react';
import { SecurityAuditModal } from './security/SecurityAuditModal';
import { PhaseRoadmapModal } from './PhaseRoadmapModal';

export const Header: React.FC = () => {
  const {
    currentUser,
    viewMode,
    setViewMode,
    deviceType,
    setDeviceType,
    isNetworkOnline,
    toggleNetworkOnline,
    isAuthenticated,
    logout,
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
                  K-12 SMS
                </span>
              </div>
            </div>
          </div>

          {/* View Mode Switcher (Desktop / Mobile / Code) + Device Frame Selector */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-0.5 bg-slate-800/90 p-0.5 sm:p-1 rounded-lg border border-slate-700/60 shrink-0">
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'desktop'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Desktop Web Preview"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>

              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'mobile'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Flutter Mobile Emulator"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>

              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'code'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Flutter Mobile Code"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Code</span>
              </button>
            </div>

            {/* Mobile Device Selector (Only shown if mobile emulator is active) */}
            {viewMode === 'mobile' && (
              <div className="hidden md:flex items-center space-x-0.5 text-xs text-slate-300 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 shrink-0">
                <button
                  onClick={() => setDeviceType('iphone')}
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                    deviceType === 'iphone'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  iPhone
                </button>
                <button
                  onClick={() => setDeviceType('pixel')}
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                    deviceType === 'pixel'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pixel
                </button>
                <button
                  onClick={() => setDeviceType('ipad')}
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                    deviceType === 'ipad'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  iPad
                </button>
              </div>
            )}
          </div>

          {/* Current Active Persona & Controls */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Wi-Fi Toggle */}
            <button
              onClick={toggleNetworkOnline}
              className={`flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded text-[11px] transition-all border cursor-pointer ${
                isNetworkOnline
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/80 border-amber-500/50 text-amber-300 animate-pulse'
              }`}
              title={isNetworkOnline ? 'Online Sync Active' : 'Offline Cache Mode'}
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
              className="p-1 sm:px-2 sm:py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 flex items-center space-x-1 cursor-pointer"
              title="Security & RBAC Audit"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Security</span>
            </button>

            {/* Roadmap Status Button */}
            <button
              onClick={() => setShowPhaseModal(true)}
              className="p-1 sm:px-2 sm:py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 flex items-center space-x-1 cursor-pointer"
              title="Phase Delivery Roadmap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Roadmap</span>
            </button>

            {/* User Profile / Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-1.5 pl-1.5 border-l border-slate-800">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-blue-400/40 object-cover"
                />
                <div className="hidden xl:block text-left">
                  <div className="text-[11px] font-semibold text-slate-200 leading-tight">
                    {currentUser.fullName.split(' ')[0]}
                  </div>
                  <div className="text-[9px] text-blue-400 font-medium leading-tight capitalize">
                    {currentUser.role === 'class_teacher' ? 'Class Teacher' : currentUser.role.replace('_', ' ')}
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 text-[11px] font-semibold transition-all cursor-pointer shadow-xs"
                  title="Sign Out to Front Page Login Screen"
                >
                  <LogOut className="w-3 h-3 text-rose-400" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 pl-1.5 border-l border-slate-800 text-[11px] text-slate-400 font-medium">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Login Screen</span>
              </div>
            )}
          </div>
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
