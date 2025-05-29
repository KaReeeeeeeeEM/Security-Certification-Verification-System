require("jest-extended")

// Set test environment variables
process.env.NODE_ENV = "test"
process.env.JWT_SECRET = "test-jwt-secret-key-for-testing-only"
process.env.ENCRYPTION_KEY = "test-encryption-key-32-characters"
process.env.MONGODB_TEST_URI = "mongodb://localhost:27017/certificate_verification_test"

// Global test timeout
jest.setTimeout(30000)

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Global test utilities
global.testUtils = {
  // Generate random test email
  generateTestEmail: () => `test${Date.now()}@example.com`,

  // Generate random certificate ID
  generateTestCertId: () => {
    const year = new Date().getFullYear()
    const sequence = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, "0")
    return `TEST-${year}-${sequence}`
  },

  // Create test user data
  createTestUser: (overrides = {}) => ({
    email: global.testUtils.generateTestEmail(),
    password: "TestPass123!",
    role: "user",
    ...overrides,
  }),

  // Create test certificate data
  createTestCertificate: (overrides = {}) => ({
    certificateId: global.testUtils.generateTestCertId(),
    studentName: "Test Student Name",
    course: "Test Course Name",
    institution: "Test University",
    graduationDate: "2024-06-15",
    grade: "First Class",
    ...overrides,
  }),

  // Wait for async operations
  wait: (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms)),
}

// Mock external services if needed
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(() => Promise.resolve({ messageId: "test-message-id" })),
  })),
}))

// Setup and teardown hooks
beforeAll(async () => {
  // Global setup before all tests
  console.log("🧪 Starting test suite...")
})

afterAll(async () => {
  // Global cleanup after all tests
  console.log("✅ Test suite completed")
})

beforeEach(() => {
  // Reset mocks before each test
  jest.clearAllMocks()
})

afterEach(() => {
  // Cleanup after each test
  jest.restoreAllMocks()
})

// Handle unhandled promise rejections in tests
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
  // Don't exit the process in tests
})
