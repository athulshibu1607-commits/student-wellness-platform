'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/components/StateContext';
import { 
  Compass, 
  CalendarCheck, 
  Hourglass, 
  Heart, 
  Bot, 
  BarChart3, 
  Users, 
  Bell, 
  Settings, 
  ShieldCheck, 
  LifeBuoy,
  ChevronDown,
  Sparkles,
  HelpCircle,
  LogOut,
  Layers,
  Home,
  User
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, notifications, setCrisisModalOpen, logout } = useAppState();
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const moreRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Primary focused desktop navigation
  const primaryNav = [
    { href: '/planner', label: 'Planner', icon: CalendarCheck },
    { href: '/focus', label: 'Focus', icon: Hourglass },
    { href: '/wellness', label: 'Wellness', icon: Heart },
    { href: '/mentor', label: 'MentorAI', icon: Bot },
    { href: '/community', label: 'Community', icon: Users },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile sheets on route change
  useEffect(() => {
    setMoreDropdownOpen(false);
    setUserDropdownOpen(false);
    setMobileMoreOpen(false);
  }, [pathname]);

  const isAdmin = user.role === 'ADMIN';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#080D1A]/90 backdrop-blur-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link 
            href={user.email && user.email !== 'guest@eng.edu' ? '/dashboard' : '/'} 
            className="flex items-center gap-3 group cursor-pointer flex-shrink-0"
            aria-label="Jijnasu Cockpit"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 p-[1.5px] shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080D1A] rounded-[10px] flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-tr from-sky-400 to-teal-300 font-black text-sm">
                  जि
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-sky-300 transition-colors">
                Jijnasu
              </span>
              <span className="hidden xl:inline-block text-[9px] font-semibold tracking-wider text-teal-400/90 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-500/20 uppercase">
                Calm OS
              </span>
            </div>
          </Link>

          {/* Desktop Focused Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Primary Navigation">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === '/dashboard'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Dashboard</span>
            </Link>

            {primaryNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/25 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* "More" Secondary Navigation Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  moreDropdownOpen || ['/progress', '/notifications', '/admin', '/help', '/features'].includes(pathname)
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180 text-sky-400' : 'text-slate-400'}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-[#0D1527] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                  <Link
                    href="/progress"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold">Analytics & Progress</div>
                      <div className="text-[10px] text-slate-400">Study velocity & habits</div>
                    </div>
                  </Link>

                  <Link
                    href="/notifications"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="font-semibold">Alerts & Inboxes</div>
                        <div className="text-[10px] text-slate-400">Deadlines & reminders</div>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-sky-500 text-slate-950 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/help"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-teal-400" />
                    <div>
                      <div className="font-semibold">Help & Shortcuts</div>
                      <div className="text-[10px] text-slate-400">System FAQ & hotkeys</div>
                    </div>
                  </Link>

                  {/* Strictly hidden unless authenticated as ADMIN */}
                  {isAdmin && (
                    <div className="pt-1 mt-1 border-t border-white/10">
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-amber-500/10 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="font-semibold">Admin Governance</div>
                          <div className="text-[10px] text-amber-400/80">Campus safety telemetry</div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Non-clinical Crisis Interception Support */}
            <button
              onClick={() => setCrisisModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-800/30 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Immediate 24/7 Verified Mental Health Crisis Helplines"
              aria-label="Access Crisis Support Helplines"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">SOS Support</span>
            </button>

            {/* Notifications Shortcut with unread badge */}
            <Link
              href="/notifications"
              className="relative p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full" />
              )}
            </Link>

            {/* User Profile / Settings Menu */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                aria-label="User account menu"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-400 to-teal-400 text-slate-950 font-black text-[11px] flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-xs text-slate-200 font-medium max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="hidden sm:inline w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0D1527] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-white/10">
                    <div className="text-xs font-bold text-white truncate">{user.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors mt-1"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Settings & Export</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MOBILE BOTTOM NAVIGATION (Section 15)
          5 ergonomic icons: Home, Planner, Focus, Wellness, More
          ========================================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080D1A]/95 backdrop-blur-2xl border-t border-white/10 px-3 py-2 flex items-center justify-around safe-area-pb">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors ${
            pathname === '/dashboard' || pathname === '/' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <Link
          href="/planner"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors ${
            pathname === '/planner' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Planner</span>
        </Link>

        <Link
          href="/focus"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors ${
            pathname === '/focus' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Hourglass className="w-4 h-4" />
          <span>Focus</span>
        </Link>

        <Link
          href="/wellness"
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors ${
            pathname === '/wellness' ? 'text-orange-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wellness</span>
        </Link>

        <button
          onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
            mobileMoreOpen || ['/mentor', '/community', '/progress', '/settings', '/notifications'].includes(pathname)
              ? 'text-sky-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Open More modules"
        >
          <Layers className="w-4 h-4" />
          <span>More</span>
        </button>
      </div>

      {/* Mobile "More" Drawer Modal */}
      {mobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in-50">
          <div 
            className="flex-1" 
            onClick={() => setMobileMoreOpen(false)}
          />
          <div className="bg-[#0D1527] border-t border-white/10 rounded-t-3xl p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">More Tools</span>
              <button 
                onClick={() => setMobileMoreOpen(false)}
                className="text-xs text-sky-400 font-semibold"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <Link
                href="/mentor"
                onClick={() => setMobileMoreOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex flex-col gap-1.5"
              >
                <Bot className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white">MentorAI</span>
                <span className="text-[10px] text-slate-400">Socratic guidance</span>
              </Link>

              <Link
                href="/community"
                onClick={() => setMobileMoreOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex flex-col gap-1.5"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">Community</span>
                <span className="text-[10px] text-slate-400">Study circles</span>
              </Link>

              <Link
                href="/progress"
                onClick={() => setMobileMoreOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex flex-col gap-1.5"
              >
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">Analytics</span>
                <span className="text-[10px] text-slate-400">Velocity trends</span>
              </Link>

              <Link
                href="/notifications"
                onClick={() => setMobileMoreOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex flex-col gap-1.5"
              >
                <Bell className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-white">Notifications</span>
                <span className="text-[10px] text-slate-400">{unreadCount} unread</span>
              </Link>

              <Link
                href="/profile"
                onClick={() => setMobileMoreOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex flex-col gap-1.5"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">Profile</span>
                <span className="text-[10px] text-slate-400">Account overview</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setMobileMoreOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex flex-col gap-1.5"
              >
                <Settings className="w-4 h-4 text-slate-300" />
                <span className="font-bold text-white">Settings</span>
                <span className="text-[10px] text-slate-400">Data & preferences</span>
              </Link>

              <Link
                href="/help"
                onClick={() => setMobileMoreOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex flex-col gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-teal-300" />
                <span className="font-bold text-white">Help & FAQ</span>
                <span className="text-[10px] text-slate-400">System guides</span>
              </Link>
            </div>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMoreOpen(false)}
                className="block p-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-2xl border border-amber-500/20 text-xs text-amber-300 font-semibold"
              >
                Admin Governance Console
              </Link>
            )}

            <div className="pt-2">
              <button
                onClick={() => {
                  logout();
                  setMobileMoreOpen(false);
                }}
                className="w-full py-2.5 bg-red-950/40 text-red-300 border border-red-800/30 rounded-xl text-xs font-semibold text-center cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
