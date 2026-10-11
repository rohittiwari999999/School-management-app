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
    <div className="space-y-6">
      {/* Super Admin Top Executive Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-rose-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-3 border border-rose-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Super Admin • Institutional Governance & Trust Council</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Super Admin Executive Console
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Complete institutional authority: Onboard & accept login credentials for Principal, Teacher, Class Teacher, and Accountant, audit access rights, and oversee K-12 operations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-right">
              <div className="text-xs text-slate-400">Total Staff Credentials</div>
              <div className="text-lg font-black text-rose-300">{staffCredentials.length} Authorized</div>
            </div>
            <div className="bg-emerald-950/80 px-4 py-2.5 rounded-xl border border-emerald-800/50 text-right">
              <div className="text-xs text-emerald-400">Security Clearance</div>
              <div className="text-sm font-bold text-white">Tier-1 Full Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Principal</span>
            <Building className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {staffCredentials.filter((c) => c.role === 'principal').length}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Executive Head of School</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Teachers</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {staffCredentials.filter((c) => c.role === 'teacher').length}
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">Subject Faculty & Labs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Class Teachers</span>
            <GraduationCap className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {staffCredentials.filter((c) => c.role === 'class_teacher').length}
          </div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">Attendance & Section In-Charge</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Accountants</span>
            <DollarSign className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {staffCredentials.filter((c) => c.role === 'accountant').length}
          </div>
          <div className="text-[11px] text-rose-700 font-medium mt-1">Bursar & Fee Desk</div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-semibold">{successNotice}</p>
          </div>
          <button
            onClick={() => setActiveTab('roster')}
            className="text-xs bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition"
          >
            View in Roster →
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex flex-wrap gap-2 shadow-sm">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 min-w-[200px] flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'create'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Accept New Staff Credentials</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`flex-1 min-w-[200px] flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'roster'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Authorized Staff & Login Roster ({staffCredentials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex-1 min-w-[200px] flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'rbac'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Role Permissions Matrix</span>
        </button>
      </div>

      {/* TAB 1: ACCEPT NEW STAFF CREDENTIALS FORM */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <UserPlus className="w-4 h-4" />
              <span>Super Admin Credential Issuance Desk</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Accept & Issue New Login Credentials
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Super Admin can create, approve, and accept official login credentials for <strong>Principal</strong>, <strong>Teacher</strong>, <strong>Class Teacher</strong>, and <strong>Accountant</strong>. Once accepted, credentials will be active immediately.
            </p>
          </div>

          <form onSubmit={handleAcceptCredential} className="space-y-6">
            {/* Step 1: Select Staff Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Institutional Role to Authorize *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    role: 'principal' as StaffRole,
                    label: 'Principal',
                    desc: 'Head of School & Academics',
                    icon: Building,
                    color: 'hover:border-amber-500',
                    activeColor: 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 text-amber-900',
                  },
                  {
                    role: 'teacher' as StaffRole,
                    label: 'Teacher',
                    desc: 'Subject Faculty & Lectures',
                    icon: BookOpen,
                    color: 'hover:border-blue-500',
                    activeColor: 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-900',
                  },
                  {
                    role: 'class_teacher' as StaffRole,
                    label: 'Class Teacher',
                    desc: 'Attendance & Section Head',
                    icon: GraduationCap,
                    color: 'hover:border-teal-500',
                    activeColor: 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 text-teal-900',
                  },
                  {
                    role: 'accountant' as StaffRole,
                    label: 'Accountant',
                    desc: 'Fee Bursar & Ledger',
                    icon: DollarSign,
                    color: 'hover:border-rose-500',
                    activeColor: 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20 text-rose-900',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      type="button"
                      key={item.role}
                      onClick={() => handleRoleChange(item.role)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? item.activeColor
                          : `border-slate-200 bg-slate-50/50 ${item.color} text-slate-700`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="w-5 h-5 mb-1 text-slate-700" />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                      </div>
                      <div className="font-bold text-sm">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Staff Details Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name of Staff Member *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={
                    selectedRole === 'principal'
                      ? 'e.g. Dr. Ramesh Chander'
                      : selectedRole === 'teacher'
                      ? 'e.g. Mrs. Sunita Rao'
                      : selectedRole === 'class_teacher'
                      ? 'e.g. Mr. Rajesh Nair'
                      : 'e.g. Mr. Amit Goenka'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email Address (Login ID) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff.name@edupulse.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/30"
                  />
                </div>
              </div>

              {/* Password with generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Login Password / Access Key *
                  </label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter or generate password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Staff / Employee ID
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="EMP-PRIN-001"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Assigned Class & Section
                </label>
                <input
                  type="text"
                  value={departmentOrClass}
                  onChange={(e) => setDepartmentOrClass(e.target.value)}
                  placeholder={
                    selectedRole === 'principal'
                      ? 'Head of School / Administration'
                      : selectedRole === 'class_teacher'
                      ? 'Class 10-A In-Charge'
                      : selectedRole === 'teacher'
                      ? 'Senior Physics & Labs'
                      : 'Fee Desk & Accounts'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highest Qualification / Specialization
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. Ph.D, M.Sc Physics B.Ed, M.Com CA-Inter"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={dateOfJoining}
                  onChange={(e) => setDateOfJoining(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/30"
                />
              </div>
            </div>

            {/* Clearance confirmation box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Super Admin Trust Clearance & System Access Verification</span>
              </div>
              <p>
                By accepting these credentials, you grant official institutional access under the EduPulse K-12 Security Policy. The staff member will be authorized to access their assigned dashboard upon authentication.
              </p>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFullName('');
                  setEmail('');
                  setPassword('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition"
              >
                Clear Form
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/30 flex items-center space-x-2 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept & Authorize Login Credentials</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: AUTHORIZED STAFF ROSTER & CREDENTIALS DIRECTORY */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                <KeyRound className="w-4 h-4" />
                <span>Credentials Vault & Directory</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Authorized Staff Login Credentials
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                List of active credentials accepted by Super Admin. You can view login passwords, copy access keys, or test sign in directly.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Accept New Staff</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search staff, email, employee ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
              />
            </div>

            {/* Role Pills Filter */}
            <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Roles' },
                { id: 'principal', label: 'Principal' },
                { id: 'teacher', label: 'Teacher' },
                { id: 'class_teacher', label: 'Class Teacher' },
                { id: 'accountant', label: 'Accountant' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setRoleFilter(pill.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
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

          {/* Credentials Cards List */}
          <div className="space-y-3">
            {filteredCredentials.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No staff credentials found matching criteria.
              </div>
            ) : (
              filteredCredentials.map((cred) => {
                const isPasswordRevealed = revealedPasswords[cred.id] || false;
                const isCopied = copiedId === cred.id;

                // Corresponding AppUser to allow 1-click test login
                const matchedUser = users.find(
                  (u) => u.email.toLowerCase() === cred.email.toLowerCase() || u.fullName === cred.fullName
                );

                return (
                  <div
                    key={cred.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-sm transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-rose-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {cred.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 flex-wrap gap-1">
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                              {cred.fullName}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleColorBadge(
                                cred.role
                              )}`}
                            >
                              {roleNameLabel(cred.role)}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {cred.employeeId}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {cred.departmentOrClass} • {cred.qualification || 'K-12 Faculty'}
                          </div>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center space-x-2 self-start sm:self-auto">
                        {matchedUser && (
                          <button
                            onClick={() => setCurrentUser(matchedUser)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition flex items-center space-x-1"
                            title="Impersonate and test dashboard view"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Test Login View</span>
                          </button>
                        )}

                        <button
                          onClick={() =>
                            updateStaffCredentialStatus(
                              cred.id,
                              cred.status === 'active' ? 'suspended' : 'active'
                            )
                          }
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition ${
                            cred.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {cred.status === 'active' ? 'Active' : 'Suspended'}
                        </button>
                      </div>
                    </div>

                    {/* Credential Details Sub-Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg text-xs border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Login Email ID
                        </span>
                        <span className="font-medium text-slate-800 break-all">{cred.email}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Login Password / Access Key
                        </span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {isPasswordRevealed ? cred.tempPassword : '••••••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleRevealPassword(cred.id)}
                            className="text-slate-500 hover:text-slate-800"
                            title={isPasswordRevealed ? 'Hide' : 'Reveal'}
                          >
                            {isPasswordRevealed ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                `Email: ${cred.email}\nPassword: ${cred.tempPassword}`,
                                cred.id
                              )
                            }
                            className="text-rose-600 hover:text-rose-800 flex items-center space-x-1"
                            title="Copy Email & Password to clipboard"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[10px] font-bold">
                              {isCopied ? 'Copied!' : 'Copy'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Authorization Status
                        </span>
                        <span className="text-emerald-700 font-semibold flex items-center space-x-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Accepted by Super Admin</span>
                        </span>
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional RBAC Architecture</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Role Authority & Privileges Breakdown
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Strict RBAC separation: Super Admin oversees governance and credential approval, Principal manages academic operations, and Faculty handle classroom instruction.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 font-bold rounded-l-lg">Feature / Authority</th>
                  <th className="p-3 font-bold text-rose-300">Super Admin</th>
                  <th className="p-3 font-bold text-amber-300">Principal</th>
                  <th className="p-3 font-bold text-blue-300">Teacher</th>
                  <th className="p-3 font-bold text-teal-300">Class Teacher</th>
                  <th className="p-3 font-bold text-emerald-300 rounded-r-lg">Accountant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    feature: 'Create / Accept Staff Login Credentials',
                    sa: '✓ Full Authority',
                    prin: '✗ Read Only',
                    tch: '✗ No Access',
                    ct: '✗ No Access',
                    acc: '✗ No Access',
                  },
                  {
                    feature: 'Institution Trust & Board Governance',
                    sa: '✓ Full Authority',
                    prin: '✗ Executive Head',
                    tch: '✗ No Access',
                    ct: '✗ No Access',
                    acc: '✗ No Access',
                  },
                  {
                    feature: 'School Academic Leadership & Circulars',
                    sa: '✓ Full Oversight',
                    prin: '✓ Full Authority',
                    tch: '✗ Read Circulars',
                    ct: '✗ Read Circulars',
                    acc: '✗ Read Circulars',
                  },
                  {
                    feature: 'CBSE / ICSE Report Cards & Exams',
                    sa: '✓ Full Oversight',
                    prin: '✓ Approve & Publish',
                    tch: '✓ Grade Entry',
                    ct: '✓ Grade Entry',
                    acc: '✗ No Access',
                  },
                  {
                    feature: 'Daily Attendance Marking & Offline Sync',
                    sa: '✓ Audit Logs',
                    prin: '✓ Live Overview',
                    tch: '✓ Subject Attendance',
                    ct: '✓ Section Authority',
                    acc: '✗ No Access',
                  },
                  {
                    feature: 'Fee Ledger, Invoicing & Bursar Desk',
                    sa: '✓ Audit Logs',
                    prin: '✓ Financial Overview',
                    tch: '✗ No Access',
                    ct: '✗ No Access',
                    acc: '✓ Full Authority',
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">{row.feature}</td>
                    <td className="p-3 font-bold text-rose-700 bg-rose-50/30">{row.sa}</td>
                    <td className="p-3 text-amber-800">{row.prin}</td>
                    <td className="p-3 text-blue-800">{row.tch}</td>
                    <td className="p-3 text-teal-800">{row.ct}</td>
                    <td className="p-3 text-emerald-800">{row.acc}</td>
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
