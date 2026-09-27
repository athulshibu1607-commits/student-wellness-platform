import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    const user = await db.findUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({
      authenticated: true,
      user: safeUser
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, user: null, error: 'Session check failed' },
      { status: 500 }
    );
  }
}
