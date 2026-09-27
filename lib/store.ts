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
  EmergencyResource,
  StudyVelocityStats
} from '@/types';

// Emergency Helplines & Verified 24/7 Crisis Support
export const EMERGENCY_RESOURCES: EmergencyResource[] = [
  {
    id: 'telemanas',
    name: 'Tele-MANAS (Govt of India)',
    description: 'National Tele Mental Health Programme of India. 24/7 free, confidential psychological support in 20+ languages.',
    phone: '14416 / 1800-891-4416',
    available: '24/7 (Toll-Free)',
    region: 'India / National',
    badge: 'Official Govt Helpline',
    actionUrl: 'tel:14416'
  },
  {
    id: 'kiran',
    name: 'KIRAN Helpline',
    description: 'Ministry of Social Justice 24/7 helpline providing psychological first-aid and mental health rehabilitation.',
    phone: '1800-599-0019',
    available: '24/7 (Toll-Free)',
    region: 'India',
    badge: 'National Helpline',
    actionUrl: 'tel:18005990019'
  },
  {
    id: 'vandrevala',
    name: 'Vandrevala Foundation',
    description: 'Free, professional mental health counseling and crisis intervention available 24 hours every day.',
    phone: '+91 9999 666 555',
    available: '24/7',
    region: 'India & International',
    badge: 'Certified Foundation',
    actionUrl: 'tel:+919999666555'
  },
  {
    id: '988lifeline',
    name: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential support for people in distress, prevention and crisis resources for international/US students.',
    phone: '988',
    available: '24/7',
    region: 'US / International',
    badge: '24/7 Support',
    actionUrl: 'tel:988'
  },
  {
    id: 'campus',
    name: 'Campus Student Counseling Center',
    description: 'Confidential peer counselor and resident clinical psychologist for engineering student wellness.',
    phone: '+91 80 2360 0000',
    available: '8:00 AM - 9:00 PM',
    region: 'Campus Emergency Unit',
    badge: 'On-Campus Support',
    actionUrl: 'tel:+918023600000'
  }
];

// Seed user
export const INITIAL_USER: User = {
  id: 'usr_001',
  email: 'arjun.sharma@eng.edu',
  name: 'Arjun Sharma',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  role: 'STUDENT',
  major: 'Computer Science & Engineering',
  semester: 6,
  weeklyTargetHours: 28,
  createdAt: '2026-01-10T08:00:00.000Z',
  updatedAt: '2026-09-27T10:00:00.000Z'
};

// Seed courses
export const INITIAL_COURSES: Course[] = [
  {
    id: 'c_os',
    userId: 'usr_001',
    code: 'CS301',
    name: 'Operating Systems & Concurrency',
    credits: 4,
    professor: 'Dr. V. Ramanujan',
    color: '#0EA5E9',
    createdAt: '2026-01-15T09:00:00.000Z'
  },
  {
    id: 'c_algo',
    userId: 'usr_001',
    code: 'CS302',
    name: 'Advanced Algorithms & Complexity',
    credits: 4,
    professor: 'Prof. Ananya Sen',
    color: '#14B8A6',
    createdAt: '2026-01-15T09:00:00.000Z'
  },
  {
    id: 'c_ds',
    userId: 'usr_001',
    code: 'CS304',
    name: 'Distributed Systems & Cloud',
    credits: 3,
    professor: 'Dr. Kenneth Liu',
    color: '#8B5CF6',
    createdAt: '2026-01-15T09:00:00.000Z'
  },
  {
    id: 'c_math',
    userId: 'usr_001',
    code: 'MA301',
    name: 'Applied Probability & Linear Algebra',
    credits: 3,
    professor: 'Prof. Rajesh Kulkarni',
    color: '#F97316',
    createdAt: '2026-01-15T09:00:00.000Z'
  }
];

// Seed tasks
export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_001',
    userId: 'usr_001',
    courseId: 'c_os',
    title: 'Implement Mutex and Semaphores in xv6 Kernel',
    description: 'Complete kernel synchronization primitives and run concurrency stress benchmarks.',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    estimatedMinutes: 180,
    completedMinutes: 90,
    createdAt: '2026-09-20T10:00:00.000Z',
    updatedAt: '2026-09-27T08:00:00.000Z'
  },
  {
    id: 'task_002',
    userId: 'usr_001',
    courseId: 'c_algo',
    title: 'Dynamic Programming Problem Set 4 (Network Flow)',
    description: 'Solve Ford-Fulkerson max-flow exercises and write formal complexity proof.',
    priority: 'HIGH',
    status: 'BACKLOG',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    estimatedMinutes: 120,
    completedMinutes: 0,
    createdAt: '2026-09-22T14:30:00.000Z',
    updatedAt: '2026-09-22T14:30:00.000Z'
  },
  {
    id: 'task_003',
    userId: 'usr_001',
    courseId: 'c_ds',
    title: 'Raft Consensus Cluster Node Heartbeat Implementation',
    description: 'Implement leader election, term timeouts, and log replication tests in Go.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    dueDate: new Date(Date.now() + 86400000 * 8).toISOString(),
    estimatedMinutes: 240,
    completedMinutes: 120,
    createdAt: '2026-09-24T11:00:00.000Z',
    updatedAt: '2026-09-27T09:00:00.000Z'
  },
  {
    id: 'task_004',
    userId: 'usr_001',
    courseId: 'c_math',
    title: 'Markov Chains & Random Walks Problem Set',
    description: 'Review stationary distribution and transition matrices for upcoming quiz.',
    priority: 'MEDIUM',
    status: 'REVIEW',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    estimatedMinutes: 90,
    completedMinutes: 80,
    createdAt: '2026-09-21T16:00:00.000Z',
    updatedAt: '2026-09-26T17:00:00.000Z'
  },
  {
    id: 'task_005',
    userId: 'usr_001',
    courseId: 'c_os',
    title: 'Virtual Memory & Page Replacement Lab Simulation',
    description: 'Benchmark LRU vs Second-Chance page replacement algorithms with cache trace.',
    priority: 'LOW',
    status: 'COMPLETED',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    estimatedMinutes: 150,
    completedMinutes: 150,
    createdAt: '2026-09-15T09:00:00.000Z',
    updatedAt: '2026-09-25T22:00:00.000Z'
  }
];

// Seed Focus Sessions
export const INITIAL_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: 'f_001',
    userId: 'usr_001',
    taskId: 'task_001',
    taskTitle: 'Implement Mutex and Semaphores in xv6 Kernel',
    durationMinutes: 50,
    sessionType: 'deepwork',
    environment3D: 'sanctum',
    notes: 'Debugged deadlock in spinlock acquisition. Added assert checks.',
    completedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    rating: 5
  },
  {
    id: 'f_002',
    userId: 'usr_001',
    taskId: 'task_003',
    taskTitle: 'Raft Consensus Cluster Node Heartbeat Implementation',
    durationMinutes: 45,
    sessionType: 'pomodoro',
    environment3D: 'cosmos',
    notes: 'Configured election timeout randomization logic.',
    completedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    rating: 4
  },
  {
    id: 'f_003',
    userId: 'usr_001',
    taskId: 'task_004',
    taskTitle: 'Markov Chains & Random Walks Problem Set',
    durationMinutes: 60,
    sessionType: 'flow',
    environment3D: 'zen',
    notes: 'Computed eigenvalues for 4x4 probability transition matrix.',
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    rating: 5
  }
];

// Seed Habits
export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h_001',
    userId: 'usr_001',
    title: 'Morning 4-7-8 Breathing & Grounding',
    category: 'HEALTH',
    streakCount: 6,
    iconName: 'Heart',
    color: '#14B8A6',
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'h_002',
    userId: 'usr_001',
    title: 'Daily LeetCode / Algorithmic Problem',
    category: 'ACADEMIC',
    streakCount: 12,
    iconName: 'Code',
    color: '#0EA5E9',
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'h_003',
    userId: 'usr_001',
    title: 'Review Engineering Notes Before Bed',
    category: 'COGNITIVE',
    streakCount: 4,
    iconName: 'BookOpen',
    color: '#8B5CF6',
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'h_004',
    userId: 'usr_001',
    title: 'Digital Curfew at 11:30 PM (7h+ Sleep)',
    category: 'REST',
    streakCount: 5,
    iconName: 'Moon',
    color: '#F97316',
    createdAt: '2026-09-01T08:00:00.000Z'
  }
];

// Seed Habit Logs (Today's date helper)
const todayStr = new Date().toISOString().split('T')[0];
export const INITIAL_HABIT_LOGS: HabitLog[] = [
  { id: 'hl_1', habitId: 'h_001', userId: 'usr_001', date: todayStr, completed: true },
  { id: 'hl_2', habitId: 'h_002', userId: 'usr_001', date: todayStr, completed: true }
];

// Seed Goals
export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g_001',
    userId: 'usr_001',
    courseId: 'c_os',
    title: 'Score 90%+ in Operating Systems End-Semester Lab',
    targetDate: new Date(Date.now() + 86400000 * 20).toISOString(),
    category: 'EXAM',
    progress: 65,
    isCompleted: false,
    priority: 'HIGH',
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'g_002',
    userId: 'usr_001',
    courseId: 'c_ds',
    title: 'Deploy Raft Key-Value Store on Kubernetes Mini-Cluster',
    targetDate: new Date(Date.now() + 86400000 * 35).toISOString(),
    category: 'PROJECT',
    progress: 40,
    isCompleted: false,
    priority: 'HIGH',
    createdAt: '2026-09-10T08:00:00.000Z'
  },
  {
    id: 'g_003',
    userId: 'usr_001',
    title: 'Complete 100 System Design & DSA Placement Questions',
    targetDate: new Date(Date.now() + 86400000 * 60).toISOString(),
    category: 'PLACEMENT',
    progress: 58,
    isCompleted: false,
    priority: 'MEDIUM',
    createdAt: '2026-08-15T08:00:00.000Z'
  }
];

// Seed Wellness Checkins
export const INITIAL_WELLNESS_CHECKINS: WellnessCheckin[] = [
  {
    id: 'w_001',
    userId: 'usr_001',
    moodScore: 4,
    stressScore: 3,
    sleepHours: 7.2,
    energyLevel: 4,
    notes: 'Solid sleep. Feeling focused on OS kernel tasks, keeping caffeine low.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'w_002',
    userId: 'usr_001',
    moodScore: 3,
    stressScore: 4,
    sleepHours: 6.0,
    energyLevel: 3,
    notes: 'Late night coding session. Felt slight tension in neck, need a stretch break.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'w_003',
    userId: 'usr_001',
    moodScore: 4,
    stressScore: 2,
    sleepHours: 7.8,
    energyLevel: 5,
    notes: 'Great workout in morning. High cognitive clarity.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'w_004',
    userId: 'usr_001',
    moodScore: 2,
    stressScore: 4,
    sleepHours: 5.5,
    energyLevel: 2,
    notes: 'Midterm exam prep stress was peak. Took 15-minute meditation in focus room.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

// Seed MentorAI Messages
export const INITIAL_MENTOR_MESSAGES: MentorMessage[] = [
  {
    id: 'm_001',
    userId: 'usr_001',
    sender: 'mentor_ai',
    content: 'Hello Arjun! I am MentorAI, your engineering co-pilot and wellness companion. I am an AI designed to assist with concept debugging, workload prioritization, and burnout prevention. How is your xv6 concurrency problem progressing today?',
    createdAt: '2026-09-27T08:00:00.000Z'
  },
  {
    id: 'm_002',
    userId: 'usr_001',
    sender: 'user',
    content: 'I have two assignments due this week and I feel a bit overwhelmed about debugging race conditions in kernel space.',
    createdAt: '2026-09-27T08:02:00.000Z'
  },
  {
    id: 'm_003',
    userId: 'usr_001',
    sender: 'mentor_ai',
    content: 'That is completely normal when dealing with concurrency. Race conditions are notorious because they are non-deterministic. Let us break it down systematically:\n\n1. Run the xv6 test harness with a single CPU first (`CPUS=1`) to isolate race conditions from logic bugs.\n2. Verify that every lock release corresponds to the exact CPU owner.\n3. Take a 5-minute breather before looking at the gdb trace.\n\nRemember: your stress level is at 3/5 right now. Tackling one subsystem at a time will prevent cognitive fatigue.',
    createdAt: '2026-09-27T08:03:00.000Z'
  }
];

// Seed Community Posts
export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_001',
    authorId: 'usr_002',
    authorName: 'Rhea Patel',
    authorMajor: 'CSE 4th Year',
    title: 'How do you structure deep work sessions before end-sem lab exams?',
    content: 'Between compiler design lab submissions and project reviews, context-switching is exhausting. I found doing 45m blocks with 10m walks helps retention without feeling drained.',
    tag: 'Workload & Wellness',
    upvotes: 18,
    hasUpvoted: false,
    isAnonymous: false,
    comments: [
      {
        id: 'c_001',
        postId: 'post_001',
        authorId: 'usr_001',
        authorName: 'Arjun Sharma',
        authorMajor: 'CSE 3rd Year',
        content: 'Totally agree. The 3D Focus Sanctum here with ambient binaural rain has cut down my tab-switching significantly.',
        createdAt: '2026-09-26T14:30:00.000Z'
      }
    ],
    createdAt: '2026-09-26T12:00:00.000Z'
  },
  {
    id: 'post_002',
    authorId: 'usr_003',
    authorName: 'Karthik Nair',
    authorMajor: 'ECE 3rd Year',
    title: 'Doubt in Verilog non-blocking vs blocking assignments for state machines',
    content: 'Why does using blocking assignments (`=`) inside sequential `always @(posedge clk)` blocks lead to race conditions during simulation synthesis?',
    tag: 'Hardware',
    upvotes: 12,
    hasUpvoted: true,
    isAnonymous: false,
    comments: [
      {
        id: 'c_002',
        postId: 'post_002',
        authorId: 'usr_004',
        authorName: 'Devika Menon',
        authorMajor: 'ECE 4th Year',
        content: 'Blocking assignments evaluate and update sequentially in simulation time, meaning the next statement sees the newly updated value immediately rather than the previous clock state! Always use `<=` for registers.',
        createdAt: '2026-09-27T07:15:00.000Z'
      }
    ],
    createdAt: '2026-09-26T18:00:00.000Z'
  },
  {
    id: 'post_003',
    authorId: 'usr_anon_1',
    authorName: 'Anonymous Colleague',
    title: 'Reminder: It is okay to take an evening off when code will not compile',
    content: 'Spent 4 hours fixing a null pointer exception last night only to find a missing comma. Slept 8 hours, woke up, and fixed it in 30 seconds. Your brain needs sleep to compute.',
    tag: 'Workload & Wellness',
    upvotes: 34,
    hasUpvoted: false,
    isAnonymous: true,
    comments: [],
    createdAt: '2026-09-25T21:00:00.000Z'
  }
];

// Seed Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_001',
    userId: 'usr_001',
    title: 'Assignment Deadline in 48 Hours',
    message: 'Implement Mutex and Semaphores in xv6 Kernel is due soon.',
    type: 'deadline',
    isRead: false,
    actionUrl: '/planner',
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif_002',
    userId: 'usr_001',
    title: 'Mindful Break Reminder',
    message: 'You completed a 50-minute deep work session. Try the 4-7-8 breathing exercise.',
    type: 'wellness',
    isRead: false,
    actionUrl: '/wellness',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'notif_003',
    userId: 'usr_001',
    title: 'Weekly Study Target: 78% Reached',
    message: '21.5 of 28 study hours logged this week. Excellent pacing.',
    type: 'system',
    isRead: true,
    actionUrl: '/progress',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const STORAGE_KEY = 'jijnasu_app_state_v2';

export interface AppState {
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
  isDemoMode: boolean; // Explicit flag separating demo/seed data from real user data
}

export function getDefaultDemoState(): AppState {
  return {
    user: INITIAL_USER,
    courses: INITIAL_COURSES,
    tasks: INITIAL_TASKS,
    focusSessions: INITIAL_FOCUS_SESSIONS,
    habits: INITIAL_HABITS,
    habitLogs: INITIAL_HABIT_LOGS,
    goals: INITIAL_GOALS,
    wellnessCheckins: INITIAL_WELLNESS_CHECKINS,
    mentorMessages: INITIAL_MENTOR_MESSAGES,
    communityPosts: INITIAL_COMMUNITY_POSTS,
    notifications: INITIAL_NOTIFICATIONS,
    highContrast: false,
    reducedMotion: false,
    isDemoMode: true
  };
}

export function getCleanUserState(user: User): AppState {
  return {
    user,
    courses: [],
    tasks: [],
    focusSessions: [],
    habits: [],
    habitLogs: [],
    goals: [],
    wellnessCheckins: [],
    mentorMessages: [
      {
        id: `m_welcome_${Date.now()}`,
        userId: user.id,
        sender: 'mentor_ai',
        content: `Welcome to Jijnasu, ${user.name}! I am MentorAI, your engineering co-pilot and wellness companion. You are currently in clean workspace mode with no seeded templates. How can I help you set up your courses and study plan?`,
        createdAt: new Date().toISOString()
      }
    ],
    communityPosts: INITIAL_COMMUNITY_POSTS, // Shared campus community
    notifications: [
      {
        id: `n_clean_${Date.now()}`,
        userId: user.id,
        title: 'Fresh Workspace Created',
        message: 'Add your enrolled courses and upcoming milestones in the Planner.',
        type: 'system',
        isRead: false,
        actionUrl: '/planner',
        createdAt: new Date().toISOString()
      }
    ],
    highContrast: false,
    reducedMotion: false,
    isDemoMode: false
  };
}

export function getInitialState(): AppState {
  if (typeof window === 'undefined') {
    return getDefaultDemoState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure habit and goal arrays exist
      if (!parsed.habits) parsed.habits = INITIAL_HABITS;
      if (!parsed.habitLogs) parsed.habitLogs = INITIAL_HABIT_LOGS;
      if (!parsed.goals) parsed.goals = INITIAL_GOALS;
      if (parsed.isDemoMode === undefined) parsed.isDemoMode = true;
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load state from localStorage:', e);
  }

  return getDefaultDemoState();
}

export function saveState(state: AppState): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }
}
