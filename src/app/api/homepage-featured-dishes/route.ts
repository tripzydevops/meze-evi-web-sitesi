import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { homepageFeaturedDishes, menuItems } from '@/db/schema';
import { eq, asc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const dish = await db
        .select({
          id: homepageFeaturedDishes.id,
          menuItemId: homepageFeaturedDishes.menuItemId,
          displayOrder: homepageFeaturedDishes.displayOrder,
          createdAt: homepageFeaturedDishes.createdAt,
          updatedAt: homepageFeaturedDishes.updatedAt,
          menuItem: {
            id: menuItems.id,
            name: menuItems.name,
            description: menuItems.description,
            price: menuItems.price,
            imageUrl: menuItems.imageUrl,
            categoryId: menuItems.categoryId,
            popular: menuItems.popular,
          },
        })
        .from(homepageFeaturedDishes)
        .leftJoin(menuItems, eq(homepageFeaturedDishes.menuItemId, menuItems.id))
        .where(eq(homepageFeaturedDishes.id, parseInt(id)))
        .limit(1);

      if (dish.length === 0) {
        return NextResponse.json(
          { error: 'Featured dish not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(dish[0], { status: 200 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const dishes = await db
      .select({
        id: homepageFeaturedDishes.id,
        menuItemId: homepageFeaturedDishes.menuItemId,
        displayOrder: homepageFeaturedDishes.displayOrder,
        createdAt: homepageFeaturedDishes.createdAt,
        updatedAt: homepageFeaturedDishes.updatedAt,
        menuItem: {
          id: menuItems.id,
          name: menuItems.name,
          description: menuItems.description,
          price: menuItems.price,
          imageUrl: menuItems.imageUrl,
          categoryId: menuItems.categoryId,
          popular: menuItems.popular,
        },
      })
      .from(homepageFeaturedDishes)
      .leftJoin(menuItems, eq(homepageFeaturedDishes.menuItemId, menuItems.id))
      .orderBy(asc(homepageFeaturedDishes.displayOrder))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(dishes, { status: 200 });
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
    const { menuItemId, displayOrder } = body;

    console.log('POST featured dish request:', { menuItemId, displayOrder });

    if (!menuItemId || isNaN(parseInt(menuItemId))) {
      return NextResponse.json(
        { error: 'Valid menuItemId is required', code: 'INVALID_MENU_ITEM_ID' },
        { status: 400 }
      );
    }

    // Verify menu item exists and get its data
    const menuItemResult = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, parseInt(menuItemId)))
      .limit(1);

    if (menuItemResult.length === 0) {
      return NextResponse.json(
        { error: 'Menu item not found', code: 'MENU_ITEM_NOT_FOUND' },
        { status: 404 }
      );
    }

    console.log('Menu item exists:', menuItemResult[0]);

    // WORKAROUND: The actual database table has name, description, price fields
    // that are NOT NULL but are not in the Drizzle schema. We need to use raw SQL
    // to insert with the actual table structure.
    const menuItem = menuItemResult[0];
    const parsedMenuItemId = parseInt(menuItemId);
    const parsedDisplayOrder = displayOrder !== undefined ? parseInt(displayOrder) : 0;
    
    const result = await db.execute(
      sql`INSERT INTO homepage_featured_dishes (menu_item_id, display_order, name, description, price, image_url, created_at, updated_at) 
          VALUES (${parsedMenuItemId}, ${parsedDisplayOrder}, ${menuItem.name}, ${menuItem.description}, ${menuItem.price}, ${menuItem.imageUrl}, NOW(), NOW()) 
          RETURNING id, menu_item_id, display_order, created_at, updated_at`
    );

    console.log('Raw SQL insert result structure:', JSON.stringify(result, null, 2));

    // Check if result has rows property
    const insertedRow = result.rows ? result.rows[0] : (Array.isArray(result) ? result[0] : result);

    return NextResponse.json(insertedRow, { status: 201 });
  } catch (error: any) {
    console.error('POST error - COMPLETE DETAILS:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      fullError: error
    });
    return NextResponse.json(
      { 
        error: 'Database insert failed', 
        message: error.message,
        code: 'DATABASE_ERROR'
      },
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
    const { menuItemId, displayOrder } = body;

    const updates: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (menuItemId !== undefined) {
      if (isNaN(parseInt(menuItemId))) {
        return NextResponse.json(
          { error: 'Valid menuItemId is required', code: 'INVALID_MENU_ITEM_ID' },
          { status: 400 }
        );
      }

      // Verify menu item exists
      const menuItemExists = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.id, parseInt(menuItemId)))
        .limit(1);

      if (menuItemExists.length === 0) {
        return NextResponse.json(
          { error: 'Menu item not found', code: 'MENU_ITEM_NOT_FOUND' },
          { status: 404 }
        );
      }

      updates.menuItemId = parseInt(menuItemId);
    }

    if (displayOrder !== undefined) {
      updates.displayOrder = displayOrder;
    }

    if (Object.keys(updates).length === 1) {
      return NextResponse.json(
        { error: 'No fields to update', code: 'NO_FIELDS' },
        { status: 400 }
      );
    }

    const existingDish = await db
      .select()
      .from(homepageFeaturedDishes)
      .where(eq(homepageFeaturedDishes.id, parseInt(id)))
      .limit(1);

    if (existingDish.length === 0) {
      return NextResponse.json(
        { error: 'Featured dish not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const updatedDish = await db
      .update(homepageFeaturedDishes)
      .set(updates)
      .where(eq(homepageFeaturedDishes.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedDish[0], { status: 200 });
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

    const existingDish = await db
      .select()
      .from(homepageFeaturedDishes)
      .where(eq(homepageFeaturedDishes.id, parseInt(id)))
      .limit(1);

    if (existingDish.length === 0) {
      return NextResponse.json(
        { error: 'Featured dish not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedDish = await db
      .delete(homepageFeaturedDishes)
      .where(eq(homepageFeaturedDishes.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Featured dish deleted successfully',
        dish: deletedDish[0],
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