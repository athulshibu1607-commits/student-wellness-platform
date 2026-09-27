'use client';

import React from 'react';
import Link from 'next/link';
import { useAppState } from '@/components/StateContext';
import { 
  Hourglass, 
  CalendarCheck, 
  Heart, 
  Flame, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Play,
  Check,
  TrendingUp,
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    user, 
    courses, 
    tasks, 
    focusSessions, 
    wellnessCheckins, 
    getVelocityStats, 
    updateTask 
  } = useAppState();

  const stats = getVelocityStats();
  const latestWellness = wellnessCheckins[0];
  const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED');

  // Next Best Action (Highest priority pending task)
  const nextActionTask = pendingTasks.find(t => t.priority === 'URGENT') ||
    pendingTasks.find(t => t.priority === 'HIGH') ||
    pendingTasks[0];

  const nextActionCourse = nextActionTask 
    ? courses.find(c => c.id === nextActionTask.courseId)
    : null;

  // Upcoming deadlines (next 3 items)
  const upcomingDeadlines = pendingTasks
    .filter(t => t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  // Today's focus minutes
  const todayDateString = new Date().toISOString().split('T')[0];
  const todayFocusMinutes = focusSessions
    .filter(s => s.completedAt.startsWith(todayDateString))
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const firstName = user.name ? user.name.split(' ')[0] : 'Engineer';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Statement */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
          <span>Student Command Cockpit</span>
          <span className="w-1 h-1 rounded-full bg-teal-400" />
          <span className="text-slate-400">{user.major}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Good day, {firstName}. Here&apos;s what matters today.
        </h1>
      </div>

      {/* =========================================================================
          LEVEL 1: NEXT ACTION (Dominant Focal Point)
          ========================================================================= */}
      <section aria-labelledby="next-action-heading">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-sky-500/25 bg-gradient-to-br from-sky-950/30 via-[#0B132B]/80 to-[#080D1A] shadow-2xl relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span id="next-action-heading">RECOMMENDED NEXT ACTION</span>
            </div>
            {nextActionTask && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                nextActionTask.priority === 'URGENT' || nextActionTask.priority === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
              }`}>
                {nextActionTask.priority} PRIORITY
              </span>
            )}
          </div>

          {nextActionTask ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {nextActionCourse ? `${nextActionCourse.code} • ${nextActionCourse.name}` : 'General Academic Task'}
                  </span>
                  {nextActionTask.dueDate && (
                    <>
                      <span>•</span>
                      <span className="text-amber-300 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due {new Date(nextActionTask.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {nextActionTask.title}
                </h2>

                {nextActionTask.description && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                    {nextActionTask.description}
                  </p>
                )}

                <div className="text-xs text-slate-400 pt-1">
                  Estimated deep work: <strong className="text-white">{nextActionTask.estimatedMinutes} minutes</strong>
                  {nextActionTask.completedMinutes > 0 && (
                    <span> ({nextActionTask.completedMinutes} min logged)</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <Link
                  href="/focus"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start Focus Session</span>
                </Link>

                <button
                  onClick={() => updateTask(nextActionTask.id, { status: 'COMPLETED' })}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Completed</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">All caught up!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No pending tasks on your board. Start a freeform deep work session or add assignments in Planner.
              </p>
              <div className="pt-2">
                <Link
                  href="/planner"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/10 transition-colors"
                >
                  <span>Open Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          LEVEL 2 & LEVEL 3: TWO-COLUMN FOCUSED WORKSPACE
          Left: Upcoming Deadlines (What is coming next?)
          Right: Workload Equilibrium & Focus Stats (How am I doing?)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upcoming Deadlines (Level 2) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-sky-400" />
              <span>Upcoming Deadlines</span>
            </h3>
            <Link 
              href="/planner" 
              className="text-xs text-sky-400 hover:underline font-semibold"
            >
              View All ({pendingTasks.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((task) => {
                const course = courses.find(c => c.id === task.courseId);
                return (
                  <div 
                    key={task.id}
                    className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        {course && (
                          <span className="font-semibold text-slate-300">
                            {course.code}
                          </span>
                        )}
                        <span>•</span>
                        <span className="text-amber-300">
                          Due {new Date(task.dueDate!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">
                        {task.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => updateTask(task.id, { status: 'COMPLETED' })}
                      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                      title="Mark task done"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-slate-400">
                No impending deadlines scheduled.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Workload Equilibrium & Focus (Level 3) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-teal-400" />
              <span>Cognitive Equilibrium</span>
            </h3>
            <Link 
              href="/wellness" 
              className="text-xs text-teal-400 hover:underline font-semibold"
            >
              Check-in Pulse →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Today's Focus Minutes */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <div className="text-[11px] text-slate-400">Today&apos;s Focus</div>
              <div className="text-2xl font-black text-white">
                {todayFocusMinutes} <span className="text-xs font-normal text-slate-400">min</span>
              </div>
              <div className="text-[10px] text-teal-400">
                Target: {Math.round(user.weeklyTargetHours / 7 * 60)} min/day
              </div>
            </div>

            {/* Streak */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <div className="text-[11px] text-slate-400">Focus Streak</div>
              <div className="text-2xl font-black text-amber-400 flex items-center gap-1">
                <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>5</span> <span className="text-xs font-normal text-slate-400">days</span>
              </div>
              <div className="text-[10px] text-slate-400">Consistent rhythm</div>
            </div>

            {/* Workload Pressure */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <div className="text-[11px] text-slate-400">Workload State</div>
              <div className="text-sm font-bold text-white">
                {stats.burnoutRiskLevel === 'Low' ? 'Balanced & Steady' : `${stats.burnoutRiskLevel} Pressure`}
              </div>
              <div className="text-[10px] text-slate-400">Non-clinical pacing</div>
            </div>

            {/* Latest Pulse */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <div className="text-[11px] text-slate-400">Logged Stress</div>
              <div className="text-sm font-bold text-white">
                {latestWellness ? `${latestWellness.stressScore} / 5` : 'Not recorded'}
              </div>
              <div className="text-[10px] text-slate-400">
                {latestWellness?.sleepHours ? `${latestWellness.sleepHours} hrs sleep` : 'Log today'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          LEVEL 4: SUBTLE PROGRESS SHORTCUT
          ========================================================================= */}
      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Total Semester Deep Work: <strong className="text-white">{stats.totalHoursStudied} hours</strong> ({stats.tasksCompleted} tasks completed)</span>
        </div>
        <Link 
          href="/progress"
          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
        >
          <span>Explore Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
