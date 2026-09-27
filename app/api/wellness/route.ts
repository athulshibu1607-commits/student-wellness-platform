import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { MoodLevel, StressLevel } from '@/types';

export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.authenticated || !authResult.session) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const checkins = await db.getWellnessCheckins(authResult.session.userId);
    return NextResponse.json({
      success: true,
      data: checkins,
      total: checkins.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve wellness history', code: 'INTERNAL_ERROR' },
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
    const { moodScore, stressScore, sleepHours, energyLevel, notes } = body;

    if (!moodScore || !stressScore) {
      return NextResponse.json(
        { error: 'Mood and stress scores are required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const safeMood = Math.min(5, Math.max(1, Math.round(Number(moodScore)))) as MoodLevel;
    const safeStress = Math.min(5, Math.max(1, Math.round(Number(stressScore)))) as StressLevel;

    const newCheckin = await db.createWellnessCheckin(authResult.session.userId, {
      moodScore: safeMood,
      stressScore: safeStress,
      sleepHours: Number(sleepHours) || 7.0,
      energyLevel: Number(energyLevel) || 3,
      notes: notes ? String(notes).trim() : undefined
    });

    return NextResponse.json({ success: true, data: newCheckin }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to record wellness checkin', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
