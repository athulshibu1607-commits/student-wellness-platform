'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  BookOpen,
  GraduationCap,
  Users2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header / Origin */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>The Philosophy Behind Jijnasu</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          From Chaos to Clarity in Engineering
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Derived from the Sanskrit <span className="text-teal-300 font-bold">जिज्ञासु (Jijñāsu)</span> — meaning <em>"one who is animated by an earnest thirst for knowledge, truth, and inquiry."</em>
        </p>
      </div>

      {/* The Origin Story */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Why We Built Jijnasu
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Engineering curricula are notorious for unremitting intensity. Between multi-week laboratory checkpoints, complex algorithmic problem sets, continuous internal assessments, and national entrance exams like GATE, engineering undergraduates face an unprecedented cognitive load.
          </p>
          <p>
            Yet the tools provided to students remain fundamentally fractured. Generic to-do lists treat a 20-hour operating system concurrency kernel lab the same as buying groceries. Standard Pomodoro timers buzz with jarring alarms that shatter delicate programming flow. And existing mental health solutions are either clinical apps that medicalize normal academic stress or superficial meditation widgets disconnected from deadlines.
          </p>
          <p>
            Jijnasu was created to unify academic rigor with nervous system restoration. We believe that <strong className="text-white">cognitive endurance is an engineering discipline</strong> — sustained not through caffeine-fueled panic marathons, but through calm focus, clear prioritization, and restorative biofeedback.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">The Four Guiding Principles</h2>
          <p className="text-xs text-slate-400 mt-1">Our commitments to student dignity, privacy, and wellbeing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-base font-bold text-white">Calm-by-Design Aesthetics</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We reject high-dopamine gamification, aggressive streak guilt, and flashing red deadline warnings. Jijnasu utilizes deep navy palettes, muted teals, and soft ambient soundscapes to keep your nervous system in parasympathetic equilibrium.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-base font-bold text-white">Non-Clinical Safety Boundaries</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We never diagnose medical conditions or issue clinical labels. Self-reported stress measures workload pressure, not pathology. For genuine acute distress, 24/7 verified human crisis helplines are permanently pinned and accessible.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-base font-bold text-white">Decisiveness Over Overwhelm</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every view in Jijnasu answers the singular question: <em>"What should I do next?"</em> By dynamically surfacing the single highest-leverage task, we protect students from decision fatigue.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="text-base font-bold text-white">Transparent AI & Privacy</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              MentorAI identifies itself transparently as an artificial intelligence companion. It uses Socratic reasoning to guide your thinking rather than hallucinating solutions. All personal study data remains under user control with complete structured export and permanent account deletion guarantees.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8 border-t border-white/10 space-y-4">
        <h3 className="text-xl font-bold text-white">Ready to experience Jijnasu?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Start your journey with our demo engineering curriculum template or initialize a clean personal workspace in seconds.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all"
        >
          <span>Launch Your Cockpit</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
