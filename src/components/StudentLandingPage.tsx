import { useState, FormEvent } from 'react';
import { HeroWorkflowVisual } from './HeroWorkflowVisual';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Search,
  ExternalLink,
  Printer,
  Download,
  Building2,
  Check,
  RefreshCw,
  Award
} from 'lucide-react';
import { getCertificateForVerification } from '../firebase/service';
import { DigitalCertificate } from '../types';

interface StudentLandingPageProps {
  onStartClearance: () => void;
  onNavigateToTab: (tab: 'home' | 'how-it-works' | 'my-clearance' | 'certificate') => void;
}

export function StudentLandingPage({ onStartClearance, onNavigateToTab }: StudentLandingPageProps) {
  // Real-time status toggle interactive demonstration (75% -> 100%)
  const [isSportsApproved, setIsSportsApproved] = useState(false);

  // Certificate verification widget state
  const [certInput, setCertInput] = useState('CP-2026-8F29A');
  const [verifiedCert, setVerifiedCert] = useState<DigitalCertificate | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');

  const handleVerifyCert = async (e: FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;
    setVerifyStatus('loading');
    try {
      const res = await getCertificateForVerification(certInput.trim());
      if (res && res.status === 'valid') {
        setVerifiedCert(res);
        setVerifyStatus('valid');
      } else {
        setVerifiedCert(null);
        setVerifyStatus('invalid');
      }
    } catch (err) {
      setVerifyStatus('invalid');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="max-w-xl">
              <div className="inline-block px-3 py-1 bg-[#1E293B] text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                University Digital Services
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-[68px] leading-[0.95] font-light tracking-tight mb-8 text-[var(--text-primary)]">
                Your clearance. <br />
                <span className="italic font-serif serif">One digital journey.</span>
              </h1>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-10 max-w-md">
                Complete your university No-Dues process digitally. Request verification, track every approval, and receive your certificate without visiting multiple offices.
              </p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <button
                  id="hero-start-clearance-btn"
                  onClick={onStartClearance}
                  className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-page)] text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-[var(--accent-hover)] transition-colors shadow-xs flex items-center gap-2"
                >
                  Start My Clearance
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Workflow Card */}
          <div className="lg:col-span-5">
            <HeroWorkflowVisual />
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION: Why should students still chase signatures? */}
      <section className="w-full border-y border-[var(--border-color)] bg-[var(--bg-subtle)]/60 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--text-muted)]">
              The Legacy Overhead
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-[var(--text-primary)] mt-2 leading-tight">
              Why should students still chase signatures?
            </h2>
            <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
              For decades, graduating students endured hours standing outside locked department offices, carrying paper slips across distant campus blocks just to prove zero dues.
            </p>
          </div>

          {/* The Old Journey vs ClearPass Journey */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* The Old Process */}
            <div className="p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-medium text-red-600 dark:text-red-400 uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Legacy Campus Procedure
                </div>
                <h3 className="text-xl font-editorial font-normal text-[var(--text-primary)] mb-6">
                  Physical Footwork & Bottlenecks
                </h3>

                {/* Stepper showing old steps */}
                <div className="space-y-3.5 font-sans-ui text-sm">
                  {[
                    { title: 'Print Form', desc: 'Download paper clearance slip from portal' },
                    { title: 'Visit Departments', desc: 'Walk between Library, Hostels, Sports gym, and Finance wing' },
                    { title: 'Wait in Queues', desc: 'Stand in lines during restricted officer visiting hours' },
                    { title: 'Collect Signatures', desc: 'Manual ink stamps, rubber signatures, and ledger lookups' },
                    { title: 'Submit Form', desc: 'Hand over signed paper to the academic registrar for manual verification' }
                  ].map((step, idx) => (
                    <div key={step.title} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      <span className="text-xs font-mono font-bold text-[var(--text-muted)] mt-0.5">
                        0{idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-[var(--text-primary)] block line-through opacity-75">
                          {step.title}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">{step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                Average time lost: <span className="font-medium text-[var(--text-primary)]">4 to 7 campus working days</span>
              </div>
            </div>

            {/* ClearPass Transformation */}
            <div className="p-8 rounded-2xl border border-[var(--accent-primary)]/40 bg-[var(--accent-light)]/20 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider mb-6">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ClearPass Transformation
                </div>
                <h3 className="text-2xl sm:text-3xl font-editorial font-normal text-[var(--text-primary)] mb-3 leading-snug">
                  ClearPass changes the journey.
                </h3>
                <p className="text-base font-medium text-[var(--accent-primary)] mb-8">
                  One request. Every department. One digital certificate.
                </p>

                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                    <span className="text-xs font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider block mb-1">
                      Single Digital Submission
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      Enter your university roll number once. The system routes digital clearance tickets to Library, Hostel, Sports, and Accounts concurrently.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                    <span className="text-xs font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider block mb-1">
                      Asynchronous Departmental Verification
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      Officers audit their accession registers, room inventories, and fee ledgers on their authenticated portal without requiring student presence.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                    <span className="text-xs font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider block mb-1">
                      Instant Tamper-Proof Credential
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      The second the final department authorizes clearance, the official digitally signed No-Dues Certificate is immediately issued and downloadable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Zero physical visits required.</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 100% Paperless
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS: Four steps. One clearance. */}
      <section id="how-it-works-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--accent-primary)]">
            Streamlined Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-[var(--text-primary)] mt-2 leading-tight">
            Four steps. One clearance.
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed">
            A linear, accountable digital pathway from initial application to registrar certification.
          </p>
        </div>

        {/* Rich Editorial Layout for 4 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Request',
              tag: 'Application',
              desc: 'Submit one No-Dues request with your roll number and academic credentials. Select which departments are required.',
              highlight: 'Single submission triggers all workflows'
            },
            {
              step: '02',
              title: 'Verify',
              tag: 'Departmental Action',
              desc: 'Departments digitally verify the student’s clearance status against their official institutional ledgers and inventories.',
              highlight: 'Authorized officers audit records'
            },
            {
              step: '03',
              title: 'Track',
              tag: 'Real-time Visibility',
              desc: 'Student sees every department’s status in real time. Know instantly if a department has approved, is reviewing, or needs action.',
              highlight: 'Full transparency on every sign-off'
            },
            {
              step: '04',
              title: 'Certify',
              tag: 'Official Credential',
              desc: 'Once all departments approve, the digital certificate becomes available with verification ID, university crest, and cryptographic seal.',
              highlight: 'Downloadable PDF & public verification'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col justify-between hover:border-[var(--accent-primary)] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-editorial font-medium text-[var(--accent-primary)]">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-editorial font-medium text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] font-mono">
                → {item.highlight}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. & 5. STUDENT EXPERIENCE & REAL-TIME STATUS PREVIEW */}
      <section className="w-full border-t border-[var(--border-color)] bg-[var(--bg-subtle)]/40 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5">
              <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--accent-primary)]">
                Student Experience
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-[var(--text-primary)] mt-2 leading-tight">
                Everything you need. <br />In one place.
              </h2>
              <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
                No guessing whether your forms reached the officer’s desk. ClearPass gives students an executive view of their verification progress, pending items, officer stamps, and instant next actions.
              </p>

              {/* Real-time status interactive demonstration */}
              <div className="mt-8 p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase font-semibold text-[var(--text-primary)]">
                    Interactive Live Simulation
                  </span>
                  <span className="text-xs font-mono text-[var(--accent-primary)]">Try It</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
                  Toggle to see how Sports clearance updates in real time when Coach Vance approves locker check-in:
                </p>

                <button
                  id="simulate-status-toggle-btn"
                  onClick={() => setIsSportsApproved(!isSportsApproved)}
                  className="w-full py-2.5 px-4 rounded-lg border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-light)] font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSportsApproved ? 'rotate-180' : ''} transition-transform duration-300`} />
                  {isSportsApproved 
                    ? 'Reset Simulation (Revert Sports to Under Review)' 
                    : 'Simulate Approval: Sports "Under Review" → "Approved ✓"'}
                </button>
              </div>

              <div className="mt-6 flex items-center gap-4 text-xs text-[var(--text-muted)] font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Live Firestore Listeners
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Instant Push Updates
                </span>
              </div>
            </div>

            {/* Right: Polished Dashboard Preview Card */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-md p-6 sm:p-8">
                {/* Header info */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-color)] pb-6 mb-6">
                  <div>
                    <span className="text-xs font-mono text-[var(--text-muted)] block">Clearance Request</span>
                    <h3 className="text-xl font-bold font-sans-ui text-[var(--text-primary)] flex items-center gap-2 mt-0.5">
                      REQ-2026-4821
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                        CS2022-048
                      </span>
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Rahul Sharma • B.Tech Computer Science & Engineering
                    </p>
                  </div>

                  {/* Progress Gauge */}
                  <div className="text-right">
                    <span className="text-xs font-mono text-[var(--text-muted)] block uppercase">Overall Progress</span>
                    <span className={`text-2xl font-bold font-mono transition-colors duration-300 ${
                      isSportsApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-primary)]'
                    }`}>
                      {isSportsApproved ? '100% Complete' : '75% Complete'}
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)] block">
                      {isSportsApproved ? '4 of 4 approved' : '3 of 4 approved'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[var(--bg-subtle)] h-2 rounded-full overflow-hidden mb-6 border border-[var(--border-color)]">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isSportsApproved ? 'bg-emerald-600 w-full' : 'bg-[var(--accent-primary)] w-3/4'
                    }`}
                  />
                </div>

                {/* Department Statuses List */}
                <div className="space-y-3 font-sans-ui text-sm">
                  {/* Library */}
                  <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">Central University Library</p>
                        <p className="text-[11px] text-[var(--text-secondary)]">Dr. Aris Thorne • Accession ledger verified</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                      Approved ✓
                    </span>
                  </div>

                  {/* Hostel */}
                  <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">Hostel Affairs & Residence</p>
                        <p className="text-[11px] text-[var(--text-secondary)]">Prof. Sarah Jenkins • Mandakini B-304 keys returned</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                      Approved ✓
                    </span>
                  </div>

                  {/* Sports (Interactive toggle) */}
                  <div className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    isSportsApproved
                      ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20'
                      : 'border-amber-300 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                        isSportsApproved
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                      }`}>
                        {isSportsApproved ? '✓' : '...'}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">Sports Board & Gymnasium</p>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          {isSportsApproved
                            ? 'Coach Marcus Vance • Locker verified & signed off'
                            : 'Coach Marcus Vance • Awaiting locker #42 return verification'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded border transition-colors ${
                      isSportsApproved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800'
                    }`}>
                      {isSportsApproved ? 'Approved ✓' : 'Under Review'}
                    </span>
                  </div>

                  {/* Accounts */}
                  <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">Finance & Student Accounts</p>
                        <p className="text-[11px] text-[var(--text-secondary)]">Mrs. Elena Rostova • Caution deposit reconciled</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                      Approved ✓
                    </span>
                  </div>
                </div>

                {/* Footer status notice */}
                <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
                  <span>
                    Next Action:{' '}
                    <strong className="text-[var(--text-primary)]">
                      {isSportsApproved ? 'Download official No-Dues Certificate' : 'Wait for Sports Board director clearance'}
                    </strong>
                  </span>
                  <button
                    onClick={() => onNavigateToTab('my-clearance')}
                    className="text-[var(--accent-primary)] font-medium hover:underline self-start sm:self-auto"
                  >
                    Open Full Student Dashboard →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DIGITAL VERIFICATION: Every approval has a record */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--accent-primary)]">
            Accountability & Audit
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-[var(--text-primary)] mt-2 leading-tight">
            Every approval has a record.
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed">
            Every departmental sign-off is stamped with officer credentials, unique verification hash, and exact timestamp to prevent fraud and administrative discrepancies.
          </p>
        </div>

        {/* Audit Record Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              department: 'Central Library',
              officer: 'Dr. Aris Thorne (Chief Librarian)',
              timestamp: 'Sep 02, 2026 • 10:15 AM',
              verId: 'LIB-VER-9041A',
              status: 'Approved',
              note: '8 volumes accessioned'
            },
            {
              department: 'Hostel Affairs',
              officer: 'Prof. Sarah Jenkins (Chief Warden)',
              timestamp: 'Sep 03, 2026 • 02:30 PM',
              verId: 'HST-VER-8823B',
              status: 'Approved',
              note: 'Room B-304 inventory intact'
            },
            {
              department: 'Sports Board',
              officer: 'Coach Marcus Vance (Director)',
              timestamp: 'Sep 04, 2026 • 09:00 AM',
              verId: 'SPT-VER-7711C',
              status: 'Under Review',
              note: 'Locker #42 inspection log'
            },
            {
              department: 'Student Accounts',
              officer: 'Mrs. Elena Rostova (Finance Officer)',
              timestamp: 'Sep 04, 2026 • 04:45 PM',
              verId: 'ACC-VER-6602D',
              status: 'Approved',
              note: 'Zero balance reconciled'
            }
          ].map((rec) => (
            <div
              key={rec.verId}
              className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--text-primary)]">{rec.department}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  rec.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800'
                }`}>
                  {rec.status}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">{rec.officer}</p>
              <p className="text-[11px] text-[var(--text-muted)] font-mono mb-3">{rec.timestamp}</p>
              <div className="pt-2.5 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[var(--text-muted)]">Verification ID:</span>
                <span className="text-[var(--accent-primary)] font-bold">{rec.verId}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. REJECTION & RE-VERIFICATION WORKFLOW */}
      <section className="w-full border-y border-[var(--border-color)] bg-[var(--bg-subtle)]/60 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-mono font-medium tracking-wider uppercase text-red-600 dark:text-red-400">
                Transparent Resolution
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-[var(--text-primary)] mt-2 leading-tight">
                Rejection does not end the process.
              </h2>
              <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
                If a department discovers outstanding library books, unreturned sports kit, or unpaid hostel dues, they state the exact reason with fee details. Students can resolve it immediately and request re-verification online.
              </p>

              {/* 4-step workflow pill line */}
              <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 font-semibold">
                  Reject
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)]">
                  Resolve
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)]">
                  Re-submit
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 font-semibold">
                  Verify
                </span>
              </div>
            </div>

            {/* Visual Example Card */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-2xl border border-red-200 dark:border-red-900/60 bg-[var(--bg-surface)] shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center font-bold text-xs">
                      ✕
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)]">Sports Clearance — Rejected</h4>
                      <p className="text-xs text-[var(--text-muted)]">REQ-2026-5509 • Vikram Patel (ME2022-072)</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400">
                    Action Required
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="p-3.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                    <span className="text-xs font-mono font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider block mb-1">
                      Department Rejection Reason:
                    </span>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      Outstanding equipment fee — ₹850
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Tournament badminton racket checked out on April 12 not returned to sports desk.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                    <span className="text-xs font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider block mb-1">
                      Next Action:
                    </span>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Clear the issue with Coach Marcus Vance at the sports complex or pay dues, then submit receipt confirmation to request verification again.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--text-muted)]">Workflow: Reject → Resolve → Re-submit → Verify</span>
                  <button
                    onClick={() => onNavigateToTab('my-clearance')}
                    className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors"
                  >
                    View in Student Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DIGITAL CERTIFICATE: All clear. Certificate ready. */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--accent-primary)]">
            Institutional Finality
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-[var(--text-primary)] mt-2 leading-tight">
            All clear. Certificate ready.
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed">
            When all required departments verify clearance, ClearPass immediately issues an official university digital No-Dues Certificate ready for graduation and transcript release.
          </p>
        </div>

        {/* Realistic Formal Certificate Preview */}
        <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] shadow-lg relative overflow-hidden">
          {/* Subtle watermark crest */}
          <div className="absolute right-6 -bottom-8 opacity-5 text-gray-900 pointer-events-none">
            <Award className="w-72 h-72" />
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-8 border-b-2 border-[var(--border-color)] relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--accent-primary)] text-white text-xl font-bold font-editorial mb-4 shadow-sm">
              CP
            </div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1">
              National University of Science & Technology
            </h3>
            <h4 className="text-2xl sm:text-3xl font-editorial font-normal text-[var(--text-primary)] tracking-wide">
              Official Digital No-Dues Certificate
            </h4>
            <p className="text-xs font-mono text-[var(--accent-primary)] mt-2">
              Certificate ID: <strong className="font-bold">CP-2026-8F29A</strong>
            </p>
          </div>

          {/* Certificate Body */}
          <div className="py-8 space-y-6 text-center sm:text-left relative z-10 font-sans-ui">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-center max-w-xl mx-auto">
              This is to formally certify that all departmental records, library accessions, hostel inventories, athletic assets, and tuition accounts for the following candidate have been verified and reconciled with <strong className="text-[var(--text-primary)]">ZERO OUTSTANDING DUES</strong>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-left">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Student Name</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">Ananya Iyer</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Student ID / Roll</span>
                <span className="text-sm font-bold font-mono text-[var(--text-primary)]">EC2022-114</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Program</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">B.Tech ECE</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Academic Year</span>
                <span className="text-xs font-mono font-medium text-[var(--text-primary)]">2022 — 2026</span>
              </div>
            </div>

            {/* Department Approvals Grid */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] block mb-3 text-center sm:text-left">
                Departmental Clearances Signed:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                {[
                  { name: 'Library', ver: 'LIB-VER-3312', by: 'Dr. A. Thorne' },
                  { name: 'Hostel', ver: 'HST-VER-4401', by: 'Prof. S. Jenkins' },
                  { name: 'Sports', ver: 'SPT-VER-5590', by: 'Coach M. Vance' },
                  { name: 'Accounts', ver: 'ACC-VER-6681', by: 'Mrs. E. Rostova' }
                ].map(dept => (
                  <div key={dept.name} className="p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs">
                    <span className="font-semibold text-[var(--text-primary)] block flex items-center justify-between">
                      {dept.name} <Check className="w-3 h-3 text-emerald-600" />
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] block">{dept.by}</span>
                    <span className="text-[10px] font-mono text-[var(--accent-primary)] mt-1 block">{dept.ver}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="pt-6 border-t-2 border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)] relative z-10">
            <div>
              Issued: <strong className="text-[var(--text-primary)]">August 31, 2026</strong> • Digital Clearance Office
            </div>
            <div className="flex items-center gap-3">
              <button
                id="view-sample-cert-btn"
                onClick={() => onNavigateToTab('certificate')}
                className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] font-medium flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Certificate
              </button>
              <button
                id="download-sample-cert-btn"
                onClick={() => onNavigateToTab('certificate')}
                className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CERTIFICATE VERIFICATION: Verify it anywhere. */}
      <section className="w-full border-y border-[var(--border-color)] bg-[var(--bg-subtle)]/60 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--accent-primary)]">
            Tamper-Proof Credential Check
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-[var(--text-primary)] mt-2 leading-tight">
            Verify it anywhere.
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            Employers, graduate universities, and academic departments can verify the authenticity of any ClearPass certificate in seconds using the certificate code.
          </p>

          {/* Search bar */}
          <form onSubmit={handleVerifyCert} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full">
              <input
                id="cert-verify-input"
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="Enter Certificate ID (e.g. CP-2026-8F29A)"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button
              id="cert-verify-submit-btn"
              type="submit"
              disabled={verifyStatus === 'loading'}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap"
            >
              {verifyStatus === 'loading' ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="mt-3 text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
            <span>Sample valid code:</span>
            <button
              type="button"
              onClick={() => { setCertInput('CP-2026-8F29A'); }}
              className="font-mono text-[var(--accent-primary)] underline hover:no-underline"
            >
              CP-2026-8F29A
            </button>
          </div>

          {/* Verification Result Card */}
          {verifyStatus === 'valid' && verifiedCert && (
            <div className="mt-8 p-6 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-left max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-900 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                    ✓ Certificate Valid
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {verifiedCert.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-[var(--text-secondary)] font-sans-ui">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Candidate</span>
                  <strong className="text-[var(--text-primary)]">{verifiedCert.studentName}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Roll Number</span>
                  <span className="font-mono text-[var(--text-primary)]">{verifiedCert.studentRollNo}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Program</span>
                  <span className="text-[var(--text-primary)]">{verifiedCert.program}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Issue Date</span>
                  <span className="font-mono text-[var(--text-primary)]">{new Date(verifiedCert.issuedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                <span>All 4 departments digitally verified.</span>
                <span className="font-mono">Status: Active & Authorized</span>
              </div>
            </div>
          )}

          {verifyStatus === 'invalid' && (
            <div className="mt-8 p-5 rounded-2xl border border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 text-left max-w-xl mx-auto">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm font-semibold">
                <AlertCircle className="w-5 h-5" />
                Certificate Not Found or Unverified
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                No active certificate matching "{certInput}" exists in the university clearance ledger. Please double check the ID.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 10. FINAL CTA: Your clearance starts here. */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 bg-[#1E293B] text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Get Started
          </div>
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-4">
            Your clearance starts here.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
            One request. Multiple departments. Zero paperwork.
          </p>
          <div>
            <button
              id="cta-start-clearance-btn"
              onClick={onStartClearance}
              className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-page)] text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-[var(--accent-hover)] transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              Start My Clearance
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
