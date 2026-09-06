import { Router, Request, Response } from 'express';

export const clearanceRouter = Router();

// Standard clearance departments metadata
const DEPARTMENTS = [
  { id: 'library', name: 'Central University Library', code: 'LIB-01', building: 'Academic Block A', officer: 'Dr. Ramesh Rao (Head Librarian)' },
  { id: 'hostel', name: 'Hostel & Residential Office', code: 'HST-02', building: 'Student Welfare Complex', officer: 'Prof. Ananya Sen (Chief Warden)' },
  { id: 'sports', name: 'Department of Physical Education & Sports', code: 'SPT-03', building: 'Indoor Sports Arena', officer: 'Mr. David Kumar (Director of PE)' },
  { id: 'department', name: 'Academic Department Laboratory', code: 'LAB-04', building: 'Science & Engineering Wing', officer: 'Dr. Priya Sharma (HoD)' },
  { id: 'accounts', name: 'Finance & Student Accounts Bureau', code: 'ACC-05', building: 'Administrative Complex Ground Floor', officer: 'Mr. S. K. Gupta (Finance Officer)' },
  { id: 'nss', name: 'NSS & Extra-Curricular Directorate', code: 'NSS-06', building: 'Student Activity Centre', officer: 'Dr. Meenakshi Sundaram (Coordinator)' }
];

// GET /api/clearance/departments - List all clearance departments
clearanceRouter.get('/departments', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: DEPARTMENTS.length,
    departments: DEPARTMENTS
  });
});

// GET /api/clearance/status/:id - Inquire status of a clearance application
clearanceRouter.get('/status/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    success: true,
    requestId: id,
    inquiryTimestamp: new Date().toISOString(),
    status: 'ACTIVE_RECORDS_STORED_IN_FIRESTORE',
    message: `For real-time clearance status on application ${id}, the platform utilizes client-side authenticated Firestore syncing.`
  });
});
