import { db } from "@/db"
import { testimonials } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const showHidden = searchParams.get("showHidden") === "true"

  try {
    const query = db.query.testimonials.findMany({
      where: showHidden ? undefined : (t, { eq }) => eq(t.hidden, false),
      orderBy: [asc(testimonials.displayOrder)]
    })
    const results = await query
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, content, rating, imageUrl, displayOrder } = body

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 })
    }

    const newTestimonial = await db.insert(testimonials).values({
      name,
      content,
      rating: rating || 5,
      imageUrl: imageUrl || null,
      displayOrder: displayOrder || 0,
    }).returning()

    return NextResponse.json(newTestimonial[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const updated = await db.update(testimonials)
      .set({
        ...body,
        updatedAt: new Date()
      })
      .where(eq(testimonials.id, parseInt(id)))
      .returning()

    return NextResponse.json(updated[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  try {
    await db.delete(testimonials).where(eq(testimonials.id, parseInt(id)))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
  }
}
