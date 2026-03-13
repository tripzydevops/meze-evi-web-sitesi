import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const createdTables: string[] = [];
    const errors: Array<{ table: string; error: string }> = [];

    const tables = [
      {
        name: 'categories',
        sql: sql`
          CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            hidden BOOLEAN DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'menu_items',
        sql: sql`
          CREATE TABLE IF NOT EXISTS menu_items (
            id SERIAL PRIMARY KEY,
            category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price VARCHAR(50),
            image_url TEXT,
            popular BOOLEAN DEFAULT false,
            hidden BOOLEAN DEFAULT false,
            serving_size VARCHAR(100),
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'homepage_hero',
        sql: sql`
          CREATE TABLE IF NOT EXISTS homepage_hero (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subtitle TEXT,
            primary_button_text VARCHAR(100),
            primary_button_link VARCHAR(255),
            secondary_button_text VARCHAR(100),
            secondary_button_link VARCHAR(255),
            background_image_url TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'homepage_features',
        sql: sql`
          CREATE TABLE IF NOT EXISTS homepage_features (
            id SERIAL PRIMARY KEY,
            icon VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'homepage_featured_section',
        sql: sql`
          CREATE TABLE IF NOT EXISTS homepage_featured_section (
            id SERIAL PRIMARY KEY,
            section_title VARCHAR(255) NOT NULL,
            section_description TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'homepage_featured_dishes',
        sql: sql`
          CREATE TABLE IF NOT EXISTS homepage_featured_dishes (
            id SERIAL PRIMARY KEY,
            menu_item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'homepage_about_section',
        sql: sql`
          CREATE TABLE IF NOT EXISTS homepage_about_section (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            image_url TEXT,
            button_text VARCHAR(100),
            button_link VARCHAR(255),
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'contact_info',
        sql: sql`
          CREATE TABLE IF NOT EXISTS contact_info (
            id SERIAL PRIMARY KEY,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            sub_content TEXT,
            icon TEXT NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            hidden BOOLEAN DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'gallery_images',
        sql: sql`
          CREATE TABLE IF NOT EXISTS gallery_images (
            id SERIAL PRIMARY KEY,
            url TEXT NOT NULL,
            alt VARCHAR(255),
            display_order INTEGER NOT NULL DEFAULT 0,
            hidden BOOLEAN DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'testimonials',
        sql: sql`
          CREATE TABLE IF NOT EXISTS testimonials (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            rating INTEGER NOT NULL DEFAULT 5,
            image_url TEXT,
            display_order INTEGER NOT NULL DEFAULT 0,
            hidden BOOLEAN DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
    ];

    for (const table of tables) {
      try {
        await db.execute(table.sql);
        createdTables.push(table.name);
      } catch (error) {
        console.error(`Error creating table ${table.name}:`, error);
        errors.push({
          table: table.name,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to create ${errors.length} table(s)`,
          tables: createdTables,
          errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'All tables created successfully',
        tables: createdTables,
        errors: [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Schema push error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)),
        tables: [],
        errors: [
          {
            table: 'general',
            error: error instanceof Error ? error.message : String(error),
          },
        ],
      },
      { status: 500 }
    );
  }
}