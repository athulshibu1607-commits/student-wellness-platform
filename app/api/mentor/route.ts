import { NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/aiProvider';
import { getSessionFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookie();
    const body = await request.json();
    const { content, message, major, semester, recentStress, userName } = body;
    const text = (content || message || '') as string;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Message content is required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    // Determine secure user identity from server session if available
    let effectiveUser = session ? await db.findUserById(session.userId) : null;
    const effectiveName = effectiveUser?.name || userName || 'Engineering Scholar';
    const effectiveMajor = effectiveUser?.major || major || 'Computer Science & Engineering';
    const effectiveSemester = effectiveUser?.semester || semester || 5;

    // AI Provider executes safety interceptor BEFORE any external LLM call
    const provider = getAIProvider();
    const result = await provider.generateResponse(text.trim(), {
      major: effectiveMajor,
      semester: effectiveSemester,
      recentStress,
      userName: effectiveName
    });

    return NextResponse.json({
      success: true,
      isCrisisAlert: result.isCrisisAlert,
      response: result.content,
      provider: result.provider,
      model: result.model,
      resources: result.resources,
      sender: 'mentor_ai',
      timestamp: result.timestamp
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal AI provider error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
