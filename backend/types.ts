export type ClearanceStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONDITIONAL';

export interface DepartmentClearanceStatus {
  department: string;
  status: ClearanceStatus;
  officerName?: string;
  officerDesignation?: string;
  approvedAt?: string;
  remarks?: string;
  dueAmount?: number;
}

export interface ClearanceRequestRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  program: string;
  branch: string;
  passingYear: number;
  contactNumber: string;
  email: string;
  overallStatus: ClearanceStatus;
  departments: DepartmentClearanceStatus[];
  submittedAt: string;
  completedAt?: string;
}

export interface VerificationResult {
  valid: boolean;
  certificateId: string;
  studentName?: string;
  rollNo?: string;
  program?: string;
  issuedAt?: string;
  issuedBy?: string;
  digitalSignatureHash?: string;
  remarks?: string;
}
