import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { homepageFeatures } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single feature by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const feature = await db
        .select()
        .from(homepageFeatures)
        .where(eq(homepageFeatures.id, parseInt(id)))
        .limit(1);

      if (feature.length === 0) {
        return NextResponse.json(
          { error: 'Feature not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(feature[0], { status: 200 });
    }

    // List all features with pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const features = await db
      .select()
      .from(homepageFeatures)
      .orderBy(asc(homepageFeatures.displayOrder))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(features, { status: 200 });
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
    const { icon, title, description, displayOrder } = body;

    // Validate required fields
    if (!icon || typeof icon !== 'string' || icon.trim() === '') {
      return NextResponse.json(
        { error: 'Icon is required and must be a non-empty string', code: 'MISSING_ICON' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    // Prepare insert data with auto-generated fields
    const insertData = {
      icon: icon.trim(),
      title: title.trim(),
      description: description || null,
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newFeature = await db
      .insert(homepageFeatures)
      .values(insertData)
      .returning();

    return NextResponse.json(newFeature[0], { status: 201 });
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
    const { icon, title, description, displayOrder } = body;

    // Check if at least one field is provided for update
    if (
      icon === undefined &&
      title === undefined &&
      description === undefined &&
      displayOrder === undefined
    ) {
      return NextResponse.json(
        { error: 'No fields provided for update', code: 'NO_UPDATE_FIELDS' },
        { status: 400 }
      );
    }

    // Check if feature exists
    const existingFeature = await db
      .select()
      .from(homepageFeatures)
      .where(eq(homepageFeatures.id, parseInt(id)))
      .limit(1);

    if (existingFeature.length === 0) {
      return NextResponse.json(
        { error: 'Feature not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate fields if provided
    if (icon !== undefined && (typeof icon !== 'string' || icon.trim() === '')) {
      return NextResponse.json(
        { error: 'Icon must be a non-empty string', code: 'INVALID_ICON' },
        { status: 400 }
      );
    }

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return NextResponse.json(
        { error: 'Title must be a non-empty string', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (icon !== undefined) updateData.icon = icon.trim();
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const updatedFeature = await db
      .update(homepageFeatures)
      .set(updateData)
      .where(eq(homepageFeatures.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedFeature[0], { status: 200 });
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

    // Check if feature exists
    const existingFeature = await db
      .select()
      .from(homepageFeatures)
      .where(eq(homepageFeatures.id, parseInt(id)))
      .limit(1);

    if (existingFeature.length === 0) {
      return NextResponse.json(
        { error: 'Feature not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedFeature = await db
      .delete(homepageFeatures)
      .where(eq(homepageFeatures.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Feature deleted successfully',
        feature: deletedFeature[0],
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