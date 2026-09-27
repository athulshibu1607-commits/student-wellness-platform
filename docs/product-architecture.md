# Product Architecture Document
## Jijnasu — Engineering Student Wellness & Productivity Platform
**Version:** 1.0.0 • **Status:** Production Specification • **Target Audience:** Engineering Undergraduates & Faculty Advisors

---

## 1. Executive Summary & Philosophy
Engineering students face a unique convergence of intense cognitive demands: rigorous problem sets, tight laboratory deadlines, high-stakes semester exams, co-curricular projects, and career placement pressures. Traditional productivity apps create anxiety through endless checklists, while generic wellness apps feel detached from academic realities.

**Jijnasu** (the seeker of knowledge) unites academic task planning, cognitive focus management, mental wellness monitoring, and peer collaboration into a single, cohesive, calm-by-design digital sanctum.

### Core Philosophy
1. **Calm by Design**: Deep navy, oceanic teals, warm ember accents, uncluttered layouts, and thoughtful typography that reduce cognitive load.
2. **Action-Oriented Simplicity**: Every page directly and immediately answers the student's primary question: *"What should I do next?"*
3. **Immersive Yet Lightweight 3D**: High-performance Three.js / React Three Fiber canvases for emotional grounding (Hero, Biofeedback breathing orb, Focus environment, and Analytics), paired with bulletproof HTML/accessible controls.
4. **Safety First**: Non-diagnostic, strictly supportive wellness monitoring with real-time heuristic crisis detection and immediate escalation to certified emergency support hotlines.

---

## 2. Page Hierarchy & Routing Specification

| Route | View Name | Primary Function | "What Should I Do Next?" Anchor |
| :--- | :--- | :--- | :--- |
| `/` | Landing / Hero | Immersive 3D interactive hero, feature showcase, philosophy & enrollment CTA | "Begin Your Journey" / "Sign In to Dashboard" |
| `/auth/login` | Sign In | Secure authentication (Email/Password, Supabase/Session Auth) | "Log in to your study workspace" |
| `/auth/register` | Sign Up | Student onboarding, branch/semester selection, study goals | "Create your engineering profile" |
| `/dashboard` | Command Cockpit | Real-time workload stress meter, top priority task, current study streak, quick focus launcher | "Start next high-priority task" |
| `/planner` | Academic Planner | Kanban & Calendar views, course tagging, assignment milestones, exam countdowns | "Add milestone or mark assignment complete" |
| `/focus` | 3D Focus Sanctum | Customizable ambient 3D environments (Minimal Cyber, Deep Forest, Cosmos), Pomodoro & Flow timers, ambient audio | "Initiate 25-minute deep work session" |
| `/wellness` | Wellness & Resiliency | Daily mood & stress check-ins, sleep/energy correlation, 3D biofeedback breathing orb | "Log today's pulse or practice 4-7-8 breathing" |
| `/mentor` | MentorAI | Empathetic engineering tutor, Socratic code & concept debugger, crisis detection system | "Ask a question about coursework or burnout" |
| `/progress` | Analytics & Velocity | Recharts visualization of study hours, subject distribution, focus velocity, and burnout risk index | "Review weekly workload balance" |
| `/community` | Circles & Pods | Study pods, anonymous peer doubt clearance, collaborative accountability threads | "Join active study circle or answer peer doubt" |
| `/notifications` | Notification Center | Urgent assignment deadlines, wellness break prompts, circle activity | "Dismiss or act upon pending alerts" |
| `/admin` | Administration & Safety | Anonymized campus wellness metrics, user role governance, safety escalation logs | "Audit platform activity and safety alerts" |
| `/settings` | Settings & Privacy | User profile, GDPR data export, account deletion, high-contrast & reduced motion toggles | "Customize accessibility and preferences" |

---

## 3. Data Architecture & Entity Schemas (Prisma / PostgreSQL)

### 3.1 Core Relational Schema
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  MENTOR
  ADMIN
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TaskStatus {
  BACKLOG
  IN_PROGRESS
  REVIEW
  COMPLETED
}

enum MoodLevel {
  EXCELLENT
  GOOD
  NEUTRAL
  FATIGUED
  OVERWHELMED
}

model User {
  id                String            @id @default(uuid())
  email             String            @unique
  name              String
  avatar            String?
  role              Role              @default(STUDENT)
  major             String            @default("Computer Science & Engineering")
  semester          Int               @default(5)
  weeklyTargetHours Float             @default(25.0)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  courses           Course[]
  tasks             Task[]
  focusSessions     FocusSession[]
  wellnessCheckins  WellnessCheckin[]
  mentorMessages    MentorMessage[]
  posts             CommunityPost[]
  comments          CommunityComment[]
  notifications     Notification[]
}

model Course {
  id          String   @id @default(uuid())
  userId      String
  code        String   // e.g. "CS301"
  name        String   // e.g. "Operating Systems"
  credits     Int      @default(4)
  professor   String?
  color       String   @default("#0ea5e9") // hex accent
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks       Task[]
}

model Task {
  id               String       @id @default(uuid())
  userId           String
  courseId         String?
  title            String
  description      String?
  priority         Priority     @default(MEDIUM)
  status           TaskStatus   @default(BACKLOG)
  dueDate          DateTime?
  estimatedMinutes Int          @default(60)
  completedMinutes Int          @default(0)
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  user             User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  course           Course?      @relation(fields: [courseId], references: [id], onDelete: SetNull)
  focusSessions    FocusSession[]
}

model FocusSession {
  id              String    @id @default(uuid())
  userId          String
  taskId          String?
  durationMinutes Int
  sessionType     String    @default("pomodoro") // pomodoro, flow, deepwork
  environment3D   String    @default("sanctum") // sanctum, cosmos, zen
  notes           String?
  completedAt     DateTime  @default(now())

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  task            Task?     @relation(fields: [taskId], references: [id], onDelete: SetNull)
}

model WellnessCheckin {
  id              String    @id @default(uuid())
  userId          String
  moodScore       Int       // 1 (drained) to 5 (energized)
  stressScore     Int       // 1 (calm) to 5 (extreme pressure)
  sleepHours      Float     @default(7.0)
  energyLevel     Int       // 1 to 5
  notes           String?
  createdAt       DateTime  @default(now())

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model MentorMessage {
  id              String    @id @default(uuid())
  userId          String
  sender          String    // "user" or "mentor_ai"
  content         String
  isCrisisAlert   Boolean   @default(false)
  createdAt       DateTime  @default(now())

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CommunityPost {
  id          String             @id @default(uuid())
  authorId    String
  title       String
  content     String
  tag         String             @default("General") // "Algorithms", "Gate Exam", "Hardware", "Wellness"
  upvotes     Int                @default(0)
  isAnonymous Boolean            @default(false)
  createdAt   DateTime           @default(now())

  author      User               @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments    CommunityComment[]
}

model CommunityComment {
  id        String        @id @default(uuid())
  postId    String
  authorId  String
  content   String
  createdAt DateTime      @default(now())

  post      CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  author    User          @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  title     String
  message   String
  type      String   @default("info") // "deadline", "wellness", "system", "crisis"
  isRead    Boolean  @default(false)
  actionUrl String?
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 4. Wellness Safety, Ethics & Crisis Protocol

### 4.1 Non-Medical Disclaimer
Jijnasu is exclusively an educational productivity and self-regulation tool. It **does not diagnose, treat, or replace professional mental healthcare or psychiatric evaluation**.
Every user-facing wellness screen displays:
> *"Jijnasu is an academic self-care platform. Stress indices represent self-reported workload pressure and are not clinical diagnostics."*

### 4.2 Automated Crisis Interception Pipeline
1. **Keyword & Sentiment Heuristic Analysis**: All MentorAI input queries and wellness reflection logs are evaluated against recognized self-harm and acute mental distress trigger patterns (`suicide`, `self-harm`, `hopeless`, `want to end it`, `can't take it anymore`).
2. **Immediate UI Override**:
   - The conversational AI responds with gentle validation without giving medical advice.
   - A high-priority **Emergency Crisis Modal** appears over the UI with one-tap connection to 24/7 verified crisis resources:
     - **Tele-MANAS (India)**: 14416 / 1800-891-4416 (Toll-free, 24/7)
     - **Kiran Mental Health**: 1800-599-0019
     - **Vandrevala Foundation**: +91 9999 666 555
     - **National Suicide & Crisis Lifeline (International/US)**: 988
     - **Campus Emergency Counselor Button**: Direct emergency dial/email
3. **Zero Hostile Interruption**: The user is never locked out of their academic materials, but the help resources stay visibly accessible.

---

## 5. 3D Interaction & Visual Design System

### 5.1 Palette & Aesthetic
- **Canvas Base**: Slate Deep Navy (`#090D16` / `#0E1726`)
- **Primary Glow**: Ocean Teal (`#0EA5E9` to `#14B8A6`)
- **Accent Ember**: Warm Solar Orange (`#F97316` / `#FB923C`)
- **Surface Elevation**: Layered Glass with subtle borders (`rgba(255, 255, 255, 0.05)`, border `rgba(255, 255, 255, 0.1)`)
- **Typography**: Space Grotesk / Inter / Outfit modern sans-serifs with high contrast legibility.

### 5.2 3D Canvas Modules (React Three Fiber + Drei)
1. **Hero Sacred Geometry**: Interactive wireframe Icosahedron / Mobius flow representing engineering logic intertwined with mental balance. Reacts smoothly to mouse pointer movements.
2. **Biofeedback Breathing Orb**: Rhythmical volumetric pulsating sphere guiding Pranayama 4-7-8 breathing (4s inhale, 7s hold, 8s exhale) with organic shader glow.
3. **Focus Sanctum Environments**:
   - *Minimal Dark Wireframe*: Distraction-free floating low-poly geometry
   - *Deep Celestial*: Particle nebula starfield for tranquil deep coding
   - *Forest Canopy*: Gentle floating leaves and atmospheric ambient light
4. **Graceful 2D Fallback**: If WebGL is unsupported or if `prefers-reduced-motion` is active, the app automatically switches to CSS-animated SVG visuals.

---

## 6. Development & Implementation Roadmap

- **Phase 1: Architecture, Environment & Foundations**
  - Project configuration (Next.js App Router, Tailwind CSS, TypeScript, Lucide Icons, Framer Motion, Three.js, R3F, Recharts)
  - Prisma Database Client & In-Memory / SQLite / PostgreSQL persistent fallbacks
  - Global Navigation, Layout & Design System with high-contrast accessibility tokens
- **Phase 2: Authentication & Student Profile**
  - Session authentication, login/signup forms, role-based controls, profile customizations
- **Phase 3: Academic Planner & 3D Focus Sanctum**
  - Assignment Kanban, Course Manager, Milestone countdowns, priority sorting
  - 3D interactive focus timer with ambient soundscapes, timer logs, and break notifications
- **Phase 4: Wellness Tracker & 3D Biofeedback Orb**
  - Daily mood/stress check-in, sleep/energy charts, interactive guided breathing exercise, safety disclaimer
- **Phase 5: MentorAI & Crisis Protocol**
  - Interactive chat interface, engineering problem-solving advice, automated crisis intervention triggers
- **Phase 6: Community Circles, Notifications & Analytics**
  - Study pods, peer discussion forums, doubt board, Recharts velocity analytics, notification hub
- **Phase 7: Admin Console, Accessibility & Data Privacy**
  - Anonymized student health overview, GDPR data export (JSON), account deletion, reduced motion toggle
- **Phase 8: QA, End-to-End Verification & Production Readiness**
  - Browser testing, responsiveness verification, keyboard navigation checks, audit and documentation
