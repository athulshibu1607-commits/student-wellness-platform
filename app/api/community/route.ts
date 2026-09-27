import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const posts = await db.getCommunityPosts();
    return NextResponse.json({
      success: true,
      data: posts,
      total: posts.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve community discussions', code: 'INTERNAL_ERROR' },
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
    const { title, content, tag, isAnonymous } = body;

    // Production moderation & input validation
    if (!title || typeof title !== 'string' || title.trim().length < 5) {
      return NextResponse.json(
        { error: 'Title must be at least 5 characters long', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    if (title.length > 150) {
      return NextResponse.json(
        { error: 'Title must not exceed 150 characters', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      return NextResponse.json(
        { error: 'Discussion content must be at least 10 characters long', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    if (content.length > 4000) {
      return NextResponse.json(
        { error: 'Discussion content exceeds maximum limit of 4000 characters', code: 'INVALID_INPUT' },
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

    const newPost = await db.createCommunityPost(user, {
      title: title.trim(),
      content: content.trim(),
      tag: tag || 'General',
      isAnonymous: Boolean(isAnonymous)
    });

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to publish community post', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.authenticated || !authResult.session) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const updated = await db.toggleUpvote(postId);
    if (!updated) {
      return NextResponse.json(
        { error: 'Discussion post not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update discussion vote', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
