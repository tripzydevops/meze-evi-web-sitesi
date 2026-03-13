import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { menuItems, categories } from '@/db/schema';
import { eq, asc, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Single efficient query to fetch all non-hidden categories with their non-hidden menu items
    const groupedData = await db.query.categories.findMany({
      where: (cat, { eq }: any) => eq(cat.hidden, false),
      orderBy: (cat, { asc }: any) => [asc(cat.displayOrder)],
      with: {
        menuItems: {
          where: (item: any, { eq }: any) => eq(item.hidden, false),
          orderBy: (item: any, { desc }: any) => [desc(item.id)],
        },
      },
    });

    // Rename menuItems to items for backward compatibility with the frontend if needed
    // Actually, looking at history, the frontend expects 'items'
    const results = groupedData.map(cat => ({
      ...cat,
      items: (cat as any).menuItems
    }));

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}