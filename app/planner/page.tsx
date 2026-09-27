'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/components/StateContext';
import { NextActionBanner } from '@/components/ui/NextActionBanner';
import { 
  CalendarCheck, 
  Plus, 
  Trash2, 
  Clock, 
  Hourglass, 
  CheckCircle2, 
  BookOpen, 
  Filter, 
  X, 
  ChevronRight, 
  Edit3,
  Search,
  Target,
  Sparkles,
  Flame,
  Check,
  LayoutGrid,
  List as ListIcon,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { TaskStatus, Priority, Task, Goal, HabitCategory } from '@/types';

export default function PlannerPage() {
  const { 
    tasks, 
    courses, 
    habits,
    habitLogs,
    goals,
    addTask, 
    updateTask, 
    deleteTask, 
    addCourse, 
    deleteCourse,
    addHabit,
    toggleHabitToday,
    deleteHabit,
    addGoal,
    updateGoal,
    deleteGoal
  } = useAppState();

  const [viewMode, setViewMode] = useState<'BOARD' | 'LIST' | 'TIMELINE'>('BOARD');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourseFilter, setActiveCourseFilter] = useState<string>('ALL');
  const [activePriorityFilter, setActivePriorityFilter] = useState<string>('ALL');
  
  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskCourseId, setTaskCourseId] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('MEDIUM');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskEstimatedMinutes, setTaskEstimatedMinutes] = useState(60);

  // Edit task form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCourseId, setEditCourseId] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('MEDIUM');
  const [editDueDate, setEditDueDate] = useState('');
  const [editEstimatedMinutes, setEditEstimatedMinutes] = useState(60);

  // New course form state
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseCredits, setCourseCredits] = useState(4);
  const [courseProfessor, setCourseProfessor] = useState('');
  const [courseColor, setCourseColor] = useState('#0EA5E9');

  // New habit form state
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<'COGNITIVE' | 'HEALTH' | 'ACADEMIC' | 'REST'>('ACADEMIC');
  const [habitColor, setHabitColor] = useState('#0EA5E9');

  // New goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<'EXAM' | 'PROJECT' | 'PLACEMENT' | 'RESEARCH'>('EXAM');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [goalPriority, setGoalPriority] = useState<Priority>('HIGH');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter(task => {
    if (activeCourseFilter !== 'ALL' && task.courseId !== activeCourseFilter) return false;
    if (activePriorityFilter !== 'ALL' && task.priority !== activePriorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'BACKLOG', label: 'Backlog', color: 'border-slate-600' },
    { status: 'IN_PROGRESS', label: 'In Progress', color: 'border-sky-500' },
    { status: 'REVIEW', label: 'Review / Testing', color: 'border-purple-500' },
    { status: 'COMPLETED', label: 'Completed', color: 'border-emerald-500' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      userId: 'usr_001',
      title: taskTitle.trim(),
      description: taskDescription.trim() || undefined,
      courseId: taskCourseId || undefined,
      priority: taskPriority,
      status: 'BACKLOG',
      dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : undefined,
      estimatedMinutes: Number(taskEstimatedMinutes) || 60
    });

    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate('');
    setIsTaskModalOpen(false);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditCourseId(task.courseId || '');
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setEditEstimatedMinutes(task.estimatedMinutes);
  };

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    updateTask(editingTask.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      courseId: editCourseId || undefined,
      priority: editPriority,
      dueDate: editDueDate ? new Date(editDueDate).toISOString() : undefined,
      estimatedMinutes: Number(editEstimatedMinutes) || 60
    });

    setEditingTask(null);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) return;

    addCourse({
      userId: 'usr_001',
      code: courseCode.trim().toUpperCase(),
      name: courseName.trim(),
      credits: Number(courseCredits) || 3,
      professor: courseProfessor.trim() || undefined,
      color: courseColor
    });

    setCourseCode('');
    setCourseName('');
    setCourseProfessor('');
    setIsCourseModalOpen(false);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;

    addHabit({
      userId: 'usr_001',
      title: habitTitle.trim(),
      category: habitCategory,
      iconName: 'Check',
      color: habitColor
    });

    setHabitTitle('');
    setIsHabitModalOpen(false);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    addGoal({
      userId: 'usr_001',
      title: goalTitle.trim(),
      category: goalCategory,
      targetDate: goalTargetDate ? new Date(goalTargetDate).toISOString() : new Date(Date.now() + 86400000 * 30).toISOString(),
      priority: goalPriority
    });

    setGoalTitle('');
    setGoalTargetDate('');
    setIsGoalModalOpen(false);
  };

  const moveNext = (taskId: string, currentStatus: TaskStatus) => {
    const nextMap: Record<TaskStatus, TaskStatus> = {
      BACKLOG: 'IN_PROGRESS',
      IN_PROGRESS: 'REVIEW',
      REVIEW: 'COMPLETED',
      COMPLETED: 'COMPLETED'
    };
    updateTask(taskId, { status: nextMap[currentStatus] });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Academic Milestone Manager
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-xs text-slate-400">{tasks.length} Tracked Tasks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Academic & Project Planner
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsHabitModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Add Habit</span>
          </button>

          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Target className="w-4 h-4 text-purple-400" />
            <span>Add Goal</span>
          </button>

          <button
            onClick={() => setIsCourseModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Courses ({courses.length})</span>
          </button>
          
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-sky-500/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Assignment / Task</span>
          </button>
        </div>
      </div>

      {/* Core UX Banner */}
      <NextActionBanner />

      {/* Search & Filters Toolbar */}
      <div className="glass-panel p-4 rounded-2xl mb-8 space-y-3 border border-white/10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search assignments by keywords, code, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Priority:</span>
            {['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
              <button
                key={p}
                onClick={() => setActivePriorityFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  activePriorityFilter === p
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Course Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-2 border-t border-white/5">
          <span className="text-slate-400 flex items-center gap-1 font-medium text-[11px]">
            <Filter className="w-3 h-3 text-sky-400" />
            Subject:
          </span>
          <button
            onClick={() => setActiveCourseFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
              activeCourseFilter === 'ALL'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            All Subjects ({tasks.length})
          </button>
          {courses.map(c => {
            const count = tasks.filter(t => t.courseId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCourseFilter(c.id)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  activeCourseFilter === c.id
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                {c.code} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* View Mode Bar & Task Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white tracking-tight">Academic Workflow</span>
          <span className="text-xs text-slate-400 font-mono">({filteredTasks.length} tasks visible)</span>
        </div>

        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('BOARD')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'BOARD' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
          <button
            onClick={() => setViewMode('LIST')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'LIST' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode('TIMELINE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'TIMELINE' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
        </div>
      </div>

      {/* View 1: Kanban Board */}
      {viewMode === 'BOARD' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.status);

            return (
              <div key={col.status} className="flex flex-col bg-[#0B132B]/50 border border-white/5 rounded-2xl p-4">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      col.status === 'COMPLETED' ? 'bg-emerald-400' :
                      col.status === 'IN_PROGRESS' ? 'bg-sky-400' :
                      col.status === 'REVIEW' ? 'bg-purple-400' : 'bg-slate-400'
                    }`} />
                    <h3 className="font-bold text-sm text-white">{col.label}</h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks List */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
                  {colTasks.map(task => {
                    const course = courses.find(c => c.id === task.courseId);

                    return (
                      <div
                        key={task.id}
                        className="p-3.5 bg-slate-900/80 border border-white/10 rounded-xl hover:border-sky-500/40 transition-all shadow-sm group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          {course && (
                            <span 
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                              style={{ backgroundColor: `${course.color}30`, border: `1px solid ${course.color}60` }}
                            >
                              {course.code}
                            </span>
                          )}
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            task.priority === 'URGENT' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                            task.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-slate-700/40 text-slate-300'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-white mb-1 leading-snug">
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {task.completedMinutes}/{task.estimatedMinutes}m
                          </span>

                          <div className="flex items-center gap-1">
                            {col.status !== 'COMPLETED' && (
                              <Link
                                href={`/focus?taskId=${task.id}`}
                                className="p-1 hover:text-sky-300 hover:bg-white/5 rounded text-slate-400"
                                title="Focus on this task"
                              >
                                <Hourglass className="w-3.5 h-3.5" />
                              </Link>
                            )}

                            <button
                              onClick={() => openEditModal(task)}
                              className="p-1 hover:text-amber-300 hover:bg-white/5 rounded text-slate-400 cursor-pointer"
                              title="Edit task"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {col.status !== 'COMPLETED' && (
                              <button
                                onClick={() => moveNext(task.id, task.status)}
                                className="p-1 hover:text-teal-300 hover:bg-white/5 rounded text-slate-400 cursor-pointer"
                                title="Advance status"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 hover:text-red-400 hover:bg-white/5 rounded text-slate-500 transition-colors cursor-pointer"
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div className="text-center py-10 text-slate-500 text-xs italic">
                      No tasks in {col.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: List View */}
      {viewMode === 'LIST' && (
        <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Task / Assignment</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTasks.map(task => {
                  const course = courses.find(c => c.id === task.courseId);
                  const isDueOverdue = task.dueDate && new Date(task.dueDate) < new Date(todayStr) && task.status !== 'COMPLETED';

                  return (
                    <tr key={task.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white max-w-xs">
                        <div className="font-semibold text-xs leading-snug">{task.title}</div>
                        {task.description && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{task.description}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {course ? (
                          <span 
                            className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                            style={{ backgroundColor: `${course.color}25`, border: `1px solid ${course.color}50` }}
                          >
                            {course.code}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          task.priority === 'URGENT' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          task.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-slate-700/40 text-slate-300'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {task.dueDate ? (
                          <span className={`font-mono text-[11px] ${isDueOverdue ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            {isDueOverdue && ' (Overdue)'}
                          </span>
                        ) : (
                          <span className="text-slate-500">No deadline</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                        {task.completedMinutes}/{task.estimatedMinutes}m
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => moveNext(task.id, task.status)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          style={{
                            backgroundColor: task.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' :
                                             task.status === 'IN_PROGRESS' ? 'rgba(14, 165, 233, 0.15)' :
                                             task.status === 'REVIEW' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: task.status === 'COMPLETED' ? '#34d399' :
                                   task.status === 'IN_PROGRESS' ? '#38bdf8' :
                                   task.status === 'REVIEW' ? '#c084fc' : '#94a3b8',
                            border: `1px solid ${
                              task.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.3)' :
                              task.status === 'IN_PROGRESS' ? 'rgba(14, 165, 233, 0.3)' :
                              task.status === 'REVIEW' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                            }`
                          }}
                        >
                          <span>{task.status.replace('_', ' ')}</span>
                          {task.status !== 'COMPLETED' && <ChevronRight className="w-3 h-3" />}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {task.status !== 'COMPLETED' && (
                            <Link
                              href={`/focus?taskId=${task.id}`}
                              className="p-1.5 hover:text-sky-300 hover:bg-white/5 rounded text-slate-400"
                              title="Start Focus Session"
                            >
                              <Hourglass className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <button
                            onClick={() => openEditModal(task)}
                            className="p-1.5 hover:text-amber-300 hover:bg-white/5 rounded text-slate-400 cursor-pointer"
                            title="Edit task"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 hover:text-red-400 hover:bg-white/5 rounded text-slate-500 transition-colors cursor-pointer"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500 text-xs italic">
                      No matching tasks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: Timeline View */}
      {viewMode === 'TIMELINE' && (
        <div className="space-y-6 mb-12">
          {[
            { label: 'Critical / Overdue', filter: (t: Task) => Boolean(t.dueDate && new Date(t.dueDate) < new Date(todayStr) && t.status !== 'COMPLETED'), color: 'border-red-500 text-red-400 bg-red-500/10' },
            { label: 'Due Today', filter: (t: Task) => Boolean(t.dueDate && t.dueDate.startsWith(todayStr)), color: 'border-amber-500 text-amber-400 bg-amber-500/10' },
            { label: 'Upcoming This Week', filter: (t: Task) => {
              if (!t.dueDate) return false;
              const due = new Date(t.dueDate);
              const today = new Date(todayStr);
              const inAWeek = new Date(Date.now() + 86400000 * 7);
              return due > today && due <= inAWeek;
            }, color: 'border-sky-500 text-sky-400 bg-sky-500/10' },
            { label: 'Future Deadlines', filter: (t: Task) => {
              if (!t.dueDate) return false;
              const due = new Date(t.dueDate);
              const inAWeek = new Date(Date.now() + 86400000 * 7);
              return due > inAWeek;
            }, color: 'border-teal-500 text-teal-400 bg-teal-500/10' },
            { label: 'Unscheduled / Backlog', filter: (t: Task) => !t.dueDate, color: 'border-slate-500 text-slate-400 bg-slate-500/10' },
          ].map(group => {
            const groupTasks = filteredTasks.filter(group.filter);
            if (groupTasks.length === 0) return null;

            return (
              <div key={group.label} className="glass-panel p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-white/5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${group.color}`}>
                    {group.label}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">({groupTasks.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupTasks.map(task => {
                    const course = courses.find(c => c.id === task.courseId);
                    return (
                      <div key={task.id} className="p-4 bg-slate-900/80 border border-white/10 rounded-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            {course && (
                              <span 
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                                style={{ backgroundColor: `${course.color}30`, border: `1px solid ${course.color}60` }}
                              >
                                {course.code}
                              </span>
                            )}
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              task.priority === 'URGENT' ? 'bg-red-500/20 text-red-300' :
                              task.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                              'bg-slate-700/40 text-slate-300'
                            }`}>
                              {task.priority}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs text-white mb-1 leading-snug">{task.title}</h4>
                          {task.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">{task.description}</p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-mono text-slate-300">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}
                          </span>

                          <div className="flex items-center gap-1">
                            {task.status !== 'COMPLETED' && (
                              <Link
                                href={`/focus?taskId=${task.id}`}
                                className="p-1 hover:text-sky-300 hover:bg-white/5 rounded text-slate-400"
                                title="Focus on this task"
                              >
                                <Hourglass className="w-3.5 h-3.5" />
                              </Link>
                            )}
                            <button
                              onClick={() => openEditModal(task)}
                              className="p-1 hover:text-amber-300 hover:bg-white/5 rounded text-slate-400 cursor-pointer"
                              title="Edit task"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {task.status !== 'COMPLETED' && (
                              <button
                                onClick={() => moveNext(task.id, task.status)}
                                className="p-1 hover:text-teal-300 hover:bg-white/5 rounded text-slate-400 cursor-pointer"
                                title="Advance status"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 hover:text-red-400 hover:bg-white/5 rounded text-slate-500 transition-colors cursor-pointer"
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Habits & Semester Goals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Habits Manager Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Daily Grounding & Academic Habits ({habits.length})
            </h3>
            <button
              onClick={() => setIsHabitModalOpen(true)}
              className="text-xs text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Habit</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {habits.map(habit => {
              const isDone = habitLogs.some(l => l.habitId === habit.id && l.date === todayStr);
              return (
                <div key={habit.id} className="p-3 bg-white/5 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleHabitToday(habit.id)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        isDone ? 'bg-teal-500 text-black' : 'border border-slate-600 hover:border-teal-400'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div>
                      <span className={`font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {habit.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Category: {habit.category} • Streak: {habit.streakCount} days 🔥
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                    title="Remove habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {habits.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">
                No habits configured. Build daily study rituals by adding one above.
              </div>
            )}
          </div>
        </div>

        {/* Goals Manager Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              Semester Milestone Goals ({goals.length})
            </h3>
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="text-xs text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
          </div>

          <div className="space-y-3">
            {goals.map(goal => (
              <div key={goal.id} className="p-3 bg-white/5 rounded-xl text-xs">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-white">{goal.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      {goal.category}
                    </span>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-slate-500 hover:text-red-400 cursor-pointer"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={goal.progress}
                    onChange={(e) => updateGoal(goal.id, { progress: Number(e.target.value) })}
                    className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                  <span className="font-mono text-slate-300 font-bold">{goal.progress}%</span>
                </div>
              </div>
            ))}

            {goals.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">
                No semester goals defined yet. Set target exam scores or placement milestones above.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Create Academic Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task / Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Deadlock Recovery in Distributed Graph"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Course</label>
                  <select
                    value={taskCourseId}
                    onChange={(e) => setTaskCourseId(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="">No Course / General</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Minutes</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={taskEstimatedMinutes}
                    onChange={(e) => setTaskEstimatedMinutes(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Milestone Description</label>
                <textarea
                  rows={3}
                  placeholder="Details, test cases, or submission guidelines..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Edit Academic Task</h3>
              <button onClick={() => setEditingTask(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Course</label>
                  <select
                    value={editCourseId}
                    onChange={(e) => setEditCourseId(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="">No Course / General</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as Priority)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Minutes</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={editEstimatedMinutes}
                    onChange={(e) => setEditEstimatedMinutes(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Manager Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Course Management</h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
              {courses.map(c => (
                <div key={c.id} className="p-2.5 bg-white/5 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white mr-2">{c.code}</span>
                    <span className="text-slate-300">{c.name}</span>
                    <span className="text-slate-400 block text-[10px]">
                      {c.credits} Credits {c.professor ? `• ${c.professor}` : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteCourse(c.id)}
                    className="p-1 text-slate-400 hover:text-red-400 cursor-pointer"
                    title="Remove course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateCourse} className="border-t border-white/10 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Add New Course</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Code (e.g. CS305)"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="Course Title"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    placeholder="Credits"
                    value={courseCredits}
                    onChange={(e) => setCourseCredits(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Professor"
                    value={courseProfessor}
                    onChange={(e) => setCourseProfessor(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <input
                    type="color"
                    value={courseColor}
                    onChange={(e) => setCourseColor(e.target.value)}
                    className="w-full h-8 bg-slate-900 border border-white/10 rounded-lg px-1 py-1 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                Enroll Course
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Habit Creation Modal */}
      {isHabitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Add Daily Habit</h3>
              <button onClick={() => setIsHabitModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Habit Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 30 Minutes LeetCode / Daily Problem"
                  value={habitTitle}
                  onChange={(e) => setHabitTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={habitCategory}
                  onChange={(e) => setHabitCategory(e.target.value as HabitCategory)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="ACADEMIC">Academic / Problem Solving</option>
                  <option value="COGNITIVE">Cognitive Review</option>
                  <option value="HEALTH">Physical / Biofeedback Health</option>
                  <option value="REST">Rest & Sleep Curfew</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsHabitModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Creation Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Add Semester Milestone Goal</h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goal / Milestone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Score 90%+ in End-Sem Algorithms Exam"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as Goal['category'])}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="EXAM">Semester Exam</option>
                    <option value="PROJECT">Lab / Engineering Project</option>
                    <option value="PLACEMENT">Placements / Interviews</option>
                    <option value="RESEARCH">Research Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
