'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Course, 
  Task, 
  FocusSession, 
  WellnessCheckin, 
  MentorMessage, 
  CommunityPost, 
  NotificationItem,
  Habit,
  HabitLog,
  Goal,
  StudyVelocityStats,
  TaskStatus,
  Priority,
  Role
} from '@/types';
import { 
  AppState, 
  getInitialState, 
  saveState, 
  getDefaultDemoState,
  getCleanUserState,
  INITIAL_USER
} from '@/lib/store';

const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'want to die',
  'end my life',
  'self harm',
  'cut myself',
  'hopeless',
  'can\'t take it anymore',
  'better off dead',
  'no reason to live'
];

interface StateContextType {
  state: AppState;
  user: User;
  courses: Course[];
  tasks: Task[];
  focusSessions: FocusSession[];
  habits: Habit[];
  habitLogs: HabitLog[];
  goals: Goal[];
  wellnessCheckins: WellnessCheckin[];
  mentorMessages: MentorMessage[];
  communityPosts: CommunityPost[];
  notifications: NotificationItem[];
  highContrast: boolean;
  reducedMotion: boolean;
  isDemoMode: boolean;
  crisisModalOpen: boolean;
  
  setCrisisModalOpen: (open: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  
  // Auth & Modes
  login: (email: string, passwordOrName?: string, role?: Role) => Promise<{ success: boolean; error?: string }>;
  registerUser?: (data: { name: string; email: string; password: string; major?: string; semester?: number }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
  loadDemoData: () => void;
  startCleanWorkspace: () => void;
  
  // Tasks CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedMinutes'>) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Courses CRUD
  addCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  updateCourse: (id: string, patch: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  // Habits CRUD
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streakCount'>) => void;
  toggleHabitToday: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
  
  // Goals CRUD
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'isCompleted'>) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Focus
  logFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;
  deleteFocusSession: (id: string) => void;
  
  // Wellness
  logWellnessCheckin: (checkin: Omit<WellnessCheckin, 'id' | 'createdAt'>) => void;
  
  // MentorAI
  sendMentorMessage: (content: string) => Promise<void>;
  clearMentorHistory: () => void;
  
  // Community
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'authorId' | 'authorName' | 'upvotes' | 'hasUpvoted' | 'comments' | 'createdAt'>) => void;
  toggleUpvotePost: (id: string) => void;
  addCommunityComment: (postId: string, content: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  
  // Analytics
  getVelocityStats: () => StudyVelocityStats;
  
  // Data Privacy & Management
  exportUserData: () => void;
  resetAllData: () => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(getInitialState);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const syncUserDataFromServer = async () => {
    try {
      const [tasksRes, coursesRes, wellnessRes, focusRes, habitsRes, notifRes] = await Promise.all([
        fetch('/api/tasks').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/courses').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/wellness').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/focus').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/habits').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/notifications').then(r => r.ok ? r.json() : null).catch(() => null)
      ]);

      setState(prev => ({
        ...prev,
        tasks: tasksRes?.data || prev.tasks,
        courses: coursesRes?.data || prev.courses,
        wellnessCheckins: wellnessRes?.data || prev.wellnessCheckins,
        focusSessions: focusRes?.data || prev.focusSessions,
        habits: habitsRes?.data?.habits || prev.habits,
        habitLogs: habitsRes?.data?.logs || prev.habitLogs,
        notifications: notifRes?.data || prev.notifications
      }));
    } catch (err) {
      console.error('Failed to sync user data from server API', err);
    }
  };

  useEffect(() => {
    setMounted(true);
    const checkAuthAndSync = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setState(prev => ({
              ...prev,
              user: data.user
            }));
            await syncUserDataFromServer();
            return;
          }
        }
      } catch {
        // offline or unauthenticated
      }
      const loaded = getInitialState();
      setState(loaded);
    };
    checkAuthAndSync();
  }, []);

  useEffect(() => {
    if (mounted) {
      saveState(state);
    }
  }, [state, mounted]);

  const setHighContrast = (enabled: boolean) => {
    setState(prev => ({ ...prev, highContrast: enabled }));
  };

  const setReducedMotion = (enabled: boolean) => {
    setState(prev => ({ ...prev, reducedMotion: enabled }));
  };

  const login = async (email: string, passwordOrName?: string, role: Role = 'STUDENT'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: passwordOrName && !passwordOrName.includes(' ') ? passwordOrName : 'password123',
          role
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setState(prev => ({
            ...prev,
            user: data.user
          }));
          await syncUserDataFromServer();
          return { success: true };
        }
      } else {
        const data = await res.json();
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err) {
      console.error('Login network error', err);
    }
    // Fallback to local state if offline
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        email,
        name: passwordOrName || email.split('@')[0],
        role
      }
    }));
    return { success: true };
  };

  const registerUser = async (data: { name: string; email: string; password: string; major?: string; semester?: number }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const result = await res.json();
        if (result.user) {
          setState(prev => ({
            ...prev,
            user: result.user
          }));
          await syncUserDataFromServer();
          return { success: true };
        }
      } else {
        const errData = await res.json();
        return { success: false, error: errData.error || 'Registration failed' };
      }
    } catch (err) {
      console.error('Registration network error', err);
    }
    return { success: false, error: 'Registration service unreachable' };
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error', err);
    }
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        email: 'guest@eng.edu',
        name: 'Guest Engineer',
        role: 'STUDENT'
      }
    }));
  };

  const updateUser = (patch: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, ...patch, updatedAt: new Date().toISOString() }
    }));
  };

  const loadDemoData = () => {
    const demo = getDefaultDemoState();
    setState(demo);
    saveState(demo);
  };

  const startCleanWorkspace = () => {
    const clean = getCleanUserState(state.user);
    setState(clean);
    saveState(clean);
  };

  // Task Operations
  const addTask = async (taskInput: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedMinutes'>) => {
    const tempId = `task_${Date.now()}`;
    const newTask: Task = {
      ...taskInput,
      id: tempId,
      completedMinutes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskInput)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setState(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === tempId ? data.data : t)
          }));
        }
      }
    } catch (err) {
      console.error('Task database persistence error', err);
    }
  };

  const updateTask = async (id: string, patch: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)
    }));

    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch })
      });
    } catch (err) {
      console.error('Task update persistence error', err);
    }
  };

  const deleteTask = async (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));

    try {
      await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Task deletion persistence error', err);
    }
  };

  // Course Operations
  const addCourse = async (courseInput: Omit<Course, 'id' | 'createdAt'>) => {
    const tempId = `c_${Date.now()}`;
    const newCourse: Course = {
      ...courseInput,
      id: tempId,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      courses: [...prev.courses, newCourse]
    }));

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseInput)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setState(prev => ({
            ...prev,
            courses: prev.courses.map(c => c.id === tempId ? data.data : c)
          }));
        }
      }
    } catch (err) {
      console.error('Course persistence error', err);
    }
  };

  const updateCourse = async (id: string, patch: Partial<Course>) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === id ? { ...c, ...patch } : c)
    }));

    try {
      await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch })
      });
    } catch (err) {
      console.error('Course update error', err);
    }
  };

  const deleteCourse = async (id: string) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.id !== id),
      tasks: prev.tasks.map(t => t.courseId === id ? { ...t, courseId: undefined } : t),
      goals: prev.goals.map(g => g.courseId === id ? { ...g, courseId: undefined } : g)
    }));

    try {
      await fetch(`/api/courses?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Course deletion error', err);
    }
  };

  // Habit Operations
  const addHabit = (habitInput: Omit<Habit, 'id' | 'createdAt' | 'streakCount'>) => {
    const newHabit: Habit = {
      ...habitInput,
      id: `h_${Date.now()}`,
      streakCount: 1,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit]
    }));
  };

  const toggleHabitToday = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      const existingIndex = prev.habitLogs.findIndex(l => l.habitId === habitId && l.date === today);
      let updatedLogs = [...prev.habitLogs];
      let streakDelta = 0;

      if (existingIndex >= 0) {
        // Toggle off
        updatedLogs.splice(existingIndex, 1);
        streakDelta = -1;
      } else {
        // Toggle on
        updatedLogs.push({
          id: `hl_${Date.now()}`,
          habitId,
          userId: prev.user.id,
          date: today,
          completed: true
        });
        streakDelta = 1;
      }

      const updatedHabits = prev.habits.map(h => {
        if (h.id === habitId) {
          return {
            ...h,
            streakCount: Math.max(0, h.streakCount + streakDelta)
          };
        }
        return h;
      });

      return {
        ...prev,
        habits: updatedHabits,
        habitLogs: updatedLogs
      };
    });

    try {
      await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId })
      });
    } catch (err) {
      console.error('Habit toggle persistence error', err);
    }
  };

  const deleteHabit = (habitId: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== habitId),
      habitLogs: prev.habitLogs.filter(l => l.habitId !== habitId)
    }));
  };

  // Goal Operations
  const addGoal = (goalInput: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'isCompleted'>) => {
    const newGoal: Goal = {
      ...goalInput,
      id: `g_${Date.now()}`,
      progress: 0,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
  };

  const updateGoal = (id: string, patch: Partial<Goal>) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...patch } : g)
    }));
  };

  const deleteGoal = (id: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  };

  // Focus Operations
  const logFocusSession = async (sessionInput: Omit<FocusSession, 'id' | 'completedAt'>) => {
    const tempId = `f_${Date.now()}`;
    const newSession: FocusSession = {
      ...sessionInput,
      id: tempId,
      completedAt: new Date().toISOString()
    };
    setState(prev => {
      const updatedTasks = prev.tasks.map(t => {
        if (t.id === sessionInput.taskId) {
          return {
            ...t,
            completedMinutes: t.completedMinutes + sessionInput.durationMinutes,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      });

      return {
        ...prev,
        focusSessions: [newSession, ...prev.focusSessions],
        tasks: updatedTasks
      };
    });

    try {
      await fetch('/api/focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionInput)
      });
    } catch (err) {
      console.error('Focus session persistence error', err);
    }
  };

  const deleteFocusSession = (id: string) => {
    setState(prev => ({
      ...prev,
      focusSessions: prev.focusSessions.filter(f => f.id !== id)
    }));
  };

  // Wellness Operations
  const logWellnessCheckin = async (checkinInput: Omit<WellnessCheckin, 'id' | 'createdAt'>) => {
    const tempId = `w_${Date.now()}`;
    const newCheckin: WellnessCheckin = {
      ...checkinInput,
      id: tempId,
      createdAt: new Date().toISOString()
    };

    if (checkinInput.notes) {
      const lower = checkinInput.notes.toLowerCase();
      if (CRISIS_KEYWORDS.some(k => lower.includes(k))) {
        setCrisisModalOpen(true);
      }
    }

    setState(prev => ({
      ...prev,
      wellnessCheckins: [newCheckin, ...prev.wellnessCheckins]
    }));

    try {
      await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkinInput)
      });
    } catch (err) {
      console.error('Wellness checkin persistence error', err);
    }
  };

  // MentorAI Operations
  const sendMentorMessage = async (content: string) => {
    const isCrisis = CRISIS_KEYWORDS.some(keyword => content.toLowerCase().includes(keyword));

    const userMsg: MentorMessage = {
      id: `m_${Date.now()}`,
      userId: state.user.id,
      sender: 'user',
      content,
      isCrisisAlert: isCrisis,
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      mentorMessages: [...prev.mentorMessages, userMsg]
    }));

    if (isCrisis) {
      setCrisisModalOpen(true);
      const emergencyResponse: MentorMessage = {
        id: `m_${Date.now() + 1}`,
        userId: state.user.id,
        sender: 'mentor_ai',
        content: `I hear how much pain and pressure you are experiencing, and I care about your safety. As an AI system, I am not equipped to provide emergency crisis care. Please connect immediately with the trained human counselors available right now. Emergency resources are displayed on your screen, or call Tele-MANAS at 14416 or 988. You do not have to carry this alone.`,
        isCrisisAlert: true,
        createdAt: new Date().toISOString()
      };
      setState(prev => ({
        ...prev,
        mentorMessages: [...prev.mentorMessages, emergencyResponse]
      }));
      return;
    }

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          userId: state.user.id,
          major: state.user.major,
          semester: state.user.semester,
          recentStress: state.wellnessCheckins[0]?.stressScore,
          userName: state.user.name
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isCrisisAlert) {
          setCrisisModalOpen(true);
        }
        const aiMsg: MentorMessage = {
          id: `m_${Date.now() + 1}`,
          userId: state.user.id,
          sender: 'mentor_ai',
          content: data.response || data.content,
          isCrisisAlert: data.isCrisisAlert,
          createdAt: new Date().toISOString()
        };
        setState(prev => ({
          ...prev,
          mentorMessages: [...prev.mentorMessages, aiMsg]
        }));
        return;
      }
    } catch (err) {
      console.warn('Mentor API fetch fallback triggered:', err);
    }

    // Local Socratic heuristic fallback if network fetch is unavailable
    let aiReply = "I understand you're navigating high academic pressure. Let's break this engineering challenge into small, manageable milestones. Which specific part feels like the biggest roadblock right now?";
    const text = content.toLowerCase();

    if (text.includes('exam') || text.includes('gate') || text.includes('study')) {
      aiReply = "For exam preparation without burning out, recall the Spaced Repetition principle. Instead of marathon 8-hour cram sessions, allocate two 90-minute deep work blocks focused purely on active recall and problem sets. Have you reviewed the highest-weightage topics first?";
    } else if (text.includes('code') || text.includes('bug') || text.includes('error') || text.includes('algorithm')) {
      aiReply = "When debugging intricate algorithms or system code, step away from the keyboard for 5 minutes. Formulate a minimal reproducible example (MRE) and verify your boundary invariants. Which exact data structure or edge condition is failing?";
    } else if (text.includes('burnout') || text.includes('tired') || text.includes('stress') || text.includes('exhausted')) {
      aiReply = "Engineering programs are mentally taxing marathons. Your current logged stress score indicates you need cognitive recuperation. Research shows taking a full 20-minute physical walk or practicing 4-7-8 breathing restores prefrontal cortex focus far better than pushing through brain fog.";
    }

    const aiMsg: MentorMessage = {
      id: `m_${Date.now() + 1}`,
      userId: state.user.id,
      sender: 'mentor_ai',
      content: aiReply,
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        mentorMessages: [...prev.mentorMessages, aiMsg]
      }));
    }, 400);
  };

  const clearMentorHistory = () => {
    setState(prev => ({
      ...prev,
      mentorMessages: [
        {
          id: `m_${Date.now()}`,
          userId: prev.user.id,
          sender: 'mentor_ai',
          content: `Chat session refreshed. I am MentorAI, your engineering co-pilot and wellness companion. What engineering topic or study pacing question would you like to explore?`,
          createdAt: new Date().toISOString()
        }
      ]
    }));
  };

  // Community Operations
  const addCommunityPost = (postInput: Omit<CommunityPost, 'id' | 'authorId' | 'authorName' | 'upvotes' | 'hasUpvoted' | 'comments' | 'createdAt'>) => {
    const newPost: CommunityPost = {
      ...postInput,
      id: `post_${Date.now()}`,
      authorId: state.user.id,
      authorName: postInput.isAnonymous ? 'Anonymous Colleague' : state.user.name,
      authorMajor: postInput.isAnonymous ? undefined : `${state.user.major} Sem ${state.user.semester}`,
      upvotes: 1,
      hasUpvoted: true,
      comments: [],
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      communityPosts: [newPost, ...prev.communityPosts]
    }));
  };

  const toggleUpvotePost = (id: string) => {
    setState(prev => ({
      ...prev,
      communityPosts: prev.communityPosts.map(p => {
        if (p.id === id) {
          const hasUpvoted = !p.hasUpvoted;
          return {
            ...p,
            hasUpvoted,
            upvotes: hasUpvoted ? p.upvotes + 1 : p.upvotes - 1
          };
        }
        return p;
      })
    }));
  };

  const addCommunityComment = (postId: string, content: string) => {
    setState(prev => ({
      ...prev,
      communityPosts: prev.communityPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...(p.comments || []),
              {
                id: `c_${Date.now()}`,
                postId,
                authorId: state.user.id,
                authorName: state.user.name,
                authorMajor: `${state.user.major}`,
                content,
                createdAt: new Date().toISOString()
              }
            ]
          };
        }
        return p;
      })
    }));
  };

  // Notification Operations
  const markNotificationRead = async (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    }));

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.error('Notification mark read error', err);
    }
  };

  const markAllNotificationsRead = async () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, isRead: true }))
    }));

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      });
    } catch (err) {
      console.error('Mark all notifications error', err);
    }
  };

  const deleteNotification = async (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));

    try {
      await fetch(`/api/notifications?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Delete notification error', err);
    }
  };

  // Analytics Computation
  const getVelocityStats = (): StudyVelocityStats => {
    const totalMinutes = state.focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalHoursStudied = Number((totalMinutes / 60).toFixed(1));
    const tasksCompleted = state.tasks.filter(t => t.status === 'COMPLETED').length;
    
    const stressSum = state.wellnessCheckins.reduce((acc, w) => acc + w.stressScore, 0);
    const avgStress = state.wellnessCheckins.length > 0 ? Number((stressSum / state.wellnessCheckins.length).toFixed(1)) : 2.5;

    let burnoutRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
    if (avgStress >= 4.2) burnoutRiskLevel = 'Critical';
    else if (avgStress >= 3.5) burnoutRiskLevel = 'High';
    else if (avgStress >= 2.5) burnoutRiskLevel = 'Moderate';

    const subjectMap: Record<string, number> = {};
    state.tasks.forEach(t => {
      const course = state.courses.find(c => c.id === t.courseId);
      const name = course ? course.code : 'General';
      subjectMap[name] = (subjectMap[name] || 0) + (t.completedMinutes / 60);
    });

    const hoursBySubject = Object.entries(subjectMap).map(([subject, hours], idx) => {
      const colors = ['#0EA5E9', '#14B8A6', '#8B5CF6', '#F97316', '#EAB308'];
      return {
        subject,
        hours: Number(hours.toFixed(1)),
        color: colors[idx % colors.length]
      };
    });

    const dailyStudyTime = [
      { day: 'Mon', hours: 4.5, target: 4.0 },
      { day: 'Tue', hours: 5.0, target: 4.0 },
      { day: 'Wed', hours: 3.5, target: 4.0 },
      { day: 'Thu', hours: 6.0, target: 4.0 },
      { day: 'Fri', hours: 4.0, target: 4.0 },
      { day: 'Sat', hours: 5.5, target: 4.0 },
      { day: 'Sun', hours: totalHoursStudied > 0 ? Math.min(6, totalHoursStudied) : 3.0, target: 4.0 }
    ];

    const wellnessTrend = state.wellnessCheckins.slice(0, 7).reverse().map((w, i) => ({
      date: `Day ${i + 1}`,
      mood: w.moodScore,
      stress: w.stressScore,
      sleep: w.sleepHours
    }));

    return {
      totalHoursStudied,
      weeklyTargetHours: state.user.weeklyTargetHours,
      tasksCompleted,
      focusStreakDays: 5,
      averageStressScore: avgStress,
      burnoutRiskLevel,
      hoursBySubject: hoursBySubject.length > 0 ? hoursBySubject : [
        { subject: 'CS301', hours: 8.5, color: '#0EA5E9' },
        { subject: 'CS302', hours: 6.0, color: '#14B8A6' },
        { subject: 'CS304', hours: 4.5, color: '#8B5CF6' },
        { subject: 'MA301', hours: 3.0, color: '#F97316' }
      ],
      dailyStudyTime,
      wellnessTrend: wellnessTrend.length > 0 ? wellnessTrend : [
        { date: 'Mon', mood: 3, stress: 3, sleep: 6.5 },
        { date: 'Tue', mood: 4, stress: 3, sleep: 7.0 },
        { date: 'Wed', mood: 2, stress: 4, sleep: 5.5 },
        { date: 'Thu', mood: 4, stress: 2, sleep: 7.8 },
        { date: 'Fri', mood: 3, stress: 4, sleep: 6.0 },
        { date: 'Sat', mood: 4, stress: 3, sleep: 7.2 }
      ]
    };
  };

  const exportUserData = async () => {
    try {
      const res = await fetch('/api/export');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jijnasu-data-export-${state.user.name.replace(/\s+/g, '_')}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch (err) {
      console.warn('API export fallback to local payload:', err);
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jijnasu_export_${state.user.name.replace(/\s+/g, '_')}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const resetAllData = () => {
    loadDemoData();
  };

  return (
    <StateContext.Provider value={{
      state,
      user: state.user,
      courses: state.courses,
      tasks: state.tasks,
      focusSessions: state.focusSessions,
      habits: state.habits,
      habitLogs: state.habitLogs,
      goals: state.goals,
      wellnessCheckins: state.wellnessCheckins,
      mentorMessages: state.mentorMessages,
      communityPosts: state.communityPosts,
      notifications: state.notifications,
      highContrast: state.highContrast,
      reducedMotion: state.reducedMotion,
      isDemoMode: state.isDemoMode,
      crisisModalOpen,
      setCrisisModalOpen,
      setHighContrast,
      setReducedMotion,
      login,
      registerUser,
      logout,
      updateUser,
      loadDemoData,
      startCleanWorkspace,
      addTask,
      updateTask,
      deleteTask,
      addCourse,
      updateCourse,
      deleteCourse,
      addHabit,
      toggleHabitToday,
      deleteHabit,
      addGoal,
      updateGoal,
      deleteGoal,
      logFocusSession,
      deleteFocusSession,
      logWellnessCheckin,
      sendMentorMessage,
      clearMentorHistory,
      addCommunityPost,
      toggleUpvotePost,
      addCommunityComment,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      getVelocityStats,
      exportUserData,
      resetAllData
    }}>
      <div className={state.highContrast ? 'high-contrast' : ''}>
        {children}
      </div>
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
