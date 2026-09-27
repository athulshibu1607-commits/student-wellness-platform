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

    const notifications = await db.getNotifications(authResult.session.userId);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve notifications', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.authenticated || !authResult.session) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, markAll } = body;

    if (markAll) {
      await db.markAllNotificationsRead(authResult.session.userId);
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const updated = await db.markNotificationRead(id, authResult.session.userId);
    if (!updated) {
      return NextResponse.json(
        { error: 'Notification not found or unauthorized', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update notification', code: 'INTERNAL_ERROR' },
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
        { error: 'Notification ID is required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const deleted = await db.deleteNotification(id, authResult.session.userId);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Notification not found or unauthorized', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Notification dismissed' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to dismiss notification', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
