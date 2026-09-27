'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowRight, 
  CalendarCheck, 
  Hourglass, 
  Heart, 
  Bot, 
  Users2, 
  BarChart3, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  Zap,
  Layers,
  ChevronRight,
  Flame,
  Activity,
  Check
} from 'lucide-react';

// Dynamic import of 3D Hero Scene with client-side only rendering and graceful 2D fallback
const HeroScene = dynamic(
  () => import('@/components/3d/HeroScene').then(mod => mod.HeroScene),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border border-sky-500/20 animate-pulse flex items-center justify-center">
          <span className="text-xs text-sky-400 font-mono tracking-wider">INITIALIZING JIJNASU CORE...</span>
        </div>
      </div>
    )
  }
);

export default function LandingPage() {
  const [activePillar, setActivePillar] = useState<'planner' | 'focus' | 'wellness' | 'mentor'>('planner');

  return (
    <div className="relative overflow-hidden bg-[#050811] text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-gradient-to-b from-sky-500/10 via-teal-500/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* =========================================================================
          01 — HERO SECTION
          ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-center pt-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Huge Editorial Statement */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              <span>Calm Operating System for Engineering Scholars</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05]">
              STUDY SMARTER.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300">
                FEEL BETTER.
              </span><br />
              BUILD YOUR FUTURE.
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              Jijnasu is the intelligent workspace for engineering students to manage academic pressure, deep focus, wellbeing and progress in one calm system.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-2xl shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="#problem"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm rounded-2xl border border-white/10 transition-colors cursor-pointer"
              >
                <span>Explore Architecture</span>
              </Link>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Calm-by-Design
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                Non-Clinical Safety
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Socratic AI Mentor
              </span>
            </div>
          </div>

          {/* Right Column: 3D JIJNASU CORE Ecosystem */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full h-[460px] sm:h-[520px] rounded-3xl relative">
              <HeroScene />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02 — THE PROBLEM (Spatial Editorial Contrast)
          ========================================================================= */}
      <section id="problem" className="py-24 border-t border-white/[0.06] bg-[#070B16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              02 / The Cognitive Crisis
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3 mb-6">
              Engineering school demands peak cognitive stamina. Why are we running it on chaotic tools?
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Undergraduate engineers juggle 6 technical subjects, weekly lab records, compiler debugging, competitive gate targets, and sleep deprivation. Standard checklists only increase cognitive noise.
            </p>
          </div>

          {/* Spatial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-sky-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Deadline Avalanche</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assignments, project rubrics, and midterm schedules scattered across portals, spreadsheets, and chat groups without unified priority.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-teal-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6">
                <Hourglass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fragmented Attention</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Context-switching between compiler errors, messaging pings, and superficial task managers drains the prefrontal cortex required for deep algorithms.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-6">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unmonitored Fatigue</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Late-night all-nighters degrade problem-solving stamina. Students push through chronic exhaustion without biofeedback or pacing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          03 — ONE SYSTEM ("Everything you need. One calm workspace.")
          ========================================================================= */}
      <section className="py-24 border-t border-white/[0.06] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
            03 / The Unified Operating System
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight mt-3 mb-6 max-w-4xl mx-auto">
            Everything you need.<br />
            One calm workspace.
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
            Jijnasu integrates your academic roadmap, deep work environment, wellness self-regulation, Socratic tutor, and collaborative study circles into one cohesive sanctuary.
          </p>

          {/* 5 Core Pillars Minimal Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-sky-400 font-black text-xl mb-1">01</div>
              <div className="text-sm font-bold text-white">PLAN</div>
              <div className="text-[11px] text-slate-400 mt-1">Kanban & deadlines</div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-teal-400 font-black text-xl mb-1">02</div>
              <div className="text-sm font-bold text-white">FOCUS</div>
              <div className="text-[11px] text-slate-400 mt-1">Sanctum & soundscapes</div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-orange-400 font-black text-xl mb-1">03</div>
              <div className="text-sm font-bold text-white">WELLNESS</div>
              <div className="text-[11px] text-slate-400 mt-1">Pranayama & pulse</div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-purple-400 font-black text-xl mb-1">04</div>
              <div className="text-sm font-bold text-white">MENTOR</div>
              <div className="text-[11px] text-slate-400 mt-1">Socratic guidance</div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center col-span-2 md:col-span-1">
              <div className="text-cyan-400 font-black text-xl mb-1">05</div>
              <div className="text-sm font-bold text-white">COMMUNITY</div>
              <div className="text-[11px] text-slate-400 mt-1">Silent study circles</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          04 — PLANNER + FOCUS STUDIO (Concise Showcase)
          ========================================================================= */}
      <section className="py-24 border-t border-white/[0.06] bg-[#070B16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual Component: Interactive Kanban & Sanctum Preview */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="text-xs font-mono text-sky-400">NEXT BEST ACTION</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready to Start
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>CS401 • Computer Networks</span>
                    <span className="text-amber-300 font-medium">Due Tomorrow</span>
                  </div>
                  <h4 className="text-base font-bold text-white">TCP Congestion Control Simulation</h4>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Estimated: 45 min deep work</span>
                    <Link 
                      href="/focus" 
                      className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Hourglass className="w-3.5 h-3.5" />
                      <span>Start Focus</span>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-300 pt-2">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-bold text-white">4 Stages</div>
                    <div className="text-[10px] text-slate-400">Kanban Flow</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-bold text-teal-300">Sanctum 3D</div>
                    <div className="text-[10px] text-slate-400">Procedural audio</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-bold text-sky-300">Auto Velocity</div>
                    <div className="text-[10px] text-slate-400">Linked session stats</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                04 / Flow Pacing
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Turn overwhelming assignments into calm, uninterrupted focus.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Connect your academic coursework directly to dedicated Pomodoro and Flow sessions. Jijnasu synthesizes binaural ambient soundscapes and immersive 3D Focus environments that help you enter deep states of concentration.
              </p>
              <div>
                <Link
                  href="/planner"
                  className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Open Academic Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          05 — WELLNESS & MENTORAI (Concise Showcase)
          ========================================================================= */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Description */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                05 / Equilibrium & Guidance
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Self-regulation meets Socratic academic intelligence.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Track your non-clinical stress levels, practice 4-7-8 Pranayama breathing with our 3D orb, and consult MentorAI for structured problem breakdown. We maintain strict non-clinical safety boundaries with 24/7 crisis helplines.
              </p>
              <div>
                <Link
                  href="/wellness"
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <span>Explore Wellness Cockpit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Scene: MentorAI Dialogue Sample */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">MentorAI Pacing</div>
                  <div className="text-[10px] text-slate-400">Socratic Engineering Co-Pilot</div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/[0.04] text-slate-300 max-w-[85%]">
                  "Explain TCP congestion control using a Socratic approach."
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-purple-200 ml-auto max-w-[90%] leading-relaxed">
                  "Suppose a sender starts transmission on an empty network pipe. How can it probe capacity without overflowing the bottleneck router? Consider the transition from Slow Start to Congestion Avoidance..."
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10">
                <span>Autonomous crisis safety interceptor</span>
                <span className="text-teal-400 font-semibold">Tele-MANAS & 988 Integrated</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          06 — COMMUNITY & PROGRESS (Concise Showcase)
          ========================================================================= */}
      <section className="py-24 border-t border-white/[0.06] bg-[#070B16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            06 / Peer Synergy & Growth
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3 mb-6 max-w-3xl mx-auto">
            Study together in silence. Watch your velocity climb.
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
            Join virtual silent study rooms, connect with accountability partners, and observe longitudinal study trends that balance productivity with cognitive rest.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <Users2 className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Virtual Silent Study Rooms</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Work alongside peers in focused, distraction-free rooms without the anxiety of video or microphone pressure.
              </p>
              <Link href="/community" className="text-xs text-cyan-400 font-bold hover:underline">
                Explore Circles & Rooms →
              </Link>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <BarChart3 className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Longitudinal Velocity Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Review weekly target completion, subject distribution, and stress trends derived from your actual database-backed records.
              </p>
              <Link href="/progress" className="text-xs text-emerald-400 font-bold hover:underline">
                View Progress Analytics →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          07 — FINAL CALL TO ACTION (Large Editorial Statement)
          ========================================================================= */}
      <section className="py-28 border-t border-white/[0.08] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 via-transparent to-teal-500/10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            07 / Begin Your Journey
          </span>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-tight">
            YOUR NEXT STEP<br />
            STARTS HERE.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Reclaim your focus, protect your mental wellbeing, and build an engineering routine that lasts.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-2xl shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Create Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm rounded-2xl border border-white/10 transition-colors cursor-pointer"
            >
              <span>Explore Jijnasu</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
