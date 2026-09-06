import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentLandingPage } from './components/StudentLandingPage';
import { HowItWorksView } from './components/HowItWorksView';
import { StudentDashboard } from './components/StudentDashboard';
import { DigitalCertificateView } from './components/DigitalCertificateView';
import { AuthorityPortal } from './components/authority/AuthorityPortal';
import { ApplyClearanceModal } from './components/ApplyClearanceModal';
import { StudentSignInModal } from './components/StudentSignInModal';
import {
  subscribeClearanceRequests,
  subscribeAuditLogs,
  subscribeCertificates,
  ensureInitialSeed,
  INITIAL_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CERTIFICATES
} from './firebase/service';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { ClearanceRequest, AuditRecord, DigitalCertificate, DepartmentKey } from './types';
import { Search, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

function getDeptFromHash(hash: string): DepartmentKey | undefined {
  if (hash.includes('library')) return 'library';
  if (hash.includes('hostel')) return 'hostel';
  if (hash.includes('sports')) return 'sports';
  if (hash.includes('accounts')) return 'accounts';
  return undefined;
}

function MainApp() {
  const { studentUser, authorityUser } = useAuth();

  // State for real-time Firestore collections initialized with comprehensive seed data
  const [requests, setRequests] = useState<ClearanceRequest[]>(INITIAL_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [certificates, setCertificates] = useState<DigitalCertificate[]>(INITIAL_CERTIFICATES);

  // Navigation tab for student portal
  const [currentTab, setCurrentTab] = useState<'landing' | 'home' | 'how-it-works' | 'my-clearance' | 'certificate'>('landing');

  // Authority portal route detection (/authority or #authority)
  const [isAuthorityRoute, setIsAuthorityRoute] = useState(() => {
    return (
      window.location.pathname.includes('/authority') ||
      window.location.hash.includes('authority')
    );
  });
  const [authorityDept, setAuthorityDept] = useState<DepartmentKey | undefined>(() => {
    return getDeptFromHash(window.location.hash);
  });

  // Modals
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Selected certificate for viewing
  const [activeCertId, setActiveCertId] = useState<string>('CP-2026-8F29A');
  const [certSearchQuery, setCertSearchQuery] = useState('');

  // Handle URL hash changes for /authority route
  useEffect(() => {
    const handleHashChange = () => {
      const isAuth =
        window.location.pathname.includes('/authority') ||
        window.location.hash.includes('authority');
      setIsAuthorityRoute(isAuth);
      setAuthorityDept(getDeptFromHash(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Initialize data and auth-safe real-time listeners
  useEffect(() => {
    // 1. Certificates are public for verification and showcase
    const unsubCerts = subscribeCertificates((data) => setCertificates(data));

    // 2. Auth-aware subscription for protected collections
    let unsubRequests: (() => void) | null = null;
    let unsubAudits: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubRequests) {
        unsubRequests();
        unsubRequests = null;
      }
      if (unsubAudits) {
        unsubAudits();
        unsubAudits = null;
      }

      if (user) {
        ensureInitialSeed();
        unsubRequests = subscribeClearanceRequests((data) => setRequests(data));

        // Subscribe to audit logs only if on authority route or signed in as authority/admin
        if (isAuthorityRoute || authorityUser) {
          unsubAudits = subscribeAuditLogs((data) => setAuditLogs(data));
        } else {
          setAuditLogs(INITIAL_AUDIT_LOGS);
        }
      } else {
        setRequests(INITIAL_REQUESTS);
        setAuditLogs(INITIAL_AUDIT_LOGS);
      }
    });

    return () => {
      unsubAuth();
      unsubCerts();
      if (unsubRequests) unsubRequests();
      if (unsubAudits) unsubAudits();
    };
  }, [isAuthorityRoute, authorityUser]);

  // Exit authority portal back to student portal
  const handleExitAuthority = () => {
    window.location.hash = '';
    setIsAuthorityRoute(false);
    setAuthorityDept(undefined);
    setCurrentTab('landing');
  };

  const handleOpenAuthority = (dept?: DepartmentKey) => {
    window.location.hash = dept ? `authority/${dept}` : 'authority';
    setAuthorityDept(dept);
    setIsAuthorityRoute(true);
  };

  // If in Authority route, render the completely separate Authority Portal
  if (isAuthorityRoute) {
    return (
      <AuthorityPortal
        requests={requests}
        auditLogs={auditLogs}
        certificates={certificates}
        onExitAuthority={handleExitAuthority}
        initialDepartment={authorityDept}
      />
    );
  }

  // Active certificate calculation
  const activeCertificate =
    certificates.find((c) => c.id.toLowerCase() === activeCertId.toLowerCase()) ||
    certificates[0];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Student Navigation (Strictly student scope - no admin/officer links) */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSignIn={() => setShowSignInModal(true)}
        onOpenApply={() => setShowApplyModal(true)}
        onOpenAuthority={handleOpenAuthority}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {(currentTab === 'landing' || currentTab === 'home') && (
          <LandingPage
            onStartClearance={() => setShowApplyModal(true)}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onOpenSignIn={() => setShowSignInModal(true)}
            onOpenAuthority={handleOpenAuthority}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorksView
            onStartClearance={() => setShowApplyModal(true)}
          />
        )}

        {currentTab === 'my-clearance' && (
          <StudentDashboard
            requests={requests}
            onOpenApply={() => setShowApplyModal(true)}
            onViewCertificate={(certId) => {
              setActiveCertId(certId);
              setCurrentTab('certificate');
            }}
          />
        )}

        {currentTab === 'certificate' && (
          <div className="space-y-8">
            {/* Quick Search & Select Bar for Certificate Tab */}
            <div className="no-print max-w-4xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[var(--text-muted)]">
                  Available Certificates:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {certificates.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCertId(c.id)}
                      className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                        c.id === activeCertificate?.id
                          ? 'bg-[var(--accent-primary)] text-white font-bold'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                      }`}
                    >
                      {c.id} ({c.studentName})
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick ID Search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (certSearchQuery.trim()) {
                    setActiveCertId(certSearchQuery.trim());
                  }
                }}
                className="relative w-full sm:w-64"
              >
                <input
                  type="text"
                  value={certSearchQuery}
                  onChange={(e) => setCertSearchQuery(e.target.value)}
                  placeholder="Lookup Certificate ID..."
                  className="w-full px-3 py-1.5 pl-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-primary)]"
                />
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </form>
            </div>

            {activeCertificate ? (
              <DigitalCertificateView
                certificate={activeCertificate}
                onVerifyClick={(certId) => {
                  setCurrentTab('home');
                  setTimeout(() => {
                    const el = document.getElementById('cert-verify-input');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                      el.focus();
                    }
                  }, 100);
                }}
              />
            ) : (
              <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <Award className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                <h3 className="text-xl font-editorial font-normal text-[var(--text-primary)]">
                  Certificate Not Found
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 mb-6">
                  No certificate matching ID "{activeCertId}" is available.
                </p>
                <button
                  onClick={() => setActiveCertId(certificates[0]?.id || 'CP-2026-8F29A')}
                  className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-semibold"
                >
                  View Sample Issued Certificate
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Clean Utility / Minimal Status Footer */}
      <footer className="no-print mt-auto py-6 sm:h-24 bg-[#0F172A] text-[#94A3B8] border-t border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center px-6 sm:px-12 justify-between gap-6 transition-colors">
        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-tighter text-white/50 mb-0.5">Student ID</span>
            <span className="text-xs font-mono text-white">
              {studentUser?.rollNo || 'ST-2024-0982-A'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-tighter text-white/50 mb-0.5">Last Activity</span>
            <span className="text-xs font-mono text-white">
              14 MAY 2024 • 10:42 AM
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-tighter text-white/50 mb-0.5">Status</span>
            <span className="text-xs font-mono text-[#F59E0B] uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
              Verification Ongoing
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-[11px] uppercase tracking-widest font-semibold">
          <span className="text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            System Online
          </span>
          <span className="opacity-50 hover:opacity-80 transition-opacity cursor-pointer">Terms of Service</span>
          <span className="opacity-50 hover:opacity-80 transition-opacity cursor-pointer">Privacy Policy</span>
        </div>
      </footer>

      {/* Apply for Clearance Modal */}
      <ApplyClearanceModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmitted={(reqId) => {
          setCurrentTab('my-clearance');
        }}
      />

      {/* Student Sign In Modal */}
      <StudentSignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
