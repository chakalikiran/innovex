import { ArrowRight, BookOpen, Home, Trophy, DollarSign, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface HowItWorksViewProps {
  onStartClearance: () => void;
}

export function HowItWorksView({ onStartClearance }: HowItWorksViewProps) {
  const faqs = [
    {
      q: 'How long does departmental verification usually take?',
      a: 'Most departments process clearance within 24 to 48 hours of your digital submission. Officers audit their respective ledgers asynchronously without needing you to wait outside offices.'
    },
    {
      q: 'What happens if a department rejects my clearance?',
      a: 'Rejection does not restart the entire process. The rejecting department specifies the exact outstanding item (such as an overdue book or equipment fee). Once you settle the item, click "Re-submit" in My Clearance to request immediate re-verification.'
    },
    {
      q: 'Is the ClearPass digital certificate official and accepted by the Registrar?',
      a: 'Yes. ClearPass is the official institutional system. The generated digital No-Dues certificate contains a verifiable ID, registrar signature, and cryptographic hash recognized for degree conferral, transcript dispatch, and caution deposit release.'
    },
    {
      q: 'Can outside agencies or employers verify my certificate?',
      a: 'Yes. Anyone possessing your Certificate ID can enter it into the public verification lookup tool on ClearPass to authenticate validity in real time.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 font-sans-ui">
      {/* Header */}
      <div className="max-w-2xl mb-14">
        <span className="text-xs font-mono font-medium tracking-wider uppercase text-[var(--accent-primary)]">
          Institutional Clearance Architecture
        </span>
        <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[var(--text-primary)] mt-2 leading-tight">
          How ClearPass works for university students
        </h1>
        <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
          From paper slips to cryptographic zero-dues certification. A clear guide to the university’s unified digital clearance procedure.
        </p>
      </div>

      {/* 4 Steps in Detail */}
      <div className="space-y-6 mb-20">
        {[
          {
            num: '01',
            title: 'Digital Application Dispatch',
            desc: 'Instead of printing forms and collecting ink stamps, submit your student roll number and academic profile once. Select the departments relevant to your graduation or semester withdrawal.',
            detail: 'ClearPass automatically generates your application ID and dispatches parallel verification requests to the respective officers.'
          },
          {
            num: '02',
            title: 'Asynchronous Department Audits',
            desc: 'Authorized departmental officers log into the university ClearPass authority portal to inspect accession registers, inventory logs, and payment ledgers.',
            detail: 'Officers approve with verified credentials or provide actionable resolution reasons if dues exist.'
          },
          {
            num: '03',
            title: 'Real-Time Visibility & Immediate Resolution',
            desc: 'Track every department’s real-time clearance status from your student dashboard. Receive push updates the moment an officer reviews your records.',
            detail: 'If an item is flagged, resolve the discrepancy and request re-verification online with one click.'
          },
          {
            num: '04',
            title: 'Automatic Certificate Issuance',
            desc: 'The instant all selected departments approve clearance, the university generates your official Digital No-Dues Certificate.',
            detail: 'Download as a printable PDF with digital registrar signatures and institutional verification codes.'
          }
        ].map((s) => (
          <div
            key={s.num}
            className="p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col sm:flex-row items-start gap-6 shadow-xs"
          >
            <span className="text-3xl font-editorial font-bold text-[var(--accent-primary)] shrink-0">
              {s.num}
            </span>
            <div className="space-y-2">
              <h3 className="text-xl font-editorial font-medium text-[var(--text-primary)]">
                {s.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {s.desc}
              </p>
              <p className="text-xs text-[var(--text-muted)] font-mono pt-2">
                → {s.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* What each department verifies */}
      <div className="mb-20">
        <h2 className="text-2xl font-editorial font-medium text-[var(--text-primary)] mb-6">
          Departmental Verification Scope
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] text-[var(--accent-primary)] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-[var(--text-primary)]">Central Library</h4>
            </div>
            <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc pl-4">
              <li>Check-in of all borrowed textbooks and monographs</li>
              <li>Verification of zero overdue circulation penalties</li>
              <li>Digital accession of graduate thesis copy</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] text-[var(--accent-primary)] flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-[var(--text-primary)]">Hostel Affairs & Residence</h4>
            </div>
            <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc pl-4">
              <li>Physical room inspection (furniture & electrical fixtures)</li>
              <li>Handover of room keys to hostel warden office</li>
              <li>Reconciliation of hostel mess and maintenance bills</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] text-[var(--accent-primary)] flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-[var(--text-primary)]">Sports Board & Gymnasium</h4>
            </div>
            <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc pl-4">
              <li>Surrender of varsity sports equipment and tournament jerseys</li>
              <li>Inspection and vacation of sports complex lockers</li>
              <li>Clearance of sports council fines or athletic dues</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] text-[var(--accent-primary)] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-[var(--text-primary)]">Finance & Student Accounts</h4>
            </div>
            <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc pl-4">
              <li>Full reconciliation of all academic semester tuition</li>
              <li>Laboratory and examination fee verification</li>
              <li>Calculated refund processing of institutional caution deposit</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="mb-20">
        <h2 className="text-2xl font-editorial font-medium text-[var(--text-primary)] mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                {faq.q}
              </h4>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-2xl bg-[var(--accent-light)]/30 border border-[var(--accent-primary)]/30 text-center space-y-4">
        <h3 className="text-2xl font-editorial font-normal text-[var(--text-primary)]">
          Ready to complete your university clearance?
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Start your application now and receive your official digital No-Dues certificate directly to your student dashboard.
        </p>
        <button
          onClick={onStartClearance}
          className="px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-xs inline-flex items-center gap-2"
        >
          Start My Clearance
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
