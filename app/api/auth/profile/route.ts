import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Verify JWT token
    const tokenData = await verifyToken(request)
    if (!tokenData.success) {
      return NextResponse.json(tokenData, { status: 401 })
    }

    // Find user by ID
    const user = await User.findById(tokenData.userId).select("-password")
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user profile",
      },
      { status: 500 },
    )
  }
}
