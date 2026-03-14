import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { homepageAboutSection } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const section = await db
        .select()
        .from(homepageAboutSection)
        .where(eq(homepageAboutSection.id, parseInt(id)))
        .limit(1);

      if (section.length === 0) {
        return NextResponse.json(
          { error: 'About section not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(section[0], { status: 200 });
    }

    // List all sections with pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const sections = await db
      .select()
      .from(homepageAboutSection)
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
    const { title, description, imageUrl, buttonText, buttonLink, titleStyle, descriptionStyle } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required and must be a non-empty string', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    // Prepare insert data with auto-generated timestamps
    const insertData: {
      title: string;
      description: string;
      imageUrl?: string;
      buttonText?: string;
      buttonLink?: string;
      titleStyle?: string | null;
      descriptionStyle?: string | null;
      createdAt: Date;
      updatedAt: Date;
    } = {
      title: title.trim(),
      description: description.trim(),
      titleStyle: titleStyle || null,
      descriptionStyle: descriptionStyle || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add optional fields if provided
    if (imageUrl !== undefined && imageUrl !== null) {
      insertData.imageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : imageUrl;
    }
    if (buttonText !== undefined && buttonText !== null) {
      insertData.buttonText = typeof buttonText === 'string' ? buttonText.trim() : buttonText;
    }
    if (buttonLink !== undefined && buttonLink !== null) {
      insertData.buttonLink = typeof buttonLink === 'string' ? buttonLink.trim() : buttonLink;
    }

    const newSection = await db
      .insert(homepageAboutSection)
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
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if section exists
    const existingSection = await db
      .select()
      .from(homepageAboutSection)
      .where(eq(homepageAboutSection.id, parseInt(id)))
      .limit(1);

    if (existingSection.length === 0) {
      return NextResponse.json(
        { error: 'About section not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, imageUrl, buttonText, buttonLink, titleStyle, descriptionStyle } = body;

    // Build update object with only provided fields
    const updates: {
      title?: string;
      description?: string;
      imageUrl?: string | null;
      buttonText?: string | null;
      buttonLink?: string | null;
      titleStyle?: string | null;
      descriptionStyle?: string | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    // Validate and add fields if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return NextResponse.json(
          { error: 'Title must be a non-empty string', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim() === '') {
        return NextResponse.json(
          { error: 'Description must be a non-empty string', code: 'INVALID_DESCRIPTION' },
          { status: 400 }
        );
      }
      updates.description = description.trim();
    }

    if (imageUrl !== undefined) {
      updates.imageUrl = imageUrl === null ? null : (typeof imageUrl === 'string' ? imageUrl.trim() : imageUrl);
    }

    if (buttonText !== undefined) {
      updates.buttonText = buttonText === null ? null : (typeof buttonText === 'string' ? buttonText.trim() : buttonText);
    }

    if (buttonLink !== undefined) {
      updates.buttonLink = buttonLink === null ? null : (typeof buttonLink === 'string' ? buttonLink.trim() : buttonLink);
    }

    if (titleStyle !== undefined) {
      updates.titleStyle = titleStyle || null;
    }

    if (descriptionStyle !== undefined) {
      updates.descriptionStyle = descriptionStyle || null;
    }

    // Check if there are fields to update besides updatedAt
    if (Object.keys(updates).length === 1) {
      return NextResponse.json(
        { error: 'No fields to update', code: 'NO_FIELDS_TO_UPDATE' },
        { status: 400 }
      );
    }

    const updatedSection = await db
      .update(homepageAboutSection)
      .set(updates)
      .where(eq(homepageAboutSection.id, parseInt(id)))
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
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if section exists before deleting
    const existingSection = await db
      .select()
      .from(homepageAboutSection)
      .where(eq(homepageAboutSection.id, parseInt(id)))
      .limit(1);

    if (existingSection.length === 0) {
      return NextResponse.json(
        { error: 'About section not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedSection = await db
      .delete(homepageAboutSection)
      .where(eq(homepageAboutSection.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'About section deleted successfully',
        deleted: deletedSection[0],
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