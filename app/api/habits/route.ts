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

    const habits = await db.getHabits(authResult.session.userId);
    const logs = await db.getHabitLogs(authResult.session.userId);

    return NextResponse.json({
      success: true,
      data: {
        habits,
        logs
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve habits', code: 'INTERNAL_ERROR' },
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
    const { habitId } = body;

    if (!habitId) {
      return NextResponse.json(
        { error: 'Habit ID is required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const result = await db.toggleHabit(authResult.session.userId, habitId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to toggle habit status', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
