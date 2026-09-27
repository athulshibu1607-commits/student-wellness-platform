import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, major, semester } = body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'A valid email address is required', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long', code: 'WEAK_PASSWORD' },
        { status: 400 }
      );
    }

    // 2. Duplicate check
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists', code: 'EMAIL_EXISTS' },
        { status: 409 }
      );
    }

    // 3. Hash password & create user
    const passwordHash = await hashPassword(password);
    const user = await db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      major: major || 'Computer Science & Engineering',
      semester: Number(semester) || 5,
      role: 'STUDENT'
    });

    // 4. Create signed session token
    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      major: user.major,
      semester: user.semester
    });

    // 5. Construct response with HTTP-only cookie
    const { passwordHash: _, ...safeUser } = user;
    const response = NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Registration successful'
    }, { status: 201 });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed due to a server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
