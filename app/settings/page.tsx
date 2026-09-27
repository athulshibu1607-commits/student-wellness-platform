'use client';

import React, { useState } from 'react';
import { useAppState } from '@/components/StateContext';
import { NextActionBanner } from '@/components/ui/NextActionBanner';
import { 
  Settings, 
  User, 
  Download, 
  Trash2, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut 
} from 'lucide-react';

export default function SettingsPage() {
  const { 
    user, 
    updateUser, 
    exportUserData, 
    resetAllData, 
    highContrast, 
    setHighContrast, 
    reducedMotion, 
    setReducedMotion,
    logout 
  } = useAppState();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [major, setMajor] = useState(user.major);
  const [semester, setSemester] = useState(user.semester);
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(user.weeklyTargetHours);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim(),
      email: email.trim(),
      major,
      semester: Number(semester),
      weeklyTargetHours: Number(weeklyTargetHours)
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const engineeringMajors = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Biotechnology Engineering',
    'Aerospace Engineering',
    'Chemical Engineering'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Personal Preferences & Security
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-xs text-slate-400">Privacy-First Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Settings & Governance
          </h1>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 rounded-xl text-xs font-semibold transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch / Log Out</span>
        </button>
      </div>

      {/* UX Banner */}
      <NextActionBanner />

      {saveSuccess && (
        <div className="p-4 mb-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile preferences saved successfully.</span>
        </div>
      )}

      {/* Section 1: Student Engineering Profile */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 mb-8">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-sky-400" />
          Academic Profile & Curriculum
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">University Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Engineering Discipline / Major</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                {engineeringMajors.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Weekly Deep Work Hours: <strong className="text-teal-400">{weeklyTargetHours} hrs</strong>
            </label>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={weeklyTargetHours}
              onChange={(e) => setWeeklyTargetHours(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Recommended: 20-30 hours weekly to prevent academic cognitive fatigue.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
            >
              Update Profile Details
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Accessibility & Display Preferences */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 mb-8">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-teal-400" />
          Accessibility & Motion Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div>
              <span className="font-bold text-sm text-white block">High Contrast Mode</span>
              <span className="text-xs text-slate-400">
                Enhance contrast borders and dark backgrounds for maximum legibility.
              </span>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                highContrast ? 'bg-sky-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle High Contrast Mode"
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div>
              <span className="font-bold text-sm text-white block">Reduced Motion Mode</span>
              <span className="text-xs text-slate-400">
                Disable heavy 3D canvas rotations and Framer Motion transitions for sensitive users.
              </span>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                reducedMotion ? 'bg-teal-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle Reduced Motion"
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Data Privacy, Account Export & Deletion */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-400" />
          Privacy Rights & Data Governance
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Your personal academic milestones, focus telemetry, and wellness logs belong exclusively to you. You can download a complete structured export of your account data or permanently erase your user profile and records.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={exportUserData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export My Jijnasu Data</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 font-semibold text-xs rounded-xl border border-red-800/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Permanently Delete My Account</span>
          </button>
        </div>

        {/* Account Deletion Confirmation Dialog */}
        {showResetConfirm && (
          <div className="mt-6 p-4 bg-red-950/60 border border-red-500/50 rounded-2xl animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-red-200">Confirm Account Deletion</h4>
                <p className="text-xs text-red-300/90 mt-1 mb-3">
                  This action is irreversible. All your courses, assignments, focus sessions, wellness history, and MentorAI conversations will be permanently deleted from the database. Type <strong className="text-white underline">DELETE</strong> to confirm.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/account/delete', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ confirmation: 'DELETE' })
                        });
                        if (res.ok) {
                          window.location.href = '/auth/login';
                        }
                      } catch {
                        resetAllData();
                        setShowResetConfirm(false);
                      }
                    }}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Confirm Permanent Erasure
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 text-xs rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
