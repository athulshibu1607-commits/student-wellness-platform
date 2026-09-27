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

    const courses = await db.getCourses(authResult.session.userId);
    return NextResponse.json({
      success: true,
      data: courses,
      total: courses.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve academic courses', code: 'INTERNAL_ERROR' },
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
    const { name, code, credits, professor, color } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Course name and code are required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const newCourse = await db.createCourse(authResult.session.userId, {
      name: String(name).trim(),
      code: String(code).trim().toUpperCase(),
      credits: Number(credits) || 3,
      professor: professor ? String(professor).trim() : undefined,
      color: color || '#0ea5e9'
    });

    return NextResponse.json({ success: true, data: newCourse }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create course', code: 'INTERNAL_ERROR' },
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
    const { id, ...patch } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const updated = await db.updateCourse(id, authResult.session.userId, patch);
    if (!updated) {
      return NextResponse.json(
        { error: 'Course not found or unauthorized', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update course', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.authenticated || !authResult.session) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const deleted = await db.deleteCourse(id, authResult.session.userId);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Course not found or unauthorized', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete course', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
