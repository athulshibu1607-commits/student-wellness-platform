# Jijnasu — Security, Safety & Authorization Audit

**Document Version:** 2.0.0 (Production Multi-User Release)  
**Focus Areas:** Authentication, Cryptographic Password Hashing, Role-Based Access Control, API Protection, Multi-User Isolation, Mental Health Safeguards, and Non-Clinical Boundaries.

---

## 1. Authentication & Authorization Boundaries

### A. Genuine Server-Side Session Security
* **Session Cookie**: `jijnasu_session` transmitted via HTTP-Only, `SameSite=Lax`, with `Secure` flag enabled in production.
* **Cryptographic Token Signing**: HMAC-SHA256 signature generated using `AUTH_SECRET` and validated via `crypto.timingSafeEqual` to prevent signature forgery and timing attacks.
* **Password Hashing**: Node.js native `crypto.scrypt` with a unique 16-byte random salt per user. Passwords never stored in plaintext.
* **Token Expiration**: Signed tokens enforce a 7-day expiration window (`exp`).
* **Zero Client Authority**: `localStorage` is **never** consulted for authentication, user IDs, or role elevation.

### B. Server-Side Role-Based Access Control (RBAC)
* Supported roles: `STUDENT`, `MENTOR`, `ADMIN`.
* Administrative endpoints (e.g. `GET /api/admin`) strictly verify the decoded server session role via `requireRole('ADMIN', request)`.
* Requests from students receive **HTTP 403 Forbidden** (`code: FORBIDDEN`).
* Role selectors in the UI are strictly for switching between demo accounts on the login portal.

---

## 2. API Surface & Input Validation

| API Endpoint | Method | Authentication Required | Authorization / Scoping | Input Validation & Bounds | Error Code |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`/api/auth/register`** | `POST` | Public | None | Email format, duplicate check, password strength | 400 `INVALID_INPUT`, 409 `USER_EXISTS` |
| **`/api/auth/login`** | `POST` | Public | None | Credentials verified with timingSafeEqual | 401 `INVALID_CREDENTIALS` |
| **`/api/auth/logout`** | `POST` | Session | None | Clears cookie (`Max-Age=0`) | 200 `OK` |
| **`/api/auth/me`** | `GET` | Session | Returns session user | HMAC signature and expiration verified | 200 `OK` |
| **`/api/tasks`** | `GET` | `requireAuth` | Scoped strictly to `session.userId` | None | 401 `AUTH_REQUIRED` |
| **`/api/tasks`** | `POST` | `requireAuth` | Created with `userId = session.userId` | `title` required, `priority` enum validated | 400 `INVALID_INPUT` |
| **`/api/tasks`** | `PUT` | `requireAuth` | Modifies only tasks matching `userId` | `id` required | 404 `NOT_FOUND` |
| **`/api/tasks`** | `DELETE`| `requireAuth` | Deletes only tasks matching `userId` | `id` search parameter required | 404 `NOT_FOUND` |
| **`/api/courses`** | `GET/POST/PUT/DELETE` | `requireAuth` | Scoped strictly to `session.userId` | `name`, `code` required | 400 / 404 |
| **`/api/wellness`** | `GET/POST` | `requireAuth` | Scoped strictly to `session.userId` | `moodScore`, `stressScore` clamped `[1, 5]` | 400 `INVALID_INPUT` |
| **`/api/focus`** | `GET/POST` | `requireAuth` | Scoped strictly to `session.userId` | `durationMinutes >= 1` | 400 `INVALID_INPUT` |
| **`/api/habits`** | `GET/POST` | `requireAuth` | Scoped strictly to `session.userId` | `habitId` required | 400 `INVALID_INPUT` |
| **`/api/notifications`** | `GET/PATCH/DELETE` | `requireAuth` | Scoped strictly to `session.userId` | `id` or `markAll` parameter | 400 / 404 |
| **`/api/admin`** | `GET` | `requireRole('ADMIN')` | Enforces `ADMIN` role server-side | Aggregated campus counts, no personal logs | 403 `FORBIDDEN` |
| **`/api/export`** | `GET` | `requireAuth` | Exports only authenticated user records | Downloads "Export My Jijnasu Data" package | 401 `AUTH_REQUIRED` |
| **`/api/account/delete`**| `POST`| `requireAuth` | Wipes user records & clears session | Requires confirmation string `"DELETE"` | 400 `CONFIRMATION_REQUIRED` |
| **`/api/mentor`** | `POST` | Optional Session | Context bound to session user | Autonomous crisis check before LLM call | 400 `INVALID_INPUT` |

---

## 3. MentorAI Safety & Crisis Intervention Protocol

1. **Autonomous Crisis Keyword Interception**:
   - The server inspects prompt tokens for explicit crisis terms (`suicide`, `kill myself`, `want to die`, `end my life`, `self harm`, `hopeless`, `can't take it anymore`).
   - If triggered:
     - Normal conversational generation is **immediately halted**.
     - An emergency crisis payload is returned with `isCrisisAlert: true`.
     - Certified human emergency hotlines are displayed (Tele-MANAS `14416`, KIRAN `1800-599-0019`, Vandrevala Foundation `9999 666 555`, 988 Suicide & Crisis Lifeline).
2. **Transparent AI Identification**:
   - MentorAI displays an explicit disclosure badge: *"MentorAI is an artificial intelligence tutor and productivity companion. It is not a human counselor or licensed medical practitioner."*
   - Avoids diagnostic language (e.g. never diagnoses depression, ADHD, or anxiety disorders).

---

## 4. Multi-User Isolation Test Results

* Verified that User A (`alice@test.com`) cannot view, edit, or delete records belonging to User B (`bob@test.com`).
* Verified cross-device synchronization: updates applied in Session B are reflected in Session A upon retrieval.
* Verified that unauthenticated requests to protected API endpoints return HTTP 401.
* Verified that non-admin accounts attempting to access `/api/admin` return HTTP 403.
