import mongoose from "mongoose"
import Certificate from "@/models/Certificate"
import { connectDB } from "@/lib/mongodb"

async function seedCertificates() {
  try {
    await connectDB()

    const certificates = [
      {
        certificateId: "UDSM-2024-123456",
        studentName: "John Doe",
        course: "Bachelor of Science in Computer Science",
        institution: "University of Dar es Salaam",
        graduationDate: new Date("2024-07-15"),
        grade: "First Class",
        encryptedData: "encrypted-data-placeholder",
        iv: "iv-placeholder",
        salt: "salt-placeholder",
        tag: "tag-placeholder",
        dataHash: "data-hash-placeholder",
        issuedBy: new mongoose.Types.ObjectId(), // Replace with a valid User ID
        issuedAt: new Date(),
        status: "active",
      },
      {
        certificateId: "UDSM-2023-654321",
        studentName: "Jane Smith",
        course: "Bachelor of Arts in Economics",
        institution: "University of Dar es Salaam",
        graduationDate: new Date("2023-11-20"),
        grade: "Second Class Upper",
        encryptedData: "encrypted-data-placeholder",
        iv: "iv-placeholder",
        salt: "salt-placeholder",
        tag: "tag-placeholder",
        dataHash: "data-hash-placeholder",
        issuedBy: new mongoose.Types.ObjectId(), // Replace with a valid User ID
        issuedAt: new Date(),
        status: "active",
      },
    ]

    // Clear existing certificates
    await Certificate.deleteMany({})

    // Insert sample certificates
    await Certificate.insertMany(certificates)

    console.log("Sample certificates seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding certificates:", error)
    process.exit(1)
  }
}

seedCertificates()
