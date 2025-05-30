import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Certificate from "@/models/Certificate"

export async function GET(request: NextRequest, { params }: { params: { certificateId: string } }) {
  try {
    await connectDB()

    const { certificateId } = params

    // Validate certificate ID format
    if (!/^[A-Z]+-\d{4}-\d{6}$/.test(certificateId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid certificate ID format",
        },
        { status: 400 },
      )
    }

    // Find certificate in database
    const certificate = await Certificate.findOne({
      certificateId: certificateId.toUpperCase(),
      status: "active", // Only return active certificates
    }).populate("issuedBy", "email institution")

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate not found or has been revoked",
        },
        { status: 404 },
      )
    }

    try {
      console.log(certificate)

      // Validate encrypted data fields
      if (!certificate.iv || !certificate.salt || !certificate.tag || !certificate.encryptedData) {
        throw new Error("Missing encryption fields in certificate");
      }

      // Decrypt certificate data for verification
      const encryptionService = require("@/utils/encryption")
      const decryptedData = encryptionService.decrypt(
        certificate.encryptedData,
        certificate.iv,
        certificate.salt,
        certificate.tag,
        process.env.ENCRYPTION_KEY,
      )

      // Verify data integrity using SHA-256 hash
      const currentHash = encryptionService.generateHash(decryptedData)
      const isIntegrityValid = currentHash === certificate.dataHash

      if (!isIntegrityValid) {
        return NextResponse.json(
          {
            success: false,
            message: "Certificate data integrity check failed. Possible tampering detected.",
          },
          { status: 400 },
        )
      }

      // Return verified certificate information
      return NextResponse.json({
        success: true,
        message: "Certificate verified successfully",
        certificate: {
          certificateId: certificate.certificateId,
          studentName: certificate.studentName,
          course: certificate.course,
          institution: certificate.institution,
          graduationDate: certificate.graduationDate,
          grade: certificate.grade,
          issuedAt: certificate.issuedAt,
          issuedBy: certificate.issuedBy.institution,
          status: certificate.status,
          verified: true,
          integrityCheck: "PASSED",
        },
      })
    } catch (decryptionError) {
      console.error("Decryption error:", decryptionError)
      return NextResponse.json(
        {
          success: false,
          message: "Certificate verification failed due to encryption error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Certificate verification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Verification failed. Please try again.",
      },
      { status: 500 },
    )
  }
}
