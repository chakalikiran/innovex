import { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ArrowLeft, BookOpen, Home, Trophy, DollarSign } from 'lucide-react';
import { DepartmentKey, DEPARTMENTS } from '../types';
import { createClearanceRequest } from '../firebase/service';
import { useAuth } from '../context/AuthContext';

interface ApplyClearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (requestId: string) => void;
}

export function ApplyClearanceModal({ isOpen, onClose, onSubmitted }: ApplyClearanceModalProps) {
  const { studentUser, loginStudent } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);
  const [createdReqId, setCreatedReqId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(studentUser?.displayName || 'Rahul Sharma');
  const [email, setEmail] = useState(studentUser?.email || 'rahul.s22@university.edu');
  const [rollNo, setRollNo] = useState(studentUser?.rollNo || 'CS2022-048');
  const [program, setProgram] = useState('B.Tech Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('2022 — 2026');
  const [phone, setPhone] = useState('+91 98451 23456');
  const [hostelBlock, setHostelBlock] = useState('Mandakini Hall');
  const [roomNo, setRoomNo] = useState('B-304');
  const [libraryCardNo, setLibraryCardNo] = useState('LIB-CS-22-048');

  // Department Selection (default to all 4)
  const [selectedDepts, setSelectedDepts] = useState<DepartmentKey[]>([
    'library',
    'hostel',
    'sports',
    'accounts'
  ]);

  if (!isOpen) return null;

  const toggleDept = (key: DepartmentKey) => {
    setSelectedDepts((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Ensure student session is active
      if (!studentUser) {
        loginStudent(rollNo, name, email);
      }

      const req = await createClearanceRequest({
        studentId: studentUser?.uid || `stud_${rollNo.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        studentName: name,
        studentEmail: email,
        studentRollNo: rollNo,
        program,
        academicYear,
        phone,
        hostelBlock,
        roomNo,
        libraryCardNo,
        selectedDepartments: selectedDepts
      });

      setCreatedReqId(req.id);
      setStep(4);
    } catch (err) {
      console.error('Failed to submit clearance request:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
              Step {step} of {step === 4 ? '4' : '3'}
            </span>
            <h3 className="text-xl font-editorial font-normal text-[var(--text-primary)]">
              Apply for No-Dues Clearance
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Student Details */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-[var(--text-secondary)]">
                Please verify your university student credentials. These details will appear on your official No-Dues Certificate.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans-ui">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                    Student Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                    University Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                    Academic Program *
                  </label>
                  <input
                    type="text"
                    required
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                    Academic Year / Batch
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                    Hostel & Room (if day-scholar leave blank)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Hostel"
                      value={hostelBlock}
                      onChange={(e) => setHostelBlock(e.target.value)}
                      className="w-2/3 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                    <input
                      type="text"
                      placeholder="Room #"
                      value={roomNo}
                      onChange={(e) => setRoomNo(e.target.value)}
                      className="w-1/3 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                    Library Card ID
                  </label>
                  <input
                    type="text"
                    value={libraryCardNo}
                    onChange={(e) => setLibraryCardNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Select Departments */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-[var(--text-secondary)]">
                Select the departments from which you require digital No-Dues clearance sign-offs:
              </p>

              <div className="space-y-3">
                {DEPARTMENTS.map((dept) => {
                  const isChecked = selectedDepts.includes(dept.key);
                  return (
                    <label
                      key={dept.key}
                      onClick={() => toggleDept(dept.key)}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-light)]/40 shadow-xs'
                          : 'border-[var(--border-color)] bg-[var(--bg-subtle)]/40 opacity-70'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 rounded text-[var(--accent-primary)]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                            {dept.name}
                          </h4>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            {dept.defaultOfficer}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          {dept.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {selectedDepts.length === 0 && (
                <p className="text-xs text-red-600">Please select at least one department.</p>
              )}
            </div>
          )}

          {/* STEP 3: Review Request */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-xs text-[var(--text-secondary)]">
                Review your application before final digital dispatch. A unique Request ID will be created.
              </p>

              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Candidate</span>
                    <strong className="text-sm text-[var(--text-primary)]">{name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Roll Number</span>
                    <strong className="text-sm font-mono text-[var(--text-primary)]">{rollNo}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Program</span>
                    <span className="text-[var(--text-primary)]">{program}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Batch</span>
                    <span className="text-[var(--text-primary)]">{academicYear}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1.5">
                    Selected Departments for Verification ({selectedDepts.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDepts.map((d) => {
                      const meta = DEPARTMENTS.find((m) => m.key === d);
                      return (
                        <span
                          key={d}
                          className="px-2.5 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] font-medium text-[var(--text-primary)]"
                        >
                          {meta?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] leading-relaxed">
                <strong className="text-[var(--text-primary)] block mb-1">Student Declaration:</strong>
                I hereby declare that all academic assets, university property, room fixtures, and library materials entrusted to me have been duly surrendered or will be accounted for during verification.
              </div>
            </div>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && createdReqId && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-editorial font-normal text-[var(--text-primary)]">
                Application Successfully Dispatched
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                Your digital clearance request has been forwarded to the selected department officers.
              </p>

              <div className="p-4 rounded-xl bg-[var(--accent-light)]/40 border border-[var(--accent-primary)]/30 max-w-sm mx-auto">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-primary)] block">
                  Generated Request ID
                </span>
                <span className="text-xl font-bold font-mono text-[var(--text-primary)] mt-1 block">
                  {createdReqId}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] font-mono">
                You can now track department sign-offs under <strong>My Clearance</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-subtle)]/30">
          {step === 4 ? (
            <button
              onClick={() => {
                onClose();
                if (createdReqId) onSubmitted(createdReqId);
              }}
              className="w-full py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors"
            >
              Track in My Clearance →
            </button>
          ) : (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  disabled={step === 2 && selectedDepts.length === 0}
                  onClick={() => setStep((s) => (s + 1) as any)}
                  className="px-5 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-2"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
