const request = require("supertest")
const mongoose = require("mongoose")
const app = require("../server")
const User = require("../models/User")

// Test database connection
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/certificate_verification_test"

describe("Authentication System", () => {
  let adminToken, userToken, adminUser, regularUser

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(MONGODB_TEST_URI)
  })

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({})
  })

  afterAll(async () => {
    // Clean up and close database connection
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  describe("POST /api/auth/register", () => {
    test("should register a new admin user successfully", async () => {
      const userData = {
        email: "admin@udsm.ac.tz",
        password: "SecurePass123!",
        role: "admin",
        institution: "University of Dar es Salaam",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
      expect(response.body.user.email).toBe(userData.email)
      expect(response.body.user.role).toBe("admin")
      expect(response.body.user.institution).toBe(userData.institution)
    })

    test("should register a regular user successfully", async () => {
      const userData = {
        email: "user@example.com",
        password: "UserPass123!",
        role: "user",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.user.role).toBe("user")
      expect(response.body.user.institution).toBeUndefined()
    })

    test("should reject registration with invalid email", async () => {
      const userData = {
        email: "invalid-email",
        password: "SecurePass123!",
        role: "user",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Validation failed")
    })

    test("should reject admin registration without institution", async () => {
      const userData = {
        email: "admin@example.com",
        password: "SecurePass123!",
        role: "admin",
        // Missing institution
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Institution is required for admin accounts")
    })

    test("should reject duplicate email registration", async () => {
      const userData = {
        email: "test@example.com",
        password: "SecurePass123!",
        role: "user",
      }

      // First registration
      await request(app).post("/api/auth/register").send(userData).expect(201)

      // Duplicate registration
      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("User with this email already exists")
    })
  })

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create test users
      adminUser = new User({
        email: "admin@test.com",
        password: "AdminPass123!",
        role: "admin",
        institution: "Test University",
      })
      await adminUser.save()

      regularUser = new User({
        email: "user@test.com",
        password: "UserPass123!",
        role: "user",
      })
      await regularUser.save()
    })

    test("should login admin user successfully", async () => {
      const loginData = {
        email: "admin@test.com",
        password: "AdminPass123!",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
      expect(response.body.user.role).toBe("admin")

      adminToken = response.body.token
    })

    test("should login regular user successfully", async () => {
      const loginData = {
        email: "user@test.com",
        password: "UserPass123!",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
      expect(response.body.user.role).toBe("user")

      userToken = response.body.token
    })

    test("should reject login with wrong password", async () => {
      const loginData = {
        email: "admin@test.com",
        password: "WrongPassword",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Invalid email or password")
    })

    test("should reject login with non-existent email", async () => {
      const loginData = {
        email: "nonexistent@test.com",
        password: "SomePassword123!",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Invalid email or password")
    })
  })

  describe("GET /api/auth/profile", () => {
    beforeEach(async () => {
      // Create and login a test user
      const user = new User({
        email: "profile@test.com",
        password: "ProfilePass123!",
        role: "user",
      })
      await user.save()

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "profile@test.com",
        password: "ProfilePass123!",
      })

      userToken = loginResponse.body.token
    })

    test("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.user.email).toBe("profile@test.com")
      expect(response.body.user.password).toBeUndefined() // Password should not be returned
    })

    test("should reject profile request without token", async () => {
      const response = await request(app).get("/api/auth/profile").expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Access token required")
    })

    test("should reject profile request with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalid-token")
        .expect(403)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Invalid or expired token")
    })
  })

  describe("Password Security", () => {
    test("should hash passwords before saving", async () => {
      const userData = {
        email: "security@test.com",
        password: "PlainTextPassword123!",
        role: "user",
      }

      await request(app).post("/api/auth/register").send(userData).expect(201)

      const savedUser = await User.findOne({ email: userData.email })
      expect(savedUser.password).not.toBe(userData.password)
      expect(savedUser.password).toMatch(/^\$2[aby]\$/) // bcrypt hash pattern
    })

    test("should validate password complexity", async () => {
      const weakPasswords = [
        "weak", // Too short
        "password", // No uppercase, no numbers
        "PASSWORD", // No lowercase, no numbers
        "12345678", // No letters
        "Password", // No numbers
      ]

      for (const password of weakPasswords) {
        const response = await request(app)
          .post("/api/auth/register")
          .send({
            email: `test${Date.now()}@example.com`,
            password,
            role: "user",
          })
          .expect(400)

        expect(response.body.success).toBe(false)
      }
    })
  })
})
