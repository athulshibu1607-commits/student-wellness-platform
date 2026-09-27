export type Role = 'STUDENT' | 'MENTOR' | 'ADMIN';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskStatus = 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export type MoodLevel = 1 | 2 | 3 | 4 | 5; // 1 = Drained, 5 = Energized
export type StressLevel = 1 | 2 | 3 | 4 | 5; // 1 = Calm, 5 = Severe

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  major: string;
  semester: number;
  weeklyTargetHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  userId: string;
  code: string;
  name: string;
  credits: number;
  professor?: string;
  color: string;
  isArchived?: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  courseId?: string;
  course?: Course;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  estimatedMinutes: number;
  completedMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  sessionType: 'pomodoro' | 'flow' | 'deepwork';
  environment3D: 'sanctum' | 'cosmos' | 'zen';
  notes?: string;
  completedAt: string;
  rating?: number; // 1-5
}

export interface WellnessCheckin {
  id: string;
  userId: string;
  moodScore: MoodLevel;
  stressScore: StressLevel;
  sleepHours: number;
  energyLevel: number; // 1-5
  notes?: string;
  createdAt: string;
}

export interface MentorMessage {
  id: string;
  userId: string;
  sender: 'user' | 'mentor_ai';
  content: string;
  isCrisisAlert?: boolean;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorMajor?: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorMajor?: string;
  title: string;
  content: string;
  tag: 'General' | 'Algorithms' | 'GATE Exam' | 'Hardware' | 'Workload & Wellness' | 'Burnout & Wellness' | 'Lab Work';
  upvotes: number;
  hasUpvoted?: boolean;
  isAnonymous: boolean;
  comments?: CommunityComment[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline' | 'wellness' | 'system' | 'crisis';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export type HabitCategory = 'COGNITIVE' | 'HEALTH' | 'ACADEMIC' | 'REST';
export type GoalCategory = 'EXAM' | 'PROJECT' | 'PLACEMENT' | 'RESEARCH';

export interface Habit {
  id: string;
  userId: string;
  title: string;
  category: HabitCategory;
  streakCount: number;
  iconName: string;
  color: string;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  courseId?: string;
  title: string;
  targetDate: string;
  category: GoalCategory;
  progress: number; // 0 - 100
  isCompleted: boolean;
  priority: Priority;
  createdAt: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  description: string;
  phone: string;
  available: string;
  region: string;
  badge: string;
  actionUrl?: string;
}

export interface StudyVelocityStats {
  totalHoursStudied: number;
  weeklyTargetHours: number;
  tasksCompleted: number;
  focusStreakDays: number;
  averageStressScore: number;
  burnoutRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  hoursBySubject: { subject: string; hours: number; color: string }[];
  dailyStudyTime: { day: string; hours: number; target: number }[];
  wellnessTrend: { date: string; mood: number; stress: number; sleep: number }[];
}
