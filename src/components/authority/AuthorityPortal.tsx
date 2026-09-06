import { useState, useEffect } from 'react';
import {
  ClearanceRequest,
  DepartmentKey,
  DEPARTMENTS,
  AuditRecord,
  DigitalCertificate
} from '../../types';
import { updateDepartmentAction } from '../../firebase/service';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AuthorityAuthView } from './AuthorityAuthView';
import {
  BookOpen,
  Home,
  Trophy,
  CreditCard,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  X,
  ArrowLeft,
  Sun,
  Moon,
  ShieldCheck,
  Building2,
  FileCheck,
  History,
  BarChart3,
  UserCheck,
  BadgeCheck,
  FileText,
  LogOut,
  ShieldAlert,
  Lock
} from 'lucide-react';

interface AuthorityPortalProps {
  requests: ClearanceRequest[];
  auditLogs: AuditRecord[];
  certificates: DigitalCertificate[];
  onExitAuthority: () => void;
  initialDepartment?: DepartmentKey;
}

export function AuthorityPortal({
  requests,
  auditLogs,
  certificates,
  onExitAuthority,
  initialDepartment = 'library'
}: AuthorityPortalProps) {
  const { theme, toggleTheme } = useTheme();
  const { authorityUser, studentUser, logoutAuthority, logoutStudent } = useAuth();

  const isAdmin = authorityUser?.role === 'admin';
  const assignedDept: DepartmentKey | null = authorityUser?.department ||
    (authorityUser?.role === 'library_officer' ? 'library' :
     authorityUser?.role === 'hostel_officer' ? 'hostel' :
     authorityUser?.role === 'sports_officer' ? 'sports' :
     authorityUser?.role === 'accounts_officer' ? 'accounts' : null);

  // Active view: 'department' | 'admin' | 'audit'
  const [activeTab, setActiveTab] = useState<'department' | 'admin' | 'audit'>('department');

  // Selected Department Officer Portal
  const [selectedDept, setSelectedDept] = useState<DepartmentKey>(assignedDept || initialDepartment);

  // Enforce department locking for officers
  useEffect(() => {
    if (assignedDept && !isAdmin) {
      setSelectedDept(assignedDept);
      if (activeTab === 'admin') {
        setActiveTab('department');
      }
    }
  }, [assignedDept, isAdmin, activeTab]);

  // Search & Status filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Action dialog state
  const [actionReq, setActionReq] = useState<ClearanceRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [actionRemarks, setActionRemarks] = useState('');
  const [dueAmount, setDueAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // If student is logged in and visits /authority
  if (studentUser && !authorityUser) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex items-center justify-center p-4 font-sans-ui">
        <div className="max-w-md w-full p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-editorial font-bold text-[var(--text-primary)]">Access Restricted</h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            You are currently signed in as a student (<strong>{studentUser.displayName}</strong>, Roll: <strong>{studentUser.rollNo}</strong>). The Higher Authority Portal is strictly reserved for department clearance officers and university administrators.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onExitAuthority}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-xs"
            >
              Return to Student Clearance Portal
            </button>
            <button
              onClick={async () => {
                await logoutStudent();
              }}
              className="w-full py-2 px-4 rounded-xl border border-[var(--border-color)] text-xs font-semibold hover:bg-[var(--bg-subtle)] transition-colors"
            >
              Sign Out Student to Login as Officer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated as an authority
  if (!authorityUser) {
    return <AuthorityAuthView onSuccess={() => {}} onExitAuthority={onExitAuthority} />;
  }

  // Sync selectedDept if initialDepartment changes from outside (for admins)
  useEffect(() => {
    if (isAdmin && initialDepartment) {
      setSelectedDept(initialDepartment);
    }
  }, [initialDepartment, isAdmin]);

  const currentDeptMeta = DEPARTMENTS.find((d) => d.key === selectedDept) || DEPARTMENTS[0];
  const officerName = authorityUser.displayName || currentDeptMeta.defaultOfficer;

  // Department specific portal metadata
  const departmentThemes: Record<
    DepartmentKey,
    {
      title: string;
      office: string;
      icon: typeof BookOpen;
      accentBg: string;
      accentText: string;
      checks: string[];
      defaultApproveRemarks: string;
      defaultRejectRemarks: string;
      defaultDueAmount?: number;
    }
  > = {
    library: {
      title: 'Library Officer Portal',
      office: 'Central University Library • Accession & Circulation Desk',
      icon: BookOpen,
      accentBg: 'bg-blue-50 dark:bg-blue-950/30',
      accentText: 'text-blue-700 dark:text-blue-400',
      checks: [
        'Accession Catalog Return Verification',
        'Physical Book Damage & Overdue Inspection',
        'Journal / Reference Desk Clearance',
        'Digital Library Card Inactivation'
      ],
      defaultApproveRemarks: 'All borrowed titles returned. Catalog accession verified. Zero dues.',
      defaultRejectRemarks: 'Overdue library book pending return. Accession #LIB-4481.',
      defaultDueAmount: 250
    },
    hostel: {
      title: 'Hostel Officer Portal',
      office: 'Hostel Affairs & Residence Directorate • Warden Office',
      icon: Home,
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/30',
      accentText: 'text-emerald-700 dark:text-emerald-400',
      checks: [
        'Hostel Room Physical Inspection & Furniture Check',
        'Hostel Key Surrender (Mandakini / Alaknanda / Kaveri)',
        'Mess Bill & Dining Dues Reconciliation',
        'Hostel Caution Deposit Audit'
      ],
      defaultApproveRemarks: 'Room inspection clear. Keys surrendered. Mess dues settled.',
      defaultRejectRemarks: 'Pending mess bill balance and unreturned room key.',
      defaultDueAmount: 850
    },
    sports: {
      title: 'Sports Officer Portal',
      office: 'Directorate of Physical Education & Sports Board',
      icon: Trophy,
      accentBg: 'bg-amber-50 dark:bg-amber-950/30',
      accentText: 'text-amber-700 dark:text-amber-400',
      checks: [
        'Gymnasium Locker Key Handover',
        'University Athletic Jersey & Team Kit Inspection',
        'Sports Equipment & Gear Return',
        'Tournament Travel Allowance Settlement'
      ],
      defaultApproveRemarks: 'Gym locker vacated and key returned. Athletic kit accounted for.',
      defaultRejectRemarks: 'Gym locker key #42 not surrendered / athletic kit missing.',
      defaultDueAmount: 500
    },
    accounts: {
      title: 'Accounts Officer Portal',
      office: 'Student Finance & Accounts Division • Bursar Desk',
      icon: CreditCard,
      accentBg: 'bg-purple-50 dark:bg-purple-950/30',
      accentText: 'text-purple-700 dark:text-purple-400',
      checks: [
        'Tuition & Examination Fee Ledger Reconciliation',
        'University Caution Deposit Settlement',
        'Cross-Department Fine Consolidation',
        'Final Institutional Ledger Stamp'
      ],
      defaultApproveRemarks: 'Full academic fee cleared. Scholarship reconciled. Caution deposit eligible.',
      defaultRejectRemarks: 'Outstanding semester tuition balance or unpaid lab surcharge.',
      defaultDueAmount: 1200
    }
  };

  const currentTheme = departmentThemes[selectedDept];
  const DeptIcon = currentTheme.icon;

  // Handle department action submission
  const handleConfirmAction = async () => {
    if (!actionReq) return;
    setIsProcessing(true);
    try {
      await updateDepartmentAction(
        actionReq,
        selectedDept,
        actionType === 'approve' ? 'approved' : 'rejected',
        actionRemarks ||
          (actionType === 'approve' ? currentTheme.defaultApproveRemarks : currentTheme.defaultRejectRemarks),
        dueAmount ? parseFloat(dueAmount) : undefined,
        officerName
      );

      setActionReq(null);
      setActionRemarks('');
      setDueAmount('');
    } catch (err) {
      console.error('Failed to update department action:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter requests for current department
  const filteredRequests = requests.filter((r) => {
    if (!r.selectedDepartments.includes(selectedDept)) return false;

    const deptStatus = r.departmentStatuses[selectedDept]?.status || 'pending';
    if (statusFilter !== 'all' && deptStatus !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRoll = r.studentRollNo.toLowerCase().includes(q);
      const matchName = r.studentName.toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      if (!matchRoll && !matchName && !matchId) return false;
    }

    return true;
  });

  // Department specific stats
  const deptPending = requests.filter(
    (r) => r.selectedDepartments.includes(selectedDept) && r.departmentStatuses[selectedDept]?.status === 'pending'
  ).length;
  const deptApproved = requests.filter(
    (r) => r.selectedDepartments.includes(selectedDept) && r.departmentStatuses[selectedDept]?.status === 'approved'
  ).length;
  const deptRejected = requests.filter(
    (r) => r.selectedDepartments.includes(selectedDept) && r.departmentStatuses[selectedDept]?.status === 'rejected'
  ).length;

  // Executive stats
  const totalRequests = requests.length;
  const completedRequests = requests.filter((r) => r.overallStatus === 'approved' || r.progressPercent === 100).length;
  const pendingRequests = requests.filter((r) => r.overallStatus === 'pending').length;

  // Department specific audit logs
  const deptAuditLogs = auditLogs.filter(
    (l) => l.department.toLowerCase() === selectedDept.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans-ui transition-colors">
      {/* 1. TOP UTILITY HEADER */}
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onExitAuthority}
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors pr-3 border-r border-[var(--border-color)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Student Portal
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--text-primary)] text-[var(--bg-page)] flex items-center justify-center font-bold text-xs shrink-0">
                AU
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight block leading-tight">
                  ClearPass Authority
                </span>
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                  Higher Authorities Management
                </span>
              </div>
            </div>
          </div>

          {/* Primary View Switcher: Department Workspace vs Executive Overview vs Audit */}
          <div className="hidden md:flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-lg border border-[var(--border-color)]">
            <button
              onClick={() => setActiveTab('department')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'department'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <DeptIcon className="w-3.5 h-3.5" />
              {isAdmin ? 'Department View' : 'Officer Workspace'}
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Campus Overview
              </button>
            )}
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Audit Trail ({isAdmin ? auditLogs.length : deptAuditLogs.length})
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle visual theme"
              className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Officer Badge */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[var(--border-color)]">
              <div className="text-right">
                <span className="text-xs font-bold block leading-tight">{officerName}</span>
                <span className="text-[10px] font-mono text-[var(--accent-primary)] uppercase flex items-center gap-1 justify-end">
                  {authorityUser.employeeId && <span>[{authorityUser.employeeId}]</span>}
                  <span>{isAdmin ? 'Campus Admin' : currentDeptMeta.name}</span>
                </span>
              </div>
            </div>

            {/* Authority Sign Out */}
            <button
              onClick={async () => {
                await logoutAuthority();
              }}
              title="Sign Out of Authority Portal"
              className="p-2 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* 2. DEDICATED SEPARATE AUTHORITY PORTALS SELECTOR BAR */}
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-subtle)]/40 px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] shrink-0 hidden sm:inline">
                  Admin Department Switcher:
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { key: 'library' as const, name: 'Library Officer', icon: BookOpen, officer: 'Dr. Aris Thorne' },
                    { key: 'hostel' as const, name: 'Hostel Officer', icon: Home, officer: 'Prof. Sarah Jenkins' },
                    { key: 'sports' as const, name: 'Sports Officer', icon: Trophy, officer: 'Coach Marcus Vance' },
                    { key: 'accounts' as const, name: 'Accounts Officer', icon: CreditCard, officer: 'Mrs. Elena Rostova' }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = selectedDept === item.key && activeTab === 'department';
                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          setSelectedDept(item.key);
                          setActiveTab('department');
                          window.location.hash = `authority/${item.key}`;
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-[var(--text-primary)] text-[var(--bg-page)] shadow-xs'
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] shrink-0 hidden sm:inline">
                  Authorized Desk Jurisdiction:
                </span>
                <div className="px-3 py-1 rounded-lg bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold flex items-center gap-2 shadow-xs">
                  <DeptIcon className="w-3.5 h-3.5" />
                  <span>{currentDeptMeta.name} Clearance Desk</span>
                  <span className="text-[9px] font-mono bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded uppercase">
                    Role-Restricted
                  </span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)] hidden lg:inline">
                  (Actions restricted to {currentDeptMeta.name} records only)
                </span>
              </div>
            )}

            <span className="text-xs font-mono text-[var(--text-muted)] shrink-0 hidden md:inline">
              Session: <strong className="text-[var(--text-primary)]">{authorityUser.role.toUpperCase()} ACCESS</strong>
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============================================================ */}
        {/* TAB 1: DEDICATED SEPARATE DEPARTMENT OFFICER PORTAL          */}
        {/* ============================================================ */}
        {activeTab === 'department' && (
          <div className="space-y-6">
            {/* Department Officer Hero Banner */}
            <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] flex items-center justify-center shrink-0 shadow-xs">
                  <DeptIcon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--accent-primary)] border border-[var(--border-color)]">
                      Official Department Desk
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Ledger Active
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
                    {currentTheme.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 font-mono">
                    {currentTheme.office} • Officer: <strong className="text-[var(--text-primary)]">{officerName}</strong>
                  </p>
                </div>
              </div>

              {/* Department Quick Stats Counter */}
              <div className="flex items-center gap-4 sm:gap-6 border-t lg:border-t-0 lg:border-l border-[var(--border-color)] pt-4 lg:pt-0 lg:pl-8">
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-mono font-light text-amber-600 dark:text-amber-400 block">
                    {deptPending}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block">
                    Pending
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-mono font-light text-emerald-600 dark:text-emerald-400 block">
                    {deptApproved}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block">
                    Cleared ✓
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-mono font-light text-red-600 dark:text-red-400 block">
                    {deptRejected}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block">
                    Flagged Dues
                  </span>
                </div>
              </div>
            </div>

            {/* Department Verification Scope & Checklist Assistant */}
            <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/50">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--text-muted)] block mb-3">
                Mandatory Verification Checklist for {currentDeptMeta.name}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentTheme.checks.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[var(--text-secondary)] font-medium leading-tight">
                      {check}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls: Search and Status Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${currentDeptMeta.name} queue by Roll No or Name...`}
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                />
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border-color)] text-xs self-stretch sm:self-auto justify-center">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                      statusFilter === st
                        ? 'bg-[var(--text-primary)] text-[var(--bg-page)] font-semibold shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Queue Table */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
              <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-subtle)]/30">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {currentDeptMeta.name} Verification Ledger
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    {filteredRequests.length} candidate requests in active queue
                  </p>
                </div>
                <span className="text-xs font-mono text-[var(--text-muted)] hidden sm:inline">
                  Officer: <strong className="text-[var(--text-primary)]">{officerName}</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-muted)] uppercase font-mono text-[10px]">
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Candidate Name</th>
                      <th className="py-3 px-4">Program</th>
                      <th className="py-3 px-4">Status in {selectedDept}</th>
                      <th className="py-3 px-4">Official Remarks</th>
                      <th className="py-3 px-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-xs">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[var(--text-muted)] font-sans">
                          No clearance applications currently match this queue filter.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req) => {
                        const deptStatus = req.departmentStatuses[selectedDept];
                        const isApproved = deptStatus?.status === 'approved';
                        const isRejected = deptStatus?.status === 'rejected';

                        return (
                          <tr key={req.id} className="hover:bg-[var(--bg-subtle)]/40 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-[var(--text-primary)]">
                              {req.studentRollNo}
                            </td>
                            <td className="py-3.5 px-4 font-sans">
                              <span className="font-semibold text-[var(--text-primary)] block">
                                {req.studentName}
                              </span>
                              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                                Req: {req.id}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[var(--text-secondary)] font-sans">
                              {req.program}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  isApproved
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
                                    : isRejected
                                    ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800'
                                }`}
                              >
                                {isApproved ? 'Approved ✓' : isRejected ? 'Rejected ✕' : 'Pending Review'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[var(--text-secondary)] font-sans max-w-xs truncate">
                              {deptStatus?.remarks || '—'}
                              {deptStatus?.dueAmount ? (
                                <span className="text-red-600 font-mono text-[11px] block font-bold">
                                  Due: ₹{deptStatus.dueAmount}
                                </span>
                              ) : null}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setActionReq(req);
                                    setActionType('approve');
                                    setActionRemarks(currentTheme.defaultApproveRemarks);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setActionReq(req);
                                    setActionType('reject');
                                    setActionRemarks(currentTheme.defaultRejectRemarks);
                                    setDueAmount(currentTheme.defaultDueAmount ? String(currentTheme.defaultDueAmount) : '');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Flag Dues
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Department Audit Log Box */}
            <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[var(--text-muted)]" />
                  <h4 className="text-xs font-mono uppercase font-bold text-[var(--text-primary)]">
                    Recent {currentDeptMeta.name} Audit Log
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {deptAuditLogs.length} verified operations recorded
                </span>
              </div>

              {deptAuditLogs.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-4 text-center font-sans">
                  No previous audit records in this department session.
                </p>
              ) : (
                <div className="space-y-2 font-mono text-xs">
                  {deptAuditLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)]/40 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[var(--text-primary)]">
                          {log.studentRollNo}
                        </span>
                        <span className="text-[var(--text-secondary)] font-sans">
                          {log.remarks}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: EXECUTIVE CAMPUS OVERVIEW                             */}
        {/* ============================================================ */}
        {activeTab === 'admin' && (
          <div className="space-y-8">
            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                University ClearPass Administration
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Executive dashboard tracking cross-department clearances, bottlenecks, and certificate issuances.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <span className="text-xs font-mono uppercase text-[var(--text-muted)] block">Total Applications</span>
                <span className="text-3xl font-editorial font-bold text-[var(--text-primary)] mt-1 block">
                  {totalRequests}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] mt-2 block font-mono">
                  2026 Graduating Cohort
                </span>
              </div>

              <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-[var(--bg-surface)]">
                <span className="text-xs font-mono uppercase text-emerald-700 dark:text-emerald-400 block">Fully Cleared</span>
                <span className="text-3xl font-editorial font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {completedRequests}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] mt-2 block font-mono">
                  {totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0}% completion rate
                </span>
              </div>

              <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900 bg-[var(--bg-surface)]">
                <span className="text-xs font-mono uppercase text-amber-700 dark:text-amber-400 block">In Progress</span>
                <span className="text-3xl font-editorial font-bold text-amber-600 dark:text-amber-400 mt-1 block">
                  {pendingRequests}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] mt-2 block font-mono">
                  Under departmental audit
                </span>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <span className="text-xs font-mono uppercase text-[var(--accent-primary)] block">Issued Certificates</span>
                <span className="text-3xl font-editorial font-bold text-[var(--accent-primary)] mt-1 block">
                  {certificates.length}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] mt-2 block font-mono">
                  Tamper-proof verifiable
                </span>
              </div>
            </div>

            {/* Department Comparison Table */}
            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Cross-Department Real-Time Clearance Matrix
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-muted)] uppercase font-mono text-[10px]">
                      <th className="p-3.5">Roll No</th>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5 text-center">Library</th>
                      <th className="p-3.5 text-center">Hostel</th>
                      <th className="p-3.5 text-center">Sports</th>
                      <th className="p-3.5 text-center">Accounts</th>
                      <th className="p-3.5 text-right">Completion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-xs">
                    {requests.map((r) => (
                      <tr key={r.id} className="hover:bg-[var(--bg-subtle)]/40">
                        <td className="p-3.5 font-bold text-[var(--text-primary)]">
                          {r.studentRollNo}
                        </td>
                        <td className="p-3.5 font-medium text-[var(--text-primary)] font-sans">
                          {r.studentName}
                        </td>
                        {(['library', 'hostel', 'sports', 'accounts'] as DepartmentKey[]).map((dk) => {
                          const st = r.departmentStatuses[dk]?.status;
                          return (
                            <td key={dk} className="p-3.5 text-center">
                              {st === 'approved' ? (
                                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                                  ✓ Clear
                                </span>
                              ) : st === 'rejected' ? (
                                <span className="inline-block px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-[10px] font-bold">
                                  ✕ Due
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px]">
                                  Pending
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="p-3.5 text-right font-bold text-[var(--text-primary)]">
                          {r.progressPercent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: COMPLETE SYSTEM AUDIT TRAIL                           */}
        {/* ============================================================ */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  University Digital Clearance Audit Trail
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Permanent immutable record of every departmental sign-off, dues liability, and digital certificate issue.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-[var(--bg-subtle)] text-[var(--accent-primary)] font-bold">
                {auditLogs.length} Verified Entries
              </span>
            </div>

            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-muted)] uppercase font-mono text-[10px]">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Officer Name</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Student Roll</th>
                      <th className="py-3 px-4">Official Remarks</th>
                      <th className="py-3 px-4 font-mono">Verification ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-xs">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[var(--bg-subtle)]/30">
                        <td className="py-3 px-4 text-[var(--text-muted)] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4 font-sans font-medium text-[var(--text-primary)]">
                          {log.actorName}
                        </td>
                        <td className="py-3 px-4 capitalize text-[var(--text-secondary)] font-sans">
                          {log.department}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.action === 'APPROVED' || log.action === 'CERTIFICATE_ISSUED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : log.action === 'REJECTED'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
                            }`}
                          >
                            {log.action.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[var(--text-primary)]">
                          {log.studentRollNo}
                        </td>
                        <td className="py-3 px-4 text-[var(--text-secondary)] font-sans max-w-sm truncate">
                          {log.remarks || '—'}
                        </td>
                        <td className="py-3 px-4 text-[10px] text-[var(--accent-primary)] font-bold">
                          {log.id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ACTION CONFIRMATION MODAL */}
      {actionReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <DeptIcon className="w-4 h-4 text-[var(--text-primary)]" />
                {actionType === 'approve' ? 'Authorize Clearance Sign-Off' : 'Record Clearance Rejection'}
              </h3>
              <button
                onClick={() => setActionReq(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-[var(--text-secondary)]">
                Student:{' '}
                <strong className="text-[var(--text-primary)]">
                  {actionReq.studentName} ({actionReq.studentRollNo})
                </strong>
              </p>
              <p className="text-[var(--text-secondary)]">
                Department:{' '}
                <strong className="text-[var(--text-primary)] capitalize">{selectedDept} Officer Desk</strong>
              </p>
              <p className="text-[var(--text-secondary)]">
                Signatory:{' '}
                <strong className="text-[var(--text-primary)]">{officerName}</strong>
              </p>
            </div>

            {/* Rejection due amount */}
            {actionType === 'reject' && (
              <div>
                <label className="block text-xs font-semibold text-red-600 mb-1">
                  Outstanding Dues / Fine Amount (₹)
                </label>
                <input
                  type="number"
                  value={dueAmount}
                  onChange={(e) => setDueAmount(e.target.value)}
                  placeholder="e.g. 250"
                  className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Official Ledger Remarks *
              </label>
              <textarea
                rows={3}
                value={actionRemarks}
                onChange={(e) => setActionRemarks(e.target.value)}
                placeholder="Enter audit notes, returned book numbers, or key status..."
                className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setActionReq(null)}
                className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmAction}
                className={`px-5 py-2 rounded-lg text-white text-xs font-semibold transition-colors ${
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isProcessing
                  ? 'Recording...'
                  : actionType === 'approve'
                  ? 'Confirm Approval ✓'
                  : 'Confirm Rejection ✕'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
