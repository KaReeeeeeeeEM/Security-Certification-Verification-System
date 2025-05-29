import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Certificate from "@/models/Certificate"
import { verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { certificateId: string } }) {
  try {
    await connectDB()

    // Verify JWT token and admin role
    const tokenData = await verifyToken(request)
    if (!tokenData.success) {
      return NextResponse.json(tokenData, { status: 401 })
    }

    if (tokenData.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 },
      )
    }

    const { certificateId } = params
    const body = await request.json()
    const { reason } = body

    const certificate = await Certificate.findOne({ certificateId: certificateId.toUpperCase() })

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate not found",
        },
        { status: 404 },
      )
    }

    certificate.status = "revoked"
    await certificate.save()

    return NextResponse.json({
      success: true,
      message: "Certificate revoked successfully",
      certificateId: certificate.certificateId,
      reason: reason || "No reason provided",
    })
  } catch (error) {
    console.error("Certificate revocation error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to revoke certificate",
      },
      { status: 500 },
    )
  }
}
