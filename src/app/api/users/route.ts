import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { user } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

// GET - Fetch all users
export async function GET(request: NextRequest) {
  try {
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Kullanıcılar yüklenemedi" },
      { status: 500 }
    )
  }
}

// PUT - Update user (e.g., promote to admin)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı ID gerekli" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { role } = body

    if (!role || !["user", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Geçersiz rol" },
        { status: 400 }
      )
    }

    const [updatedUser] = await db
      .update(user)
      .set({ role })
      .where(eq(user.id, userId))
      .returning()

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Kullanıcı güncellenemedi" },
      { status: 500 }
    )
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    if (!userId) {
      return NextResponse.json(
        { error: "Kullanıcı ID gerekli" },
        { status: 400 }
      )
    }

    await db.delete(user).where(eq(user.id, userId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Kullanıcı silinemedi" },
      { status: 500 }
    )
  }
}