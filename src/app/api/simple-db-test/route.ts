import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';

export async function GET() {
  try {
    const result = await db.insert(categories).values({
      name: 'Test Category',
      displayOrder: 999,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    return NextResponse.json({
      success: true,
      data: result[0]
    }, { status: 201 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}