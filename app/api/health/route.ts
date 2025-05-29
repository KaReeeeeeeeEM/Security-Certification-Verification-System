import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET() {
  try {
    await connectDB()

    return NextResponse.json({
      success: true,
      message: "Secure Certificate Verification System is running",
      purpose: "Combating certificate fraud in Tanzanian universities",
      security: "AES-256 encryption, JWT authentication, bcrypt hashing",
      timestamp: new Date().toISOString(),
      status: "healthy",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        status: "unhealthy",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
