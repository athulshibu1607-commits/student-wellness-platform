import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

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
    const { postId, content } = body;

    if (!postId || !content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Post ID and valid comment content are required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment exceeds maximum limit of 2000 characters', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const user = await db.findUserById(authResult.session.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User profile not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const newComment = await db.addComment(postId, user, content.trim());
    if (!newComment) {
      return NextResponse.json(
        { error: 'Post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to post comment', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
