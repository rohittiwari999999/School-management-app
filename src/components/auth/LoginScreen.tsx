import React, { useState } from 'react';
import { useSMS } from '../../context/SMSContext';
import {
  GraduationCap,
  Zap,
  Shield,
  UserCheck,
  BookOpen,
  Users,
  CreditCard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface LoginScreenProps {
  isMobileEmulator?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ isMobileEmulator = false }) => {
  const { login, loginAsDemoRole } = useSMS();

  const [email, setEmail] = useState('superadmin@edupulse.edu');
  const [password, setPassword] = useState('Super@Edu2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your institutional email address.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    }, 400);
  };

  const handleQuickRoleSelect = (
    role: 'super_admin' | 'principal' | 'teacher' | 'class_teacher' | 'parent_student' | 'accountant',
    demoEmail: string,
    demoPass: string
  ) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      loginAsDemoRole(role);
      setIsLoading(false);
    }, 250);
  };

  return (
    <div
      className={`min-h-[85vh] flex items-center justify-center ${
        isMobileEmulator ? 'p-2' : 'py-8 px-4 sm:px-6'
      }`}
    >
      <div className="w-full max-w-[480px] space-y-5 animate-fade-in">
        {/* App Branding & Icon */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 text-white shadow-xl shadow-blue-600/30 ring-4 ring-blue-500/10">
            <GraduationCap className="w-8 h-8 sm:w-11 sm:h-11" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            EduPulse K-12 SMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            Enterprise School Management System
            <br />
            Nursery to 12th Grade
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center space-x-2.5 text-xs font-medium animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Demo Access (One-Touch) Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h2 className="text-sm font-bold text-slate-900">
                Quick Demo Access (One-Touch)
              </h2>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              Role Switch
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-normal">
            Select your individual persona or enter your credentials below:
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* 1. Super Admin */}
            <button
              type="button"
              onClick={() =>
                handleQuickRoleSelect(
                  'super_admin',
                  'superadmin@edupulse.edu',
                  'Super@Edu2026'
                )
              }
              className="flex items-center space-x-2 p-2 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100/80 transition-all text-left cursor-pointer group hover:shadow-xs active:scale-98"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-rose-900 truncate">
                  Super Admin
                </div>
                <div className="text-[10px] text-slate-600 font-medium truncate">
                  Shri Vikramaditya
                </div>
              </div>
            </button>

            {/* 2. Principal */}
            <button
              type="button"
              onClick={() =>
                handleQuickRoleSelect(
                  'principal',
                  'principal@edupulse.edu',
                  'Prin@Edu2026'
                )
              }
              className="flex items-center space-x-2 p-2 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 transition-all text-left cursor-pointer group hover:shadow-xs active:scale-98"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-blue-900 truncate">
                  Principal
                </div>
                <div className="text-[10px] text-slate-600 font-medium truncate">
                  Dr. Alok Verma
                </div>
              </div>
            </button>

            {/* 3. Subject Teacher */}
            <button
              type="button"
              onClick={() =>
                handleQuickRoleSelect(
                  'teacher',
                  'ananya.sen@edupulse.edu',
                  'Teach@Edu2026'
                )
              }
              className="flex items-center space-x-2 p-2 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100/80 transition-all text-left cursor-pointer group hover:shadow-xs active:scale-98"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-teal-900 truncate">
                  Subject Teacher
                </div>
                <div className="text-[10px] text-slate-600 font-medium truncate">
                  Dr. Ananya Sen
                </div>
              </div>
            </button>

            {/* 4. Class Teacher */}
            <button
              type="button"
              onClick={() =>
                handleQuickRoleSelect(
                  'class_teacher',
                  'priya.sharma@edupulse.edu',
                  'ClsTch@Edu2026'
                )
              }
              className="flex items-center space-x-2 p-2 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100/80 transition-all text-left cursor-pointer group hover:shadow-xs active:scale-98"
            >
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-sky-900 truncate">
                  Class Teacher
                </div>
                <div className="text-[10px] text-slate-600 font-medium truncate">
                  Ms. Priya Sharma
                </div>
              </div>
            </button>

            {/* 5. Parent & Student */}
            <button
              type="button"
              onClick={() =>
                handleQuickRoleSelect(
                  'parent_student',
                  'family.sharma@edupulse.edu',
                  'Family@Edu2026'
                )
              }
              className="flex items-center space-x-2 p-2 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/80 transition-all text-left cursor-pointer group hover:shadow-xs active:scale-98"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-purple-900 truncate">
                  Parent & Student
                </div>
                <div className="text-[10px] text-slate-600 font-medium truncate">
                  Sharma Family
                </div>
              </div>
            </button>

            {/* 6. Accountant (Fees) */}
            <button
              type="button"
              onClick={() =>
                handleQuickRoleSelect(
                  'accountant',
                  'vikram.goel@edupulse.edu',
                  'Acc@Edu2026'
                )
              }
              className="flex items-center space-x-2 p-2 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100/80 transition-all text-left cursor-pointer group hover:shadow-xs active:scale-98"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-orange-900 truncate">
                  Accountant (Fees)
                </div>
                <div className="text-[10px] text-slate-600 font-medium truncate">
                  Mr. Vikram Goel
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Standard Login Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Institutional Sign In
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">
              Direct Role Access
            </span>
          </div>

          <form onSubmit={handleSignIn} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@edupulse.edu"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-99 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <Sparkles className="w-4 h-4 text-blue-200" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-slate-400 font-medium">
          Academic Year 2026-2027 • EduPulse SMS v1.0.0
        </div>
      </div>
    </div>
  );
};
