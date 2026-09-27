'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/components/StateContext';
import { Compass, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { Role } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppState();

  const [email, setEmail] = useState('arjun.sharma@eng.edu');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<Role>('STUDENT');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password, role);
    setLoading(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Invalid university credentials');
    }
  };

  const handleQuickDemo = async (demoRole: Role, demoEmail: string, demoPassword = 'password123') => {
    setError(null);
    setLoading(true);
    const result = await login(demoEmail, demoPassword, demoRole);
    setLoading(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-[1.5px] mx-auto mb-3 shadow-lg shadow-sky-500/25">
            <div className="w-full h-full bg-[#080D1A] rounded-[14px] flex items-center justify-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-tr from-sky-400 to-teal-300 font-black text-xl">
                जि
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Sign In to Jijnasu
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your engineering student wellness & productivity cockpit
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs font-semibold flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              University Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Portal Access Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="STUDENT">Engineering Student</option>
              <option value="MENTOR">Faculty Advisor / Mentor</option>
              <option value="ADMIN">Campus Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>Enter Cockpit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Demo Role Switchers for testing */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block text-center mb-2.5">
            Instant One-Click Demo Profiles
          </span>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('STUDENT', 'arjun.sharma@eng.edu', 'password123')}
              className="p-2 bg-white/5 hover:bg-sky-500/20 rounded-xl text-slate-300 hover:text-sky-300 border border-white/5 transition-colors cursor-pointer text-center"
            >
              Student
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('MENTOR', 'dr.ramanujan@eng.edu', 'password123')}
              className="p-2 bg-white/5 hover:bg-purple-500/20 rounded-xl text-slate-300 hover:text-purple-300 border border-white/5 transition-colors cursor-pointer text-center"
            >
              Faculty
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('ADMIN', 'campus.admin@eng.edu', 'admin123')}
              className="p-2 bg-white/5 hover:bg-teal-500/20 rounded-xl text-slate-300 hover:text-teal-300 border border-white/5 transition-colors cursor-pointer text-center"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          New to Jijnasu?{' '}
          <Link href="/auth/register" className="text-teal-400 hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
