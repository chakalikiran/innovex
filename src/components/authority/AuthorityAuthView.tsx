import { useState, FormEvent } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  LogIn,
  UserPlus,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Lock,
  BadgeAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DepartmentKey, UserRole } from '../../types';
import { DEFAULT_DEMO_AUTHORITIES } from '../../firebase/service';

interface AuthorityAuthViewProps {
  onSuccess: () => void;
  onExitAuthority: () => void;
}

export function AuthorityAuthView({ onSuccess, onExitAuthority }: AuthorityAuthViewProps) {
  const { signInAuthority, registerAuthority, resetPassword } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>('signin');

  // Sign in state
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [regFullName, setRegFullName] = useState('');
  const [regEmpId, setRegEmpId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState<DepartmentKey>('library');
  const [regRole, setRegRole] = useState<UserRole>('library_officer');

  // Forgot state
  const [forgotEmail, setForgotEmail] = useState('');

  // Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleFillDemo = (authority: (typeof DEFAULT_DEMO_AUTHORITIES)[0]) => {
    clearMessages();
    setEmpId(authority.employeeId);
    setPassword(authority.password);
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!empId.trim()) {
      setErrorMsg('Please enter your official Employee ID.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInAuthority(empId.trim(), password);
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your Employee ID and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!regFullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!regEmpId.trim()) {
      setErrorMsg('Please enter your Employee ID.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Please enter your official institutional email.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerAuthority({
        fullName: regFullName.trim(),
        employeeId: regEmpId.trim().toUpperCase(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        department: regRole === 'admin' ? undefined : regDepartment,
        role: regRole
      });
      setSuccessMsg('Authority account registered successfully! Entering portal...');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgot = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!forgotEmail.trim()) {
      setErrorMsg('Please enter your official email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(forgotEmail);
      setSuccessMsg('Password reset link sent to your email. Please check your inbox.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send password reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sync department with role when role changes in registration
  const handleRoleChange = (role: UserRole) => {
    setRegRole(role);
    if (role === 'library_officer') setRegDepartment('library');
    if (role === 'hostel_officer') setRegDepartment('hostel');
    if (role === 'sports_officer') setRegDepartment('sports');
    if (role === 'accounts_officer') setRegDepartment('accounts');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans-ui selection:bg-amber-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white block leading-tight">
              ClearPass Authority
            </span>
            <span className="text-[10px] font-mono uppercase text-slate-400">
              Authorized Personnel Only
            </span>
          </div>
        </div>

        <button
          onClick={onExitAuthority}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/60 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Student Portal</span>
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8 space-y-6">
          
          {/* Card Title & Security Badge */}
          <div className="border-b border-slate-800 pb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-semibold">
                  Restricted Gateway
                </span>
              </div>
              <h1 className="text-2xl font-editorial font-normal text-white">
                {mode === 'signin' && 'Authority Sign In'}
                {mode === 'register' && 'Authority Registration'}
                {mode === 'forgot' && 'Reset Officer Password'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === 'signin' && 'Authorized personnel only.'}
                {mode === 'register' && 'Provision university department officer or administrative access.'}
                {mode === 'forgot' && 'Enter your institutional email to receive a password reset link.'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-xs text-red-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-xs text-emerald-300 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 1: AUTHORITY SIGN IN (Employee ID + Password)            */}
          {/* ============================================================ */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EMP-LIB-01 or EMP-ADM-00"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs uppercase"
                />
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                  Format: EMP-XXX-XX (case-insensitive)
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-200">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setMode('forgot');
                    }}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter authority password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <LogIn className="w-4 h-4" />
                {isSubmitting ? 'Authenticating Authority...' : 'Sign In'}
              </button>

              {/* Demo Authority Quick-Select Buttons */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                  Test Credentials (1-Click Fill):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DEFAULT_DEMO_AUTHORITIES.map((auth) => (
                    <button
                      key={auth.employeeId}
                      type="button"
                      onClick={() => handleFillDemo(auth)}
                      className="p-2 rounded-lg border border-slate-800 bg-slate-950 hover:border-amber-500/50 hover:bg-slate-800/40 text-left transition-colors"
                    >
                      <span className="text-[10px] font-mono text-amber-400 font-bold block">
                        {auth.employeeId}
                      </span>
                      <span className="text-[11px] text-slate-300 truncate block">
                        {auth.role === 'admin' ? 'University Admin' : auth.department.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-center">
                <p className="text-[11px] text-slate-400 mb-2">
                  Need to register a new officer or admin account?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('register');
                  }}
                  className="w-full py-2 px-4 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register Authority Account
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* VIEW 2: AUTHORITY REGISTRATION                               */}
          {/* ============================================================ */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Full Name & Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Aris Thorne (Chief Librarian)"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-LIB-102"
                    value={regEmpId}
                    onChange={(e) => setRegEmpId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Official Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="officer@rguktrkv.ac.in"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Authority Role *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="library_officer">Library Officer</option>
                    <option value="hostel_officer">Hostel Officer / Warden</option>
                    <option value="sports_officer">Sports Officer</option>
                    <option value="accounts_officer">Accounts Officer / Bursar</option>
                    <option value="admin">University Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Department Jurisdiction *
                  </label>
                  <select
                    disabled={regRole === 'admin'}
                    value={regRole === 'admin' ? '' : regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value as DepartmentKey)}
                    className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:border-amber-500 text-xs disabled:opacity-50"
                  >
                    {regRole === 'admin' ? (
                      <option value="">Campus-Wide / All Departments</option>
                    ) : (
                      <>
                        <option value="library">Library Desk</option>
                        <option value="hostel">Hostel Affairs</option>
                        <option value="sports">Sports Board</option>
                        <option value="accounts">Accounts & Finance</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 mt-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <UserPlus className="w-4 h-4" />
                {isSubmitting ? 'Registering authority account...' : 'Register Authority Account'}
              </button>

              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('signin');
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* VIEW 3: FORGOT PASSWORD                                      */}
          {/* ============================================================ */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Registered Official Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="officer@rguktrkv.ac.in"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <KeyRound className="w-4 h-4" />
                {isSubmitting ? 'Sending link...' : 'Send Password Reset Link'}
              </button>

              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('signin');
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Authority Sign In
                </button>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* Security Footer */}
      <footer className="border-t border-slate-800/80 py-3 px-4 text-center text-[11px] text-slate-500">
        Strictly restricted to authorized university department officers and institutional administrators. Unauthorized access is logged under the university disciplinary code.
      </footer>
    </div>
  );
}
