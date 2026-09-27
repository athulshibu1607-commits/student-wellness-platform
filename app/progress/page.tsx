'use client';

import React from 'react';
import { useAppState } from '@/components/StateContext';
import { NextActionBanner } from '@/components/ui/NextActionBanner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  LineChart, 
  Line, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Flame, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export default function ProgressPage() {
  const { getVelocityStats, user, tasks } = useAppState();
  const stats = getVelocityStats();

  const stressColorMap: Record<string, { color: string; advice: string }> = {
    Low: { color: 'text-emerald-400', advice: 'Workload is well balanced. Keep pacing your deep work intervals.' },
    Moderate: { color: 'text-sky-400', advice: 'Healthy academic pressure. Schedule breaks between laboratory blocks.' },
    High: { color: 'text-amber-400', advice: 'Elevated workload tension. Prioritize sleep and schedule an intentional recovery pause.' },
    Critical: { color: 'text-red-400', advice: 'Intense academic workload pressure. Step away, hydrate, and consider taking a structured rest break.' }
  };
  const adviceMeta = stressColorMap[stats.burnoutRiskLevel] || stressColorMap.Low;

  const hasAnyData = stats.totalHoursStudied > 0 || tasks.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Cognitive Velocity & Analytics
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="text-xs text-slate-400">Non-Diagnostic Workload Trends</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Academic Velocity & Wellbeing Trends
          </h1>
        </div>
      </div>

      {/* UX Banner */}
      <NextActionBanner />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs uppercase text-slate-400 font-semibold block mb-1">Weekly Study Time</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.totalHoursStudied}h</span>
            <span className="text-xs text-slate-400">/ {stats.weeklyTargetHours}h target</span>
          </div>
          <p className="text-[11px] text-teal-400 mt-2 font-medium">
            {stats.weeklyTargetHours > 0 ? Math.round((stats.totalHoursStudied / stats.weeklyTargetHours) * 100) : 0}% of weekly quota logged
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs uppercase text-slate-400 font-semibold block mb-1">Assignments Done</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.tasksCompleted}</span>
            <span className="text-xs text-slate-400">of {tasks.length} total</span>
          </div>
          <p className="text-[11px] text-sky-400 mt-2 font-medium">
            {tasks.filter(t => t.status !== 'COMPLETED').length} pending milestones
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs uppercase text-slate-400 font-semibold block mb-1">Current Study Streak</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-400">{stats.focusStreakDays}</span>
            <span className="text-xs text-slate-400">Days Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Consistent daily deep work
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-sky-500/20">
          <span className="text-xs uppercase text-slate-400 font-semibold block mb-1">Workload Pressure Status</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${adviceMeta.color}`}>{stats.burnoutRiskLevel}</span>
            <span className="text-xs text-slate-400">({stats.averageStressScore}/5.0)</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-2 leading-tight">
            {adviceMeta.advice}
          </p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Chart 1: Daily Study Hours vs Target (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                Daily Focus Hours vs Quota
              </h3>
              <p className="text-xs text-slate-400">Pacing across this academic week</p>
            </div>
            <span className="text-xs font-mono bg-sky-500/10 text-sky-300 px-2.5 py-1 rounded-full border border-sky-500/30">
              Target: 4.0h/day
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyStudyTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Bar dataKey="hours" name="Logged Hours" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Daily Goal" fill="#334155" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Hours Distribution by Subject (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                Subject Workload Split
              </h3>
              <p className="text-xs text-slate-400">Allocated hours across courses</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.hoursBySubject}
                  dataKey="hours"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={5}
                >
                  {stats.hoursBySubject.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Chart 3: Wellness Correlation Trend (Mood vs Stress vs Sleep) */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              Cognitive Equilibrium (Sleep vs Stress vs Mood)
            </h3>
            <p className="text-xs text-slate-400">Holistic correlation over recent check-in cycles</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.wellnessTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="sleep" name="Sleep (Hrs)" stroke="#14B8A6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="stress" name="Stress (1-5)" stroke="#F97316" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="mood" name="Mood Clarity (1-5)" stroke="#38BDF8" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
