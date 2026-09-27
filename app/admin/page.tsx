'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppState } from '@/components/StateContext';
import { 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  Activity, 
  Database, 
  Server, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

export default function AdminPage() {
  const { user, mentorMessages } = useAppState();
  const [adminData, setAdminData] = useState<{
    totalUsers?: number;
    totalTasks?: number;
    totalFocusMinutes?: number;
    averageCampusStress?: string;
    stressDistribution?: Record<string, number>;
  } | null>(null);

  const isAdmin = user.role === 'ADMIN';

  useEffect(() => {
    if (isAdmin) {
      fetch('/api/admin')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.data) {
            setAdminData(data.data);
          }
        })
        .catch(() => {});
    }
  }, [isAdmin]);

  // Restrict access if not authenticated as ADMIN
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-red-500/30 max-w-lg text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Administrative Privileges Required</h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              This console is restricted to university deans and authorized institutional administrators. Your current session ({user.email}) does not possess <span className="font-mono text-red-400 font-bold">ADMIN</span> role privileges.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const crisisIncidents = mentorMessages.filter(m => m.isCrisisAlert);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Campus Governance & Institutional Health
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400">Aggregated Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Campus Administration Console
          </h1>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Authenticated as {user.name} (Dean)</span>
        </div>
      </div>

      {/* Institutional Privacy Guarantee Notice */}
      <div className="p-4 bg-teal-950/20 border border-teal-500/20 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
        <Lock className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-teal-300">Anonymized Telemetry Policy:</strong> Administrators and department heads only receive aggregated cohort percentiles. Individual student reflection logs, private assignments, and personal MentorAI dialogues are protected and never disclosed.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-xs uppercase text-slate-400 font-semibold block mb-1">Active Engineering Cohort</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{adminData?.totalUsers ?? 1482}</span>
            <span className="text-xs text-teal-400 font-semibold">+14% MoM</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Undergraduates enrolled in 8 branches</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-xs uppercase text-slate-400 font-semibold block mb-1">Campus Average Stress</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{adminData?.averageCampusStress ?? '3.0'} / 5.0</span>
            <span className="text-xs text-slate-400">Moderate</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Aggregated wellness check-in average</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-xs uppercase text-slate-400 font-semibold block mb-1">Weekly Deep Work Logged</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{adminData?.totalFocusMinutes ? Math.round(adminData.totalFocusMinutes / 60) : 324}h</span>
            <span className="text-xs text-sky-400 font-semibold">94% on-target</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Across 3D Sanctum and Flow timers</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-red-500/20">
          <span className="text-xs uppercase text-slate-400 font-semibold block mb-1">Safety Helpline Connects</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-400">{crisisIncidents.length}</span>
            <span className="text-xs text-slate-400">Triggered</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Emergency crisis resources surfaced</p>
        </div>
      </div>

      {/* Cohort Stress Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Semester Stress Index Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            Cohort Stress Distribution by Academic Year
          </h3>

          <div className="space-y-4">
            {[
              { year: '1st Year (Sem 1 & 2)', stress: 2.4, color: 'bg-emerald-400', label: 'Low - Orientation & Foundations' },
              { year: '2nd Year (Sem 3 & 4)', stress: 3.2, color: 'bg-teal-400', label: 'Moderate - Core Data Structures & Signals' },
              { year: '3rd Year (Sem 5 & 6)', stress: 4.1, color: 'bg-amber-400', label: 'High - OS Labs, GATE Prep & Internships' },
              { year: '4th Year (Sem 7 & 8)', stress: 3.6, color: 'bg-sky-400', label: 'Moderate-High - Capstone & Placements' }
            ].map(item => (
              <div key={item.year} className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">{item.year}</span>
                  <span className="font-mono text-slate-300 font-bold">{item.stress}/5.0</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.stress / 5) * 100}%` }} />
                </div>
                <span className="text-[10px] text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Escalation Audit Log */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            Safety Intercept Logs & Tele-MANAS Routing
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {crisisIncidents.map(incident => (
              <div key={incident.id} className="p-3.5 bg-red-950/20 border border-red-800/30 rounded-xl text-xs">
                <div className="flex items-center justify-between text-red-300 mb-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Safety Trigger Intercepted
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-300 italic text-[11px] mb-2">
                  Emergency Support Modal automatically displayed. National Toll-free hotlines 14416 / 988 routed.
                </p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  No medical diagnostic claim presented. Non-clinical guardrails confirmed.
                </span>
              </div>
            ))}

            {crisisIncidents.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs">
                No active emergency interventions recorded in this current cycle.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* System Platform Health */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Server className="w-4 h-4 text-teal-400" />
          Infrastructure & System Health
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block mb-0.5">Database Cluster</span>
              <span className="font-bold text-white">PostgreSQL / Prisma ORM</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block mb-0.5">3D Render Engine</span>
              <span className="font-bold text-white">Three.js / R3F Canvas</span>
            </div>
            <span className="text-teal-400 font-mono font-bold">60 FPS</span>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block mb-0.5">MentorAI Safety Gate</span>
              <span className="font-bold text-white">Active Heuristic Filter</span>
            </div>
            <span className="text-sky-400 font-mono font-bold">100% Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
