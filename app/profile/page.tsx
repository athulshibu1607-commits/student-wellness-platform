'use client';

import React from 'react';
import Link from 'next/link';
import { useAppState } from '@/components/StateContext';
import { 
  User, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Settings, 
  Download, 
  LogOut,
  Mail,
  ShieldCheck
} from 'lucide-react';

export default function ProfilePage() {
  const { user, getVelocityStats, exportUserData, logout } = useAppState();
  const stats = getVelocityStats();

  // Initials for avatar
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'JS';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 flex-shrink-0 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-black text-2xl text-teal-300">
              {initials}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h1 className="text-2xl font-black text-white tracking-tight">{user.name}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 self-center sm:self-auto">
                {user.role}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                {user.major}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                Semester {user.semester}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Progress Summary */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Academic Progress
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Weekly Focus Time</span>
            </div>
            <div className="text-2xl font-black text-white">
              {stats.totalHoursStudied}h
              <span className="text-xs font-normal text-slate-400 ml-1.5">/ {stats.weeklyTargetHours}h</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tasks Completed</span>
            </div>
            <div className="text-2xl font-black text-white">
              {stats.tasksCompleted}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Study Streak</span>
            </div>
            <div className="text-2xl font-black text-white">
              {stats.focusStreakDays}
              <span className="text-xs font-normal text-slate-400 ml-1.5">Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Account Actions
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/settings"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Edit Profile & Preferences</span>
          </Link>

          <button
            onClick={exportUserData}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-teal-300 rounded-xl text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export Account Data</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-950/30 hover:bg-red-900/50 text-red-300 rounded-xl text-xs font-semibold border border-red-800/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
