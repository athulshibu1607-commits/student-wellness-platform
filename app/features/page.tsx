'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Hourglass, 
  Heart, 
  Bot, 
  Users2, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Sliders,
  CalendarCheck,
  BrainCircuit,
  Lock,
  FileCheck2
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: Compass,
      title: 'Dynamic Action Cockpit',
      subtitle: 'Answers "What should I do next?" without cognitive friction',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/25',
      href: '/dashboard',
      points: [
        'Algorithmic priority engine scanning deadlines, weights, and urgency',
        'Direct 1-click Focus launch linking timers directly to active assignments',
        'Live workload pressure meter reflecting true capacity vs weekly targets',
        'Interactive daily habit loop keeping streaks unbroken'
      ]
    },
    {
      icon: CalendarCheck,
      title: 'Academic Kanban Planner',
      subtitle: 'Coursework breakdown designed for technical problem sets',
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/25',
      href: '/planner',
      points: [
        '4-stage academic Kanban (Backlog, In Progress, Review, Completed)',
        'Course tagging with credit weighting and instructor context',
        'Milestone manager tracking midterms, final lab submissions, and quizzes',
        'Course archiving preserving historical study velocity'
      ]
    },
    {
      icon: Hourglass,
      title: '3D Ambient Focus Studio',
      subtitle: 'Zero-distraction spatial environments with Web Audio',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/25',
      href: '/focus',
      points: [
        'Three spatial 3D scenes (Sanctum wireframe, Cosmos starfield, Zen ring)',
        'Procedural Web Audio soundscapes: Rain, 432Hz Drone, and Stream',
        'Distraction Shield pre-flight checklist for notification suppression',
        'Post-session reflection modal logging actual study minutes'
      ]
    },
    {
      icon: Heart,
      title: 'Non-Clinical Biofeedback & Wellness',
      subtitle: 'Cognitive self-regulation and restorative breathing',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/25',
      href: '/wellness',
      points: [
        '3D Pranayama 4-7-8 breathing orb with synchronized pacing',
        '30-second daily cognitive check-in (mood, stress, sleep, energy)',
        'Immediate stress coping strategies based on self-reported pressure',
        '1-click 24/7 emergency crisis support directory (Tele-MANAS, 988)'
      ]
    },
    {
      icon: Bot,
      title: 'MentorAI Socratic Companion',
      subtitle: 'Transparent AI engineering tutor and reflection guide',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/25',
      href: '/mentor',
      points: [
        'Socratic reasoning guiding algorithm, OS kernel, and circuit debugging',
        'Autonomous crisis keyword interceptor safeguarding student wellbeing',
        'Context-aware mentoring referencing current semester and stress levels',
        'Exportable conversation transcripts for exam revision'
      ]
    },
    {
      icon: Users2,
      title: 'Engineering Circles Community',
      subtitle: 'Collaborative study hubs, silent rooms, and doubt clearance',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/25',
      href: '/community',
      points: [
        'Topic-based discussion board with anonymous posting option',
        'Virtual silent study pods for group accountability',
        'Study partner matchmaking for GATE, midterms, and lab projects',
        'Peer upvoting and inline threaded doubt resolution'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Complete Platform Capabilities</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Engineered for Academic Longevity
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Every tool in Jijnasu is purpose-built to solve a specific cognitive bottleneck faced by engineering undergraduates.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div>
                <div className={`p-3 rounded-2xl w-fit mb-5 ${item.bg} ${item.color} border ${item.border}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-white mb-1.5 tracking-tight">
                  {item.title}
                </h2>
                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  {item.subtitle}
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${item.color} flex-shrink-0 mt-0.5`} />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold ${item.color} hover:underline`}
                >
                  <span>Launch Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Privacy & Architecture Guarantees */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5 text-teal-400" />
          <span>Data Ownership Guarantee</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Secure Multi-User Database & Full Data Ownership
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Your personal assignments, focus sessions, and wellness check-ins are backed by isolated database persistence with cryptographic session validation. You can download a complete structured export of your account at any time via &ldquo;Export My Jijnasu Data&rdquo; or permanently delete your records.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all"
          >
            Enter Student Cockpit
          </Link>
          <Link
            href="/settings"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/10 transition-colors"
          >
            Data Privacy & Export
          </Link>
        </div>
      </div>
    </div>
  );
}
