const request = require("supertest")
const mongoose = require("mongoose")
const app = require("../server")
const User = require("../models/User")
const Certificate = require("../models/Certificate")

const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/certificate_verification_test"

describe("Certificate Management System", () => {
  let adminToken, userToken, adminUser, regularUser

  beforeAll(async () => {
    await mongoose.connect(MONGODB_TEST_URI)
  })

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({})
    await Certificate.deleteMany({})

    // Create test users
    adminUser = new User({
      email: "admin@udsm.ac.tz",
      password: "AdminPass123!",
      role: "admin",
      institution: "University of Dar es Salaam",
    })
    await adminUser.save()

    regularUser = new User({
      email: "user@test.com",
      password: "UserPass123!",
      role: "user",
    })
    await regularUser.save()

    // Get tokens
    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@udsm.ac.tz", password: "AdminPass123!" })
    adminToken = adminLogin.body.token

    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@test.com", password: "UserPass123!" })
    userToken = userLogin.body.token
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  describe("POST /api/certificates/issue", () => {
    const validCertificateData = {
      certificateId: "UDSM-2024-123456",
      studentName: "John Mwalimu Nyerere",
      course: "Bachelor of Science in Computer Science",
      institution: "University of Dar es Salaam",
      graduationDate: "2024-06-15",
      grade: "First Class",
    }

    test("should issue certificate successfully with admin token", async () => {
      const response = await request(app)
        .post("/api/certificates/issue")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(validCertificateData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.certificate.certificateId).toBe(validCertificateData.certificateId)
      expect(response.body.certificate.studentName).toBe(validCertificateData.studentName)

      // Verify certificate was saved to database
      const savedCert = await Certificate.findOne({ certificateId: validCertificateData.certificateId })
      expect(savedCert).toBeTruthy()
      expect(savedCert.encryptedData).toBeDefined()
      expect(savedCert.dataHash).toBeDefined()
    })

    test("should reject certificate issuance with user token", async () => {
      const response = await request(app)
        .post("/api/certificates/issue")
        .set("Authorization", `Bearer ${userToken}`)
        .send(validCertificateData)
        .expect(403)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Admin access required")
    })

    test("should reject certificate issuance without token", async () => {
      const response = await request(app).post("/api/certificates/issue").send(validCertificateData).expect(401)

      expect(response.body.success).toBe(false)
    })

    test("should reject invalid certificate ID format", async () => {
      const invalidData = {
        ...validCertificateData,
        certificateId: "INVALID-FORMAT",
      }

      const response = await request(app)
        .post("/api/certificates/issue")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Validation failed")
    })

    test("should reject duplicate certificate ID", async () => {
      // Issue first certificate
      await request(app)
        .post("/api/certificates/issue")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(validCertificateData)
        .expect(201)

      // Try to issue duplicate
      const response = await request(app)
        .post("/api/certificates/issue")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(validCertificateData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Certificate with this ID already exists")
    })

    test("should validate required fields", async () => {
      const requiredFields = ["certificateId", "studentName", "course", "institution", "graduationDate", "grade"]

      for (const field of requiredFields) {
        const incompleteData = { ...validCertificateData }
        delete incompleteData[field]

        const response = await request(app)
          .post("/api/certificates/issue")
          .set("Authorization", `Bearer ${adminToken}`)
          .send(incompleteData)
          .expect(400)

        expect(response.body.success).toBe(false)
      }
    })
  })

  describe("GET /api/certificates/verify/:certificateId", () => {
    let issuedCertificateId

    beforeEach(async () => {
      // Issue a test certificate
      const certificateData = {
        certificateId: "UDSM-2024-789012",
        studentName: "Fatuma Hassan Kilifi",
        course: "Bachelor of Science in Agriculture",
        institution: "University of Dar es Salaam",
        graduationDate: "2024-07-20",
        grade: "Second Class Upper",
      }

      await request(app)
        .post("/api/certificates/issue")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(certificateData)

      issuedCertificateId = certificateData.certificateId
    })

    test("should verify valid certificate successfully", async () => {
      const response = await request(app).get(`/api/certificates/verify/${issuedCertificateId}`).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.certificate.verified).toBe(true)
      expect(response.body.certificate.certificateId).toBe(issuedCertificateId)
      expect(response.body.certificate.integrityCheck).toBe("PASSED")
    })

    test("should handle non-existent certificate", async () => {
      const response = await request(app).get("/api/certificates/verify/FAKE-2024-000000").expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Certificate not found or has been revoked")
    })

    test("should reject invalid certificate ID format", async () => {
      const response = await request(app).get("/api/certificates/verify/invalid-format").expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Invalid certificate ID format")
    })

    test("should verify certificate without authentication (public access)", async () => {
      const response = await request(app)
        .get(`/api/certificates/verify/${issuedCertificateId}`)
        // No authorization header
        .expect(200)

      expect(response.body.success).toBe(true)
    })
  })

  describe("GET /api/certificates/list", () => {
    beforeEach(async () => {
      // Issue multiple test certificates
      const certificates = [
        {
          certificateId: "UDSM-2024-111111",
          studentName: "Student One",
          course: "Course One",
          institution: "University of Dar es Salaam",
          graduationDate: "2024-06-15",
          grade: "First Class",
        },
        {
          certificateId: "UDSM-2024-222222",
          studentName: "Student Two",
          course: "Course Two",
          institution: "University of Dar es Salaam",
          graduationDate: "2024-07-20",
          grade: "Second Class Upper",
        },
      ]

      for (const cert of certificates) {
        await request(app).post("/api/certificates/issue").set("Authorization", `Bearer ${adminToken}`).send(cert)
      }
    })

    test("should list certificates for admin user", async () => {
      const response = await request(app)
        .get("/api/certificates/list")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.certificates).toHaveLength(2)
      expect(response.body.pagination).toBeDefined()
    })

    test("should reject certificate list for regular user", async () => {
      const response = await request(app)
        .get("/api/certificates/list")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Admin access required")
    })

    test("should support pagination", async () => {
      const response = await request(app)
        .get("/api/certificates/list?page=1&limit=1")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200)

      expect(response.body.certificates).toHaveLength(1)
      expect(response.body.pagination.current).toBe(1)
      expect(response.body.pagination.total).toBe(2)
    })
  })

  describe("PATCH /api/certificates/revoke/:certificateId", () => {
    let certificateToRevoke

    beforeEach(async () => {
      const certificateData = {
        certificateId: "UDSM-2024-REVOKE",
        studentName: "Student To Revoke",
        course: "Test Course",
        institution: "University of Dar es Salaam",
        graduationDate: "2024-06-15",
        grade: "Pass",
      }

      await request(app)
        .post("/api/certificates/issue")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(certificateData)

      certificateToRevoke = certificateData.certificateId
    })

    test("should revoke certificate successfully", async () => {
      const response = await request(app)
        .patch(`/api/certificates/revoke/${certificateToRevoke}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ reason: "Test revocation" })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.certificateId).toBe(certificateToRevoke)

      // Verify certificate is revoked in database
      const revokedCert = await Certificate.findOne({ certificateId: certificateToRevoke })
      expect(revokedCert.status).toBe("revoked")
    })

    test("should reject revocation by regular user", async () => {
      const response = await request(app)
        .patch(`/api/certificates/revoke/${certificateToRevoke}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ reason: "Unauthorized attempt" })
        .expect(403)

      expect(response.body.success).toBe(false)
    })

    test("should handle non-existent certificate revocation", async () => {
      const response = await request(app)
        .patch("/api/certificates/revoke/FAKE-2024-000000")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ reason: "Test" })
        .expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Certificate not found")
    })
  })

  describe("Encryption and Security", () => {
    test("should encrypt certificate data properly", async () => {
      const certificateData = {
        certificateId: "UDSM-2024-ENCRYPT",
        studentName: "Encryption Test Student",
        course: "Security Course",
        institution: "University of Dar es Salaam",
        graduationDate: "2024-06-15",
        grade: "First Class",
      }

      await request(app)
        .post("/api/certificates/issue")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(certificateData)

      const savedCert = await Certificate.findOne({ certificateId: certificateData.certificateId })

      // Verify encryption fields exist
      expect(savedCert.encryptedData).toBeDefined()
      expect(savedCert.iv).toBeDefined()
      expect(savedCert.dataHash).toBeDefined()

      // Verify data is actually encrypted (not plain text)
      expect(savedCert.encryptedData).not.toContain(certificateData.studentName)
      expect(savedCert.encryptedData).not.toContain(certificateData.course)
    })

    test("should maintain data integrity through encryption/decryption cycle", async () => {
      const originalData = {
        certificateId: "UDSM-2024-INTEGRITY",
        studentName: "Integrity Test Student",
        course: "Data Integrity Course",
        institution: "University of Dar es Salaam",
        graduationDate: "2024-06-15",
        grade: "First Class",
      }

      // Issue certificate
      await request(app).post("/api/certificates/issue").set("Authorization", `Bearer ${adminToken}`).send(originalData)

      // Verify certificate (which involves decryption)
      const response = await request(app).get(`/api/certificates/verify/${originalData.certificateId}`).expect(200)

      // Check that decrypted data matches original
      expect(response.body.certificate.studentName).toBe(originalData.studentName)
      expect(response.body.certificate.course).toBe(originalData.course)
      expect(response.body.certificate.grade).toBe(originalData.grade)
      expect(response.body.certificate.integrityCheck).toBe("PASSED")
    })
  })
})
