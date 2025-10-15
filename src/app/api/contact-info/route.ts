import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contactInfo } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

const VALID_TYPES = ['address', 'phone', 'email', 'hours'] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const showHidden = searchParams.get('showHidden') === 'true';

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(contactInfo)
        .where(eq(contactInfo.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Record not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db
      .select()
      .from(contactInfo)
      .orderBy(asc(contactInfo.displayOrder));

    const results = await query.limit(limit).offset(offset);

    // Filter hidden records unless showHidden is true
    const filteredResults = showHidden
      ? results
      : results.filter((record) => !record.hidden);

    return NextResponse.json(filteredResults, { status: 200 });
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
    const { type, title, content, subContent, icon, displayOrder, hidden } = body;

    // Validate required fields
    if (!type) {
      return NextResponse.json(
        { error: 'Type is required', code: 'MISSING_TYPE' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string', code: 'INVALID_CONTENT' },
        { status: 400 }
      );
    }

    if (!icon || typeof icon !== 'string' || icon.trim() === '') {
      return NextResponse.json(
        { error: 'Icon is required and must be a non-empty string', code: 'INVALID_ICON' },
        { status: 400 }
      );
    }

    // Validate type
    if (!VALID_TYPES.includes(type as any)) {
      return NextResponse.json(
        {
          error: `Type must be one of: ${VALID_TYPES.join(', ')}`,
          code: 'INVALID_TYPE',
        },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData = {
      type: type.trim(),
      title: title.trim(),
      content: content.trim(),
      subContent: subContent ? subContent.trim() : null,
      icon: icon.trim(),
      displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
      hidden: hidden !== undefined ? Boolean(hidden) : false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newRecord = await db.insert(contactInfo).values(insertData).returning();

    return NextResponse.json(newRecord[0], { status: 201 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(contactInfo)
      .where(eq(contactInfo.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { type, title, content, subContent, icon, displayOrder, hidden } = body;

    // Validate type if provided
    if (type && !VALID_TYPES.includes(type as any)) {
      return NextResponse.json(
        {
          error: `Type must be one of: ${VALID_TYPES.join(', ')}`,
          code: 'INVALID_TYPE',
        },
        { status: 400 }
      );
    }

    // Validate title if provided
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return NextResponse.json(
        { error: 'Title must be a non-empty string', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    // Validate content if provided
    if (content !== undefined && (typeof content !== 'string' || content.trim() === '')) {
      return NextResponse.json(
        { error: 'Content must be a non-empty string', code: 'INVALID_CONTENT' },
        { status: 400 }
      );
    }

    // Validate icon if provided
    if (icon !== undefined && (typeof icon !== 'string' || icon.trim() === '')) {
      return NextResponse.json(
        { error: 'Icon must be a non-empty string', code: 'INVALID_ICON' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (type !== undefined) updateData.type = type.trim();
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (subContent !== undefined) updateData.subContent = subContent ? subContent.trim() : null;
    if (icon !== undefined) updateData.icon = icon.trim();
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
    if (hidden !== undefined) updateData.hidden = Boolean(hidden);

    const updated = await db
      .update(contactInfo)
      .set(updateData)
      .where(eq(contactInfo.id, parseInt(id)))
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(contactInfo)
      .where(eq(contactInfo.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(contactInfo)
      .where(eq(contactInfo.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Record deleted successfully',
        record: deleted[0],
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