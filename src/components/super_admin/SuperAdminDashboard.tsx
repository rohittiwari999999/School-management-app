import React, { useState } from 'react';
import { useSMS } from '../../context/SMSContext';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Users,
  Building,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Briefcase,
  DollarSign,
  Lock,
  ArrowRight,
  RefreshCw,
  Clock,
  Send,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import { StaffRole, StaffCredential } from '../../types';

export const SuperAdminDashboard: React.FC = () => {
  const {
    staffCredentials,
    acceptStaffCredential,
    updateStaffCredentialStatus,
    deleteStaffCredential,
    users,
    setCurrentUser,
    students,
    dashboardStats,
  } = useSMS();

  // Tab state
  const [activeTab, setActiveTab] = useState<'create' | 'roster' | 'rbac'>('create');

  // Role filter in roster
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form state for creating/accepting new credentials
  const [selectedRole, setSelectedRole] = useState<StaffRole>('principal');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [departmentOrClass, setDepartmentOrClass] = useState('');
  const [qualification, setQualification] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState(new Date().toISOString().split('T')[0]);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Generate randomized strong password
  const generateStrongPassword = () => {
    const rolePrefix =
      selectedRole === 'principal'
        ? 'Prin'
        : selectedRole === 'class_teacher'
        ? 'ClsTch'
        : selectedRole === 'teacher'
        ? 'Teach'
        : 'Acc';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const generated = `${rolePrefix}@Edu${randNum}!`;
    setPassword(generated);
  };

  // Generate default employee ID when role changes
  const handleRoleChange = (role: StaffRole) => {
    setSelectedRole(role);
    const prefix =
      role === 'principal'
        ? 'EMP-PRIN'
        : role === 'class_teacher'
        ? 'EMP-CT'
        : role === 'teacher'
        ? 'EMP-TCH'
        : 'EMP-ACC';
    const count = staffCredentials.filter((c) => c.role === role).length + 1;
    setEmployeeId(`${prefix}-${String(count).padStart(3, '0')}`);

    // Suggest department
    if (role === 'principal') setDepartmentOrClass('Head of School / Executive Administration');
    if (role === 'class_teacher') setDepartmentOrClass('Class 10-A In-Charge & Academic Mentor');
    if (role === 'teacher') setDepartmentOrClass('Senior Secondary Mathematics & Computer Science');
    if (role === 'accountant') setDepartmentOrClass('Finance Desk, Fee Bursar & Accounts');
  };

  const handleAcceptCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      return;
    }

    acceptStaffCredential({
      fullName: fullName.trim(),
      role: selectedRole,
      email: email.trim().toLowerCase(),
      tempPassword: password,
      phoneNumber: phoneNumber.trim() || '+91 98000 00000',
      employeeId: employeeId.trim() || `EMP-${Date.now().toString().slice(-4)}`,
      departmentOrClass: departmentOrClass.trim() || 'General Faculty',
      qualification: qualification.trim() || 'Qualified Professional',
      dateOfJoining: dateOfJoining || new Date().toISOString().split('T')[0],
      status: 'active',
    });

    setSuccessNotice(`New ${selectedRole.replace('_', ' ')} login credentials accepted for "${fullName.trim()}"!`);
    
    // Reset form
    setFullName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setDepartmentOrClass('');
    setQualification('');

    setTimeout(() => {
      setSuccessNotice(null);
    }, 5000);
  };

  const toggleRevealPassword = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredCredentials = staffCredentials.filter((cred) => {
    const matchesRole = roleFilter === 'all' || cred.role === roleFilter;
    const matchesSearch =
      cred.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.departmentOrClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const roleColorBadge = (role: StaffRole) => {
    switch (role) {
      case 'principal':
        return 'bg-amber-500/10 text-amber-700 border-amber-300';
      case 'teacher':
        return 'bg-blue-500/10 text-blue-700 border-blue-300';
      case 'class_teacher':
        return 'bg-teal-500/10 text-teal-700 border-teal-300';
      case 'accountant':
        return 'bg-rose-500/10 text-rose-700 border-rose-300';
    }
  };

  const roleNameLabel = (role: StaffRole) => {
    switch (role) {
      case 'principal':
        return 'Principal';
      case 'teacher':
        return 'Subject Teacher';
      case 'class_teacher':
        return 'Class Teacher';
      case 'accountant':
        return 'Accountant';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Super Admin Top Executive Banner - Compact */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-3.5 sm:p-4 rounded-xl shadow-md border border-rose-900/40">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold mb-1 border border-rose-500/30">
              <ShieldAlert className="w-3 h-3" />
              <span>Super Admin</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Institutional Admin Console
            </h1>
            <p className="text-slate-300 text-xs">
              Staff onboarding and credential issuance.
            </p>
          </div>

          <div className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-right shrink-0">
            <div className="text-[10px] text-slate-400">Staff Count</div>
            <div className="text-sm sm:text-base font-black text-rose-300">{staffCredentials.length} Active</div>
          </div>
        </div>
      </div>

      {/* Quick KPI Cards - Compact */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
            <span>Principal</span>
            <Building className="w-3 h-3 text-amber-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
            {staffCredentials.filter((c) => c.role === 'principal').length}
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
            <span>Teachers</span>
            <BookOpen className="w-3 h-3 text-blue-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
            {staffCredentials.filter((c) => c.role === 'teacher').length}
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
            <span>Class Teachers</span>
            <GraduationCap className="w-3 h-3 text-teal-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
            {staffCredentials.filter((c) => c.role === 'class_teacher').length}
          </div>
        </div>

        <div className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
            <span>Accountants</span>
            <DollarSign className="w-3 h-3 text-rose-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
            {staffCredentials.filter((c) => c.role === 'accountant').length}
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 sm:p-3 rounded-lg flex items-center justify-between animate-fade-in shadow-sm gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold truncate">{successNotice}</p>
          </div>
          <button
            onClick={() => setActiveTab('roster')}
            className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded hover:bg-emerald-700 transition shrink-0"
          >
            Roster →
          </button>
        </div>
      )}

      {/* Navigation Tabs - Compact */}
      <div className="bg-white rounded-lg border border-slate-200 p-1 flex gap-1 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 min-w-[100px] flex items-center justify-center space-x-1 py-1.5 px-2.5 rounded text-xs font-bold transition-all ${
            activeTab === 'create'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Staff</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`flex-1 min-w-[100px] flex items-center justify-center space-x-1 py-1.5 px-2.5 rounded text-xs font-bold transition-all ${
            activeTab === 'roster'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Roster ({staffCredentials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex-1 min-w-[100px] flex items-center justify-center space-x-1 py-1.5 px-2.5 rounded text-xs font-bold transition-all ${
            activeTab === 'rbac'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Permissions</span>
        </button>
      </div>

      {/* TAB 1: ACCEPT NEW STAFF CREDENTIALS FORM */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Issue Staff Login Credentials
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Enter staff details to authorize access.
            </p>
          </div>

          <form onSubmit={handleAcceptCredential} className="space-y-4">
            {/* Step 1: Select Staff Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                1. Role *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { role: 'principal' as StaffRole, label: 'Principal', icon: Building },
                  { role: 'teacher' as StaffRole, label: 'Teacher', icon: BookOpen },
                  { role: 'class_teacher' as StaffRole, label: 'Class Teacher', icon: GraduationCap },
                  { role: 'accountant' as StaffRole, label: 'Accountant', icon: DollarSign },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      type="button"
                      key={item.role}
                      onClick={() => handleRoleChange(item.role)}
                      className={`py-2 px-3 rounded-lg border text-left transition-all cursor-pointer flex items-center space-x-2 ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 text-rose-900 ring-1 ring-rose-500 font-bold'
                          : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Chander"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Official Email (Login ID) *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@edupulse.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate</span>
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Staff ID
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="EMP-PRIN-001"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Department / Class
                </label>
                <input
                  type="text"
                  value={departmentOrClass}
                  onChange={(e) => setDepartmentOrClass(e.target.value)}
                  placeholder="Department or Class"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/30"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFullName('');
                  setEmail('');
                  setPassword('');
                }}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
              >
                Clear
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Credentials</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: AUTHORIZED STAFF ROSTER & CREDENTIALS DIRECTORY */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Staff Credentials Roster
              </h2>
              <p className="text-slate-500 text-xs">
                Active login credentials approved by Super Admin.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('create')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Staff</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff, email, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All' },
                { id: 'principal', label: 'Principal' },
                { id: 'teacher', label: 'Teacher' },
                { id: 'class_teacher', label: 'Class Teacher' },
                { id: 'accountant', label: 'Accountant' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setRoleFilter(pill.id)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition ${
                    roleFilter === pill.id
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5">
            {filteredCredentials.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No staff credentials found.
              </div>
            ) : (
              filteredCredentials.map((cred) => {
                const isPasswordRevealed = revealedPasswords[cred.id] || false;
                const isCopied = copiedId === cred.id;

                const matchedUser = users.find(
                  (u) => u.email.toLowerCase() === cred.email.toLowerCase() || u.fullName === cred.fullName
                );

                return (
                  <div
                    key={cred.id}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {cred.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {cred.fullName}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${roleColorBadge(
                                cred.role
                              )}`}
                            >
                              {roleNameLabel(cred.role)}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {cred.employeeId} · {cred.departmentOrClass}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        {matchedUser && (
                          <button
                            onClick={() => setCurrentUser(matchedUser)}
                            className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition flex items-center space-x-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Test Login</span>
                          </button>
                        )}

                        <button
                          onClick={() =>
                            updateStaffCredentialStatus(
                              cred.id,
                              cred.status === 'active' ? 'suspended' : 'active'
                            )
                          }
                          className={`text-xs px-2 py-1 rounded border font-medium ${
                            cred.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {cred.status === 'active' ? 'Active' : 'Suspended'}
                        </button>
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded-lg text-xs border border-slate-100">
                      <div className="text-slate-600 truncate max-w-xs">
                        <span className="text-slate-400 mr-1.5">Email:</span>
                        <span className="font-medium">{cred.email}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Pass:</span>
                        <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-xs">
                          {isPasswordRevealed ? cred.tempPassword : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleRevealPassword(cred.id)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          {isPasswordRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              `Email: ${cred.email}\nPassword: ${cred.tempPassword}`,
                              cred.id
                            )
                          }
                          className="text-rose-600 hover:text-rose-800 flex items-center space-x-0.5"
                          title="Copy"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[10px] font-bold">{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ROLE PERMISSIONS MATRIX */}
      {activeTab === 'rbac' && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Role Authority Matrix
            </h2>
            <p className="text-slate-500 text-xs">
              Role-Based Access Control privileges across modules.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-2.5 font-bold rounded-l-lg">Authority</th>
                  <th className="p-2.5 font-bold text-rose-300">Super Admin</th>
                  <th className="p-2.5 font-bold text-amber-300">Principal</th>
                  <th className="p-2.5 font-bold text-blue-300">Teacher</th>
                  <th className="p-2.5 font-bold text-teal-300">Class Teacher</th>
                  <th className="p-2.5 font-bold text-emerald-300 rounded-r-lg">Accountant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { feature: 'Create/Accept Staff Credentials', sa: '✓ Full', prin: '✗ None', tch: '✗ None', ct: '✗ None', acc: '✗ None' },
                  { feature: 'School Governance & Policy', sa: '✓ Full', prin: '✗ Executive', tch: '✗ None', ct: '✗ None', acc: '✗ None' },
                  { feature: 'Academics & Circulars', sa: '✓ Oversight', prin: '✓ Full', tch: '✗ Read', ct: '✗ Read', acc: '✗ Read' },
                  { feature: 'Report Cards & Exams', sa: '✓ Oversight', prin: '✓ Approve', tch: '✓ Grades', ct: '✓ Grades', acc: '✗ None' },
                  { feature: 'Daily Attendance Marking', sa: '✓ Audit', prin: '✓ Overview', tch: '✓ Subject', ct: '✓ Section', acc: '✗ None' },
                  { feature: 'Fees & Invoicing Desk', sa: '✓ Audit', prin: '✓ Overview', tch: '✗ None', ct: '✗ None', acc: '✓ Full' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-medium text-slate-800">{row.feature}</td>
                    <td className="p-2.5 font-bold text-rose-700 bg-rose-50/20">{row.sa}</td>
                    <td className="p-2.5 text-amber-800">{row.prin}</td>
                    <td className="p-2.5 text-blue-800">{row.tch}</td>
                    <td className="p-2.5 text-teal-800">{row.ct}</td>
                    <td className="p-2.5 text-emerald-800">{row.acc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
