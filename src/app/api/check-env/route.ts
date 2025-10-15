import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const targetKeywords = ['DATABASE', 'POSTGRES', 'SUPABASE'];
    const foundVariables: Array<{
      name: string;
      preview: string;
      suffix: string;
      length: number;
    }> = [];

    // Iterate through all environment variables
    Object.keys(process.env).forEach((key) => {
      // Check if the key contains any of the target keywords
      const containsKeyword = targetKeywords.some(keyword => 
        key.toUpperCase().includes(keyword)
      );

      if (containsKeyword) {
        const value = process.env[key] || '';
        const length = value.length;

        // Get first 50 characters
        const preview = length > 50 
          ? value.substring(0, 50) + '...'
          : value;

        // Get last 20 characters
        const suffix = length > 20
          ? '...' + value.substring(length - 20)
          : value;

        foundVariables.push({
          name: key,
          preview,
          suffix,
          length
        });
      }
    });

    return NextResponse.json({
      foundVariables,
      totalFound: foundVariables.length
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}