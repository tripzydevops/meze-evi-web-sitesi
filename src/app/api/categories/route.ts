import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const showHidden = searchParams.get('showHidden') === 'true';

    // Single category by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.id, parseInt(id)))
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json(
          { error: 'Category not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(category[0], { status: 200 });
    }

    // List all categories with pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db
      .select()
      .from(categories)
      .orderBy(asc(categories.displayOrder))
      .limit(limit)
      .offset(offset);

    // Filter out hidden categories unless showHidden=true
    if (!showHidden) {
      query = query.where(eq(categories.hidden, false)) as any;
    }

    const results = await query;

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, displayOrder } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    // Prepare insert data with defaults
    const insertData = {
      name: trimmedName,
      displayOrder: displayOrder !== undefined && displayOrder !== null 
        ? parseInt(displayOrder) 
        : 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newCategory = await db
      .insert(categories)
      .values(insertData)
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, displayOrder, hidden } = body;

    // Check if at least one field to update is provided
    if (name === undefined && displayOrder === undefined && hidden === undefined) {
      return NextResponse.json(
        { error: 'At least one field to update must be provided', code: 'NO_UPDATE_FIELDS' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, parseInt(id)))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: 'Category not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      name?: string;
      displayOrder?: number;
      hidden?: boolean;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (displayOrder !== undefined && displayOrder !== null) {
      updateData.displayOrder = parseInt(displayOrder);
    }

    if (hidden !== undefined) {
      updateData.hidden = hidden === true;
    }

    const updated = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, parseInt(id)))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: 'Category not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Manual cascade deletion (as a safeguard/fallback)
    const categoryId = parseInt(id);
    
    // 1. Delete featured dishes records that reference menu items in this category
    // Handle both old and new tables if they exist
    await db.execute(
      `DELETE FROM homepage_featured_dishes 
       WHERE menu_item_id IN (SELECT id FROM menu_items WHERE category_id = ${categoryId})`
    );
    
    // Also handle homepage_featured_dishes_new which was discovered during diagnostics
    try {
      await db.execute(
        `DELETE FROM homepage_featured_dishes_new 
         WHERE menu_item_id IN (SELECT id FROM menu_items WHERE category_id = ${categoryId})`
      );
    } catch (e) {
      // Ignore if table doesn't exist
    }

    // 2. Delete menu items in this category
    await db.execute(
      `DELETE FROM menu_items WHERE category_id = ${categoryId}`
    );

    // 3. Finally delete the category
    const deleted = await db
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json(
      {
        message: 'Category deleted successfully',
        category: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}