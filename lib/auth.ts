import crypto from 'crypto';
import { cookies } from 'next/headers';
import { Role } from '@/types';

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  role: Role;
  major: string;
  semester: number;
}

const AUTH_SECRET = process.env.AUTH_SECRET || 'jijnasu_development_fallback_secret_32_chars_minimum';
export const SESSION_COOKIE_NAME = 'jijnasu_session';

/**
 * Hash password securely using Node.js scrypt with unique salt
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verify plaintext password against stored salt:hash string
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return resolve(false);

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return resolve(false);
      try {
        const keyBuffer = Buffer.from(key, 'hex');
        const match = crypto.timingSafeEqual(keyBuffer, derivedKey);
        resolve(match);
      } catch {
        resolve(false);
      }
    });
  });
}

/**
 * Create HMAC-SHA256 signed session token
 */
export function createSessionToken(user: SessionUser, expiresInSeconds = 7 * 24 * 60 * 60): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = {
    ...user,
    exp: expiresAt,
    iat: Math.floor(Date.now() / 1000)
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verify token signature and expiration
 */
export function verifySessionToken(token: string): SessionUser | null {
  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(payloadB64)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role as Role,
      major: payload.major,
      semester: payload.semester
    };
  } catch {
    return null;
  }
}

/**
 * Extract authenticated session from HTTP Request or Next.js Cookies
 */
export async function getSessionUser(request?: Request): Promise<SessionUser | null> {
  let token: string | undefined;

  // Try extracting from Request Cookie header if provided
  if (request) {
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader
        .split(';')
        .map(c => c.trim())
        .find(c => c.startsWith(`${SESSION_COOKIE_NAME}=`));
      if (match) {
        token = match.substring(`${SESSION_COOKIE_NAME}=`.length);
      }
    }
  }

  // Fallback to Next.js cookies() API
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Called outside Next.js request context
    }
  }

  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Alias for getSessionUser
 */
export async function getSessionFromCookie(request?: Request): Promise<SessionUser | null> {
  return getSessionUser(request);
}

export type AuthResult = 
  | { authenticated: true; session: SessionUser; error?: undefined }
  | { authenticated: false; session?: undefined; error: string };

export type RoleResult = 
  | { authenticated: true; authorized: true; session: SessionUser; error?: undefined }
  | { authenticated: false; authorized: false; session?: undefined; error: string }
  | { authenticated: true; authorized: false; session: SessionUser; error: string };

/**
 * Require valid authenticated session; returns AuthResult object
 */
export async function requireAuth(request?: Request): Promise<AuthResult> {
  const session = await getSessionUser(request);
  if (!session) {
    return { authenticated: false, error: 'Authentication required' };
  }
  return { authenticated: true, session };
}

/**
 * Require specific role (e.g. ADMIN or MENTOR); returns RoleResult object
 */
export async function requireRole(allowedRole: Role, request?: Request): Promise<RoleResult> {
  const auth = await requireAuth(request);
  if (!auth.authenticated || !auth.session) {
    return { authenticated: false, authorized: false, error: 'Authentication required' };
  }
  if (auth.session.role !== allowedRole) {
    return { 
      authenticated: true, 
      authorized: false, 
      session: auth.session, 
      error: `Forbidden: Access requires ${allowedRole} role` 
    };
  }
  return { authenticated: true, authorized: true, session: auth.session };
}

/**
 * Helper to generate Set-Cookie header for session token
 */
export function createSessionCookie(token: string, maxAge = 7 * 24 * 60 * 60): string {
  const isProd = process.env.NODE_ENV === 'production';
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${isProd ? '; Secure' : ''}`;
}

/**
 * Helper to generate Set-Cookie header to clear session
 */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
