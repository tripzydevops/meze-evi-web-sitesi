import { db } from "@/db"
import { galleryImages } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const showHidden = searchParams.get("showHidden") === "true"

  try {
    const query = db.query.galleryImages.findMany({
      where: showHidden ? undefined : (img, { eq }) => eq(img.hidden, false),
      orderBy: [asc(galleryImages.displayOrder)]
    })
    const images = await query
    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, alt, displayOrder } = body

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const newImage = await db.insert(galleryImages).values({
      url,
      alt: alt || null,
      displayOrder: displayOrder || 0,
    }).returning()

    return NextResponse.json(newImage[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 })
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
    const updatedImage = await db.update(galleryImages)
      .set({
        ...body,
        updatedAt: new Date()
      })
      .where(eq(galleryImages.id, parseInt(id)))
      .returning()

    return NextResponse.json(updatedImage[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update gallery image" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  try {
    await db.delete(galleryImages).where(eq(galleryImages.id, parseInt(id)))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 })
  }
}
