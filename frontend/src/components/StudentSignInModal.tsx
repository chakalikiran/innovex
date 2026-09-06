import { useState, FormEvent } from 'react';
import { X, LogIn, UserPlus, KeyRound, AlertCircle, CheckCircle2, ArrowLeft, GraduationCap, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isAllowedStudentEmail, DEFAULT_DEMO_STUDENT } from '../firebase/service';

interface StudentSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenRegisterPage?: () => void;
}

export function StudentSignInModal({ isOpen, onClose, onSuccess, onOpenRegisterPage }: StudentSignInModalProps) {
  const { signInStudent, registerStudent, resetPassword, loginStudentWithGoogle } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>('signin');

  // Sign In fields - prefilled by default
  const [loginEmail, setLoginEmail] = useState(DEFAULT_DEMO_STUDENT.email);
  const [loginPassword, setLoginPassword] = useState(DEFAULT_DEMO_STUDENT.password);

  // Register fields
  const [regFullName, setRegFullName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleFillDemoStudent = () => {
    clearMessages();
    setLoginEmail(DEFAULT_DEMO_STUDENT.email);
    setLoginPassword(DEFAULT_DEMO_STUDENT.password);
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    setIsSubmitting(true);
    try {
      await loginStudentWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!isAllowedStudentEmail(loginEmail)) {
      setErrorMsg('Please use your official RGUKT university email address (@rguktrkv.ac.in or @rguktong.ac.in).');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInStudent(loginEmail, loginPassword);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify your credentials.');
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
    if (!regStudentId.trim()) {
      setErrorMsg('Please enter your Student ID / Roll Number.');
      return;
    }
    if (!isAllowedStudentEmail(regEmail)) {
      setErrorMsg('Please use your official RGUKT university email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerStudent({
        fullName: regFullName.trim(),
        studentId: regStudentId.trim().toUpperCase(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword
      });
      setSuccessMsg('Account registered successfully! Redirecting to student portal...');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!forgotEmail.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(forgotEmail);
      setSuccessMsg('Password reset link sent to your university email address. Please check your inbox.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send password reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans-ui">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-7 shadow-2xl space-y-5 text-[var(--text-primary)]">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800/60 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-editorial font-normal text-[var(--text-primary)] leading-tight">
                {mode === 'signin' && 'Student Sign In'}
                {mode === 'register' && 'Student Registration'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {mode === 'signin' && 'Sign in with your official university account.'}
                {mode === 'register' && 'Register your official university student account.'}
                {mode === 'forgot' && 'Enter your university email to receive reset instructions.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-2.5 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span className="font-medium leading-relaxed">{errorMsg}</span>
            </div>

            {(errorMsg.toLowerCase().includes('firebase') || errorMsg.toLowerCase().includes('not enabled') || errorMsg.toLowerCase().includes('operation-not-allowed')) && (
              <div className="p-2.5 rounded-lg bg-amber-100/60 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-800 text-[11px] space-y-1.5">
                <p className="font-semibold text-amber-950 dark:text-amber-100">
                  To enable Email/Password authentication:
                </p>
                <ol className="list-decimal pl-4 space-y-0.5 text-amber-900 dark:text-amber-200">
                  <li>Open <strong>Firebase Console</strong> for your project</li>
                  <li>Go to <strong>Build &gt; Authentication &gt; Sign-in method</strong> tab</li>
                  <li>Click <strong>Email/Password</strong>, toggle <strong>Enable</strong> ON, and click <strong>Save</strong></li>
                </ol>
                <div className="pt-1">
                  <a
                    href="https://console.firebase.google.com/project/ai-studio-applet-webapp-70d28/authentication/providers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    Open Firebase Console <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 1: STUDENT SIGN IN                                      */}
        {/* ============================================================ */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                University Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. your_id@rguktrkv.ac.in"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-primary)] text-xs"
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                Allowed domains: @rguktrkv.ac.in or @rguktong.ac.in
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-[var(--text-primary)]">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('forgot');
                  }}
                  className="text-[11px] text-[var(--accent-primary)] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="Enter account password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-[var(--accent-primary)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              {isSubmitting ? 'Verifying credentials...' : 'Sign In'}
            </button>

            {/* Prefill Credentials Helper */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleFillDemoStudent}
                className="w-full py-1.5 px-3 rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--bg-subtle)] text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Prefill Credentials:</span>
                <span className="font-semibold text-[var(--accent-primary)]">{DEFAULT_DEMO_STUDENT.email}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-[var(--border-color)] text-center">
              <p className="text-[11px] text-[var(--text-muted)] mb-2">
                New to university clearance system?
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onOpenRegisterPage) {
                    onClose();
                    onOpenRegisterPage();
                  } else {
                    clearMessages();
                    setMode('register');
                  }
                }}
                className="w-full py-2 px-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] font-semibold text-[var(--text-primary)] transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Create Account / Register
              </button>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: STUDENT REGISTRATION                                 */}
        {/* ============================================================ */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">
                  Student ID / Roll No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. R200048"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">
                  University Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="id@rguktrkv.ac.in"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>
            </div>

            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-[11px] text-blue-700 dark:text-blue-300">
              Only <strong>@rguktrkv.ac.in</strong> and <strong>@rguktong.ac.in</strong> domains are permitted for student accounts.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min. 6 chars"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 mt-2 rounded-xl bg-[var(--accent-primary)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? 'Creating account...' : 'Create Student Account'}
            </button>

            <div className="pt-2 border-t border-[var(--border-color)] text-center">
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('signin');
                }}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center gap-1 mx-auto"
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
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Registered University Email *
              </label>
              <input
                type="email"
                required
                placeholder="your_id@rguktrkv.ac.in"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-primary)] text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-[var(--accent-primary)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <KeyRound className="w-4 h-4" />
              {isSubmitting ? 'Sending link...' : 'Send Password Reset Link'}
            </button>

            <div className="pt-2 border-t border-[var(--border-color)] text-center">
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('signin');
                }}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
