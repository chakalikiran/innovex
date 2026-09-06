import { useState } from 'react';
import { ClearanceRequest, DepartmentKey, DEPARTMENTS } from '../types';
import { resubmitDepartmentClearance } from '../firebase/service';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  RefreshCw,
  Award,
  ExternalLink,
  ChevronRight,
  Send,
  Plus,
  LogOut
} from 'lucide-react';

interface StudentDashboardProps {
  requests: ClearanceRequest[];
  onOpenApply: () => void;
  onViewCertificate: (certId: string) => void;
}

export function StudentDashboard({ requests, onOpenApply, onViewCertificate }: StudentDashboardProps) {
  const { studentUser, logoutStudent } = useAuth();

  // Find requests matching student roll or email, or default to latest request
  const studentRequests = requests.filter(
    (r) =>
      r.studentRollNo === studentUser?.rollNo ||
      r.studentEmail === studentUser?.email ||
      r.studentId === studentUser?.uid
  );

  // If user has matched requests use those, otherwise fall back to all requests so demo is always rich and clickable
  const activeRequests = studentRequests.length > 0 ? studentRequests : requests;
  const [selectedReqId, setSelectedReqId] = useState<string>(activeRequests[0]?.id || 'REQ-2026-4821');

  const currentReq = requests.find((r) => r.id === selectedReqId) || activeRequests[0] || requests[0];

  // Re-submit modal state
  const [resubmitDept, setResubmitDept] = useState<DepartmentKey | null>(null);
  const [resubmitNote, setResubmitNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentReq) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-editorial font-normal text-[var(--text-primary)]">
          No Clearance Request Found
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2 mb-6">
          You haven't submitted a university No-Dues application yet.
        </p>
        <button
          onClick={onOpenApply}
          className="px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)]"
        >
          Apply for Clearance
        </button>
      </div>
    );
  }

  const approvedDepts = currentReq.selectedDepartments.filter(
    (d) => currentReq.departmentStatuses[d]?.status === 'approved'
  );
  const pendingDepts = currentReq.selectedDepartments.filter(
    (d) => currentReq.departmentStatuses[d]?.status === 'pending'
  );
  const rejectedDepts = currentReq.selectedDepartments.filter(
    (d) => currentReq.departmentStatuses[d]?.status === 'rejected'
  );

  const handleResubmit = async () => {
    if (!resubmitDept) return;
    setIsSubmitting(true);
    try {
      await resubmitDepartmentClearance(
        currentReq,
        resubmitDept,
        resubmitNote || 'Dues cleared with department office. Requesting verification.'
      );
      setResubmitDept(null);
      setResubmitNote('');
    } catch (err) {
      console.error('Error re-submitting clearance:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 font-sans-ui">
      {/* Student Session Header with Logout */}
      {studentUser && (
        <div className="mb-6 px-4 py-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-bold text-sm flex items-center justify-center">
              {studentUser.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {studentUser.displayName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--status-approved-bg)] text-[var(--status-approved)] border border-[var(--status-approved-border)] font-medium">
                  Roll: {studentUser.rollNo || 'Student'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono">{studentUser.email}</p>
            </div>
          </div>
          <button
            id="student-dashboard-logout-btn"
            onClick={logoutStudent}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs font-semibold shadow-2xs transition-colors"
            title="Log out of your student account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Switcher if student has multiple applications or demo switcher */}
      {requests.length > 1 && (
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Your Applications:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {requests.slice(0, 4).map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedReqId(r.id)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    r.id === currentReq.id
                      ? 'bg-[var(--accent-primary)] text-white font-semibold'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                  }`}
                >
                  {r.id} ({r.progressPercent}%)
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenApply}
            className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Clearance Request
          </button>
        </div>
      )}

      {/* TOP SECTION: Prompt mandated header */}
      {/* "Your Clearance" */}
      {/* "3 of 4 departments approved" */}
      {/* "75% Complete" */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-1">
              <span>Application ID: {currentReq.id}</span>
              <span>•</span>
              <span>Roll: {currentReq.studentRollNo}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-[var(--text-primary)]">
              Your Clearance
            </h1>
            <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">
              {approvedDepts.length} of {currentReq.selectedDepartments.length} departments approved
            </p>
          </div>

          <div className="flex items-center gap-6 self-start md:self-auto">
            {/* Percentage Display */}
            <div className="text-right">
              <span className={`text-4xl sm:text-5xl font-editorial font-normal leading-none ${
                currentReq.progressPercent === 100
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : currentReq.overallStatus === 'rejected'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-[var(--text-primary)]'
              }`}>
                {currentReq.progressPercent}%
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] block mt-1">
                Complete
              </span>
            </div>

            {/* Certificate Quick Badge if complete */}
            {currentReq.progressPercent === 100 && currentReq.certificateId && (
              <button
                onClick={() => onViewCertificate(currentReq.certificateId!)}
                className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Award className="w-4 h-4" />
                Certificate Ready
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--bg-subtle)] h-2.5 rounded-full overflow-hidden mt-6 border border-[var(--border-color)]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              currentReq.progressPercent === 100
                ? 'bg-emerald-600'
                : currentReq.overallStatus === 'rejected'
                ? 'bg-amber-500'
                : 'bg-[var(--accent-primary)]'
            }`}
            style={{ width: `${currentReq.progressPercent}%` }}
          />
        </div>

        {/* Summary counts pill line */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {approvedDepts.length} Approved
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
            <Clock className="w-4 h-4 text-amber-600" />
            {pendingDepts.length} Pending
          </span>
          {rejectedDepts.length > 0 && (
            <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600" />
              {rejectedDepts.length} Action Required (Rejected)
            </span>
          )}
        </div>
      </div>

      {/* DEPARTMENT STATUSES LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-editorial font-medium text-[var(--text-primary)]">
          Departmental Verification Status
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {currentReq.selectedDepartments.map((deptKey) => {
            const statusObj = currentReq.departmentStatuses[deptKey];
            const meta = DEPARTMENTS.find((d) => d.key === deptKey);
            const isApproved = statusObj?.status === 'approved';
            const isPending = statusObj?.status === 'pending';
            const isRejected = statusObj?.status === 'rejected';

            return (
              <div
                key={deptKey}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isApproved
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-[var(--bg-surface)]'
                    : isRejected
                    ? 'border-red-300 dark:border-red-900/70 bg-red-50/20 dark:bg-red-950/10'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Status icon badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : isRejected
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {isApproved ? '✓' : isRejected ? '✕' : '...'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-[var(--text-primary)]">
                          {statusObj?.name || meta?.name}
                        </h3>
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          ({meta?.defaultOfficer})
                        </span>
                      </div>

                      {/* Remarks / Officer Note */}
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
                        {statusObj?.remarks || 'Awaiting departmental review.'}
                      </p>

                      {/* Rejection Specifics: Amount & Resolution Action */}
                      {isRejected && (
                        <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs">
                          {statusObj.dueAmount ? (
                            <p className="font-bold text-red-700 dark:text-red-300 mb-1">
                              Outstanding Due: ₹{statusObj.dueAmount}
                            </p>
                          ) : null}
                          <p className="text-[var(--text-secondary)]">
                            <strong>Next Action:</strong> Clear the issue with the department officer and request re-verification.
                          </p>
                        </div>
                      )}

                      {/* Officer & Timestamp footer */}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-muted)] font-mono">
                        {statusObj?.officerName && (
                          <span>Audited by: {statusObj.officerName}</span>
                        )}
                        {statusObj?.updatedAt && (
                          <span>• {new Date(statusObj.updatedAt).toLocaleString()}</span>
                        )}
                        {statusObj?.verificationId && (
                          <span className="text-[var(--accent-primary)] font-semibold">
                            • ID: {statusObj.verificationId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Action / Badge */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2">
                    <span
                      className={`text-xs font-mono font-semibold px-3 py-1 rounded-full border ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
                          : isRejected
                          ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800'
                      }`}
                    >
                      {isApproved ? 'Approved ✓' : isRejected ? 'Rejected' : 'Under Review'}
                    </span>

                    {/* If rejected: Provide Re-submit Button */}
                    {isRejected && (
                      <button
                        onClick={() => setResubmitDept(deptKey)}
                        className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Re-submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RE-SUBMIT MODAL */}
      {resubmitDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-editorial font-medium text-[var(--text-primary)]">
              Request Department Re-verification
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Confirm that you have settled any outstanding dues or returned assets for{' '}
              <strong className="text-[var(--text-primary)]">
                {DEPARTMENTS.find((d) => d.key === resubmitDept)?.name}
              </strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Resolution Note for Officer:
              </label>
              <textarea
                rows={3}
                value={resubmitNote}
                onChange={(e) => setResubmitNote(e.target.value)}
                placeholder="e.g. Cleared ₹850 fine at counter #2 (Receipt #RC-9912). Racket returned."
                className="w-full p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResubmitDept(null)}
                className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleResubmit}
                className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Send for Re-verification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
