import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, account, session } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const adminEmail = "bispecialmeze@gmail.com";
    
    // Find the user first to get the ID
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, adminEmail))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        message: `User ${adminEmail} not found. You can go ahead and sign up fresh.`,
        status: "NOT_FOUND"
      });
    }

    const userId = existingUser[0].id;

    // Delete related records first to satisfy foreign key constraints
    await db.delete(session).where(eq(session.userId, userId));
    await db.delete(account).where(eq(account.userId, userId));
    
    // Finally delete the user
    await db.delete(user).where(eq(user.id, userId));

    return NextResponse.json({ 
      message: `Successfully deleted account for ${adminEmail}. You can now go to /sign-up to register fresh with the password '12345678'.`,
      status: "DELETED"
    });

  } catch (error: any) {
    console.error('Account reset error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
