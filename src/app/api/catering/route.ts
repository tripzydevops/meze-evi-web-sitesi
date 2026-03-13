import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cateringInquiries } from '@/db/schema';

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
  // This could be protected later for the admin panel
  try {
    const inquiries = await db.select().from(cateringInquiries).orderBy(cateringInquiries.createdAt);
    return NextResponse.json(inquiries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
