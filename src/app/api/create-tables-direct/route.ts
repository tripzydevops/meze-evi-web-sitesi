import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    // Try multiple ways to access the underlying pg client
    let client = null;
    let clientSource = 'unknown';

    const attempts = [
      { accessor: (db as any).$client, source: '$client' },
      { accessor: (db as any).client, source: 'client' },
      { accessor: (db as any)._, source: '_' },
      { accessor: (db as any).session?.client, source: 'session.client' },
    ];

    for (const attempt of attempts) {
      if (attempt.accessor && typeof attempt.accessor.query === 'function') {
        client = attempt.accessor;
        clientSource = attempt.source;
        break;
      }
    }

    if (!client) {
      return NextResponse.json({
        success: false,
        message: 'Could not access underlying pg client from Drizzle instance',
        tables: [],
        errors: ['No valid client found'],
        clientInfo: {
          found: false,
          source: 'none',
          attempts: attempts.map(a => a.source)
        }
      }, { status: 500 });
    }

    const tables = [
      {
        name: 'categories',
        sql: `CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          display_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );`
      },
      {
        name: 'menu_items',
        sql: `CREATE TABLE IF NOT EXISTS menu_items (
          id SERIAL PRIMARY KEY,
          category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price VARCHAR(50),
          image_url TEXT,
          popular BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );`
      },
      {
        name: 'homepage_hero',
        sql: `CREATE TABLE IF NOT EXISTS homepage_hero (
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
        );`
      },
      {
        name: 'homepage_features',
        sql: `CREATE TABLE IF NOT EXISTS homepage_features (
          id SERIAL PRIMARY KEY,
          icon VARCHAR(100) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          display_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );`
      },
      {
        name: 'homepage_featured_section',
        sql: `CREATE TABLE IF NOT EXISTS homepage_featured_section (
          id SERIAL PRIMARY KEY,
          section_title VARCHAR(255) NOT NULL,
          section_description TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );`
      },
      {
        name: 'homepage_featured_dishes',
        sql: `CREATE TABLE IF NOT EXISTS homepage_featured_dishes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price VARCHAR(50) NOT NULL,
          image_url TEXT,
          display_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );`
      },
      {
        name: 'homepage_about_section',
        sql: `CREATE TABLE IF NOT EXISTS homepage_about_section (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          image_url TEXT,
          button_text VARCHAR(100),
          button_link VARCHAR(255),
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );`
      },
      {
        name: 'user',
        sql: `CREATE TABLE IF NOT EXISTS "user" (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          email_verified BOOLEAN NOT NULL DEFAULT FALSE,
          image TEXT,
          role TEXT NOT NULL DEFAULT 'user',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );`
      },
      {
        name: 'session',
        sql: `CREATE TABLE IF NOT EXISTS session (
          id TEXT PRIMARY KEY,
          expires_at TIMESTAMP NOT NULL,
          token TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
        );`
      },
      {
        name: 'account',
        sql: `CREATE TABLE IF NOT EXISTS account (
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
        );`
      },
      {
        name: 'verification',
        sql: `CREATE TABLE IF NOT EXISTS verification (
          id TEXT PRIMARY KEY,
          identifier TEXT NOT NULL,
          value TEXT NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );`
      }
    ];

    const successfulTables: string[] = [];
    const errors: { table: string; error: string }[] = [];

    for (const table of tables) {
      try {
        await client.query(table.sql);
        successfulTables.push(table.name);
        console.log(`✅ Successfully created table: ${table.name}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push({
          table: table.name,
          error: errorMessage
        });
        console.error(`❌ Failed to create table ${table.name}:`, errorMessage);
      }
    }

    const allSuccess = errors.length === 0;

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess 
        ? 'All database tables created successfully' 
        : `Created ${successfulTables.length} tables with ${errors.length} errors`,
      tables: successfulTables,
      errors: errors,
      clientInfo: {
        found: true,
        source: clientSource,
        type: typeof client,
        hasQueryMethod: typeof client.query === 'function'
      }
    }, { status: allSuccess ? 200 : 500 });

  } catch (error) {
    console.error('GET /api/create-tables error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create database tables',
      tables: [],
      errors: [error instanceof Error ? error.message : String(error)],
      clientInfo: {
        found: false,
        source: 'error',
        error: error instanceof Error ? error.message : String(error)
      }
    }, { status: 500 });
  }
}