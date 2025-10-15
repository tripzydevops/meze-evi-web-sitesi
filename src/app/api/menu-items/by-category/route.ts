import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { menuItems, categories } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Fetch all categories ordered by displayOrder
    const allCategories = await db.select()
      .from(categories)
      .orderBy(asc(categories.displayOrder));

    // Build the grouped response
    const groupedData = await Promise.all(
      allCategories.map(async (category) => {
        // Fetch menu items for this category ordered by id DESC
        const items = await db.select()
          .from(menuItems)
          .where(eq(menuItems.categoryId, category.id))
          .orderBy(desc(menuItems.id));

        return {
          id: category.id,
          name: category.name,
          displayOrder: category.displayOrder,
          items: items
        };
      })
    );

    return NextResponse.json(groupedData, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}