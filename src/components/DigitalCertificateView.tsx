import { useState } from 'react';
import { DigitalCertificate } from '../types';
import { Award, Printer, Download, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';

interface DigitalCertificateViewProps {
  certificate: DigitalCertificate;
  onVerifyClick: (certId: string) => void;
}

export function DigitalCertificateView({ certificate, onVerifyClick }: DigitalCertificateViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(certificate.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 font-sans-ui">
      {/* Top Action Bar */}
      <div className="no-print mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
            Official Credential
          </span>
          <h1 className="text-2xl font-editorial font-normal text-[var(--text-primary)]">
            Digital No-Dues Certificate
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-lg border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied ID' : 'Copy Cert ID'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Download / Print PDF
          </button>
        </div>
      </div>

      {/* FORMAL UNIVERSITY CERTIFICATE (Printable) */}
      <div className="bg-white text-neutral-900 border-4 border-double border-neutral-300 rounded-3xl p-8 sm:p-14 shadow-xl relative overflow-hidden print:border-2 print:shadow-none print:m-0 print:p-8">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Award className="w-96 h-96 text-black" />
        </div>

        {/* Certificate Border Inset */}
        <div className="border border-neutral-200 p-6 sm:p-10 rounded-2xl relative z-10">
          {/* Header */}
          <div className="text-center pb-8 border-b-2 border-neutral-300 space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#1B365D] text-white text-2xl font-bold font-editorial mx-auto flex items-center justify-center mb-3 shadow-sm">
              CP
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              National University of Science & Technology
            </p>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-neutral-900 tracking-wide uppercase">
              Digital Clearance & No-Dues Certificate
            </h2>
            <p className="text-xs text-neutral-600 font-serif italic">
              Issued under the authority of the University Academic Registrar & Directorate of Student Services
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-neutral-100 rounded-md font-mono text-xs text-[#1B365D] font-bold border border-neutral-300">
                Certificate ID: {certificate.id}
              </span>
            </div>
          </div>

          {/* Statement */}
          <div className="py-8 space-y-6 text-sm leading-relaxed text-neutral-700">
            <p className="text-justify font-serif text-base text-neutral-800">
              This document serves as formal and irrevocable certification that the student whose credentials appear below has completed all departmental clearance requirements. The respective authorities of the University have examined all inventories, ledgers, laboratory equipment, library accessions, hostel accommodations, athletic materials, and accounts, verifying <strong>ZERO OUTSTANDING LIABILITIES</strong> against the student.
            </p>

            {/* Candidate Metadata Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Candidate Full Name</span>
                <strong className="text-sm text-neutral-900 block font-serif">{certificate.studentName}</strong>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Student ID / Roll No.</span>
                <strong className="text-sm font-mono text-neutral-900 block">{certificate.studentRollNo}</strong>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Degree & Branch</span>
                <span className="text-neutral-800 font-medium block">{certificate.program}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Academic Batch</span>
                <span className="font-mono text-neutral-800 block">{certificate.academicYear}</span>
              </div>
            </div>

            {/* Department Approvals Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                Departmental Clearances Digitally Signed & Stamped:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certificate.approvals.map((appr) => (
                  <div
                    key={appr.department}
                    className="p-3.5 rounded-lg border border-neutral-200 bg-white flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <strong className="text-neutral-900 block flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {appr.departmentName}
                      </strong>
                      <span className="text-neutral-600 text-[11px] block mt-0.5">
                        Officer: {appr.officerName}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 block">
                        Verified: {new Date(appr.approvedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-[#1B365D] font-bold block">
                        {appr.verificationId}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 uppercase font-semibold">
                        CLEARED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Signatures & Seal Footer */}
          <div className="pt-8 border-t-2 border-neutral-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-xs">
            {/* Verification QR / Hash */}
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-block p-2 bg-neutral-50 border border-neutral-300 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-[#1B365D] mx-auto sm:mx-0" />
              </div>
              <p className="text-[10px] font-mono text-neutral-500 uppercase">Cryptographic Audit Hash</p>
              <p className="text-[9px] font-mono text-neutral-700 break-all leading-tight max-w-[200px]">
                {certificate.verificationHash.slice(0, 32)}...
              </p>
            </div>

            {/* Issued Date & Authority */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full border-2 border-neutral-400 text-neutral-500 flex items-center justify-center font-bold text-[10px] mx-auto uppercase tracking-tighter">
                OFFICIAL SEAL
              </div>
              <p className="font-serif text-neutral-800 text-xs">
                Date of Issuance: {new Date(certificate.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-[10px] text-neutral-500 font-mono">
                ClearPass Digital Registry Ledger
              </p>
            </div>

            {/* Registrar Signature */}
            <div className="text-center sm:text-right space-y-1">
              <div className="font-serif italic text-lg text-neutral-800 font-medium pb-1">
                Dr. Alistair Sterling
              </div>
              <div className="border-t border-neutral-400 pt-1">
                <p className="font-bold text-neutral-900 text-xs uppercase tracking-wide">University Registrar</p>
                <p className="text-[10px] text-neutral-500">Board of Academic Examinations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification prompt button */}
      <div className="no-print mt-6 text-center">
        <button
          onClick={() => onVerifyClick(certificate.id)}
          className="text-xs text-[var(--accent-primary)] hover:underline font-mono"
        >
          Check public verification status for this certificate →
        </button>
      </div>
    </div>
  );
}
