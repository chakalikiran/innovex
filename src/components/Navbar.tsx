import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Bell,
  CheckCircle,
  User,
  LogOut,
  FileText,
  ChevronDown,
  BookOpen,
  Home,
  Trophy,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { DepartmentKey } from '../types';

interface NavbarProps {
  currentTab: 'landing' | 'home' | 'how-it-works' | 'my-clearance' | 'certificate';
  setCurrentTab: (tab: 'landing' | 'home' | 'how-it-works' | 'my-clearance' | 'certificate') => void;
  onOpenSignIn: () => void;
  onOpenApply: () => void;
  onOpenAuthority?: (dept?: DepartmentKey) => void;
}

export function Navbar({ currentTab, setCurrentTab, onOpenSignIn, onOpenApply, onOpenAuthority }: NavbarProps) {
  const { studentUser, logoutStudent, notifications, unreadCount, markNotificationRead } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAuthorityMenu, setShowAuthorityMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const authorityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (authorityRef.current && !authorityRef.current.contains(e.target as Node)) {
        setShowAuthorityMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full pt-3 sm:pt-5 pb-2 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1A1F26] border border-[#E2DDD3] dark:border-slate-800 shadow-xs px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8 lg:gap-12">
          <button
            id="brand-logo-btn"
            onClick={() => setCurrentTab('landing')}
            className="flex items-center text-left group focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              ClearPass
            </span>
          </button>

          {/* Student Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              id="nav-landing-btn"
              onClick={() => setCurrentTab('landing')}
              className={`transition-colors py-1 ${
                currentTab === 'landing' || currentTab === 'home'
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              id="nav-how-it-works-btn"
              onClick={() => setCurrentTab('how-it-works')}
              className={`transition-colors py-1 ${
                currentTab === 'how-it-works'
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              How It Works
            </button>
            <button
              id="nav-my-clearance-btn"
              onClick={() => setCurrentTab('my-clearance')}
              className={`transition-colors py-1 flex items-center gap-1.5 ${
                currentTab === 'my-clearance'
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              My Clearance
            </button>
            <button
              id="nav-certificate-btn"
              onClick={() => setCurrentTab('certificate')}
              className={`transition-colors py-1 ${
                currentTab === 'certificate'
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Certificate
            </button>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {studentUser ? (
            <div className="flex items-center gap-2.5">
              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  id="notifications-toggle-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-[var(--border-color)] flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Clearance Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <span className="text-xs font-medium text-[var(--accent-primary)]">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-[var(--text-muted)] text-center">No notifications yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3.5 hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors ${
                              !n.read ? 'bg-[var(--accent-light)]/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-[var(--text-primary)]">{n.title}</p>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-[var(--text-muted)] mt-1.5 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Student Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  id="student-profile-menu-btn"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-bold text-xs flex items-center justify-center">
                    {studentUser.displayName.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight truncate max-w-[110px]">
                      {studentUser.displayName}
                    </p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">
                      {studentUser.rollNo || 'Student'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-lg py-1.5 z-50">
                    <div className="px-3.5 py-2.5 border-b border-[var(--border-color)]">
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{studentUser.displayName}</p>
                      <p className="text-xs text-[var(--text-muted)] font-mono truncate">{studentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--status-approved-bg)] text-[var(--status-approved)] border border-[var(--status-approved-border)]">
                        Roll: {studentUser.rollNo || 'CS2022-048'}
                      </span>
                    </div>

                    <button
                      id="profile-view-clearance-btn"
                      onClick={() => {
                        setCurrentTab('my-clearance');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] flex items-center gap-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--status-approved)]" />
                      View Clearance Status
                    </button>
                    <button
                      id="profile-view-cert-btn"
                      onClick={() => {
                        setCurrentTab('certificate');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      Digital Certificate
                    </button>
                    <div className="border-t border-[var(--border-color)] my-1" />
                    <button
                      id="profile-sign-out-btn"
                      onClick={() => {
                        logoutStudent();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Direct Student Logout Button */}
              <button
                id="student-logout-btn"
                onClick={() => {
                  logoutStudent();
                  setShowProfileMenu(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs font-semibold shadow-2xs transition-colors"
                title="Log out of student account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              id="student-sign-in-btn"
              onClick={onOpenSignIn}
              className="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors"
            >
              Sign In
            </button>
          )}

          {/* Dark / Light Toggle Pill matching screenshot */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors flex items-center gap-1.5"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-500" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-[var(--border-color)] py-2 px-3 bg-[var(--bg-surface)]">
        <button
          onClick={() => setCurrentTab('landing')}
          className={`text-xs font-medium py-1 px-2.5 rounded ${
            currentTab === 'landing' || currentTab === 'home' ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'
          }`}
        >
          Landing
        </button>
        <button
          onClick={() => setCurrentTab('how-it-works')}
          className={`text-xs font-medium py-1 px-2.5 rounded ${
            currentTab === 'how-it-works' ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'
          }`}
        >
          How It Works
        </button>
        <button
          onClick={() => setCurrentTab('my-clearance')}
          className={`text-xs font-medium py-1 px-2.5 rounded ${
            currentTab === 'my-clearance' ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'
          }`}
        >
          My Clearance
        </button>
        <button
          onClick={() => setCurrentTab('certificate')}
          className={`text-xs font-medium py-1 px-2.5 rounded ${
            currentTab === 'certificate' ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'
          }`}
        >
          Certificate
        </button>
        {studentUser && (
          <button
            id="mobile-student-logout-btn"
            onClick={logoutStudent}
            className="text-xs font-semibold py-1 px-2 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
