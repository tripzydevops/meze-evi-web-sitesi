import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cateringInquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, eventDate, guestCount, message } = body;

    // Basic validation
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Ad Soyad, E-posta ve Telefon zorunludur.', code: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    const newInquiry = await db.insert(cateringInquiries).values({
      fullName,
      email,
      phone,
      eventDate: eventDate ? new Date(eventDate) : null,
      guestCount: guestCount ? parseInt(guestCount) : null,
      message,
      status: 'pending',
    }).returning();

    return NextResponse.json({
      success: true,
      data: newInquiry[0],
      message: 'Talebiniz başarıyla alındı. Sizinle en kısa sürede iletişime geçeceğiz.'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Catering Inquiry Error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.', detail: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const adminAuth = request.cookies.get('admin_auth')?.value
  const authHeader = request.headers.get('x-admin-key')
  const accessKey = process.env.ADMIN_ACCESS_KEY || '1234'

  if (adminAuth !== accessKey && authHeader !== accessKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inquiries = await db.select().from(cateringInquiries).orderBy(cateringInquiries.createdAt);
    return NextResponse.json(inquiries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const adminAuth = request.cookies.get('admin_auth')?.value
  const accessKey = process.env.ADMIN_ACCESS_KEY || '1234'

  if (adminAuth !== accessKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const body = await request.json();
    const { status } = body;

    const updated = await db.update(cateringInquiries)
      .set({ status, updatedAt: new Date() })
      .where(eq(cateringInquiries.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
