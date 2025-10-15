import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (!token) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Valid email is required',
          code: 'INVALID_EMAIL' 
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, normalizedEmail))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Update user role to admin
    const updatedUser = await db
      .update(user)
      .set({
        role: 'admin',
        updatedAt: new Date()
      })
      .where(eq(user.email, normalizedEmail))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to update user',
          code: 'UPDATE_FAILED' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'User promoted to admin successfully',
        user: updatedUser[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}