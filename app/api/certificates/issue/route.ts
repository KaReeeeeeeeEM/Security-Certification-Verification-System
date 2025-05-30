import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Certificate from "@/models/Certificate"
import { verifyToken } from "@/lib/auth"
import { z } from "zod"

// Input validation schema
const certificateSchema = z.object({
  certificateId: z.string().regex(/^[A-Z]+-\d{4}-\d{6}$/, "Certificate ID must follow format: UNIV-YYYY-NNNNNN"),
  studentName: z.string().min(2, "Student name must be at least 2 characters").max(100),
  course: z.string().min(2, "Course name must be at least 2 characters").max(200),
  institution: z.string().min(2, "Institution name must be at least 2 characters").max(100),
  graduationDate: z.string()
    .refine((val) => {
      try {
        const date = new Date(val);
        return !isNaN(date.getTime()); 
      } catch (error) {
        return false;
      }
    }, "Please provide a valid graduation date (YYYY-MM-DD)")
    .transform((val) => new Date(val)), // Transform the valid string to a Date object
  grade: z.enum(["First Class", "Second Class Upper", "Second Class Lower", "Pass", "Distinction", "Merit"]),
});


export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const validatedData = certificateSchema.parse(body)

    const { certificateId, studentName, course, institution, graduationDate, grade } = validatedData
    console.log(validatedData)

    // Check if certificate ID already exists
    const existingCertificate = await Certificate.findOne({ certificateId })
    if (existingCertificate) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate with this ID already exists",
        },
        { status: 400 },
      )
    }

    // Prepare certificate data for encryption
    const certificateData = {
      certificateId,
      studentName,
      course,
      institution,
      graduationDate,
      grade,
      issuedAt: new Date(),
      issuedBy: tokenData.userId,
    }

    // Encrypt the certificate data using AES-256
    const encryptionService = require("@/utils/encryption")
    const { encryptedData, iv, salt, tag } = encryptionService.encrypt(certificateData, process.env.ENCRYPTION_KEY)

    // Generate SHA-256 hash for integrity verification
    const dataHash = encryptionService.generateHash(certificateData)

    // Create new certificate record
    const certificate = new Certificate({
      certificateId,
      studentName,
      course,
      institution,
      graduationDate,
      grade,
      encryptedData,
      iv,
      salt,
      tag,
      dataHash,
      issuedBy: tokenData.userId,
    })

    await certificate.save()

    return NextResponse.json(
      {
        success: true,
        message: "Certificate issued successfully",
        certificate: {
          certificateId: certificate.certificateId,
          studentName: certificate.studentName,
          course: certificate.course,
          institution: certificate.institution,
          graduationDate: certificate.graduationDate,
          grade: certificate.grade,
          issuedAt: certificate.issuedAt,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Certificate issuance error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to issue certificate. Please try again.",
      },
      { status: 500 },
    )
  }
}
