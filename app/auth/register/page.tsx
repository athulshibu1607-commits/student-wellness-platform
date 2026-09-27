'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/components/StateContext';
import { User, Lock, Mail, ArrowRight, BookOpen } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAppState();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [major, setMajor] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Please provide all required fields');
      return;
    }

    setError(null);
    setLoading(true);

    if (registerUser) {
      const res = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        major,
        semester
      });
      setLoading(false);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setError(res.error || 'Registration failed');
      }
    } else {
      setLoading(false);
      router.push('/dashboard');
    }
  };

  const engineeringMajors = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Biotechnology Engineering',
    'Aerospace Engineering'
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-[1.5px] mx-auto mb-3 shadow-lg shadow-teal-500/25">
            <div className="w-full h-full bg-[#080D1A] rounded-[14px] flex items-center justify-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-tr from-sky-400 to-teal-300 font-black text-xl">
                जि
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Create Student Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Join the engineering wellness and academic productivity sanctum
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs font-semibold flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Priya Iyer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              University Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="priya.iyer@eng.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Discipline / Major
              </label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {engineeringMajors.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Sem {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Set Security Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>Complete Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-sky-400 hover:underline font-semibold">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
