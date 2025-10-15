import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST() {
  const connectionString = 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL || 
    `postgresql://${process.env.SUPABASE_DB_USER}:${process.env.SUPABASE_DB_PASSWORD}@${process.env.SUPABASE_DB_HOST}:${process.env.SUPABASE_DB_PORT}/${process.env.SUPABASE_DB_NAME}`;

  let pool: Pool | null = null;
  const created: string[] = [];
  const failed: Array<{ table: string; error: string }> = [];

  try {
    pool = new Pool({ connectionString });

    const tables = [
      {
        name: 'categories',
        sql: `
          CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `
      },
      {
        name: 'menu_items',
        sql: `
          CREATE TABLE IF NOT EXISTS menu_items (
            id SERIAL PRIMARY KEY,
            category_id INTEGER NOT NULL REFERENCES categories(id),
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price VARCHAR(50),
            image_url TEXT,
            popular BOOLEAN DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `
      },
      {
        name: 'homepage_hero',
        sql: `
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
        `
      },
      {
        name: 'homepage_features',
        sql: `
          CREATE TABLE IF NOT EXISTS homepage_features (
            id SERIAL PRIMARY KEY,
            icon VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `
      },
      {
        name: 'homepage_featured_section',
        sql: `
          CREATE TABLE IF NOT EXISTS homepage_featured_section (
            id SERIAL PRIMARY KEY,
            section_title VARCHAR(255) NOT NULL,
            section_description TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `
      },
      {
        name: 'homepage_featured_dishes',
        sql: `
          CREATE TABLE IF NOT EXISTS homepage_featured_dishes (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price VARCHAR(50) NOT NULL,
            image_url TEXT,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `
      },
      {
        name: 'homepage_about_section',
        sql: `
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
        `
      },
      {
        name: 'user',
        sql: `
          CREATE TABLE IF NOT EXISTS "user" (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            email_verified BOOLEAN NOT NULL DEFAULT false,
            image TEXT,
            role TEXT NOT NULL DEFAULT 'user',
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `
      },
      {
        name: 'session',
        sql: `
          CREATE TABLE IF NOT EXISTS session (
            id TEXT PRIMARY KEY,
            expires_at TIMESTAMP NOT NULL,
            token TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
          )
        `
      },
      {
        name: 'account',
        sql: `
          CREATE TABLE IF NOT EXISTS account (
            id TEXT PRIMARY KEY,
            account_id TEXT NOT NULL,
            provider_id TEXT NOT NULL,
            user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
            access_token TEXT,
            refresh_token TEXT,
            id_token TEXT,
            access_token_expires_at TIMESTAMP,
            refresh_token_expires_at TIMESTAMP,
            scope TEXT,
            password TEXT,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL
          )
        `
      },
      {
        name: 'verification',
        sql: `
          CREATE TABLE IF NOT EXISTS verification (
            id TEXT PRIMARY KEY,
            identifier TEXT NOT NULL,
            value TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `
      }
    ];

    for (const table of tables) {
      try {
        await pool.query(table.sql);
        created.push(table.name);
      } catch (error) {
        console.error(`Failed to create table ${table.name}:`, error);
        failed.push({
          table: table.name,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    await pool.end();

    const connectionUsed = connectionString.includes('DATABASE_URL') 
      ? 'DATABASE_URL' 
      : connectionString.includes('POSTGRES_URL')
      ? 'POSTGRES_URL'
      : 'SUPABASE_*';

    if (created.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Failed to create any tables',
        created,
        failed,
        connectionUsed
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${created.length} table(s)`,
      created,
      failed,
      connectionUsed
    }, { status: 200 });

  } catch (error) {
    console.error('Database setup error:', error);
    
    if (pool) {
      try {
        await pool.end();
      } catch (closeError) {
        console.error('Error closing pool:', closeError);
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Database connection or setup failed',
      error: error instanceof Error ? error.message : String(error),
      created,
      failed,
      connectionUsed: 'connection_failed'
    }, { status: 500 });
  }
}