import mongoose from "mongoose"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

// Import models
import User from "../models/User"
import Certificate from "../models/Certificate"

// Sample data for Tanzanian universities
const sampleUsers = [
  {
    email: "admin@udsm.ac.tz",
    password: "SecurePass123!",
    role: "admin" as const,
    institution: "University of Dar es Salaam",
  },
  {
    email: "admin@sua.ac.tz",
    password: "SecurePass123!",
    role: "admin" as const,
    institution: "Sokoine University of Agriculture",
  },
  {
    email: "admin@mzumbe.ac.tz",
    password: "SecurePass123!",
    role: "admin" as const,
    institution: "Mzumbe University",
  },
  {
    email: "verifier@example.com",
    password: "UserPass123!",
    role: "user" as const,
  },
]

const sampleCertificates = [
  {
    certificateId: "UDSM-2024-001234",
    studentName: "John Mwalimu Nyerere",
    course: "Bachelor of Science in Computer Science",
    institution: "University of Dar es Salaam",
    graduationDate: new Date("2024-06-15"),
    grade: "First Class",
  },
  {
    certificateId: "SUA-2024-002345",
    studentName: "Fatuma Hassan Kilifi",
    course: "Bachelor of Science in Agriculture",
    institution: "Sokoine University of Agriculture",
    graduationDate: new Date("2024-07-20"),
    grade: "Second Class Upper",
  },
  {
    certificateId: "MZUM-2024-003456",
    studentName: "Peter Mwanza Temba",
    course: "Bachelor of Business Administration",
    institution: "Mzumbe University",
    graduationDate: new Date("2024-08-10"),
    grade: "Second Class Upper",
  },
]

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/certificate_verification")
    console.log("Connected to MongoDB for seeding")

    // Clear existing data
    console.log("Clearing existing data...")
    await User.deleteMany({})
    await Certificate.deleteMany({})

    // Create users
    console.log("Creating sample users...")
    const createdUsers = []

    for (const userData of sampleUsers) {
      const user = new User(userData)
      await user.save()
      createdUsers.push(user)
      console.log(`Created user: ${user.email} (${user.role})`)
    }

    // Create certificates
    console.log("Creating sample certificates...")
    const adminUser = createdUsers.find((user) => user.role === "admin")
    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-super-secret-encryption-key-32-chars"

    for (const certData of sampleCertificates) {
      // Prepare certificate data for encryption
      const certificateData = {
        ...certData,
        issuedAt: new Date(),
        issuedBy: adminUser!._id,
      }

      // Encrypt the certificate data
      const encryptionService = require("../utils/encryption")
      const { encryptedData, iv, salt, tag } = encryptionService.encrypt(certificateData, ENCRYPTION_KEY)

      // Generate hash for integrity
      const dataHash = encryptionService.generateHash(certificateData)

      // Create certificate
      const certificate = new Certificate({
        ...certData,
        encryptedData,
        iv,
        salt,
        tag,
        dataHash,
        issuedBy: adminUser!._id,
      })

      await certificate.save()
      console.log(`Created certificate: ${certificate.certificateId}`)
    }

    console.log("\n✅ Database seeding completed successfully!")
    console.log("\n📋 Sample Accounts Created:")
    console.log("Admin Accounts:")
    sampleUsers
      .filter((u) => u.role === "admin")
      .forEach((user) => {
        console.log(`  📧 ${user.email} | 🔑 ${user.password} | 🏛️  ${user.institution}`)
      })
    console.log("\nUser Accounts:")
    sampleUsers
      .filter((u) => u.role === "user")
      .forEach((user) => {
        console.log(`  📧 ${user.email} | 🔑 ${user.password}`)
      })

    console.log("\n📜 Sample Certificates:")
    sampleCertificates.forEach((cert) => {
      console.log(`  🆔 ${cert.certificateId} | 👤 ${cert.studentName} | 🎓 ${cert.grade}`)
    })

    console.log("\n🚀 You can now start the application and test with these credentials!")
  } catch (error) {
    console.error("❌ Seeding failed:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
    process.exit(0)
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
}

export default seedDatabase
