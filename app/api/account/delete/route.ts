import { NextResponse } from 'next/server';
import { requireAuth, clearSessionCookie, verifyPassword } from '@/lib/auth';
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
    const { confirmation, password } = body;

    if (confirmation !== 'DELETE') {
      return NextResponse.json(
        { error: 'Confirmation string "DELETE" is required to delete account', code: 'CONFIRMATION_REQUIRED' },
        { status: 400 }
      );
    }

    const user = await db.findUserById(authResult.session.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Account not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    if (password && user.passwordHash) {
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Incorrect password', code: 'INVALID_CREDENTIALS' },
          { status: 403 }
        );
      }
    }

    // Cascade delete user data
    await db.deleteUser(authResult.session.userId);

    const response = NextResponse.json({
      success: true,
      message: 'Your Jijnasu account and all associated telemetry have been permanently deleted.'
    });

    response.headers.set('Set-Cookie', clearSessionCookie());
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process account deletion', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
