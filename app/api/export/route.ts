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

    const exportPackage = await db.exportUserData(authResult.session.userId);
    if (!exportPackage) {
      return NextResponse.json(
        { error: 'User profile not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const payload = exportPackage;

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="jijnasu-data-export-${authResult.session.userId}.json"`
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate account data export', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
