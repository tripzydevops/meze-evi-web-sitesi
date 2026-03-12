import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { menuItems, categories } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const categoryId = searchParams.get('category_id');
    const popular = searchParams.get('popular');
    const showHidden = searchParams.get('showHidden') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single menu item by ID with category information
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const result = await db
        .select({
          id: menuItems.id,
          categoryId: menuItems.categoryId,
          name: menuItems.name,
          description: menuItems.description,
          price: menuItems.price,
          imageUrl: menuItems.imageUrl,
          popular: menuItems.popular,
          hidden: menuItems.hidden,
          servingSize: menuItems.servingSize,
          createdAt: menuItems.createdAt,
          updatedAt: menuItems.updatedAt,
          category: {
            id: categories.id,
            name: categories.name,
          },
        })
        .from(menuItems)
        .leftJoin(categories, eq(menuItems.categoryId, categories.id))
        .where(
          and(
            eq(menuItems.id, parseInt(id)),
            showHidden ? undefined : eq(menuItems.hidden, false),
            showHidden ? undefined : eq(categories.hidden, false)
          )
        )
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Menu item not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(result[0], { status: 200 });
    }

    // List all menu items with filters
    let whereConditions = [];

    if (categoryId) {
      if (isNaN(parseInt(categoryId))) {
        return NextResponse.json(
          { error: 'Valid category ID is required', code: 'INVALID_CATEGORY_ID' },
          { status: 400 }
        );
      }
      whereConditions.push(eq(menuItems.categoryId, parseInt(categoryId)));
    }

    if (popular === 'true') {
      whereConditions.push(eq(menuItems.popular, true));
    }

    // For public requests, hide items from hidden categories or items marked as hidden
    if (!showHidden) {
      whereConditions.push(eq(categories.hidden, false));
      whereConditions.push(eq(menuItems.hidden, false));
    }

    let query = db
      .select({
        id: menuItems.id,
        categoryId: menuItems.categoryId,
        name: menuItems.name,
        description: menuItems.description,
        price: menuItems.price,
        imageUrl: menuItems.imageUrl,
        popular: menuItems.popular,
        hidden: menuItems.hidden,
        servingSize: menuItems.servingSize,
        createdAt: menuItems.createdAt,
        updatedAt: menuItems.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(menuItems)
      .leftJoin(categories, eq(menuItems.categoryId, categories.id))
      .orderBy(desc(menuItems.id))
      .limit(limit)
      .offset(offset);

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions)) as any;
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
    const { categoryId, name, description, price, imageUrl, popular, hidden, servingSize } = body;

    // Validate required fields
    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required', code: 'MISSING_CATEGORY_ID' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!price || typeof price !== 'string' || price.trim() === '') {
      return NextResponse.json(
        { error: 'Price is required and must be a non-empty string', code: 'MISSING_PRICE' },
        { status: 400 }
      );
    }

    // Validate categoryId is a valid integer
    if (isNaN(parseInt(categoryId))) {
      return NextResponse.json(
        { error: 'Category ID must be a valid integer', code: 'INVALID_CATEGORY_ID' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, parseInt(categoryId)))
      .limit(1);

    if (category.length === 0) {
      return NextResponse.json(
        { error: 'Category does not exist', code: 'CATEGORY_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const insertData = {
      categoryId: parseInt(categoryId),
      name: name.trim(),
      description: description || null,
      price: price.trim(),
      imageUrl: imageUrl || null,
      popular: popular === true,
      hidden: hidden === true,
      servingSize: servingSize && typeof servingSize === 'string' ? servingSize.trim() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newMenuItem = await db.insert(menuItems).values(insertData).returning();

    return NextResponse.json(newMenuItem[0], { status: 201 });
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { categoryId, name, description, price, imageUrl, popular, hidden, servingSize } = body;

    // Check if menu item exists
    const existingMenuItem = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, parseInt(id)))
      .limit(1);

    if (existingMenuItem.length === 0) {
      return NextResponse.json(
        { error: 'Menu item not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Build update object with provided fields only
    const updates: any = {
      updatedAt: new Date(),
    };

    // Validate and add categoryId if provided
    if (categoryId !== undefined) {
      if (isNaN(parseInt(categoryId))) {
        return NextResponse.json(
          { error: 'Category ID must be a valid integer', code: 'INVALID_CATEGORY_ID' },
          { status: 400 }
        );
      }

      // Check if category exists
      const category = await db
        .select()
        .from(categories)
        .where(eq(categories.id, parseInt(categoryId)))
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json(
          { error: 'Category does not exist', code: 'CATEGORY_NOT_FOUND' },
          { status: 400 }
        );
      }

      updates.categoryId = parseInt(categoryId);
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (description !== undefined) {
      updates.description = description || null;
    }

    if (price !== undefined) {
      if (typeof price !== 'string' || price.trim() === '') {
        return NextResponse.json(
          { error: 'Price must be a non-empty string', code: 'INVALID_PRICE' },
          { status: 400 }
        );
      }
      updates.price = price.trim();
    }

    if (imageUrl !== undefined) {
      updates.imageUrl = imageUrl || null;
    }

    if (popular !== undefined) {
      updates.popular = popular === true;
    }

    if (hidden !== undefined) {
      updates.hidden = hidden === true;
    }

    if (servingSize !== undefined) {
      updates.servingSize = servingSize && typeof servingSize === 'string' ? servingSize.trim() : null;
    }

    // Check if at least one field to update (besides updatedAt)
    if (Object.keys(updates).length === 1) {
      return NextResponse.json(
        { error: 'At least one field to update is required', code: 'NO_FIELDS_TO_UPDATE' },
        { status: 400 }
      );
    }

    const updated = await db
      .update(menuItems)
      .set(updates)
      .where(eq(menuItems.id, parseInt(id)))
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if menu item exists
    const existingMenuItem = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, parseInt(id)))
      .limit(1);

    if (existingMenuItem.length === 0) {
      return NextResponse.json(
        { error: 'Menu item not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(menuItems)
      .where(eq(menuItems.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Menu item deleted successfully',
        deletedItem: deleted[0],
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