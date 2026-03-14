import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { homepageHero } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const heroId = parseInt(id);
      if (isNaN(heroId)) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const hero = await db
        .select()
        .from(homepageHero)
        .where(eq(homepageHero.id, heroId))
        .limit(1);

      if (hero.length === 0) {
        return NextResponse.json(
          { error: 'Hero section not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(hero[0], { status: 200 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const heroes = await db
      .select()
      .from(homepageHero)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(heroes, { status: 200 });
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

    const {
      title,
      subtitle,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      backgroundImageUrl,
      titleStyle,
      subtitleStyle,
    } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    const newHero = await db
      .insert(homepageHero)
      .values({
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : null,
        primaryButtonText: primaryButtonText ? primaryButtonText.trim() : null,
        primaryButtonLink: primaryButtonLink ? primaryButtonLink.trim() : null,
        secondaryButtonText: secondaryButtonText ? secondaryButtonText.trim() : null,
        secondaryButtonLink: secondaryButtonLink ? secondaryButtonLink.trim() : null,
        backgroundImageUrl: backgroundImageUrl ? backgroundImageUrl.trim() : null,
        titleStyle: titleStyle || null,
        subtitleStyle: subtitleStyle || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newHero[0], { status: 201 });
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

    const heroId = parseInt(id);

    const existingHero = await db
      .select()
      .from(homepageHero)
      .where(eq(homepageHero.id, heroId))
      .limit(1);

    if (existingHero.length === 0) {
      return NextResponse.json(
        { error: 'Hero section not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      title,
      subtitle,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      backgroundImageUrl,
      titleStyle,
      subtitleStyle,
    } = body;

    const updates: Record<string, string | null | Date> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return NextResponse.json(
          { error: 'Title must be a non-empty string', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updates.title = title.trim();
    }

    if (subtitle !== undefined) {
      updates.subtitle = subtitle ? subtitle.trim() : null;
    }

    if (primaryButtonText !== undefined) {
      updates.primaryButtonText = primaryButtonText ? primaryButtonText.trim() : null;
    }

    if (primaryButtonLink !== undefined) {
      updates.primaryButtonLink = primaryButtonLink ? primaryButtonLink.trim() : null;
    }

    if (secondaryButtonText !== undefined) {
      updates.secondaryButtonText = secondaryButtonText ? secondaryButtonText.trim() : null;
    }

    if (secondaryButtonLink !== undefined) {
      updates.secondaryButtonLink = secondaryButtonLink ? secondaryButtonLink.trim() : null;
    }

    if (backgroundImageUrl !== undefined) {
      updates.backgroundImageUrl = backgroundImageUrl ? backgroundImageUrl.trim() : null;
    }

    if (titleStyle !== undefined) {
      updates.titleStyle = titleStyle || null;
    }

    if (subtitleStyle !== undefined) {
      updates.subtitleStyle = subtitleStyle || null;
    }

    const updatedHero = await db
      .update(homepageHero)
      .set(updates)
      .where(eq(homepageHero.id, heroId))
      .returning();

    return NextResponse.json(updatedHero[0], { status: 200 });
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

    const heroId = parseInt(id);

    const existingHero = await db
      .select()
      .from(homepageHero)
      .where(eq(homepageHero.id, heroId))
      .limit(1);

    if (existingHero.length === 0) {
      return NextResponse.json(
        { error: 'Hero section not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedHero = await db
      .delete(homepageHero)
      .where(eq(homepageHero.id, heroId))
      .returning();

    return NextResponse.json(
      {
        message: 'Hero section deleted successfully',
        hero: deletedHero[0],
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