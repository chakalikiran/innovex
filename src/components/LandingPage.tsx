import { useState, FormEvent } from 'react';
import { HeroWorkflowVisual } from './HeroWorkflowVisual';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Search,
  ExternalLink,
  Download,
  Building2,
  Check,
  RefreshCw,
  Award,
  Layers,
  ChevronDown,
  UserCheck,
  HelpCircle,
  GraduationCap,
  FileText,
  BadgeCheck,
  Lock
} from 'lucide-react';
import { getCertificateForVerification } from '../firebase/service';
import { DigitalCertificate, DepartmentKey } from '../types';
import rkvalleyCampusImg from '../assets/images/rkvalley_central_library_front_1788682553686.jpg';

interface LandingPageProps {
  onStartClearance: () => void;
  onNavigateToTab: (tab: 'landing' | 'home' | 'how-it-works' | 'my-clearance' | 'certificate') => void;
  onOpenSignIn?: () => void;
  onOpenAuthority?: (dept?: DepartmentKey) => void;
}

export function LandingPage({
  onStartClearance,
  onNavigateToTab,
  onOpenSignIn,
  onOpenAuthority
}: LandingPageProps) {
  // Real-time status simulation toggle (75% -> 100%)
  const [isSportsApproved, setIsSportsApproved] = useState(false);

  // Certificate verification widget state
  const [certInput, setCertInput] = useState('CP-2026-8F29A');
  const [verifiedCert, setVerifiedCert] = useState<DigitalCertificate | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');

  // FAQ open/close accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

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
    } catch {
      setVerifyStatus('invalid');
    }
  };

  const faqs = [
    {
      q: 'How does the digital clearance process work for students?',
      a: 'Students submit a single No-Dues request with their university roll number. ClearPass automatically routes concurrent clearance requests to the Central Library, Hostel Warden, Sports Director, and Accounts Officer. Each department audits records asynchronously; once all sign off, your digital certificate is instantly issued.'
    },
    {
      q: 'What happens if a department rejects my clearance?',
      a: 'Rejection is not final. If an officer finds outstanding dues (such as an overdue library book, unreturned sports kit, or hostel fee balance), they state the exact reason with fee details. Once you resolve the pending item, you can re-submit the verification request with a single click in your student dashboard.'
    },
    {
      q: 'How can employers or external universities verify my certificate?',
      a: 'Every ClearPass digital certificate carries a unique cryptographic certificate code (e.g. CP-2026-8F29A) and an embedded QR verification seal. Anyone can input the code on our Public Certificate Verification portal to verify authenticity and view official department approvals in real time.'
    },
    {
      q: 'Do I need to visit campus offices or collect physical stamps?',
      a: 'Zero campus visits or physical stamps are required. ClearPass operates 100% digitally. Department officers review ledgers directly from their authenticated portal, eliminating lines, lost paperwork, and administrative delays.'
    },
    {
      q: 'Can department officers reject or request additional proofs?',
      a: 'Yes, authorized officers have full administrative controls to either approve with remarks, request additional information, or reject with a specified fine amount or return instruction. All actions are immutably logged in the system audit trail.'
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 0. ANNOUNCEMENT / UTILITY BAR */}
      <div className="w-full bg-[var(--text-primary)] text-[var(--bg-page)] py-2.5 px-4 text-center text-xs font-mono font-medium tracking-wide flex items-center justify-center gap-2 border-b border-[var(--border-color)]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>Official University Clearance Portal • 2026 Graduating Cohort Digital No-Dues Now Active</span>
      </div>

      {/* 1. HERO SECTION (Aligned with Reference Structure) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-12 sm:pb-16">
        <div className="w-full rounded-[2.25rem] sm:rounded-[3rem] bg-[#43484D] text-white p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-xl">
          {/* Subtle Campus Photograph Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            <img
              src={rkvalleyCampusImg}
              alt="RGUKT RK Valley Central Library Campus"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-20 mix-blend-luminosity scale-105 filter blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2F3438]/95 via-[#34393E]/90 to-[#2A2E32]/85" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.2em] text-slate-300 uppercase">
                    RGUKT RK VALLEY • NO-DUES PLATFORM
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-emerald-300 border border-emerald-400/20">
                    Active
                  </span>
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-sans font-bold leading-[1.04] tracking-tight text-white mb-6">
                  One digital<br />
                  clearance for<br />
                  every student<br />
                  milestone.
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg mb-8 font-normal">
                  ClearPass digitizes the traditional campus clearance process so students can request verification, monitor department approvals, and access a digital no-dues certificate without standing in multiple office queues.
                </p>

                <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                  <button
                    id="hero-start-clearance-btn"
                    onClick={onStartClearance}
                    className="px-8 py-3.5 rounded-full bg-white text-slate-900 font-bold text-sm sm:text-base shadow-md hover:bg-slate-100 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Start My Clearance</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Workflow Live Interactive Card */}
            <div className="lg:col-span-5">
              <HeroWorkflowVisual />
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 CAMPUS CENTRAL CLEARANCE LANDMARK */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-4">
        <div className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image Column */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-sm group">
              <img
                src={rkvalleyCampusImg}
                alt="RGUKT RK Valley Central Library Campus"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-400/20 inline-block mb-1.5">
                    Central Verification Hub
                  </span>
                  <h4 className="text-white font-bold text-lg sm:text-xl leading-tight">
                    RGUKT RK Valley — Central Library
                  </h4>
                  <p className="text-slate-200 text-xs font-mono mt-0.5">
                    Academic Complex & Clearance Operations
                  </p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--accent-primary)] text-[11px] font-mono font-bold uppercase tracking-widest mb-4 w-fit">
                <Building2 className="w-3.5 h-3.5" />
                Official Campus Infrastructure
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
                Unified Campus No-Dues Operations
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                From the iconic Central Library to the Residence Halls and Athletic Board, ClearPass connects student records with verified campus authorities across the RGUKT RK Valley campus.
              </p>

              {/* Department Highlights */}
              <div className="grid grid-cols-2 gap-4 border-t border-[var(--border-color)] pt-5 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Central Library
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    Accession Catalog Audit
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Residence Directorate
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Hostel & Mess Clearance
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Physical Education
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Sports Kit & Locker Return
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                    Finance Section
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    Caution Deposit Reconciled
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onStartClearance}
                  className="px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xs"
                >
                  <span>Start Student Clearance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PORTAL HUBS / DIRECT PATHWAYS */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
        <div className="max-w-2xl mb-12">
          <div className="inline-block px-3 py-1 bg-[#1E293B] text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Direct Access Gateways
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-primary)]">
            Tailored portals for students, faculty, and verifiers.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Hub */}
          <div className="p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col justify-between hover:border-[var(--text-primary)] transition-all">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[var(--text-primary)] text-[var(--bg-page)] flex items-center justify-center font-bold mb-6">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                For Students
              </span>
              <h3 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] mb-3">
                Student Clearance
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                Submit your single No-Dues request, monitor departmental approvals, resolve pending dues directly, and download your signed certificate.
              </p>
            </div>
            <div className="pt-6 border-t border-[var(--border-color)] flex items-center gap-3">
              <button
                id="portal-apply-btn"
                onClick={onStartClearance}
                className="px-4 py-2.5 bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--accent-hover)] transition-colors"
              >
                Apply Now
              </button>
              <button
                id="portal-track-btn"
                onClick={() => onNavigateToTab('my-clearance')}
                className="px-4 py-2.5 border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--bg-subtle)] transition-colors"
              >
                My Clearance
              </button>
            </div>
          </div>

          {/* Verification Hub */}
          <div className="p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col justify-between hover:border-[var(--text-primary)] transition-all">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-light)] text-[var(--accent-primary)] flex items-center justify-center font-bold mb-6">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                For Employers & Universities
              </span>
              <h3 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] mb-3">
                Verify Certificate
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                Instantly validate student No-Dues credentials using the certificate ID or QR verification string. Real-time institutional verification.
              </p>
            </div>
            <div className="pt-6 border-t border-[var(--border-color)]">
              <button
                id="portal-verify-btn"
                onClick={() => {
                  const el = document.getElementById('verification-widget-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 border border-[var(--text-primary)] text-[var(--text-primary)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--bg-subtle)] transition-colors inline-flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Quick Verification
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE PROBLEM VS TRANSFORMATION */}
      <section className="w-full border-y border-[var(--border-color)] bg-[var(--bg-subtle)]/60 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--text-muted)]">
              The Legacy Overhead
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-primary)] mt-2 leading-tight">
              Why should students still chase signatures?
            </h2>
            <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
              For decades, graduating students endured hours standing outside locked department offices, carrying paper slips across distant campus blocks just to prove zero dues.
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Old Journey */}
            <div className="p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-medium text-red-600 dark:text-red-400 uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Legacy Campus Procedure
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] mb-6">
                  Physical Footwork & Bottlenecks
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  {[
                    { title: 'Print Form', desc: 'Download paper clearance slip from portal' },
                    { title: 'Visit Departments', desc: 'Walk between Library, Hostels, Sports gym, and Finance wing' },
                    { title: 'Wait in Queues', desc: 'Stand in lines during restricted officer visiting hours' },
                    { title: 'Collect Signatures', desc: 'Manual ink stamps, rubber signatures, and ledger lookups' },
                    { title: 'Submit Form', desc: 'Hand over signed paper to the academic registrar for manual verification' }
                  ].map((step, idx) => (
                    <div key={step.title} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      <span className="font-bold text-[var(--text-muted)] mt-0.5">
                        0{idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-[var(--text-primary)] block line-through opacity-70">
                          {step.title}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">{step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] font-mono">
                Average time lost: <span className="font-bold text-[var(--text-primary)]">4 to 7 campus working days</span>
              </div>
            </div>

            {/* ClearPass Transformation */}
            <div className="p-8 rounded-2xl border border-[var(--text-primary)] bg-[var(--bg-surface)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-6">
                  <CheckCircle2 className="w-4 h-4" />
                  ClearPass Transformation
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] mb-3">
                  Single Submission. Concurrent Audits.
                </h3>
                <p className="text-sm font-medium text-[var(--accent-primary)] mb-6">
                  One request. Every department. One digital certificate.
                </p>

                <div className="space-y-4 text-xs font-sans">
                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/50">
                    <span className="text-[11px] font-mono font-semibold uppercase text-[var(--accent-primary)] block mb-1">
                      Concurrent Routing
                    </span>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      Enter your university roll number once. ClearPass automatically fans out clearance tickets to Library, Hostel, Sports, and Accounts concurrently.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/50">
                    <span className="text-[11px] font-mono font-semibold uppercase text-[var(--accent-primary)] block mb-1">
                      Asynchronous Departmental Verification
                    </span>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      Officers audit their accession registers, room inventories, and fee ledgers on their authenticated portal without requiring student presence.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/50">
                    <span className="text-[11px] font-mono font-semibold uppercase text-[var(--accent-primary)] block mb-1">
                      Instant Tamper-Proof Credential
                    </span>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      The second the final department authorizes clearance, the official digitally signed No-Dues Certificate is immediately issued and downloadable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">Zero physical visits required.</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 100% Paperless
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS: 4 Steps */}
      <section id="how-it-works-section" className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28">
        <div className="max-w-2xl mb-16">
          <div className="inline-block px-3 py-1 bg-[#1E293B] text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Streamlined Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-primary)]">
            Four steps. One clearance.
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed">
            A linear, accountable digital pathway from initial application to registrar certification.
          </p>
        </div>

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
              className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col justify-between hover:border-[var(--text-primary)] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-mono font-bold text-[var(--text-primary)]">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-[var(--text-primary)] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)] font-mono">
                → {item.highlight}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SYNCHRONIZED DEPARTMENTS DIRECTORY */}
      <section className="w-full border-y border-[var(--border-color)] bg-[var(--bg-subtle)]/60 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--text-muted)]">
              Integrated Campus Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-primary)] mt-2 leading-tight">
              Synchronized with core departments.
            </h2>
            <p className="mt-2 text-base text-[var(--text-secondary)]">
              Each administrative wing has direct integration for instantaneous verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <div className="text-xs font-mono font-bold uppercase text-[var(--accent-primary)] mb-2">
                01 • Library
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)] uppercase mb-2">Central Library</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Accession register audits, overdue book check-in verification, journal return logs, and library fine reconciliation.
              </p>
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                Lead: Dr. Aris Thorne (Chief Librarian)
              </span>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <div className="text-xs font-mono font-bold uppercase text-[var(--accent-primary)] mb-2">
                02 • Residence
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)] uppercase mb-2">Hostel Affairs</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Room inventory inspection, furniture verification, hostel key surrender, mess dues balance, and damage assessment.
              </p>
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                Lead: Prof. Sarah Jenkins (Chief Warden)
              </span>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <div className="text-xs font-mono font-bold uppercase text-[var(--accent-primary)] mb-2">
                03 • Athletics
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)] uppercase mb-2">Sports Board</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Gym locker clearance, university kit and equipment returns, tournament fee settlements, and coach authorization.
              </p>
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                Lead: Coach Marcus Vance (Director)
              </span>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <div className="text-xs font-mono font-bold uppercase text-[var(--accent-primary)] mb-2">
                04 • Finance
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)] uppercase mb-2">Student Accounts</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Tuition fee ledger reconciliation, scholarship balances, caution deposit returns, and institutional ledger audit.
              </p>
              <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                Lead: Mrs. Elena Rostova (Finance Officer)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIVE INTERACTIVE STATUS SIMULATION */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--accent-primary)]">
              Student Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-primary)] mt-2 leading-tight">
              Everything you need. <br />In one place.
            </h2>
            <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
              No guessing whether your forms reached the officer’s desk. ClearPass gives students an executive view of their verification progress, pending items, officer stamps, and instant next actions.
            </p>

            {/* Interactive Simulation Trigger */}
            <div className="mt-8 p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase font-bold text-[var(--text-primary)]">
                  Interactive Live Demo
                </span>
                <span className="text-xs font-mono text-[var(--accent-primary)]">Click to test</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
                Toggle to see how Sports clearance updates in real time when Coach Marcus Vance approves locker check-in:
              </p>

              <button
                id="simulate-status-toggle-btn"
                onClick={() => setIsSportsApproved(!isSportsApproved)}
                className="w-full py-2.5 px-4 rounded-lg border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSportsApproved ? 'rotate-180 text-emerald-600' : 'text-amber-500'} transition-transform duration-300`} />
                {isSportsApproved 
                  ? 'Reset Simulation (Revert Sports to Under Review)' 
                  : 'Simulate Approval: Sports "Under Review" → "Approved ✓"'}
              </button>
            </div>
          </div>

          {/* Interactive Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-md p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-color)] pb-6 mb-6">
                <div>
                  <span className="text-xs font-mono text-[var(--text-muted)] block">Clearance Request</span>
                  <h3 className="text-xl font-bold font-mono text-[var(--text-primary)] flex items-center gap-2 mt-0.5">
                    REQ-2026-4821
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                      CS2022-048
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Rahul Sharma • B.Tech Computer Science & Engineering
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-[var(--text-muted)] block uppercase">Overall Progress</span>
                  <span className={`text-2xl font-light font-mono transition-colors duration-300 ${
                    isSportsApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-primary)]'
                  }`}>
                    {isSportsApproved ? '100% Complete' : '75% Complete'}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)] block font-mono">
                    {isSportsApproved ? '4 of 4 approved' : '3 of 4 approved'}
                  </span>
                </div>
              </div>

              <div className="w-full bg-[var(--bg-subtle)] h-2 rounded-full overflow-hidden mb-6 border border-[var(--border-color)]">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isSportsApproved ? 'bg-emerald-600 w-full' : 'bg-[var(--text-primary)] w-3/4'
                  }`}
                />
              </div>

              {/* Status Rows */}
              <div className="space-y-3 font-sans text-xs">
                <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/40 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">Central University Library</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">Dr. Aris Thorne • Accession ledger verified</p>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400">
                    Approved ✓
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/40 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">Hostel Affairs & Residence</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">Prof. Sarah Jenkins • Mandakini B-304 keys returned</p>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400">
                    Approved ✓
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                  isSportsApproved
                    ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20'
                    : 'border-amber-300 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/20'
                }`}>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">Sports Board & Gymnasium</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      {isSportsApproved
                        ? 'Coach Marcus Vance • Locker verified & signed off'
                        : 'Coach Marcus Vance • Awaiting locker #42 return verification'}
                    </p>
                  </div>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    isSportsApproved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400'
                  }`}>
                    {isSportsApproved ? 'Approved ✓' : 'Under Review'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)]/40 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">Finance & Student Accounts</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">Mrs. Elena Rostova • Caution deposit reconciled</p>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400">
                    Approved ✓
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--text-muted)] font-mono">
                <span>
                  Next Action:{' '}
                  <strong className="text-[var(--text-primary)]">
                    {isSportsApproved ? 'Download official No-Dues Certificate' : 'Wait for Sports Board director clearance'}
                  </strong>
                </span>
                <button
                  onClick={() => onNavigateToTab('my-clearance')}
                  className="text-[var(--accent-primary)] font-semibold hover:underline self-start sm:self-auto"
                >
                  Open Full Dashboard →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CERTIFICATE VERIFICATION WIDGET */}
      <section id="verification-widget-section" className="w-full border-y border-[var(--border-color)] bg-[var(--bg-subtle)]/60 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--accent-primary)]">
            Tamper-Proof Credential Check
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-primary)] mt-2 leading-tight">
            Verify any certificate in seconds.
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            Employers, graduate universities, and academic departments can verify the authenticity of any ClearPass certificate using the credential ID.
          </p>

          <form onSubmit={handleVerifyCert} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full">
              <input
                id="cert-verify-input"
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="Enter Certificate ID (e.g. CP-2026-8F29A)"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)]"
              />
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button
              id="cert-verify-submit-btn"
              type="submit"
              disabled={verifyStatus === 'loading'}
              className="w-full sm:w-auto px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-page)] text-xs uppercase tracking-widest font-semibold hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap"
            >
              {verifyStatus === 'loading' ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>

          <div className="mt-3 text-xs text-[var(--text-muted)] flex items-center justify-center gap-2 font-mono">
            <span>Sample valid code:</span>
            <button
              type="button"
              onClick={() => { setCertInput('CP-2026-8F29A'); }}
              className="text-[var(--accent-primary)] underline hover:no-underline font-bold"
            >
              CP-2026-8F29A
            </button>
          </div>

          {verifyStatus === 'valid' && verifiedCert && (
            <div className="mt-8 p-6 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-left max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-900 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-800 dark:text-emerald-300 font-mono">
                    ✓ Certificate Valid
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {verifiedCert.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-[var(--text-secondary)] font-mono">
                <div>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block">Candidate</span>
                  <strong className="text-[var(--text-primary)] font-sans">{verifiedCert.studentName}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block">Roll Number</span>
                  <span className="text-[var(--text-primary)]">{verifiedCert.studentRollNo}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block">Program</span>
                  <span className="text-[var(--text-primary)] font-sans">{verifiedCert.program}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] block">Issue Date</span>
                  <span className="text-[var(--text-primary)]">{new Date(verifiedCert.issuedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center justify-between font-mono">
                <span>All 4 departments digitally verified.</span>
                <span>Status: Active & Authorized</span>
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
                No active certificate matching "{certInput}" exists in the university clearance ledger.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="w-full max-w-5xl mx-auto px-6 sm:px-12 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block px-3 py-1 bg-[#1E293B] text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Answers & Clarity
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-primary)]">
            Frequently asked questions.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)]/60 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 text-center border-t border-[var(--border-color)]">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 bg-[#1E293B] text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Get Started Today
          </div>
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-4">
            Your clearance starts here.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
            One digital request. 4 synchronized departments. Zero paperwork.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              id="cta-start-clearance-btn"
              onClick={onStartClearance}
              className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-page)] text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-[var(--accent-hover)] transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              Start My Clearance
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="cta-view-clearance-btn"
              onClick={() => onNavigateToTab('my-clearance')}
              className="px-8 py-4 border border-[var(--text-primary)] text-[var(--text-primary)] text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-[var(--bg-subtle)] transition-colors"
            >
              Check My Status
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
