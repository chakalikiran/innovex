export type DepartmentKey = 'library' | 'hostel' | 'sports' | 'accounts';

export type ClearanceStatus = 'pending' | 'approved' | 'rejected';

export interface DepartmentStatus {
  department: DepartmentKey;
  name: string;
  status: ClearanceStatus;
  updatedAt: string;
  officerName?: string;
  officerEmail?: string;
  remarks?: string;
  dueAmount?: number;
  verificationId?: string;
}

export interface ClearanceRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRollNo: string;
  program: string;
  academicYear: string;
  phone?: string;
  hostelBlock?: string;
  roomNo?: string;
  libraryCardNo?: string;
  selectedDepartments: DepartmentKey[];
  departmentStatuses: Record<DepartmentKey, DepartmentStatus>;
  overallStatus: ClearanceStatus;
  progressPercent: number;
  certificateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditRecord {
  id: string;
  requestId: string;
  studentRollNo: string;
  studentName: string;
  department: string;
  action: 'APPLIED' | 'APPROVED' | 'REJECTED' | 'RESUBMITTED' | 'CERTIFICATE_ISSUED';
  actorEmail: string;
  actorName: string;
  actorRole: string;
  remarks?: string;
  timestamp: string;
}

export interface DigitalCertificate {
  id: string;
  requestId: string;
  studentName: string;
  studentRollNo: string;
  program: string;
  academicYear: string;
  issuedAt: string;
  issuer: string;
  verificationHash: string;
  status: 'valid' | 'revoked';
  approvals: {
    department: DepartmentKey;
    departmentName: string;
    officerName: string;
    verificationId: string;
    approvedAt: string;
  }[];
}

export interface NotificationItem {
  id: string;
  recipientEmail: string;
  studentRollNo: string;
  title: string;
  message: string;
  type: 'status_change' | 'action_required' | 'certificate_ready';
  requestId: string;
  read: boolean;
  createdAt: string;
}

export type UserRole =
  | 'student'
  | 'library_officer'
  | 'hostel_officer'
  | 'sports_officer'
  | 'accounts_officer'
  | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: DepartmentKey;
  rollNo?: string;
  employeeId?: string;
  createdAt?: string;
}

export interface StudentRegistrationData {
  fullName: string;
  studentId: string;
  email: string;
  password: string;
}

export interface AuthorityRegistrationData {
  fullName: string;
  employeeId: string;
  email: string;
  password: string;
  department?: DepartmentKey;
  role: UserRole;
}

export interface DepartmentMeta {
  key: DepartmentKey;
  name: string;
  officerRole: UserRole;
  defaultOfficer: string;
  iconName: string;
  description: string;
}

export const DEPARTMENTS: DepartmentMeta[] = [
  {
    key: 'library',
    name: 'Central University Library',
    officerRole: 'library_officer',
    defaultOfficer: 'Dr. Aris Thorne (Chief Librarian)',
    iconName: 'BookOpen',
    description: 'Book returns, accession registers, journal dues, catalog clearance'
  },
  {
    key: 'hostel',
    name: 'Hostel Affairs & Residence',
    officerRole: 'hostel_officer',
    defaultOfficer: 'Prof. Sarah Jenkins (Chief Warden)',
    iconName: 'Home',
    description: 'Room inventory, mess bill clearance, damages assessment, key return'
  },
  {
    key: 'sports',
    name: 'Sports Board & Gymnasium',
    officerRole: 'sports_officer',
    defaultOfficer: 'Coach Marcus Vance (Sports Director)',
    iconName: 'Trophy',
    description: 'Athletic equipment check-in, court locker keys, tournament jersey returns'
  },
  {
    key: 'accounts',
    name: 'Finance & Student Accounts',
    officerRole: 'accounts_officer',
    defaultOfficer: 'Mrs. Elena Rostova (Finance Officer)',
    iconName: 'DollarSign',
    description: 'Tuition fees, lab contingency dues, caution deposit balance reconciliation'
  }
];
