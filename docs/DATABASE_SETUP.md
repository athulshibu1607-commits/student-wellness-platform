# Database Setup Guide — Jijnasu Architecture

This document describes the exact database architecture, schema models, environment configuration, migration workflows, and isolation guarantees implemented in **Jijnasu**.

---

## 1. Architecture Overview

Jijnasu operates on a production-ready data layer using **Prisma ORM (v6.19.3)** targeted at **PostgreSQL**.

```text
Next.js Frontend & Client Components
        ↓
HTTP-Only Cookie Session (`jijnasu_session`)
        ↓
Server Actions & Next.js API Routes (`/app/api/*`)
        ↓
Cryptographic Auth & Authorization Layer (`lib/auth.ts`)
        ↓
Repository Data Layer (`lib/db.ts`)
        ↓
Prisma Client (`@prisma/client`)
        ↓
PostgreSQL Database
```

---

## 2. Environment Variables

Store credentials strictly in environment variables. Safe defaults and placeholders are documented in `.env.example`:

```env
# Database Configuration (Supabase PostgreSQL)
# Transaction pooler (Port 6543, pgbouncer=true) for runtime queries:
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection string (Port 5432) for Prisma migrations:
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# HMAC-SHA256 Signing secret for session tokens (minimum 32 characters)
AUTH_SECRET="jijnasu_production_super_secret_signing_key_32_chars_minimum"

# Optional Upstream AI Provider Key (if omitted, Built-in DevelopmentSocraticProvider activates)
MENTOR_AI_API_KEY=""
GEMINI_API_KEY=""
```

### Supabase Connection Configuration

1. In the Supabase Dashboard, navigate to **Project Settings** > **Database**.
2. Under **Connection string**:
   - For `DATABASE_URL`: Select **Transaction** mode (port `6543`), enable `pgbouncer=true`.
   - For `DIRECT_URL`: Select **Session** or **Direct** connection (port `5432`).
3. Set these variables in `.env` (for local development) or your hosting provider (e.g. Vercel, Railway).
4. Run `npx prisma migrate deploy` to apply all migrations to Supabase.
```

> **Security Rule**: Never commit real database connection strings or secret keys to version control.

---

## 3. Schema Models & Multi-User Isolation

Every personal record in [`prisma/schema.prisma`](file:///Users/abhinavprajeev/jijnasu/prisma/schema.prisma) maintains a direct foreign-key relationship to `User.id`:

* **`User`**: Account identity, `email` (unique index), `passwordHash`, `role` (`STUDENT`, `MENTOR`, `ADMIN`), academic metadata (`major`, `semester`, `weeklyTargetHours`).
* **`Course`**: Academic courses linked via `userId`. Indexed on `userId`.
* **`Task`**: Academic assignments and milestones linked via `userId` and optional `courseId`. Performance indexes on `[userId]`, `[dueDate]`, and `[status]`.
* **`FocusSession`**: Pomodoro, Flow, and Deep Work sessions linked via `userId`. Indexed on `[userId, completedAt]`.
* **`WellnessCheckin`**: Mood, stress, sleep, and cognitive energy records linked via `userId`. Indexed on `[userId, createdAt]`.
* **`Habit` & `HabitLog`**: Habit definitions and daily completion logs scoped strictly to `userId`.
* **`Goal`**: Academic target deadlines and progress bars scoped to `userId`.
* **`Notification`**: Deadline reminders, wellness alerts, and system notices scoped to `userId`. Indexed on `[userId, isRead]`.
* **`CommunityPost` & `CommunityComment`**: Peer discussions with public read visibility, author tracking (`authorId`), and anonymous pseudonymization flags.
* **`MentorConversation` & `MentorMessage`**: Socratic co-pilot messages scoped to `userId`.

---

## 4. Migration & Schema Validation Commands

Verify and compile the Prisma schema:

```bash
# 1. Validate Prisma schema syntax and relationship graph
npx prisma validate

# 2. Generate TypeScript types and Prisma Client
npx prisma generate

# 3. Apply schema to a local or remote PostgreSQL database (development)
npx prisma migrate dev --name init

# 4. Deploy schema to production database (CI/CD)
npx prisma migrate deploy
```

---

## 5. Dual-Mode Fallback Repository

To guarantee that developers can run and test Jijnasu in isolated environments without needing an active PostgreSQL instance running on the host machine, [`lib/db.ts`](file:///Users/abhinavprajeev/jijnasu/lib/db.ts) implements an in-process multi-user repository:

* Automatically hashes default user credentials using Node.js `crypto.scrypt`.
* Fully enforces multi-user isolation (User A cannot access or delete User B's tasks or wellness logs).
* Supports immediate drop-in switching to `@prisma/client` when `DATABASE_URL` points to an active PostgreSQL instance.
