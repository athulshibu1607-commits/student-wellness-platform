'use client';

import React from 'react';
import Link from 'next/link';
import { useAppState } from '@/components/StateContext';
import { ShieldAlert, Heart, Eye, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCrisisModalOpen, highContrast, setHighContrast, reducedMotion, setReducedMotion } = useAppState();

  return (
    <footer className="w-full border-t border-white/10 bg-[#060A14] text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Philosophy */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-bold text-sm">
                जि
              </div>
              <span className="text-white font-extrabold text-base tracking-tight">
                Jijnasu
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
              An Engineering Student Wellness & Productivity Sanctuary. Designed with calm-by-design principles, cognitive focus timers, empathetic AI mentoring, and workload stress monitoring.
            </p>
            {/* Non-Medical Clinical Disclaimer */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-slate-300 max-w-md leading-relaxed">
              <strong className="text-sky-300 block mb-0.5">Clinical Disclaimer:</strong>
              Jijnasu is an educational self-regulation platform. Stress metrics reflect self-reported workload pressure and do not constitute psychiatric or medical diagnosis. For clinical distress, connect with certified professionals.
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform & Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-sky-400 transition-colors">
                  Command Dashboard
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-sky-400 transition-colors">
                  Academic Planner & Tasks
                </Link>
              </li>
              <li>
                <Link href="/focus" className="hover:text-sky-400 transition-colors">
                  3D Focus Sanctum
                </Link>
              </li>
              <li>
                <Link href="/wellness" className="hover:text-sky-400 transition-colors">
                  Daily Wellness Check-in
                </Link>
              </li>
              <li>
                <Link href="/mentor" className="hover:text-sky-400 transition-colors">
                  MentorAI Co-Pilot
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-sky-400 transition-colors">
                  Engineering Circles
                </Link>
              </li>
              <li className="pt-2 border-t border-white/5">
                <Link href="/features" className="text-teal-400 hover:text-teal-300 transition-colors">
                  Features Overview
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-teal-400 hover:text-teal-300 transition-colors">
                  About & Philosophy
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-teal-400 hover:text-teal-300 transition-colors">
                  Help / FAQ / Shortcuts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Accessibility & Emergency */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Safety & Accessibility
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => setCrisisModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-700/50 rounded-xl text-red-300 text-xs font-bold transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>24/7 Crisis Helplines</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  High Contrast
                </span>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    highContrast ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                  aria-label="Toggle High Contrast Mode"
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  Reduced Motion
                </span>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    reducedMotion ? 'bg-teal-500' : 'bg-slate-700'
                  }`}
                  aria-label="Toggle Reduced Motion"
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      reducedMotion ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Jijnasu Platform. Built for engineering student thriving.</p>
          <div className="flex items-center gap-4">
            <Link href="/settings" className="hover:text-slate-300 transition-colors">
              Data Privacy & Export
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-slate-300 transition-colors">
              Campus Governance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
