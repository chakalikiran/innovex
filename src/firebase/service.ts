import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { db, auth } from './config';
import {
  ClearanceRequest,
  DepartmentStatus,
  AuditRecord,
  DigitalCertificate,
  NotificationItem,
  DepartmentKey,
  ClearanceStatus,
  UserRole,
  DEPARTMENTS,
  AppUser,
  StudentRegistrationData,
  AuthorityRegistrationData
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Recursively strips any undefined fields from an object or array to ensure
 * compliance with Firestore, which rejects documents containing undefined values.
 */
export function sanitizeFirestoreData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .map((item) => sanitizeFirestoreData(item))
      .filter((item) => item !== undefined) as unknown as T;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

// Initial realistic seed records
export const INITIAL_REQUESTS: ClearanceRequest[] = [
  {
    id: 'REQ-2026-4821',
    studentId: 'stud_rahul_01',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.s22@university.edu',
    studentRollNo: 'CS2022-048',
    program: 'B.Tech Computer Science & Engineering',
    academicYear: '2022 — 2026',
    phone: '+91 98451 23456',
    hostelBlock: 'Mandakini Hall',
    roomNo: 'B-304',
    libraryCardNo: 'LIB-CS-22-048',
    selectedDepartments: ['library', 'hostel', 'sports', 'accounts'],
    departmentStatuses: {
      library: {
        department: 'library',
        name: 'Central University Library',
        status: 'approved',
        updatedAt: '2026-09-02T10:15:00Z',
        officerName: 'Dr. Aris Thorne (Chief Librarian)',
        officerEmail: 'library@university.edu',
        remarks: 'All 8 issued books returned. Accession ledger closed.',
        verificationId: 'LIB-VER-9041A'
      },
      hostel: {
        department: 'hostel',
        name: 'Hostel Affairs & Residence',
        status: 'approved',
        updatedAt: '2026-09-03T14:30:00Z',
        officerName: 'Prof. Sarah Jenkins (Chief Warden)',
        officerEmail: 'hostel@university.edu',
        remarks: 'Room B-304 inspected. Inventory intact and room keys surrendered.',
        verificationId: 'HST-VER-8823B'
      },
      sports: {
        department: 'sports',
        name: 'Sports Board & Gymnasium',
        status: 'pending',
        updatedAt: '2026-09-04T09:00:00Z',
        officerName: 'Coach Marcus Vance (Sports Director)',
        officerEmail: 'sports@university.edu',
        remarks: 'Under Review: Awaiting locker #42 return verification.',
        verificationId: 'SPT-VER-7711C'
      },
      accounts: {
        department: 'accounts',
        name: 'Finance & Student Accounts',
        status: 'approved',
        updatedAt: '2026-09-04T16:45:00Z',
        officerName: 'Mrs. Elena Rostova (Finance Officer)',
        officerEmail: 'accounts@university.edu',
        remarks: 'Full 8 semesters tuition cleared. Caution deposit balance reconciled.',
        verificationId: 'ACC-VER-6602D'
      }
    },
    overallStatus: 'pending',
    progressPercent: 75,
    createdAt: '2026-09-01T09:30:00Z',
    updatedAt: '2026-09-04T16:45:00Z'
  },
  {
    id: 'REQ-2026-3190',
    studentId: 'stud_ananya_02',
    studentName: 'Ananya Iyer',
    studentEmail: 'ananya.iyer@university.edu',
    studentRollNo: 'EC2022-114',
    program: 'B.Tech Electronics & Communication',
    academicYear: '2022 — 2026',
    phone: '+91 99234 56789',
    hostelBlock: 'Ganga Hall',
    roomNo: 'A-112',
    libraryCardNo: 'LIB-EC-22-114',
    selectedDepartments: ['library', 'hostel', 'sports', 'accounts'],
    departmentStatuses: {
      library: {
        department: 'library',
        name: 'Central University Library',
        status: 'approved',
        updatedAt: '2026-08-28T11:00:00Z',
        officerName: 'Dr. Aris Thorne',
        verificationId: 'LIB-VER-3312'
      },
      hostel: {
        department: 'hostel',
        name: 'Hostel Affairs & Residence',
        status: 'approved',
        updatedAt: '2026-08-29T15:20:00Z',
        officerName: 'Prof. Sarah Jenkins',
        verificationId: 'HST-VER-4401'
      },
      sports: {
        department: 'sports',
        name: 'Sports Board & Gymnasium',
        status: 'approved',
        updatedAt: '2026-08-30T10:10:00Z',
        officerName: 'Coach Marcus Vance',
        verificationId: 'SPT-VER-5590'
      },
      accounts: {
        department: 'accounts',
        name: 'Finance & Student Accounts',
        status: 'approved',
        updatedAt: '2026-08-31T17:00:00Z',
        officerName: 'Mrs. Elena Rostova',
        verificationId: 'ACC-VER-6681'
      }
    },
    overallStatus: 'approved',
    progressPercent: 100,
    certificateId: 'CP-2026-8F29A',
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-08-31T17:00:00Z'
  },
  {
    id: 'REQ-2026-5509',
    studentId: 'stud_vikram_03',
    studentName: 'Vikram Patel',
    studentEmail: 'vikram.p22@university.edu',
    studentRollNo: 'ME2022-072',
    program: 'B.Tech Mechanical Engineering',
    academicYear: '2022 — 2026',
    phone: '+91 97112 34567',
    hostelBlock: 'Cauvery Hall',
    roomNo: 'C-208',
    libraryCardNo: 'LIB-ME-22-072',
    selectedDepartments: ['library', 'hostel', 'sports', 'accounts'],
    departmentStatuses: {
      library: {
        department: 'library',
        name: 'Central University Library',
        status: 'approved',
        updatedAt: '2026-09-03T11:00:00Z',
        officerName: 'Dr. Aris Thorne',
        verificationId: 'LIB-VER-7721'
      },
      hostel: {
        department: 'hostel',
        name: 'Hostel Affairs & Residence',
        status: 'approved',
        updatedAt: '2026-09-04T12:30:00Z',
        officerName: 'Prof. Sarah Jenkins',
        verificationId: 'HST-VER-8832'
      },
      sports: {
        department: 'sports',
        name: 'Sports Board & Gymnasium',
        status: 'rejected',
        updatedAt: '2026-09-05T10:00:00Z',
        officerName: 'Coach Marcus Vance',
        officerEmail: 'sports@university.edu',
        remarks: 'Outstanding equipment fee — ₹850',
        dueAmount: 850,
        verificationId: 'SPT-REJ-9912'
      },
      accounts: {
        department: 'accounts',
        name: 'Finance & Student Accounts',
        status: 'pending',
        updatedAt: '2026-09-02T14:00:00Z',
        officerName: 'Mrs. Elena Rostova',
        remarks: 'Pending clearance from Sports board before final audit'
      }
    },
    overallStatus: 'rejected',
    progressPercent: 50,
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-05T10:00:00Z'
  },
  {
    id: 'REQ-2026-6102',
    studentId: 'stud_priyanka_04',
    studentName: 'Priyanka Roy',
    studentEmail: 'priyanka.r22@university.edu',
    studentRollNo: 'EE2022-031',
    program: 'B.Tech Electrical Engineering',
    academicYear: '2022 — 2026',
    phone: '+91 98765 43210',
    selectedDepartments: ['library', 'hostel', 'sports', 'accounts'],
    departmentStatuses: {
      library: {
        department: 'library',
        name: 'Central University Library',
        status: 'approved',
        updatedAt: '2026-09-04T16:00:00Z',
        officerName: 'Dr. Aris Thorne',
        verificationId: 'LIB-VER-9011'
      },
      hostel: {
        department: 'hostel',
        name: 'Hostel Affairs & Residence',
        status: 'pending',
        updatedAt: '2026-09-04T10:00:00Z'
      },
      sports: {
        department: 'sports',
        name: 'Sports Board & Gymnasium',
        status: 'pending',
        updatedAt: '2026-09-04T10:00:00Z'
      },
      accounts: {
        department: 'accounts',
        name: 'Finance & Student Accounts',
        status: 'pending',
        updatedAt: '2026-09-04T10:00:00Z'
      }
    },
    overallStatus: 'pending',
    progressPercent: 25,
    createdAt: '2026-09-04T10:00:00Z',
    updatedAt: '2026-09-04T16:00:00Z'
  }
];

export const INITIAL_CERTIFICATES: DigitalCertificate[] = [
  {
    id: 'CP-2026-8F29A',
    requestId: 'REQ-2026-3190',
    studentName: 'Ananya Iyer',
    studentRollNo: 'EC2022-114',
    program: 'B.Tech Electronics & Communication',
    academicYear: '2022 — 2026',
    issuedAt: '2026-08-31T17:00:00Z',
    issuer: 'ClearPass University Registrar & Digital Clearance Office',
    verificationHash: 'e7b99c4381ff07d10e527d2c38abf0d491c1289ae6570c946e30b6',
    status: 'valid',
    approvals: [
      {
        department: 'library',
        departmentName: 'Central University Library',
        officerName: 'Dr. Aris Thorne',
        verificationId: 'LIB-VER-3312',
        approvedAt: '2026-08-28T11:00:00Z'
      },
      {
        department: 'hostel',
        departmentName: 'Hostel Affairs & Residence',
        officerName: 'Prof. Sarah Jenkins',
        verificationId: 'HST-VER-4401',
        approvedAt: '2026-08-29T15:20:00Z'
      },
      {
        department: 'sports',
        departmentName: 'Sports Board & Gymnasium',
        officerName: 'Coach Marcus Vance',
        verificationId: 'SPT-VER-5590',
        approvedAt: '2026-08-30T10:10:00Z'
      },
      {
        department: 'accounts',
        departmentName: 'Finance & Student Accounts',
        officerName: 'Mrs. Elena Rostova',
        verificationId: 'ACC-VER-6681',
        approvedAt: '2026-08-31T17:00:00Z'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'AUD-001',
    requestId: 'REQ-2026-4821',
    studentRollNo: 'CS2022-048',
    studentName: 'Rahul Sharma',
    department: 'Central University Library',
    action: 'APPROVED',
    actorEmail: 'library@university.edu',
    actorName: 'Dr. Aris Thorne',
    actorRole: 'library_officer',
    remarks: 'Verified accession register, all 8 engineering volumes checked back in.',
    timestamp: '2026-09-02T10:15:00Z'
  },
  {
    id: 'AUD-002',
    requestId: 'REQ-2026-4821',
    studentRollNo: 'CS2022-048',
    studentName: 'Rahul Sharma',
    department: 'Hostel Affairs & Residence',
    action: 'APPROVED',
    actorEmail: 'hostel@university.edu',
    actorName: 'Prof. Sarah Jenkins',
    actorRole: 'hostel_officer',
    remarks: 'Mandakini B-304 room handover signed. No inventory breakage.',
    timestamp: '2026-09-03T14:30:00Z'
  },
  {
    id: 'AUD-003',
    requestId: 'REQ-2026-5509',
    studentRollNo: 'ME2022-072',
    studentName: 'Vikram Patel',
    department: 'Sports Board & Gymnasium',
    action: 'REJECTED',
    actorEmail: 'sports@university.edu',
    actorName: 'Coach Marcus Vance',
    actorRole: 'sports_officer',
    remarks: 'Outstanding equipment fee — ₹850. Badminton tournament racket unreturned.',
    timestamp: '2026-09-05T10:00:00Z'
  },
  {
    id: 'AUD-004',
    requestId: 'REQ-2026-4821',
    studentRollNo: 'CS2022-048',
    studentName: 'Rahul Sharma',
    department: 'Finance & Student Accounts',
    action: 'APPROVED',
    actorEmail: 'accounts@university.edu',
    actorName: 'Mrs. Elena Rostova',
    actorRole: 'accounts_officer',
    remarks: 'Tuition fees receipt verified; semester 1-8 ledger reconciled zero dues.',
    timestamp: '2026-09-04T16:45:00Z'
  },
  {
    id: 'AUD-005',
    requestId: 'REQ-2026-3190',
    studentRollNo: 'EC2022-114',
    studentName: 'Ananya Iyer',
    department: 'University Registrar',
    action: 'CERTIFICATE_ISSUED',
    actorEmail: 'registrar@university.edu',
    actorName: 'Office of the Registrar',
    actorRole: 'admin',
    remarks: 'All 4 departments digitally verified. Official No-Dues Certificate CP-2026-8F29A generated.',
    timestamp: '2026-08-31T17:00:00Z'
  }
];

// Helper to seed Firestore if empty
let isSeeded = false;
export async function ensureInitialSeed() {
  if (isSeeded || !auth.currentUser) return;
  try {
    const snap = await getDocs(collection(db, 'clearance_requests'));
    if (snap.empty) {
      for (const req of INITIAL_REQUESTS) {
        await setDoc(doc(db, 'clearance_requests', req.id), sanitizeFirestoreData(req));
      }
      for (const cert of INITIAL_CERTIFICATES) {
        await setDoc(doc(db, 'certificates', cert.id), sanitizeFirestoreData(cert));
      }
      for (const aud of INITIAL_AUDIT_LOGS) {
        try {
          await setDoc(doc(db, 'audit_logs', aud.id), sanitizeFirestoreData(aud));
        } catch (audErr) {
          console.warn('Audit seed log deferred:', audErr);
        }
      }
      for (const authUser of DEFAULT_DEMO_AUTHORITIES) {
        await setDoc(doc(db, 'employee_index', authUser.employeeId), sanitizeFirestoreData({
          employeeId: authUser.employeeId,
          email: authUser.email,
          displayName: authUser.displayName,
          role: authUser.role,
          department: authUser.department
        }));
      }
    }
    isSeeded = true;
  } catch (err) {
    console.warn('Seed operation deferred or offline:', err);
  }
}

// Subscriptions
export function subscribeClearanceRequests(onUpdate: (requests: ClearanceRequest[]) => void): () => void {
  // If not authenticated, do not initiate protected queries; provide fallback initial state
  if (!auth.currentUser) {
    onUpdate(INITIAL_REQUESTS);
    return () => {};
  }

  ensureInitialSeed();
  const reqCol = collection(db, 'clearance_requests');
  return onSnapshot(
    reqCol,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_REQUESTS);
      } else {
        const list: ClearanceRequest[] = [];
        snapshot.forEach((d) => list.push(d.data() as ClearanceRequest));
        // Sort newest first
        list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        onUpdate(list);
      }
    },
    (error) => {
      console.warn('Fallback to memory requests due to snapshot status:', error);
      onUpdate(INITIAL_REQUESTS);
    }
  );
}

export function subscribeAuditLogs(onUpdate: (logs: AuditRecord[]) => void): () => void {
  // If not authenticated, do not initiate protected queries; provide fallback initial state
  if (!auth.currentUser) {
    onUpdate(INITIAL_AUDIT_LOGS);
    return () => {};
  }

  const audCol = collection(db, 'audit_logs');
  return onSnapshot(
    audCol,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_AUDIT_LOGS);
      } else {
        const list: AuditRecord[] = [];
        snapshot.forEach((d) => list.push(d.data() as AuditRecord));
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        onUpdate(list);
      }
    },
    (error) => {
      console.warn('Fallback to memory audit logs due to snapshot status:', error);
      onUpdate(INITIAL_AUDIT_LOGS);
    }
  );
}

export function subscribeCertificates(onUpdate: (certs: DigitalCertificate[]) => void): () => void {
  const certCol = collection(db, 'certificates');
  return onSnapshot(
    certCol,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_CERTIFICATES);
      } else {
        const list: DigitalCertificate[] = [];
        snapshot.forEach((d) => list.push(d.data() as DigitalCertificate));
        onUpdate(list);
      }
    },
    (error) => {
      console.warn('Fallback to memory certificates due to snapshot status:', error);
      onUpdate(INITIAL_CERTIFICATES);
    }
  );
}

// Create new clearance request
export async function createClearanceRequest(
  data: Omit<ClearanceRequest, 'id' | 'departmentStatuses' | 'overallStatus' | 'progressPercent' | 'createdAt' | 'updatedAt'>
): Promise<ClearanceRequest> {
  const reqId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const departmentStatuses: Record<DepartmentKey, DepartmentStatus> = {
    library: {
      department: 'library',
      name: 'Central University Library',
      status: data.selectedDepartments.includes('library') ? 'pending' : 'approved',
      updatedAt: now,
      remarks: data.selectedDepartments.includes('library') ? 'Verification in queue' : 'Not required'
    },
    hostel: {
      department: 'hostel',
      name: 'Hostel Affairs & Residence',
      status: data.selectedDepartments.includes('hostel') ? 'pending' : 'approved',
      updatedAt: now,
      remarks: data.selectedDepartments.includes('hostel') ? 'Verification in queue' : 'Not required'
    },
    sports: {
      department: 'sports',
      name: 'Sports Board & Gymnasium',
      status: data.selectedDepartments.includes('sports') ? 'pending' : 'approved',
      updatedAt: now,
      remarks: data.selectedDepartments.includes('sports') ? 'Verification in queue' : 'Not required'
    },
    accounts: {
      department: 'accounts',
      name: 'Finance & Student Accounts',
      status: data.selectedDepartments.includes('accounts') ? 'pending' : 'approved',
      updatedAt: now,
      remarks: data.selectedDepartments.includes('accounts') ? 'Verification in queue' : 'Not required'
    }
  };

  const newRequest: ClearanceRequest = {
    ...data,
    id: reqId,
    departmentStatuses,
    overallStatus: 'pending',
    progressPercent: 0,
    createdAt: now,
    updatedAt: now
  };

  try {
    await setDoc(doc(db, 'clearance_requests', reqId), sanitizeFirestoreData(newRequest));
    // Add audit log
    const auditId = `AUD-${Date.now().toString().slice(-6)}`;
    const audit: AuditRecord = {
      id: auditId,
      requestId: reqId,
      studentRollNo: data.studentRollNo,
      studentName: data.studentName,
      department: 'Student Portal',
      action: 'APPLIED',
      actorEmail: data.studentEmail,
      actorName: data.studentName,
      actorRole: 'student',
      remarks: `Submitted No-Dues request for ${data.selectedDepartments.length} departments.`,
      timestamp: now
    };
    try {
      await setDoc(doc(db, 'audit_logs', auditId), sanitizeFirestoreData(audit));
    } catch (audErr) {
      console.warn('Audit log write deferred:', audErr);
    }
  } catch (error) {
    console.warn('Firestore request write deferred, updating local session:', error);
    INITIAL_REQUESTS.unshift(newRequest);
  }

  return newRequest;
}

// Department action: Approve or Reject
export async function updateDepartmentAction(
  request: ClearanceRequest,
  deptKey: DepartmentKey,
  status: 'approved' | 'rejected',
  remarks: string,
  dueAmount?: number,
  officerName = 'Authorized Officer',
  officerEmail = 'officer@university.edu',
  officerRole: UserRole = 'admin'
): Promise<void> {
  const now = new Date().toISOString();
  const deptMeta = DEPARTMENTS.find((d) => d.key === deptKey);
  const deptName = deptMeta?.name || deptKey;
  const verificationId = status === 'approved' 
    ? `${deptKey.toUpperCase().slice(0, 3)}-VER-${Math.floor(1000 + Math.random() * 9000)}`
    : `${deptKey.toUpperCase().slice(0, 3)}-REJ-${Math.floor(1000 + Math.random() * 9000)}`;

  const updatedDeptStatuses = {
    ...request.departmentStatuses,
    [deptKey]: {
      ...request.departmentStatuses[deptKey],
      status,
      remarks: remarks || (status === 'approved' ? 'Clearance approved.' : 'Outstanding dues recorded.'),
      dueAmount: status === 'rejected' ? (Number(dueAmount) || 0) : 0,
      officerName,
      officerEmail,
      updatedAt: now,
      verificationId
    }
  };

  // Re-calculate progress and overall status
  const depts = request.selectedDepartments;
  const approvedCount = depts.filter((d) => updatedDeptStatuses[d]?.status === 'approved').length;
  const rejectedCount = depts.filter((d) => updatedDeptStatuses[d]?.status === 'rejected').length;
  const progressPercent = Math.round((approvedCount / depts.length) * 100);

  let overallStatus: ClearanceStatus = 'pending';
  let certificateId = request.certificateId;

  if (rejectedCount > 0) {
    overallStatus = 'rejected';
  } else if (approvedCount === depts.length) {
    overallStatus = 'approved';
    if (!certificateId) {
      certificateId = `CP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      // Generate certificate
      const cert: DigitalCertificate = {
        id: certificateId,
        requestId: request.id,
        studentName: request.studentName,
        studentRollNo: request.studentRollNo,
        program: request.program,
        academicYear: request.academicYear,
        issuedAt: now,
        issuer: 'ClearPass University Registrar & Digital Clearance Office',
        verificationHash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
        status: 'valid',
        approvals: depts.map((d) => ({
          department: d,
          departmentName: updatedDeptStatuses[d].name,
          officerName: updatedDeptStatuses[d].officerName || 'Authorized Officer',
          verificationId: updatedDeptStatuses[d].verificationId || 'VER-AUTO',
          approvedAt: updatedDeptStatuses[d].updatedAt
        }))
      };
      await setDoc(doc(db, 'certificates', certificateId), sanitizeFirestoreData(cert));
    }
  }

  const updatedReq: ClearanceRequest = {
    ...request,
    departmentStatuses: updatedDeptStatuses,
    overallStatus,
    progressPercent,
    updatedAt: now
  };
  if (certificateId) {
    updatedReq.certificateId = certificateId;
  } else {
    delete (updatedReq as any).certificateId;
  }

  try {
    await setDoc(doc(db, 'clearance_requests', request.id), sanitizeFirestoreData(updatedReq));

    // Write audit record
    const auditId = `AUD-${Date.now().toString().slice(-6)}`;
    const audit: AuditRecord = {
      id: auditId,
      requestId: request.id,
      studentRollNo: request.studentRollNo,
      studentName: request.studentName,
      department: deptName,
      action: status === 'approved' ? 'APPROVED' : 'REJECTED',
      actorEmail: officerEmail,
      actorName: officerName,
      actorRole: officerRole,
      remarks: remarks + (dueAmount ? ` (Due: ₹${dueAmount})` : ''),
      timestamp: now
    };
    try {
      await setDoc(doc(db, 'audit_logs', auditId), sanitizeFirestoreData(audit));
    } catch (audErr) {
      console.warn('Audit log write deferred:', audErr);
    }
  } catch (err) {
    console.warn('Firestore update deferred, updating local session:', err);
    const idx = INITIAL_REQUESTS.findIndex((r) => r.id === request.id);
    if (idx !== -1) {
      INITIAL_REQUESTS[idx] = updatedReq;
    }
  }
}

// Student re-submit after resolving rejection
export async function resubmitDepartmentClearance(
  request: ClearanceRequest,
  deptKey: DepartmentKey,
  studentNote = 'Issue resolved and dues cleared.'
): Promise<void> {
  const now = new Date().toISOString();
  const deptMeta = DEPARTMENTS.find((d) => d.key === deptKey);
  const deptName = deptMeta?.name || deptKey;

  const updatedDeptStatuses = {
    ...request.departmentStatuses,
    [deptKey]: {
      ...request.departmentStatuses[deptKey],
      status: 'pending' as ClearanceStatus,
      remarks: `Re-submitted: ${studentNote}`,
      dueAmount: 0,
      updatedAt: now
    }
  };

  // Re-calculate
  const depts = request.selectedDepartments;
  const approvedCount = depts.filter((d) => updatedDeptStatuses[d]?.status === 'approved').length;
  const rejectedCount = depts.filter((d) => updatedDeptStatuses[d]?.status === 'rejected').length;
  const progressPercent = Math.round((approvedCount / depts.length) * 100);
  const overallStatus: ClearanceStatus = rejectedCount > 0 ? 'rejected' : 'pending';

  const updatedReq: ClearanceRequest = {
    ...request,
    departmentStatuses: updatedDeptStatuses,
    overallStatus,
    progressPercent,
    updatedAt: now
  };

  try {
    await setDoc(doc(db, 'clearance_requests', request.id), sanitizeFirestoreData(updatedReq));

    const auditId = `AUD-${Date.now().toString().slice(-6)}`;
    const audit: AuditRecord = {
      id: auditId,
      requestId: request.id,
      studentRollNo: request.studentRollNo,
      studentName: request.studentName,
      department: deptName,
      action: 'RESUBMITTED',
      actorEmail: request.studentEmail,
      actorName: request.studentName,
      actorRole: 'student',
      remarks: `Student re-submitted for re-verification: ${studentNote}`,
      timestamp: now
    };
    try {
      await setDoc(doc(db, 'audit_logs', auditId), sanitizeFirestoreData(audit));
    } catch (audErr) {
      console.warn('Audit log write deferred:', audErr);
    }
  } catch (err) {
    console.warn('Firestore update deferred, updating local session:', err);
    const idx = INITIAL_REQUESTS.findIndex((r) => r.id === request.id);
    if (idx !== -1) {
      INITIAL_REQUESTS[idx] = updatedReq;
    }
  }
}

// Fetch single certificate for public verification
export async function getCertificateForVerification(certId: string): Promise<DigitalCertificate | null> {
  try {
    const docSnap = await getDoc(doc(db, 'certificates', certId.trim().toUpperCase()));
    if (docSnap.exists()) {
      return docSnap.data() as DigitalCertificate;
    }
    // Check fallback sample
    const fallback = INITIAL_CERTIFICATES.find(c => c.id.toUpperCase() === certId.trim().toUpperCase());
    return fallback || null;
  } catch (err) {
    const fallback = INITIAL_CERTIFICATES.find(c => c.id.toUpperCase() === certId.trim().toUpperCase());
    return fallback || null;
  }
}

// -------------------------------------------------------------
// AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) SERVICES
// -------------------------------------------------------------

export function isAllowedStudentEmail(email: string): boolean {
  const norm = email.trim().toLowerCase();
  return norm.endsWith('@rguktrkv.ac.in') || norm.endsWith('@rguktong.ac.in');
}

export const DEFAULT_DEMO_AUTHORITIES = [
  {
    employeeId: 'EMP-LIB-01',
    email: 'library.officer@rguktrkv.ac.in',
    password: 'Password@123',
    displayName: 'Dr. Aris Thorne',
    role: 'library_officer' as UserRole,
    department: 'library' as DepartmentKey,
    title: 'Chief Librarian'
  },
  {
    employeeId: 'EMP-HST-02',
    email: 'hostel.warden@rguktrkv.ac.in',
    password: 'Password@123',
    displayName: 'Prof. Sarah Jenkins',
    role: 'hostel_officer' as UserRole,
    department: 'hostel' as DepartmentKey,
    title: 'Chief Warden of Hostels'
  },
  {
    employeeId: 'EMP-SPT-03',
    email: 'sports.director@rguktrkv.ac.in',
    password: 'Password@123',
    displayName: 'Coach Marcus Vance',
    role: 'sports_officer' as UserRole,
    department: 'sports' as DepartmentKey,
    title: 'Sports Director & Physical Education'
  },
  {
    employeeId: 'EMP-ACC-04',
    email: 'accounts.bursar@rguktrkv.ac.in',
    password: 'Password@123',
    displayName: 'Mrs. Elena Rostova',
    role: 'accounts_officer' as UserRole,
    department: 'accounts' as DepartmentKey,
    title: 'Bursar & Accounts Officer'
  },
  {
    employeeId: 'EMP-ADM-00',
    email: 'admin@rguktrkv.ac.in',
    password: 'Password@123',
    displayName: 'Prof. K. R. Rao',
    role: 'admin' as UserRole,
    title: 'Dean of Student Affairs & Institutional Admin'
  }
];

export const DEFAULT_DEMO_STUDENT = {
  studentId: 'R200048',
  email: 'rahul.r200048@rguktrkv.ac.in',
  password: 'Password@123',
  displayName: 'Rahul Sharma',
  role: 'student' as UserRole
};

// Student Registration
export async function registerStudentUser(data: StudentRegistrationData): Promise<AppUser> {
  const normEmail = data.email.trim().toLowerCase();
  if (!isAllowedStudentEmail(normEmail)) {
    throw new Error('Please use your official RGUKT university email address (@rguktrkv.ac.in or @rguktong.ac.in).');
  }
  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const cred = await createUserWithEmailAndPassword(auth, normEmail, data.password);
  await updateProfile(cred.user, { displayName: data.fullName.trim() });

  const appUser: AppUser = {
    uid: cred.user.uid,
    email: normEmail,
    displayName: data.fullName.trim(),
    role: 'student',
    rollNo: data.studentId.trim().toUpperCase(),
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'users', cred.user.uid), sanitizeFirestoreData(appUser));
  await setDoc(doc(db, 'students', cred.user.uid), sanitizeFirestoreData({
    uid: cred.user.uid,
    rollNo: appUser.rollNo,
    name: appUser.displayName,
    email: normEmail,
    createdAt: appUser.createdAt
  }));

  return appUser;
}

// Student Login
export async function loginStudentUser(email: string, password: string): Promise<AppUser> {
  const normEmail = email.trim().toLowerCase();
  if (!isAllowedStudentEmail(normEmail)) {
    throw new Error('Please use your official RGUKT university email address (@rguktrkv.ac.in or @rguktong.ac.in).');
  }

  let cred;
  try {
    cred = await signInWithEmailAndPassword(auth, normEmail, password);
  } catch (err: any) {
    // If it is the default demo student, auto-provision if not already registered in Firebase Auth
    if (normEmail === DEFAULT_DEMO_STUDENT.email && password === DEFAULT_DEMO_STUDENT.password) {
      try {
        cred = await createUserWithEmailAndPassword(auth, normEmail, password);
        await updateProfile(cred.user, { displayName: DEFAULT_DEMO_STUDENT.displayName });
      } catch (inner) {
        throw err;
      }
    } else {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please verify your credentials.');
      }
      throw err;
    }
  }

  // Retrieve user role from Firestore
  let appUser: AppUser | null = null;
  try {
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
    if (userDoc.exists()) {
      appUser = userDoc.data() as AppUser;
    }
  } catch (e) {
    console.warn('Could not fetch user profile doc:', e);
  }

  if (!appUser) {
    appUser = {
      uid: cred.user.uid,
      email: cred.user.email || normEmail,
      displayName: cred.user.displayName || 'University Student',
      role: 'student',
      rollNo: normEmail.split('@')[0].toUpperCase(),
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', cred.user.uid), sanitizeFirestoreData(appUser));
  }

  if (appUser.role !== 'student') {
    await fbSignOut(auth);
    throw new Error('Officers and administrators must log in through the Authority Portal.');
  }

  return appUser;
}

// Authority Registration
export async function registerAuthorityUser(data: AuthorityRegistrationData): Promise<AppUser> {
  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const cleanEmpId = data.employeeId.trim().toUpperCase();
  const cleanEmail = data.email.trim().toLowerCase();

  const cred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
  await updateProfile(cred.user, { displayName: data.fullName.trim() });

  const appUser: AppUser = {
    uid: cred.user.uid,
    email: cleanEmail,
    displayName: data.fullName.trim(),
    role: data.role,
    employeeId: cleanEmpId,
    department: data.department,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'users', cred.user.uid), sanitizeFirestoreData(appUser));
  await setDoc(doc(db, 'employee_index', cleanEmpId), sanitizeFirestoreData({
    employeeId: cleanEmpId,
    email: cleanEmail,
    uid: cred.user.uid,
    role: data.role,
    department: data.department,
    displayName: data.fullName.trim()
  }));

  return appUser;
}

// Authority Login by Employee ID + Password
export async function loginAuthorityUser(employeeId: string, password: string): Promise<AppUser> {
  const cleanEmpId = employeeId.trim().toUpperCase();

  // 1. Look up in employee_index in Firestore
  let officerEmail: string | null = null;
  let officerMeta: any = null;

  try {
    const empSnap = await getDoc(doc(db, 'employee_index', cleanEmpId));
    if (empSnap.exists()) {
      officerMeta = empSnap.data();
      officerEmail = officerMeta.email;
    }
  } catch (e) {
    console.warn('Employee index lookup error:', e);
  }

  // 2. If not found in index, check default demo authorities list
  if (!officerEmail) {
    const demo = DEFAULT_DEMO_AUTHORITIES.find((a) => a.employeeId.toUpperCase() === cleanEmpId);
    if (demo) {
      officerEmail = demo.email;
      officerMeta = demo;
    }
  }

  if (!officerEmail) {
    throw new Error(`Employee ID "${employeeId}" not recognized. Please verify your Employee ID or register an authority account.`);
  }

  let cred;
  try {
    cred = await signInWithEmailAndPassword(auth, officerEmail, password);
  } catch (err: any) {
    const demo = DEFAULT_DEMO_AUTHORITIES.find((a) => a.employeeId.toUpperCase() === cleanEmpId);
    if (demo && password === demo.password) {
      try {
        cred = await createUserWithEmailAndPassword(auth, officerEmail, password);
        await updateProfile(cred.user, { displayName: demo.displayName });
      } catch (inner) {
        throw err;
      }
    } else {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        throw new Error('Invalid Employee ID or password. Please verify your credentials.');
      }
      throw err;
    }
  }

  // Fetch user profile from Firestore
  let appUser: AppUser | null = null;
  try {
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
    if (userDoc.exists()) {
      appUser = userDoc.data() as AppUser;
    }
  } catch (e) {
    console.warn('Could not fetch user profile:', e);
  }

  if (!appUser) {
    appUser = {
      uid: cred.user.uid,
      email: officerEmail,
      displayName: officerMeta?.displayName || cred.user.displayName || 'Department Officer',
      role: officerMeta?.role || 'library_officer',
      department: officerMeta?.department,
      employeeId: cleanEmpId,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', cred.user.uid), sanitizeFirestoreData(appUser));
    await setDoc(doc(db, 'employee_index', cleanEmpId), sanitizeFirestoreData({
      employeeId: cleanEmpId,
      email: officerEmail,
      uid: cred.user.uid,
      role: appUser.role,
      department: appUser.department,
      displayName: appUser.displayName
    }));
  }

  if (appUser.role === 'student') {
    await fbSignOut(auth);
    throw new Error('Student accounts are not authorized to access the Higher Authority Portal.');
  }

  return appUser;
}

// Password Reset
export async function resetUserPassword(email: string): Promise<void> {
  const normEmail = email.trim().toLowerCase();
  await sendPasswordResetEmail(auth, normEmail);
}

// User Profile Fetch
export async function getUserProfile(uid: string): Promise<AppUser | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as AppUser;
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Sign Out
export async function logoutAppUser(): Promise<void> {
  await fbSignOut(auth);
}
