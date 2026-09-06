import { useState, FormEvent } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building2,
  BadgeAlert,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DepartmentKey, UserRole } from '../types';
import { isAllowedStudentEmail } from '../firebase/service';

interface RegisterPageProps {
  onStudentRegistered: () => void;
  onAuthorityRegistered: (role: UserRole, department?: DepartmentKey) => void;
  onOpenSignIn: () => void;
  onNavigateHome: () => void;
}

export function RegisterPage({
  onStudentRegistered,
  onAuthorityRegistered,
  onOpenSignIn,
  onNavigateHome
}: RegisterPageProps) {
  const { registerStudent, registerAuthority } = useAuth();

  // Step 1: 'choose_type', Step 2: 'student', Step 3: 'authority'
  const [selectedType, setSelectedType] = useState<'student' | 'authority' | null>(null);
  const [step, setStep] = useState<'choose_type' | 'student_form' | 'authority_form'>('choose_type');

  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentConfirmPassword, setStudentConfirmPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Higher Authority Form State
  const [authName, setAuthName] = useState('');
  const [authEmpId, setAuthEmpId] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authRole, setAuthRole] = useState<UserRole>('library_officer');
  const [authDepartment, setAuthDepartment] = useState<DepartmentKey>('library');
  const [showAuthPassword, setShowAuthPassword] = useState(false);

  // Status & Error
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = () => setErrorMsg(null);

  // When role changes, sync department logically
  const handleRoleChange = (role: UserRole) => {
    setAuthRole(role);
    if (role === 'library_officer') setAuthDepartment('library');
    else if (role === 'hostel_officer') setAuthDepartment('hostel');
    else if (role === 'sports_officer') setAuthDepartment('sports');
    else if (role === 'accounts_officer') setAuthDepartment('accounts');
  };

  const handleChooseType = (type: 'student' | 'authority') => {
    setSelectedType(type);
    clearError();
    if (type === 'student') {
      setStep('student_form');
    } else {
      setStep('authority_form');
    }
  };

  // Submit Student Registration
  const handleStudentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!studentName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!studentId.trim()) {
      setErrorMsg('Please enter your student ID / roll number.');
      return;
    }
    const cleanEmail = studentEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your university email address.');
      return;
    }
    // Strict RGUKT university domain check requirement
    if (!isAllowedStudentEmail(cleanEmail)) {
      setErrorMsg('Please use your official RGUKT university email address.');
      return;
    }
    if (!studentPassword) {
      setErrorMsg('Please enter a password.');
      return;
    }
    if (studentPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (studentPassword !== studentConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerStudent({
        fullName: studentName.trim(),
        studentId: studentId.trim().toUpperCase(),
        email: cleanEmail,
        password: studentPassword
      });

      // Role assigned: 'student' -> Redirect to Student Portal / Dashboard
      onStudentRegistered();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Higher Authority Registration
  const handleAuthoritySubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!authName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!authEmpId.trim()) {
      setErrorMsg('Please enter your employee ID.');
      return;
    }
    const cleanEmail = authEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your official email address.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid official email address.');
      return;
    }
    if (!authPassword) {
      setErrorMsg('Please enter a password.');
      return;
    }
    if (authPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (authPassword !== authConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerAuthority({
        fullName: authName.trim(),
        employeeId: authEmpId.trim().toUpperCase(),
        email: cleanEmail,
        password: authPassword,
        department: authRole === 'admin' ? undefined : authDepartment,
        role: authRole
      });

      // Role-based redirect according to assigned role
      onAuthorityRegistered(authRole, authRole === 'admin' ? undefined : authDepartment);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authority registration failed. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Breadcrumb & Step Tracker */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span
            className={`px-2.5 py-1 rounded-full ${
              step === 'choose_type'
                ? 'bg-[var(--text-primary)] text-[var(--bg-page)] font-bold'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            1. Account Type
          </span>
          <span className="text-[var(--text-muted)]">/</span>
          <span
            className={`px-2.5 py-1 rounded-full ${
              step !== 'choose_type'
                ? 'bg-[var(--text-primary)] text-[var(--bg-page)] font-bold'
                : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
            }`}
          >
            2. Registration Details
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1A1F26] border border-[#E2DDD3] dark:border-slate-800 shadow-xs p-6 sm:p-10 transition-colors">
        {/* ========================================================================= */}
        {/* STEP 1: CHOOSE ACCOUNT TYPE                                               */}
        {/* ========================================================================= */}
        {step === 'choose_type' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="text-center max-w-xl mx-auto space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                ClearPass Account Registration
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-[var(--text-primary)] tracking-tight">
                Choose Account Type
              </h1>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Select your institutional role to proceed with the appropriate registration process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto pt-2">
              {/* Option 1: Student */}
              <button
                type="button"
                id="select-type-student-btn"
                onClick={() => handleChooseType('student')}
                className="group p-6 rounded-2xl border-2 border-[var(--border-color)] hover:border-[var(--text-primary)] dark:hover:border-white bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]/40 text-left transition-all duration-150 flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Student
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                      For university students
                    </p>
                  </div>
                  <ul className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Single-click No-Dues clearance request</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Live tracking across all 4 departments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Tamper-proof digital certificate download</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
                  <span>Register as Student</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Higher Authority */}
              <button
                type="button"
                id="select-type-authority-btn"
                onClick={() => handleChooseType('authority')}
                className="group p-6 rounded-2xl border-2 border-[var(--border-color)] hover:border-[var(--text-primary)] dark:hover:border-white bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]/40 text-left transition-all duration-150 flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      Higher Authority
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                      For authorized university employees and department officers
                    </p>
                  </div>
                  <ul className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Department verification & ledger approvals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Role-restricted desk jurisdiction</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Official immutable audit trail logs</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
                  <span>Register as Authority</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Existing User Login Prompt */}
            <div className="text-center pt-4 border-t border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-secondary)]">
                Already have a ClearPass account?{' '}
                <button
                  type="button"
                  id="switch-to-signin-btn"
                  onClick={onOpenSignIn}
                  className="font-bold text-[var(--text-primary)] underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  Sign In here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: STUDENT REGISTRATION FORM                                         */}
        {/* ========================================================================= */}
        {step === 'student_form' && (
          <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep('choose_type');
                  clearError();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Account Type</span>
              </button>

              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
                Student Account
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold font-editorial text-[var(--text-primary)] tracking-tight">
                Student Registration
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Register using your official RGUKT university credentials to request digital No-Dues clearance.
              </p>
            </div>

            {errorMsg && (
              <div
                id="student-reg-error"
                className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span className="font-medium leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="student-full-name-input"
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => {
                      setStudentName(e.target.value);
                      clearError();
                    }}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
                  />
                  <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="student-id-input"
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value);
                    clearError();
                  }}
                  placeholder="e.g. R200048 or CS2022-048"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
                />
              </div>

              {/* University Email */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                  University Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="student-email-input"
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => {
                      setStudentEmail(e.target.value);
                      clearError();
                    }}
                    placeholder="e.g. rahul.r200048@rguktrkv.ac.in"
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
                  />
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Only emails ending with <strong>@rguktrkv.ac.in</strong> or <strong>@rguktong.ac.in</strong> are permitted.
                </p>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="student-password-input"
                      type={showStudentPassword ? 'text' : 'password'}
                      required
                      value={studentPassword}
                      onChange={(e) => {
                        setStudentPassword(e.target.value);
                        clearError();
                      }}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 pl-9 pr-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
                    />
                    <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowStudentPassword(!showStudentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      {showStudentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="student-confirm-password-input"
                      type={showStudentPassword ? 'text' : 'password'}
                      required
                      value={studentConfirmPassword}
                      onChange={(e) => {
                        setStudentConfirmPassword(e.target.value);
                        clearError();
                      }}
                      placeholder="Confirm password"
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
                    />
                    <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="student-register-submit-btn"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-bold hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Student Account...</span>
                  ) : (
                    <>
                      <span>Complete Student Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center pt-2 border-t border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-secondary)]">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={onOpenSignIn}
                  className="font-bold text-[var(--text-primary)] underline underline-offset-4 hover:opacity-80"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: HIGHER AUTHORITY REGISTRATION FORM                                */}
        {/* ========================================================================= */}
        {step === 'authority_form' && (
          <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep('choose_type');
                  clearError();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Account Type</span>
              </button>

              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                Higher Authority Account
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold font-editorial text-[var(--text-primary)] tracking-tight">
                Higher Authority Registration
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Register as an authorized university clearance officer or campus administrator.
              </p>
            </div>

            {errorMsg && (
              <div
                id="authority-reg-error"
                className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span className="font-medium leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAuthoritySubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="authority-full-name-input"
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => {
                      setAuthName(e.target.value);
                      clearError();
                    }}
                    placeholder="e.g. Dr. Aris Thorne"
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
                  />
                  <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Employee ID & Official Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="authority-emp-id-input"
                    type="text"
                    required
                    value={authEmpId}
                    onChange={(e) => {
                      setAuthEmpId(e.target.value);
                      clearError();
                    }}
                    placeholder="e.g. EMP-LIB-001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                    Official Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="authority-email-input"
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => {
                        setAuthEmail(e.target.value);
                        clearError();
                      }}
                      placeholder="e.g. library@university.edu"
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
                    />
                    <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Role & Department Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="authority-role-select"
                    value={authRole}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
                  >
                    <option value="library_officer">Library Officer</option>
                    <option value="hostel_officer">Hostel Officer</option>
                    <option value="sports_officer">Sports Officer</option>
                    <option value="accounts_officer">Accounts Officer</option>
                    <option value="admin">Admin / Higher Authority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="authority-dept-select"
                    value={authDepartment}
                    disabled={authRole !== 'admin'}
                    onChange={(e) => setAuthDepartment(e.target.value as DepartmentKey)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all disabled:opacity-75"
                  >
                    <option value="library">Central University Library</option>
                    <option value="hostel">Hostel Affairs & Residence</option>
                    <option value="sports">Sports & Physical Education</option>
                    <option value="accounts">Accounts & Finance Office</option>
                  </select>
                  {authRole !== 'admin' && (
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">
                      Desk locked to officer role jurisdiction.
                    </p>
                  )}
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="authority-password-input"
                      type={showAuthPassword ? 'text' : 'password'}
                      required
                      value={authPassword}
                      onChange={(e) => {
                        setAuthPassword(e.target.value);
                        clearError();
                      }}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 pl-9 pr-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
                    />
                    <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowAuthPassword(!showAuthPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      {showAuthPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="authority-confirm-password-input"
                      type={showAuthPassword ? 'text' : 'password'}
                      required
                      value={authConfirmPassword}
                      onChange={(e) => {
                        setAuthConfirmPassword(e.target.value);
                        clearError();
                      }}
                      placeholder="Confirm password"
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all"
                    />
                    <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="authority-register-submit-btn"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-bold hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Officer Account...</span>
                  ) : (
                    <>
                      <span>Complete Authority Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center pt-2 border-t border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-secondary)]">
                Already registered as an officer?{' '}
                <button
                  type="button"
                  onClick={onOpenSignIn}
                  className="font-bold text-[var(--text-primary)] underline underline-offset-4 hover:opacity-80"
                >
                  Sign In to Authority Portal
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
