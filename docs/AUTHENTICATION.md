# Authentication & Authorization Architecture — Jijnasu

This document details the genuine authentication and server-side authorization implementation in **Jijnasu**.

---

## 1. Core Principles

1. **No Client-Side Authority**: `localStorage` is **never** used for authentication tokens, identity derivation, or role elevation.
2. **Cryptographic Password Hashing**: Passwords are never stored in plaintext. They are salted with 16 bytes of cryptographically secure random bytes and derived using Node.js `crypto.scrypt` with timing-safe comparison.
3. **HTTP-Only Session Cookies**: Session tokens are transmitted exclusively via secure HTTP-Only cookies (`jijnasu_session`), mitigating Cross-Site Scripting (XSS) credential theft.
4. **HMAC-SHA256 Token Signing**: Session payloads are tamper-proofed with HMAC-SHA256 using `AUTH_SECRET` and include expiration timestamps (`exp`).
5. **Server-Side Identity Derivation**: All private API endpoints derive user identity directly from the decoded server session, never trusting client-supplied `userId` or `role`.

---

## 2. Authentication Flow

### Registration (`POST /api/auth/register`)
1. Validates required fields (`name`, `email`, `password`).
2. Validates email format and duplicate registration checks.
3. Hashes password using `hashPassword(password)`.
4. Creates user record in database.
5. Issues signed session cookie and returns sanitized user object (excluding `passwordHash`).

### Login (`POST /api/auth/login`)
1. Looks up user by email.
2. Verifies provided password against stored hash using `verifyPassword` (`crypto.timingSafeEqual`).
3. Generates signed session token via `createSessionToken`.
4. Sets `Set-Cookie: jijnasu_session=...; HttpOnly; Path=/; SameSite=Lax`.
5. Returns user profile and sets authenticated server state.

### Logout (`POST /api/auth/logout`)
1. Clears session cookie by setting `Max-Age=0`.
2. Invalidates client-side session state.

### Session Inspection (`GET /api/auth/me`)
1. Decodes cookie token.
2. Validates HMAC signature and token expiration.
3. Returns `{ authenticated: true, user }` or `{ authenticated: false }`.

---

## 3. Server-Side Role-Based Access Control (RBAC)

Jijnasu defines three discrete system roles:
* **`STUDENT`**: Standard engineering scholar profile; access to own courses, tasks, focus sessions, wellness records, and community discussions.
* **`MENTOR`**: Faculty / department advisor; view guidance requests and mentoring dialogues.
* **`ADMIN`**: Dean of Academics / Campus Administrator; access to aggregated campus wellness telemetry and safety incident audit trails.

### Enforcement in API Routes
Authorization is enforced server-side using helper functions in [`lib/auth.ts`](file:///Users/abhinavprajeev/jijnasu/lib/auth.ts):

```typescript
// Require valid session
const auth = await requireAuth(request);
if (!auth.authenticated || !auth.session) {
  return NextResponse.json({ error: 'Authentication required', code: 'AUTH_REQUIRED' }, { status: 401 });
}

// Require ADMIN role
const roleAuth = await requireRole('ADMIN', request);
if (!roleAuth.authorized) {
  return NextResponse.json({ error: 'Access requires ADMIN role', code: 'FORBIDDEN' }, { status: 403 });
}
```

Client-side role selectors in the UI are strictly for **demo profile switching**; attempting to invoke administrative endpoints as a `STUDENT` returns **HTTP 403 Forbidden**.

---

## 4. Multi-User Isolation Guarantees

Every data query in the repository filters strictly by `session.userId`:
* Tasks: `getTasks(session.userId)`
* Wellness: `getWellnessCheckins(session.userId)`
* Focus: `getFocusSessions(session.userId)`
* Courses: `getCourses(session.userId)`

Mutations (e.g., `DELETE /api/tasks?id=xyz`) verify that the targeted record belongs to `session.userId`. Attempting to delete another student's task returns **HTTP 404 / Unauthorized**.
