import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const diagnostics: {
    connectionTest: { success: boolean; result?: any; error?: string };
    tables: { success: boolean; tableNames?: string[]; error?: string };
    version: { success: boolean; versionString?: string; error?: string };
    errors: string[];
  } = {
    connectionTest: { success: false },
    tables: { success: false },
    version: { success: false },
    errors: [],
  };

  // Test 1: Basic connection test
  try {
    const result = await db.execute(sql`SELECT 1 as test`);
    diagnostics.connectionTest = {
      success: true,
      result: result.rows,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    diagnostics.connectionTest = {
      success: false,
      error: errorMessage,
    };
    diagnostics.errors.push(`Connection test failed: ${errorMessage}`);
  }

  // Test 2: List all tables
  try {
    const result = await db.execute(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
    );
    const tableNames = result.rows.map((row: any) => row.table_name);
    diagnostics.tables = {
      success: true,
      tableNames,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    diagnostics.tables = {
      success: false,
      error: errorMessage,
    };
    diagnostics.errors.push(`Table listing failed: ${errorMessage}`);
  }

  // Test 3: Get database version
  try {
    const result = await db.execute(sql`SELECT version()`);
    const versionString = result.rows[0]?.version || 'Unknown';
    diagnostics.version = {
      success: true,
      versionString,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    diagnostics.version = {
      success: false,
      error: errorMessage,
    };
    diagnostics.errors.push(`Version check failed: ${errorMessage}`);
  }

  return NextResponse.json(diagnostics, { status: 200 });
}