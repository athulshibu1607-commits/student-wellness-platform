import { prisma } from './prisma';
import { 
  User, 
  Course, 
  Task, 
  FocusSession, 
  WellnessCheckin, 
  MentorMessage, 
  CommunityPost, 
  CommunityComment, 
  NotificationItem, 
  Habit, 
  HabitLog, 
  Goal,
  Role,
  Priority,
  TaskStatus,
  HabitCategory,
  GoalCategory
} from '@/types';
import { INITIAL_COURSES, INITIAL_TASKS, INITIAL_WELLNESS_CHECKINS, INITIAL_HABITS, INITIAL_GOALS, INITIAL_COMMUNITY_POSTS, INITIAL_NOTIFICATIONS, INITIAL_USER } from './store';
import { hashPassword } from './auth';

// In-memory record structure
interface UserRecord extends User {
  passwordHash?: string;
}

export function assertDatabaseConfigured() {
  const isProduction = process.env.NODE_ENV === 'production';
  const allowDemo = process.env.ALLOW_IN_MEMORY_DEMO === 'true';
  const dbUrl = process.env.DATABASE_URL;

  // In production deployment (e.g. Vercel, Railway, Render), DATABASE_URL must be provided and must not be an unconfigured localhost placeholder
  if (isProduction && !allowDemo && (!dbUrl || dbUrl.includes('localhost:5432') || dbUrl.includes('postgres:postgres@localhost'))) {
    throw new Error(
      'Production database configuration is missing: DATABASE_URL must be configured with a valid PostgreSQL connection string in production deployments. Silently using in-memory storage in production is prohibited to prevent data loss. See /docs/DATABASE_SETUP.md for instructions.'
    );
  }
}

export function shouldUsePrisma(): boolean {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return false;
  if (process.env.USE_PRISMA === 'true') return true;
  // If a real non-placeholder URL is configured
  if (!dbUrl.includes('localhost:5432') && !dbUrl.includes('postgres:postgres@localhost')) {
    return true;
  }
  return false;
}

class DatabaseRepository {
  private users: UserRecord[] = [];
  private courses: Course[] = [];
  private tasks: Task[] = [];
  private focusSessions: FocusSession[] = [];
  private wellnessCheckins: WellnessCheckin[] = [];
  private mentorMessages: MentorMessage[] = [];
  private communityPosts: CommunityPost[] = [];
  private notifications: NotificationItem[] = [];
  private habits: Habit[] = [];
  private habitLogs: HabitLog[] = [];
  private goals: Goal[] = [];
  private isSeeded = false;

  constructor() {
    this.seedDefaultData();
  }

  private async seedDefaultData() {
    if (this.isSeeded) return;
    this.isSeeded = true;

    // Default student user
    const defaultPasswordHash = await hashPassword('password123');
    const demoStudent: UserRecord = {
      ...INITIAL_USER,
      passwordHash: defaultPasswordHash
    };

    // Default faculty/mentor user
    const mentorPasswordHash = await hashPassword('password123');
    const demoMentor: UserRecord = {
      id: 'usr_mentor_01',
      email: 'mentor@eng.edu',
      name: 'Prof. Ananya Roy',
      avatar: undefined,
      role: 'MENTOR',
      major: 'Computer Systems Architecture',
      semester: 8,
      weeklyTargetHours: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordHash: mentorPasswordHash
    };

    // Default institutional admin
    const adminPasswordHash = await hashPassword('admin123456');
    const demoAdmin: UserRecord = {
      id: 'usr_admin',
      email: 'dean@jijnasu.edu',
      name: 'Dr. Vikram Sen',
      avatar: undefined,
      role: 'ADMIN',
      major: 'Academic Affairs & Counseling',
      semester: 8,
      weeklyTargetHours: 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordHash: adminPasswordHash
    };

    // Campus admin alias
    const demoCampusAdmin: UserRecord = {
      id: 'usr_campus_admin',
      email: 'campus.admin@eng.edu',
      name: 'Dean of Academics',
      avatar: undefined,
      role: 'ADMIN',
      major: 'Academic Affairs',
      semester: 8,
      weeklyTargetHours: 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordHash: adminPasswordHash
    };

    this.users.push(demoStudent, demoMentor, demoAdmin, demoCampusAdmin);
    this.courses.push(...INITIAL_COURSES);
    this.tasks.push(...INITIAL_TASKS);
    this.wellnessCheckins.push(...INITIAL_WELLNESS_CHECKINS);
    this.habits.push(...INITIAL_HABITS);
    this.goals.push(...INITIAL_GOALS);
    this.communityPosts.push(...INITIAL_COMMUNITY_POSTS);
    this.notifications.push(...INITIAL_NOTIFICATIONS);
  }

  // --- USERS & AUTH ---
  async findUserByEmail(email: string): Promise<UserRecord | null> {
    assertDatabaseConfigured();
    const cleanEmail = email.toLowerCase().trim();

    if (shouldUsePrisma()) {
      const u = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (!u) return null;
      return {
        ...u,
        role: u.role as Role,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
        avatar: u.avatar || undefined,
        passwordHash: u.passwordHash || undefined
      };
    }

    await this.seedDefaultData();
    return this.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  }

  async findUserById(id: string): Promise<UserRecord | null> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const u = await prisma.user.findUnique({ where: { id } });
      if (!u) return null;
      return {
        ...u,
        role: u.role as Role,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
        avatar: u.avatar || undefined,
        passwordHash: u.passwordHash || undefined
      };
    }

    await this.seedDefaultData();
    return this.users.find(u => u.id === id) || null;
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    name: string;
    major?: string;
    semester?: number;
    role?: Role;
  }): Promise<UserRecord> {
    assertDatabaseConfigured();
    const cleanEmail = data.email.toLowerCase().trim();

    if (shouldUsePrisma()) {
      const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (existing) {
        throw new Error('User already exists with this email');
      }
      const u = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: data.name,
          passwordHash: data.passwordHash,
          role: (data.role as any) || 'STUDENT',
          major: data.major || 'Computer Science & Engineering',
          semester: data.semester || 5,
          weeklyTargetHours: 25.0
        }
      });
      return {
        ...u,
        role: u.role as Role,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
        avatar: u.avatar || undefined,
        passwordHash: u.passwordHash || undefined
      };
    }

    await this.seedDefaultData();
    const existing = await this.findUserByEmail(cleanEmail);
    if (existing) {
      throw new Error('User already exists with this email');
    }

    const newUser: UserRecord = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      email: cleanEmail,
      name: data.name,
      role: data.role || 'STUDENT',
      major: data.major || 'Computer Science & Engineering',
      semester: data.semester || 5,
      weeklyTargetHours: 25.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordHash: data.passwordHash
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, patch: Partial<User>): Promise<UserRecord | null> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const u = await prisma.user.update({
        where: { id },
        data: {
          name: patch.name,
          email: patch.email ? patch.email.toLowerCase().trim() : undefined,
          major: patch.major,
          semester: patch.semester,
          weeklyTargetHours: patch.weeklyTargetHours,
          avatar: patch.avatar
        }
      });
      return {
        ...u,
        role: u.role as Role,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
        avatar: u.avatar || undefined,
        passwordHash: u.passwordHash || undefined
      };
    }

    const user = await this.findUserById(id);
    if (!user) return null;
    Object.assign(user, patch, { updatedAt: new Date().toISOString() });
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      await prisma.user.delete({ where: { id } });
      return true;
    }

    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    this.users.splice(idx, 1);
    // Cascade delete user data in memory
    this.tasks = this.tasks.filter(t => t.userId !== id);
    this.courses = this.courses.filter(c => c.userId !== id);
    this.wellnessCheckins = this.wellnessCheckins.filter(w => w.userId !== id);
    this.focusSessions = this.focusSessions.filter(f => f.userId !== id);
    this.habits = this.habits.filter(h => h.userId !== id);
    this.habitLogs = this.habitLogs.filter(hl => hl.userId !== id);
    this.goals = this.goals.filter(g => g.userId !== id);
    this.notifications = this.notifications.filter(n => n.userId !== id);
    return true;
  }

  // --- TASKS (ISOLATED BY USER) ---
  async getTasks(userId: string): Promise<Task[]> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const records = await prisma.task.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
      return records.map(t => ({
        ...t,
        description: t.description || undefined,
        courseId: t.courseId || undefined,
        dueDate: t.dueDate ? t.dueDate.toISOString() : undefined,
        priority: t.priority as Priority,
        status: t.status as TaskStatus,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString()
      }));
    }

    return this.tasks.filter(t => t.userId === userId);
  }

  async createTask(userId: string, data: Partial<Task>): Promise<Task> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const record = await prisma.task.create({
        data: {
          userId,
          courseId: data.courseId || undefined,
          title: data.title || 'Untitled Assignment',
          description: data.description,
          priority: (data.priority as any) || 'MEDIUM',
          status: (data.status as any) || 'BACKLOG',
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          estimatedMinutes: data.estimatedMinutes || 60,
          completedMinutes: 0
        }
      });
      return {
        ...record,
        description: record.description || undefined,
        courseId: record.courseId || undefined,
        dueDate: record.dueDate ? record.dueDate.toISOString() : undefined,
        priority: record.priority as Priority,
        status: record.status as TaskStatus,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString()
      };
    }

    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      courseId: data.courseId,
      title: data.title || 'Untitled Assignment',
      description: data.description,
      priority: data.priority || 'MEDIUM',
      status: data.status || 'BACKLOG',
      dueDate: data.dueDate,
      estimatedMinutes: data.estimatedMinutes || 60,
      completedMinutes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return newTask;
  }

  async updateTask(id: string, userId: string, patch: Partial<Task>): Promise<Task | null> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const existing = await prisma.task.findFirst({ where: { id, userId } });
      if (!existing) return null;
      const updated = await prisma.task.update({
        where: { id },
        data: {
          title: patch.title,
          description: patch.description,
          courseId: patch.courseId,
          priority: patch.priority as any,
          status: patch.status as any,
          dueDate: patch.dueDate ? new Date(patch.dueDate) : undefined,
          estimatedMinutes: patch.estimatedMinutes,
          completedMinutes: patch.completedMinutes
        }
      });
      return {
        ...updated,
        description: updated.description || undefined,
        courseId: updated.courseId || undefined,
        dueDate: updated.dueDate ? updated.dueDate.toISOString() : undefined,
        priority: updated.priority as Priority,
        status: updated.status as TaskStatus,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString()
      };
    }

    const task = this.tasks.find(t => t.id === id && t.userId === userId);
    if (!task) return null;
    Object.assign(task, patch, { updatedAt: new Date().toISOString() });
    return task;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const del = await prisma.task.deleteMany({ where: { id, userId } });
      return del.count > 0;
    }

    const idx = this.tasks.findIndex(t => t.id === id && t.userId === userId);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    return true;
  }

  // --- COURSES (ISOLATED BY USER) ---
  async getCourses(userId: string): Promise<Course[]> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const courses = await prisma.course.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
      return courses.map(c => ({
        ...c,
        professor: c.professor || undefined,
        createdAt: c.createdAt.toISOString()
      }));
    }

    return this.courses.filter(c => c.userId === userId);
  }

  async createCourse(userId: string, data: Partial<Course>): Promise<Course> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const c = await prisma.course.create({
        data: {
          userId,
          code: data.code || 'ENG101',
          name: data.name || 'Engineering Course',
          credits: data.credits || 4,
          professor: data.professor,
          color: data.color || '#0ea5e9',
          isArchived: false
        }
      });
      return {
        ...c,
        professor: c.professor || undefined,
        createdAt: c.createdAt.toISOString()
      };
    }

    const newCourse: Course = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      code: data.code || 'ENG101',
      name: data.name || 'Engineering Course',
      credits: data.credits || 4,
      professor: data.professor,
      color: data.color || '#0ea5e9',
      isArchived: false,
      createdAt: new Date().toISOString()
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  async updateCourse(id: string, userId: string, patch: Partial<Course>): Promise<Course | null> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const existing = await prisma.course.findFirst({ where: { id, userId } });
      if (!existing) return null;
      const updated = await prisma.course.update({
        where: { id },
        data: patch
      });
      return {
        ...updated,
        professor: updated.professor || undefined,
        createdAt: updated.createdAt.toISOString()
      };
    }

    const course = this.courses.find(c => c.id === id && c.userId === userId);
    if (!course) return null;
    Object.assign(course, patch);
    return course;
  }

  async deleteCourse(id: string, userId: string): Promise<boolean> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const del = await prisma.course.deleteMany({ where: { id, userId } });
      return del.count > 0;
    }

    const idx = this.courses.findIndex(c => c.id === id && c.userId === userId);
    if (idx === -1) return false;
    this.courses.splice(idx, 1);
    this.tasks = this.tasks.filter(t => t.courseId !== id);
    return true;
  }

  // --- FOCUS SESSIONS (ISOLATED BY USER) ---
  async getFocusSessions(userId: string): Promise<FocusSession[]> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const sessions = await prisma.focusSession.findMany({ where: { userId }, orderBy: { completedAt: 'desc' } });
      return sessions.map(f => ({
        ...f,
        sessionType: f.sessionType as 'pomodoro' | 'flow' | 'deepwork',
        environment3D: f.environment3D as 'sanctum' | 'cosmos' | 'zen',
        taskId: f.taskId || undefined,
        notes: f.notes || undefined,
        rating: f.rating || 5,
        completedAt: f.completedAt.toISOString()
      }));
    }

    return this.focusSessions.filter(f => f.userId === userId);
  }

  async createFocusSession(userId: string, data: Partial<FocusSession>): Promise<FocusSession> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const f = await prisma.focusSession.create({
        data: {
          userId,
          taskId: data.taskId || undefined,
          durationMinutes: data.durationMinutes || 25,
          sessionType: data.sessionType || 'pomodoro',
          environment3D: data.environment3D || 'sanctum',
          notes: data.notes,
          rating: data.rating || 5
        }
      });
      return {
        ...f,
        sessionType: f.sessionType as 'pomodoro' | 'flow' | 'deepwork',
        environment3D: f.environment3D as 'sanctum' | 'cosmos' | 'zen',
        taskId: f.taskId || undefined,
        notes: f.notes || undefined,
        rating: f.rating || 5,
        completedAt: f.completedAt.toISOString()
      };
    }

    const newSession: FocusSession = {
      id: `f_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      taskId: data.taskId,
      durationMinutes: data.durationMinutes || 25,
      sessionType: data.sessionType || 'pomodoro',
      environment3D: data.environment3D || 'sanctum',
      notes: data.notes,
      rating: data.rating || 5,
      completedAt: new Date().toISOString()
    };
    this.focusSessions.push(newSession);

    // If linked to a task, update completedMinutes
    if (data.taskId) {
      const task = this.tasks.find(t => t.id === data.taskId && t.userId === userId);
      if (task) {
        task.completedMinutes = (task.completedMinutes || 0) + (data.durationMinutes || 25);
      }
    }

    return newSession;
  }

  // --- WELLNESS CHECKINS (ISOLATED BY USER) ---
  async getWellnessCheckins(userId: string): Promise<WellnessCheckin[]> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const logs = await prisma.wellnessCheckin.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
      return logs.map(w => ({
        ...w,
        moodScore: w.moodScore as any,
        stressScore: w.stressScore as any,
        notes: w.notes || undefined,
        createdAt: w.createdAt.toISOString()
      }));
    }

    return this.wellnessCheckins.filter(w => w.userId === userId);
  }

  async createWellnessCheckin(userId: string, data: Partial<WellnessCheckin>): Promise<WellnessCheckin> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const w = await prisma.wellnessCheckin.create({
        data: {
          userId,
          moodScore: data.moodScore || 3,
          stressScore: data.stressScore || 3,
          sleepHours: data.sleepHours || 7.0,
          energyLevel: data.energyLevel || 3,
          notes: data.notes
        }
      });
      return {
        ...w,
        moodScore: w.moodScore as any,
        stressScore: w.stressScore as any,
        notes: w.notes || undefined,
        createdAt: w.createdAt.toISOString()
      };
    }

    const newCheckin: WellnessCheckin = {
      id: `w_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      moodScore: data.moodScore || 3,
      stressScore: data.stressScore || 3,
      sleepHours: data.sleepHours || 7.0,
      energyLevel: data.energyLevel || 3,
      notes: data.notes,
      createdAt: new Date().toISOString()
    };
    this.wellnessCheckins.unshift(newCheckin);
    return newCheckin;
  }

  // --- NOTIFICATIONS (ISOLATED BY USER) ---
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const notes = await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
      return notes.map(n => ({
        ...n,
        type: n.type as any,
        actionUrl: n.actionUrl || undefined,
        createdAt: n.createdAt.toISOString()
      }));
    }

    return this.notifications.filter(n => n.userId === userId);
  }

  async markNotificationRead(id: string, userId: string): Promise<boolean> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const res = await prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
      return res.count > 0;
    }

    const notif = this.notifications.find(n => n.id === id && n.userId === userId);
    if (!notif) return false;
    notif.isRead = true;
    return true;
  }

  async markAllNotificationsRead(userId: string): Promise<boolean> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      await prisma.notification.updateMany({ where: { userId }, data: { isRead: true } });
      return true;
    }

    this.notifications.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    return true;
  }

  async deleteNotification(id: string, userId: string): Promise<boolean> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const res = await prisma.notification.deleteMany({ where: { id, userId } });
      return res.count > 0;
    }

    const idx = this.notifications.findIndex(n => n.id === id && n.userId === userId);
    if (idx === -1) return false;
    this.notifications.splice(idx, 1);
    return true;
  }

  // --- COMMUNITY (PUBLIC READ, AUTHORIZED WRITE) ---
  async getCommunityPosts(): Promise<CommunityPost[]> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const posts = await prisma.communityPost.findMany({
        include: { 
          author: { select: { name: true, major: true } },
          comments: { 
            include: { author: { select: { name: true } } },
            orderBy: { createdAt: 'asc' } 
          } 
        },
        orderBy: { createdAt: 'desc' }
      });
      return posts.map(p => ({
        id: p.id,
        authorId: p.authorId,
        authorName: p.isAnonymous ? 'Anonymous Student' : (p.author?.name || 'Student'),
        authorMajor: p.author?.major,
        title: p.title,
        content: p.content,
        tag: p.tag as any,
        upvotes: p.upvotes,
        hasUpvoted: false,
        isAnonymous: p.isAnonymous,
        createdAt: p.createdAt.toISOString(),
        comments: p.comments.map(c => ({
          id: c.id,
          postId: c.postId,
          authorId: c.authorId,
          authorName: (c as any).author?.name || 'Student',
          content: c.content,
          createdAt: c.createdAt.toISOString()
        }))
      }));
    }

    return this.communityPosts;
  }

  async createCommunityPost(userOrData: any, maybeData?: any): Promise<CommunityPost> {
    assertDatabaseConfigured();
    
    // Support both signatures: createCommunityPost(user, data) and createCommunityPost(data)
    const user: User | null = maybeData ? userOrData : null;
    const data: Partial<CommunityPost> = maybeData ? maybeData : userOrData;

    const authorId = user?.id || data.authorId || 'usr_001';
    const authorName = user?.name || data.authorName || 'Student';
    const authorMajor = user?.major || data.authorMajor;

    if (shouldUsePrisma()) {
      const post = await prisma.communityPost.create({
        data: {
          authorId,
          title: data.title || 'Untitled Discussion',
          content: data.content || '',
          tag: data.tag || 'General',
          isAnonymous: Boolean(data.isAnonymous),
          upvotes: 0
        },
        include: { 
          author: { select: { name: true, major: true } },
          comments: true 
        }
      });
      return {
        id: post.id,
        authorId: post.authorId,
        authorName: post.isAnonymous ? 'Anonymous Student' : (post.author?.name || authorName),
        authorMajor: post.author?.major || authorMajor,
        title: post.title,
        content: post.content,
        tag: post.tag as any,
        upvotes: post.upvotes,
        hasUpvoted: false,
        isAnonymous: post.isAnonymous,
        createdAt: post.createdAt.toISOString(),
        comments: []
      };
    }

    const newPost: CommunityPost = {
      id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      authorId,
      authorName: data.isAnonymous ? 'Anonymous Student' : authorName,
      authorMajor,
      title: data.title || 'Untitled Discussion',
      content: data.content || '',
      tag: data.tag || 'General',
      upvotes: 0,
      hasUpvoted: false,
      isAnonymous: Boolean(data.isAnonymous),
      comments: [],
      createdAt: new Date().toISOString()
    };
    this.communityPosts.unshift(newPost);
    return newPost;
  }

  async toggleUpvoteCommunityPost(id: string, userId: string): Promise<number> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const post = await prisma.communityPost.update({
        where: { id },
        data: { upvotes: { increment: 1 } }
      });
      return post.upvotes;
    }

    const post = this.communityPosts.find(p => p.id === id);
    if (!post) return 0;
    post.upvotes = (post.upvotes || 0) + 1;
    post.hasUpvoted = true;
    return post.upvotes;
  }

  async toggleUpvote(id: string, userId?: string): Promise<number> {
    return this.toggleUpvoteCommunityPost(id, userId || 'usr_001');
  }

  async addComment(postId: string, user: User, content: string): Promise<CommunityComment | null> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const c = await prisma.communityComment.create({
        data: {
          postId,
          authorId: user.id,
          content
        }
      });
      return {
        id: c.id,
        postId: c.postId,
        authorId: c.authorId,
        authorName: user.name,
        content: c.content,
        createdAt: c.createdAt.toISOString()
      };
    }

    const post = this.communityPosts.find(p => p.id === postId);
    if (!post) return null;
    const newComment: CommunityComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      postId,
      authorId: user.id,
      authorName: user.name,
      content,
      createdAt: new Date().toISOString()
    };
    post.comments = post.comments || [];
    post.comments.push(newComment);
    return newComment;
  }

  async addCommunityComment(postId: string, comment: Partial<CommunityComment>): Promise<CommunityComment | null> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const c = await prisma.communityComment.create({
        data: {
          postId,
          authorId: comment.authorId || 'usr_001',
          content: comment.content || ''
        }
      });
      return {
        id: c.id,
        postId: c.postId,
        authorId: c.authorId,
        authorName: comment.authorName || 'Student',
        content: c.content,
        createdAt: c.createdAt.toISOString()
      };
    }

    const post = this.communityPosts.find(p => p.id === postId);
    if (!post) return null;
    const newComment: CommunityComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      postId,
      authorId: comment.authorId || 'usr_001',
      authorName: comment.authorName || 'Student',
      content: comment.content || '',
      createdAt: new Date().toISOString()
    };
    post.comments = post.comments || [];
    post.comments.push(newComment);
    return newComment;
  }

  // --- HABITS (ISOLATED BY USER) ---
  async getHabits(userId: string): Promise<Habit[]> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const habits = await prisma.habit.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
      return habits.map(h => ({
        ...h,
        category: h.category as any,
        streakCount: 0,
        createdAt: h.createdAt.toISOString()
      }));
    }

    return this.habits.filter(h => h.userId === userId);
  }

  async getHabitLogs(userId: string): Promise<HabitLog[]> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const logs = await prisma.habitLog.findMany({ where: { userId }, orderBy: { date: 'desc' } });
      return logs.map(l => ({
        id: l.id,
        habitId: l.habitId,
        userId: l.userId,
        date: l.date,
        completed: l.completed
      }));
    }

    return this.habitLogs.filter(hl => hl.userId === userId);
  }

  async toggleHabit(userId: string, habitId: string): Promise<boolean> {
    return this.toggleHabitToday(userId, habitId);
  }

  async toggleHabitToday(userId: string, habitId: string): Promise<boolean> {
    assertDatabaseConfigured();
    const today = new Date().toISOString().split('T')[0];

    if (shouldUsePrisma()) {
      const existing = await prisma.habitLog.findFirst({
        where: { userId, habitId, date: today }
      });
      if (existing) {
        await prisma.habitLog.delete({ where: { id: existing.id } });
        return false;
      } else {
        await prisma.habitLog.create({
          data: {
            userId,
            habitId,
            date: today,
            completed: true
          }
        });
        return true;
      }
    }

    const idx = this.habitLogs.findIndex(l => l.userId === userId && l.habitId === habitId && l.date === today);
    if (idx !== -1) {
      this.habitLogs.splice(idx, 1);
      return false;
    } else {
      this.habitLogs.push({
        id: `hl_${Date.now()}`,
        habitId,
        userId,
        date: today,
        completed: true
      });
      return true;
    }
  }

  // --- GOALS (ISOLATED BY USER) ---
  async getGoals(userId: string): Promise<Goal[]> {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const goals = await prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
      return goals.map(g => ({
        ...g,
        category: g.category as any,
        priority: g.priority as any,
        courseId: g.courseId || undefined,
        progress: g.progress,
        targetDate: g.targetDate.toISOString(),
        createdAt: g.createdAt.toISOString()
      }));
    }

    return this.goals.filter(g => g.userId === userId);
  }

  // --- EXPORT USER DATA ---
  async exportUserData(userId: string) {
    assertDatabaseConfigured();
    const [user, courses, tasks, focusSessions, wellnessCheckins, notifications, habits, goals] = await Promise.all([
      this.findUserById(userId),
      this.getCourses(userId),
      this.getTasks(userId),
      this.getFocusSessions(userId),
      this.getWellnessCheckins(userId),
      this.getNotifications(userId),
      this.getHabits(userId),
      this.getGoals(userId)
    ]);

    let sanitizedUser = null;
    if (user) {
      const { passwordHash, ...rest } = user;
      sanitizedUser = rest;
    }

    return {
      exportTitle: 'Export My Jijnasu Data',
      notice: 'This export contains all academic, wellness, and focus telemetry associated with your account on Jijnasu Engineering Wellness & Productivity Platform.',
      generatedAt: new Date().toISOString(),
      user: sanitizedUser,
      courses,
      tasks,
      focusSessions,
      wellnessCheckins,
      notifications,
      habits,
      goals
    };
  }

  // --- ADMIN GOVERNANCE AGGREGATES ---
  async getAdminMetrics() {
    assertDatabaseConfigured();

    if (shouldUsePrisma()) {
      const [totalUsers, totalTasks, focusAgg, wellness] = await Promise.all([
        prisma.user.count(),
        prisma.task.count(),
        prisma.focusSession.aggregate({ _sum: { durationMinutes: true } }),
        prisma.wellnessCheckin.findMany({ select: { stressScore: true } })
      ]);

      const totalFocusMinutes = focusAgg._sum.durationMinutes || 0;
      const avgStress = wellness.length > 0
        ? (wellness.reduce((s, w) => s + w.stressScore, 0) / wellness.length).toFixed(1)
        : '2.8';

      const stressDistribution = {
        calm: wellness.filter(w => w.stressScore === 1).length,
        steady: wellness.filter(w => w.stressScore === 2).length,
        elevated: wellness.filter(w => w.stressScore === 3).length,
        high: wellness.filter(w => w.stressScore === 4).length,
        critical: wellness.filter(w => w.stressScore === 5).length
      };

      return {
        totalUsers,
        totalTasks,
        totalFocusMinutes,
        averageCampusStress: avgStress,
        stressDistribution,
        auditTimestamp: new Date().toISOString()
      };
    }

    const totalUsers = this.users.length;
    const totalTasks = this.tasks.length;
    const totalFocusMinutes = this.focusSessions.reduce((sum, f) => sum + f.durationMinutes, 0);
    const avgStress = this.wellnessCheckins.length > 0
      ? (this.wellnessCheckins.reduce((s, w) => s + w.stressScore, 0) / this.wellnessCheckins.length).toFixed(1)
      : '2.8';

    const stressDistribution = {
      calm: this.wellnessCheckins.filter(w => w.stressScore === 1).length,
      steady: this.wellnessCheckins.filter(w => w.stressScore === 2).length,
      elevated: this.wellnessCheckins.filter(w => w.stressScore === 3).length,
      high: this.wellnessCheckins.filter(w => w.stressScore === 4).length,
      critical: this.wellnessCheckins.filter(w => w.stressScore === 5).length
    };

    return {
      totalUsers,
      totalTasks,
      totalFocusMinutes,
      averageCampusStress: avgStress,
      stressDistribution,
      auditTimestamp: new Date().toISOString()
    };
  }
}

// Global Singleton Repository
const globalForDb = globalThis as unknown as { dbRepo?: DatabaseRepository };
export const db = globalForDb.dbRepo ?? new DatabaseRepository();
if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbRepo = db;
}
