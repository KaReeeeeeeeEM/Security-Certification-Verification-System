import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Certificate from "@/models/Certificate"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const certificates = await Certificate.find()
      .populate("issuedBy", "email institution")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Certificate.countDocuments()

    return NextResponse.json({
      success: true,
      certificates: certificates.map((cert) => ({
        certificateId: cert.certificateId,
        studentName: cert.studentName,
        course: cert.course,
        institution: cert.institution,
        graduationDate: cert.graduationDate,
        grade: cert.grade,
        status: cert.status,
        issuedAt: cert.issuedAt,
        issuedBy: cert.issuedBy.institution,
      })),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: certificates.length,
        totalRecords: total,
      },
    })
  } catch (error) {
    console.error("Certificate list error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch certificates",
      },
      { status: 500 },
    )
  }
}
