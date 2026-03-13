import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const adminEmail = "bispecialmeze@gmail.com";
    
    // Check if user exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, adminEmail))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: `User ${adminEmail} not found in database. Please sign up first.`,
        status: "NOT_FOUND"
      }, { status: 404 });
    }

    // Update user role to admin
    await db
      .update(user)
      .set({
        role: 'admin',
        updatedAt: new Date()
      })
      .where(eq(user.email, adminEmail));

    return NextResponse.json({ 
      message: `Successfully promoted ${adminEmail} to admin!`,
      userDetails: {
        id: existingUser[0].id,
        email: existingUser[0].email,
        role: 'admin'
      }
    });

  } catch (error: any) {
    console.error('Emergency fix error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
