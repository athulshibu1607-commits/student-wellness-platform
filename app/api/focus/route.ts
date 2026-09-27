import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.authenticated || !authResult.session) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const sessions = await db.getFocusSessions(authResult.session.userId);
    return NextResponse.json({
      success: true,
      data: sessions,
      total: sessions.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve focus history', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.authenticated || !authResult.session) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { taskId, durationMinutes, sessionType, environment3D, notes, rating } = body;

    const newSession = await db.createFocusSession(authResult.session.userId, {
      taskId: taskId || undefined,
      durationMinutes: Math.max(1, Number(durationMinutes) || 25),
      sessionType: sessionType || 'pomodoro',
      environment3D: environment3D || 'sanctum',
      notes: notes ? String(notes).trim() : undefined,
      rating: rating ? Math.min(5, Math.max(1, Number(rating))) : 5
    });

    return NextResponse.json({ success: true, data: newSession }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to log focus session', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
