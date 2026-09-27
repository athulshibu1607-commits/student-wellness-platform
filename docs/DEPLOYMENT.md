# Deployment Guide — Jijnasu Platform

This document describes how to deploy the Jijnasu Engineering Student Wellness & Productivity Platform to modern cloud hosting environments such as **Vercel**, **Railway**, **Render**, or **Fly.io**.

---

## 1. Prerequisites

* **Node.js**: v18.18+ or v20+ (Node v20.x recommended)
* **Hosted PostgreSQL**: Supabase, Neon, Railway Postgres, Render Postgres, or AWS RDS
* **Hosting Platform**: Vercel (recommended for Next.js App Router), Railway, or Render
* **Upstream AI Key**: Google Gemini API Key (optional; platform gracefully operates built-in Socratic reasoning engine if omitted)

---

## 2. Environment Variables Configuration

Configure the following environment variables in your deployment dashboard (e.g., Vercel Project Settings > Environment Variables):

| Variable | Description | Example / Requirement |
|---|---|---|
| `DATABASE_URL` | PostgreSQL pooled connection URL | `postgresql://user:pass@ep-cool-db.us-east-2.aws.neon.tech/jijnasu?sslmode=require` |
| `DIRECT_URL` | PostgreSQL direct URL for Prisma migrations | `postgresql://user:pass@ep-cool-db.us-east-2.aws.neon.tech/jijnasu?sslmode=require` |
| `AUTH_SECRET` | Secret key for signing HMAC session cookies | Minimum 32 random characters (`openssl rand -base64 32`) |
| `NODE_ENV` | Environment identifier | `production` |
| `GEMINI_API_KEY` | Upstream Google Gemini LLM API Key | Optional (enables production LLM provider) |
| `NEXT_PUBLIC_APP_URL` | Production canonical URL | `https://jijnasu.edu` |

> **Production Safeguard**: In production deployments, `DATABASE_URL` must point to an active hosted PostgreSQL instance. Silent fallback to temporary in-memory storage is strictly prohibited in production to prevent data loss.

---

## 3. Step-by-Step Production Deployment Workflow

Follow these exact 13 steps to launch Jijnasu into production:

### Step 1: Create PostgreSQL Database
Create a hosted PostgreSQL cluster on your preferred cloud database provider:
* **Supabase**: Create a new project, navigate to Database Settings > Connection String.
* **Neon**: Create a new database branch, copy pooled and direct connection URIs.
* **Railway**: Add a PostgreSQL service to your project canvas.

### Step 2: Copy `DATABASE_URL` and `DIRECT_URL`
Copy your database connection strings:
* Set `DATABASE_URL` (use transaction pooler port `6543` / `?pgbouncer=true` if using Supabase).
* Set `DIRECT_URL` (direct port `5432` for running migrations).

### Step 3: Configure `AUTH_SECRET`
Generate a cryptographically secure 32+ character random string:
```bash
openssl rand -base64 32
```
Add it to your hosting environment variables as `AUTH_SECRET`.

### Step 4: Configure `GEMINI_API_KEY`
If using external Google Gemini models for MentorAI:
* Obtain an API key from Google AI Studio.
* Add it as `GEMINI_API_KEY` in environment variables.
* If omitted, Jijnasu automatically runs the built-in Socratic reasoning engine.

### Step 5: Configure `NEXT_PUBLIC_APP_URL`
Set your production domain (e.g., `https://jijnasu.vercel.app` or `https://jijnasu.edu`).

### Step 6: Run Prisma Migration
Apply the database schema to your remote PostgreSQL cluster:
```bash
# Set connection to your production database
export DATABASE_URL="your-production-db-url"
export DIRECT_URL="your-production-direct-url"

# Deploy official migration
npx prisma migrate deploy
```
*Note*: The migration script is located at `prisma/migrations/20260927000000_init/migration.sql`.

### Step 7: Deploy Application
* **Vercel**:
  1. Import the Git repository into Vercel.
  2. Framework Preset: **Next.js**.
  3. Build Command: `npx prisma generate && npm run build`
  4. Output Directory: `.next`
  5. Install Command: `npm install`
  6. Deploy.
* **Railway / Render**:
  1. Create Web Service linked to the repository.
  2. Build Command: `npx prisma generate && npm run build`
  3. Start Command: `npm run start`

### Step 8: Test Registration
Visit `https://<your-domain>/auth/register` and register a new student account:
* Verify that registration returns `HTTP 201 Created`.
* Verify that a secure, `HttpOnly`, `SameSite=Lax`, `Secure` cookie named `jijnasu_session` is set by the browser.

### Step 9: Test Login
Visit `https://<your-domain>/auth/login`:
* Log in with the registered credentials.
* Verify successful redirect to `/dashboard`.
* Refresh the page to confirm persistent session state.

### Step 10: Test Database Persistence
* Create a course (e.g. `CS301 - Operating Systems`) in the Planner (`/planner`).
* Create an assignment (e.g. `xv6 Spinlock Implementation`).
* Submit a daily wellness check-in (`/wellness`).
* Restart the application or open a private browsing window to verify that records persist in PostgreSQL.

### Step 11: Test Logout
* Open the user dropdown and click **Log Out**.
* Verify that `jijnasu_session` cookie is deleted (`maxAge: 0`).
* Verify that accessing protected routes redirects to the login screen.

### Step 12: Test APIs & Authorization
Run automated verification checks:
* `GET /api/tasks` — returns only tasks belonging to the authenticated session.
* Non-admin `GET /api/admin` — returns `HTTP 403 Forbidden`.
* User B cannot access, modify, or delete User A's data.

### Step 13: Test MentorAI & Safety Interception
* Navigate to `/mentor` and submit an academic query (e.g. *"Explain TCP Slow Start"*).
* Submit a test distress phrase (e.g. *"I cannot take this pressure anymore, feeling hopeless"*).
* Verify that the autonomous crisis safety interceptor executes *before* external inference, halts normal generation, and displays verified 24/7 emergency helplines (Tele-MANAS, KIRAN, Vandrevala Foundation, 988).

---

## 4. Production Health Checklist

- [ ] `DATABASE_URL` is set to active hosted PostgreSQL cluster.
- [ ] `npx prisma migrate deploy` completed with 0 errors.
- [ ] `AUTH_SECRET` is at least 32 random characters.
- [ ] Cookies are transmitted over HTTPS (`Secure` flag active).
- [ ] No `.env` secrets or personal paths committed to Git.
- [ ] WebGL canvas fallback verified on devices with hardware acceleration disabled.
- [ ] Audio nodes verified to dispose on page exit (`/focus`).
