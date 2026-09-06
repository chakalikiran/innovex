import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppUser,
  UserRole,
  DepartmentKey,
  NotificationItem,
  StudentRegistrationData,
  AuthorityRegistrationData
} from '../types';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  loginStudentUser,
  registerStudentUser,
  loginAuthorityUser,
  registerAuthorityUser,
  resetUserPassword,
  logoutAppUser,
  getUserProfile,
  DEFAULT_DEMO_STUDENT,
  DEFAULT_DEMO_AUTHORITIES
} from '../firebase/service';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

interface AuthContextType {
  studentUser: AppUser | null;
  authorityUser: AppUser | null;
  isLoading: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
  signInStudent: (email: string, password: string) => Promise<AppUser>;
  registerStudent: (data: StudentRegistrationData) => Promise<AppUser>;
  signInAuthority: (employeeId: string, password: string) => Promise<AppUser>;
  registerAuthority: (data: AuthorityRegistrationData) => Promise<AppUser>;
  resetPassword: (email: string) => Promise<void>;
  logoutStudent: () => Promise<void>;
  logoutAuthority: () => Promise<void>;
  markNotificationRead: (id: string) => void;
  // Legacy helpers
  loginStudent: (rollNo: string, name: string, email: string) => void;
  loginStudentWithGoogle: () => Promise<void>;
  loginAuthority: (role: UserRole, officerName: string, email: string, department?: DepartmentKey) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    recipientEmail: 'rahul.r200048@rguktrkv.ac.in',
    studentRollNo: 'R200048',
    title: 'Finance Department Approved',
    message: 'Mrs. Elena Rostova approved your tuition ledger clearance.',
    type: 'status_change',
    requestId: 'REQ-2026-4821',
    read: false,
    createdAt: '2026-09-04T16:45:00Z'
  },
  {
    id: 'NOTIF-02',
    recipientEmail: 'rahul.r200048@rguktrkv.ac.in',
    studentRollNo: 'R200048',
    title: 'Hostel Handover Cleared',
    message: 'Mandakini Residence B-304 room inspection completed successfully.',
    type: 'status_change',
    requestId: 'REQ-2026-4821',
    read: true,
    createdAt: '2026-09-03T14:30:00Z'
  },
  {
    id: 'NOTIF-03',
    recipientEmail: 'rahul.r200048@rguktrkv.ac.in',
    studentRollNo: 'R200048',
    title: 'Sports Verification Under Review',
    message: 'Locker #42 handover is currently under review by Coach Marcus Vance.',
    type: 'action_required',
    requestId: 'REQ-2026-4821',
    read: true,
    createdAt: '2026-09-02T11:00:00Z'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // Student session
  const [studentUser, setStudentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('clearpass_student_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  // Authority session (strictly isolated for /authority)
  const [authorityUser, setAuthorityUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('clearpass_authority_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);

  // Sync session with LocalStorage
  useEffect(() => {
    if (studentUser) {
      localStorage.setItem('clearpass_student_user', JSON.stringify(studentUser));
    } else {
      localStorage.removeItem('clearpass_student_user');
    }
  }, [studentUser]);

  useEffect(() => {
    if (authorityUser) {
      localStorage.setItem('clearpass_authority_user', JSON.stringify(authorityUser));
    } else {
      localStorage.removeItem('clearpass_authority_user');
    }
  }, [authorityUser]);

  // Sync with Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      setIsLoading(true);
      if (fbUser) {
        try {
          const profile = await getUserProfile(fbUser.uid);
          if (profile) {
            if (profile.role === 'student') {
              setStudentUser(profile);
              setAuthorityUser(null);
            } else {
              setAuthorityUser(profile);
              setStudentUser(null);
            }
          }
        } catch (e) {
          console.warn('Error fetching authenticated profile:', e);
        }
      } else {
        // If not authenticated in Firebase Auth, clear users
        setStudentUser(null);
        setAuthorityUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time notifications for student
  useEffect(() => {
    if (!studentUser || !auth.currentUser) return;
    try {
      const notifQuery = query(
        collection(db, 'notifications'),
        where('recipientEmail', '==', studentUser.email)
      );
      const unsubscribe = onSnapshot(
        notifQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: NotificationItem[] = [];
            snapshot.forEach((d) => {
              items.push({ id: d.id, ...d.data() } as NotificationItem);
            });
            setNotifications(items);
          }
        },
        (error) => {
          console.warn('Notifications subscription fallback:', error);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      // fallback to sample
    }
  }, [studentUser?.email]);

  // Student Auth
  const signInStudent = async (email: string, password: string): Promise<AppUser> => {
    const user = await loginStudentUser(email, password);
    setStudentUser(user);
    setAuthorityUser(null);
    return user;
  };

  const registerStudent = async (data: StudentRegistrationData): Promise<AppUser> => {
    const user = await registerStudentUser(data);
    setStudentUser(user);
    setAuthorityUser(null);
    return user;
  };

  const logoutStudent = async () => {
    setStudentUser(null);
    await logoutAppUser().catch(() => {});
  };

  // Authority Auth
  const signInAuthority = async (employeeId: string, password: string): Promise<AppUser> => {
    const officer = await loginAuthorityUser(employeeId, password);
    setAuthorityUser(officer);
    setStudentUser(null);
    return officer;
  };

  const registerAuthority = async (data: AuthorityRegistrationData): Promise<AppUser> => {
    const officer = await registerAuthorityUser(data);
    setAuthorityUser(officer);
    setStudentUser(null);
    return officer;
  };

  const logoutAuthority = async () => {
    setAuthorityUser(null);
    await logoutAppUser().catch(() => {});
  };

  const resetPassword = async (email: string) => {
    await resetUserPassword(email);
  };

  // Legacy Helpers
  const loginStudent = (rollNo: string, name: string, email: string) => {
    const user: AppUser = {
      uid: `stud_${rollNo.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      email,
      displayName: name,
      role: 'student',
      rollNo
    };
    setStudentUser(user);
    setAuthorityUser(null);
  };

  const loginStudentWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const user: AppUser = {
          uid: result.user.uid,
          email: result.user.email || 'student@rguktrkv.ac.in',
          displayName: result.user.displayName || 'University Student',
          role: 'student',
          rollNo: 'R200048'
        };
        setStudentUser(user);
        setAuthorityUser(null);
      }
    } catch (err) {
      console.warn('Google sign-in fallback:', err);
      loginStudent('R200048', 'Rahul Sharma', 'rahul.r200048@rguktrkv.ac.in');
    }
  };

  const loginAuthority = (role: UserRole, officerName: string, email: string, department?: DepartmentKey) => {
    const officer: AppUser = {
      uid: `auth_${role}_${Date.now()}`,
      email,
      displayName: officerName,
      role,
      department
    };
    setAuthorityUser(officer);
    setStudentUser(null);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        studentUser,
        authorityUser,
        isLoading,
        notifications,
        unreadCount,
        signInStudent,
        registerStudent,
        signInAuthority,
        registerAuthority,
        resetPassword,
        logoutStudent,
        logoutAuthority,
        markNotificationRead,
        loginStudent,
        loginStudentWithGoogle,
        loginAuthority
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
