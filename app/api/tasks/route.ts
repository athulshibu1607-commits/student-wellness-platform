import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSessionUser(request);
    const userId = session?.userId || 'usr_001';

    const tasks = await db.getTasks(userId);
    return NextResponse.json({
      success: true,
      data: tasks,
      total: tasks.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser(request);
    const userId = session?.userId || 'usr_001';

    const body = await request.json();
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json(
        { error: 'Task title is required', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    const newTask = await db.createTask(userId, {
      title: body.title.trim(),
      description: body.description?.trim(),
      courseId: body.courseId || undefined,
      priority: body.priority || 'MEDIUM',
      status: body.status || 'BACKLOG',
      dueDate: body.dueDate || undefined,
      estimatedMinutes: Number(body.estimatedMinutes) || 60
    });

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task', code: 'CREATE_ERROR' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionUser(request);
    const userId = session?.userId || 'usr_001';

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required', code: 'MISSING_ID' },
        { status: 400 }
      );
    }

    const updated = await db.updateTask(id, userId, updates);
    if (!updated) {
      return NextResponse.json(
        { error: 'Task not found or unauthorized', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task', code: 'UPDATE_ERROR' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionUser(request);
    const userId = session?.userId || 'usr_001';

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required', code: 'MISSING_ID' },
        { status: 400 }
      );
    }

    const deleted = await db.deleteTask(id, userId);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Task not found or unauthorized', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete task', code: 'DELETE_ERROR' },
      { status: 500 }
    );
  }
}
