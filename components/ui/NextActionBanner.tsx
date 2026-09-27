'use client';

import React from 'react';
import Link from 'next/link';
import { useAppState } from '@/components/StateContext';
import { Play, CheckCircle2, Sparkles, ArrowRight, Clock, AlertCircle } from 'lucide-react';

export const NextActionBanner: React.FC = () => {
  const { tasks, updateTask, courses } = useAppState();

  // Find top priority uncompleted task
  const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED');
  
  // Sort priority: URGENT > HIGH > MEDIUM > LOW
  const priorityWeight: Record<string, number> = {
    URGENT: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1
  };

  const topTask = [...pendingTasks].sort((a, b) => {
    const pwA = priorityWeight[a.priority] || 0;
    const pwB = priorityWeight[b.priority] || 0;
    if (pwB !== pwA) return pwB - pwA;
    // secondary sort by due date if present
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  })[0];

  const course = topTask ? courses.find(c => c.id === topTask.courseId) : null;

  return (
    <aside 
      aria-label="Recommended Next Action"
      className="w-full bg-gradient-to-r from-sky-950/60 via-[#0E1B38]/80 to-teal-950/60 border border-sky-500/25 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl shadow-sky-950/20 backdrop-blur-md"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left prompt & context */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-sky-500/20 border border-sky-400/30 rounded-xl text-sky-400 flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-bold text-sky-400">
                What should you do next?
              </span>
              {topTask && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  topTask.priority === 'URGENT'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {topTask.priority} PRIORITY
                </span>
              )}
            </div>

            {topTask ? (
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {topTask.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5 flex items-center gap-2 flex-wrap">
                  {course && (
                    <span className="font-medium text-sky-300">
                      {course.code}: {course.name}
                    </span>
                  )}
                  {topTask.dueDate && (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Due {new Date(topTask.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  <span className="text-slate-400">
                    • Est. {topTask.estimatedMinutes} mins ({topTask.completedMinutes} mins logged)
                  </span>
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  You are all caught up on academic milestones!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Great job maintaining velocity. Take a 15-minute mindful breathing break or check discussions in Circles.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {topTask ? (
            <>
              <Link
                href={`/planner?taskId=${topTask.id}`}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Inspect in Academic Planner"
              >
                <span>Open Task</span>
              </Link>

              <button
                onClick={() => updateTask(topTask.id, { status: 'COMPLETED' })}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Mark this assignment completed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Mark Done</span>
              </button>
              
              <Link
                href={`/focus?taskId=${topTask.id}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Focus</span>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/planner"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                <span>Plan Session</span>
              </Link>
              <Link
                href="/wellness"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                <span>Breathing Exercise</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
