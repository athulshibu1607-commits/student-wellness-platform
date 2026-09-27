'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Keyboard, 
  Download, 
  Sparkles,
  ArrowRight,
  Phone
} from 'lucide-react';
import { useAppState } from '@/components/StateContext';

export default function HelpPage() {
  const { setCrisisModalOpen } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Jijnasu decide "What should I do next?"',
      a: 'The Next Action engine continuously evaluates your active tasks, filtering out completed items and ordering pending work primarily by priority level (URGENT > HIGH > MEDIUM > LOW) and secondarily by impending due dates. It connects directly with Focus Studio to launch a distraction-free timer with one click.'
    },
    {
      q: 'What is the difference between Demo Mode and Clean Workspace Mode?',
      a: 'Demo Mode ships with realistic undergraduate engineering curriculum examples (such as xv6 OS kernel synchronization, Ford-Fulkerson max-flow proofs, and Raft consensus in Go). Clean Workspace Mode allows you to start from a completely blank slate with zero demo data. You can switch between modes at any time via the top toggle banner or in Settings.'
    },
    {
      q: 'Is Jijnasu a medical or psychiatric diagnosis application?',
      a: 'No. Jijnasu is an educational self-regulation and productivity platform. Self-reported mood, stress, and energy ratings represent academic workload pressure and do not constitute clinical psychological or medical assessment. If you or someone you know is in acute distress, certified 24/7 crisis hotlines are always accessible via the SOS Support button.'
    },
    {
      q: 'How does the procedural Web Audio soundscape work in Focus Studio?',
      a: 'Focus Studio synthesizes ambient soundscapes directly in your browser using the HTML5 Web Audio API. Unlike pre-recorded loops or streaming audio, procedural soundscapes require minimal bandwidth, have no vocal distraction, and are generated using real-time pink noise filters and gentle 432Hz sine waves.'
    },
    {
      q: 'Can I export my data or delete my account?',
      a: 'Yes. In Settings, you can click "Export My Jijnasu Data" to download a complete JSON archive of all your courses, assignments, focus logs, and wellness entries. You can also permanently delete your account and all associated database records via Settings.'
    },
    {
      q: 'How does MentorAI answer technical engineering queries?',
      a: 'MentorAI operates on a transparent Socratic tutoring framework. It breaks down complex engineering problems—such as race conditions in kernel spinlocks or state transition equations in dynamic programming—into manageable invariants, prompting you to reason through solutions independently.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Support & Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          How can we help your study flow?
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Find answers regarding workload planning, 3D ambient focus, non-clinical wellness, and keyboard productivity shortcuts.
        </p>

        {/* Search */}
        <div className="relative max-w-lg mx-auto pt-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-7" />
          <input
            type="text"
            placeholder="Search questions or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-sky-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Emergency Assistance Notice */}
      <div className="p-5 bg-red-950/40 border border-red-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-500/20 rounded-xl text-red-400 flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-sm font-bold text-white block">In Crisis or Need Immediate Support?</strong>
            <p className="text-xs text-slate-300 mt-0.5">
              Verified free 24/7 human helplines (Tele-MANAS, KIRAN, 988) are available right now.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCrisisModalOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all cursor-pointer flex-shrink-0"
        >
          Open Crisis Directory
        </button>
      </div>

      {/* Keyboard Shortcuts Sheet */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Keyboard className="w-4 h-4 text-teal-400" />
          Keyboard Efficiency Shortcuts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-white/5">
            <span className="text-slate-300">Toggle Focus Timer Play/Pause</span>
            <kbd className="px-2 py-0.5 bg-white/10 text-white font-mono rounded text-[11px]">Space</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-white/5">
            <span className="text-slate-300">Reset Focus Timer to Beginning</span>
            <kbd className="px-2 py-0.5 bg-white/10 text-white font-mono rounded text-[11px]">Esc</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-white/5">
            <span className="text-slate-300">Quick Open SOS Crisis Directory</span>
            <kbd className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-800/40 font-mono rounded text-[11px]">SOS Button</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-white/5">
            <span className="text-slate-300">Export All Personal Data as JSON</span>
            <kbd className="px-2 py-0.5 bg-white/10 text-white font-mono rounded text-[11px]">Settings → Export</kbd>
          </div>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white mb-2">Frequently Asked Questions</h2>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 p-4 text-center">No questions matching your search query.</p>
        )}
      </div>

      {/* Navigation Back */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <Link href="/dashboard" className="text-teal-400 hover:underline flex items-center gap-1">
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          <span>Back to Command Dashboard</span>
        </Link>
        <Link href="/settings" className="hover:text-slate-200">
          Account & Privacy Settings
        </Link>
      </div>
    </div>
  );
}
