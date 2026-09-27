# Production Readiness Checklist — Jijnasu

This checklist documents every verified technical and operational requirement for production multi-user readiness.

---

## 1. Authentication & Session Security
- [x] Passwords hashed using cryptographically secure `scrypt` with unique 16-byte salts.
- [x] Plaintext passwords never stored in database or memory logs.
- [x] Session tokens signed with HMAC-SHA256 and verified using timing-safe comparisons (`crypto.timingSafeEqual`).
- [x] Session tokens delivered exclusively via `HttpOnly`, `SameSite=Lax`, and `Secure` (in prod) cookies (`jijnasu_session`).
- [x] No sensitive auth tokens stored in `localStorage`.
- [x] Proper logout endpoint clears cookie with `Max-Age=0`.

## 2. Authorization & Multi-User Isolation
- [x] Server-side derivation of `userId` from authenticated session cookie.
- [x] Identity spoofing prevented (client cannot override `userId` or `role`).
- [x] User A cannot read, edit, or delete User B's assignments or tasks.
- [x] User A cannot view User B's private wellness check-ins or reflections.
- [x] Non-admin users attempting to access `/api/admin` receive **HTTP 403 Forbidden**.
- [x] Authorized admins (`dean@jijnasu.edu`) receive aggregated metrics without exposed personal data.

## 3. Database Architecture & Prisma ORM
- [x] Prisma schema matches application entities: `User`, `Course`, `Task`, `FocusSession`, `WellnessCheckin`, `Habit`, `HabitLog`, `Goal`, `Notification`, `CommunityPost`, `CommunityComment`, `StudyRoom`.
- [x] Performance indexes configured: `[userId]`, `[dueDate]`, `[status]`, `[courseId]`, `[completedAt]`.
- [x] Schema validated with `npx prisma validate`.
- [x] Prisma client generated with `npx prisma generate`.
- [x] Cross-device synchronization verified (task modified in session B immediately observed in session A).

## 4. Mental Health Boundaries & Safety Architecture
- [x] 24/7 autonomous crisis interception triggers BEFORE any AI reasoning or external network call.
- [x] Toll-free national helplines surfaced: Tele-MANAS (14416), KIRAN (1800-599-0019), Vandrevala (9999 666 555), 988.
- [x] Non-clinical boundaries explicitly stated across all wellness and mentoring screens.
- [x] Transparent AI co-pilot disclosure: platform identifies itself as an artificial co-pilot, not a therapist or clinician.

## 5. UI, 3D & Accessibility Integrity
- [x] Immersive 3D Academic Core with 6 orbiting system nodes preserved.
- [x] Three.js procedural geometries with fallback rendering on low-power devices.
- [x] WCAG AA compliance: High Contrast toggle and Reduced Motion switches verified.
- [x] Full mobile responsive viewports tested and functional across all modules.
- [x] Procedural Web Audio soundscapes operate cleanly without external asset dependencies.

## 6. Data Governance & User Rights
- [x] Complete structured data export titled **"Export My Jijnasu Data"** via `GET /api/export`.
- [x] Permanent account deletion flow with required confirmation string (`DELETE`) via `POST /api/account/delete`.
- [x] All user tasks, courses, focus sessions, and wellness logs wiped on account deletion.
