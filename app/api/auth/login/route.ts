import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required', code: 'INVALID_CREDENTIALS' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await db.findUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password', code: 'AUTH_FAILED' },
        { status: 401 }
      );
    }

    // Verify password hash
    let isPasswordValid = false;
    if (user.passwordHash) {
      isPasswordValid = await verifyPassword(password, user.passwordHash);
    } else {
      // Legacy demo users without hash fallback to password123
      isPasswordValid = password === 'password123';
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password', code: 'AUTH_FAILED' },
        { status: 401 }
      );
    }

    // Generate signed token
    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      major: user.major,
      semester: user.semester
    });

    const { passwordHash: _, ...safeUser } = user;
    const response = NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Login successful'
    });

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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed due to a server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
