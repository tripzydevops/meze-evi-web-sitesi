import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { homepageFeaturedSection } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single section by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { 
            error: 'Valid ID is required',
            code: 'INVALID_ID'
          },
          { status: 400 }
        );
      }

      const section = await db.select()
        .from(homepageFeaturedSection)
        .where(eq(homepageFeaturedSection.id, parseInt(id)))
        .limit(1);

      if (section.length === 0) {
        return NextResponse.json(
          { 
            error: 'Featured section not found',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        );
      }

      return NextResponse.json(section[0], { status: 200 });
    }

    // List all sections with pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const sections = await db.select()
      .from(homepageFeaturedSection)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(sections, { status: 200 });

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
    const { sectionTitle, sectionDescription } = body;

    // Validate required fields
    if (!sectionTitle || typeof sectionTitle !== 'string' || sectionTitle.trim() === '') {
      return NextResponse.json(
        { 
          error: 'sectionTitle is required and must be a non-empty string',
          code: 'MISSING_REQUIRED_FIELD'
        },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const insertData = {
      sectionTitle: sectionTitle.trim(),
      sectionDescription: sectionDescription?.trim() || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newSection = await db.insert(homepageFeaturedSection)
      .values(insertData)
      .returning();

    return NextResponse.json(newSection[0], { status: 201 });

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
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { sectionTitle, sectionDescription } = body;

    // Check if there are fields to update
    if (sectionTitle === undefined && sectionDescription === undefined) {
      return NextResponse.json(
        { 
          error: 'No fields to update',
          code: 'NO_FIELDS_TO_UPDATE'
        },
        { status: 400 }
      );
    }

    // Validate sectionTitle if provided
    if (sectionTitle !== undefined && (typeof sectionTitle !== 'string' || sectionTitle.trim() === '')) {
      return NextResponse.json(
        { 
          error: 'sectionTitle must be a non-empty string',
          code: 'INVALID_FIELD'
        },
        { status: 400 }
      );
    }

    // Check if section exists
    const existingSection = await db.select()
      .from(homepageFeaturedSection)
      .where(eq(homepageFeaturedSection.id, parseInt(id)))
      .limit(1);

    if (existingSection.length === 0) {
      return NextResponse.json(
        { 
          error: 'Featured section not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      sectionTitle?: string;
      sectionDescription?: string | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date()
    };

    if (sectionTitle !== undefined) {
      updateData.sectionTitle = sectionTitle.trim();
    }

    if (sectionDescription !== undefined) {
      updateData.sectionDescription = sectionDescription?.trim() || null;
    }

    const updatedSection = await db.update(homepageFeaturedSection)
      .set(updateData)
      .where(eq(homepageFeaturedSection.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedSection[0], { status: 200 });

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
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    // Check if section exists
    const existingSection = await db.select()
      .from(homepageFeaturedSection)
      .where(eq(homepageFeaturedSection.id, parseInt(id)))
      .limit(1);

    if (existingSection.length === 0) {
      return NextResponse.json(
        { 
          error: 'Featured section not found',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const deletedSection = await db.delete(homepageFeaturedSection)
      .where(eq(homepageFeaturedSection.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Featured section deleted successfully',
        deletedSection: deletedSection[0]
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