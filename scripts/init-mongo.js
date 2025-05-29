var db = db.getSiblingDB("certificate_verification")

// Create collections
db.createCollection("users")
db.createCollection("certificates")

// Create indexes for better performance
print("Creating database indexes...")

// User collection indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ institution: 1 })
db.users.createIndex({ createdAt: 1 })

// Certificate collection indexes
db.certificates.createIndex({ certificateId: 1 }, { unique: true })
db.certificates.createIndex({ studentName: 1 })
db.certificates.createIndex({ institution: 1 })
db.certificates.createIndex({ status: 1 })
db.certificates.createIndex({ issuedBy: 1 })
db.certificates.createIndex({ graduationDate: 1 })
db.certificates.createIndex({ createdAt: 1 })

// Compound indexes for common queries
db.certificates.createIndex({ institution: 1, status: 1 })
db.certificates.createIndex({ certificateId: 1, status: 1 })

print("Database indexes created successfully")

// Create initial admin user (password will be hashed by the application)
print("Creating initial admin user...")

// Note: In production, this should be done through the application
// to ensure proper password hashing
const initialAdmin = {
  email: "admin@system.local",
  // This is a placeholder - actual password hashing happens in the application
  password: "$2b$12$placeholder.hash.will.be.replaced.by.application",
  role: "admin",
  institution: "System Administrator",
  createdAt: new Date(),
  lastLogin: null,
}

try {
  db.users.insertOne(initialAdmin)
  print("Initial admin user created: admin@system.local")
} catch (error) {
  print("Admin user already exists or creation failed: " + error)
}

// Create database constraints and validation rules
print("Setting up database validation rules...")

// User collection validation
db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "role"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
          description: "Must be a valid email address",
        },
        password: {
          bsonType: "string",
          minLength: 6,
          description: "Password must be at least 6 characters",
        },
        role: {
          bsonType: "string",
          enum: ["admin", "user"],
          description: "Role must be either admin or user",
        },
        institution: {
          bsonType: "string",
          description: "Institution name for admin users",
        },
      },
    },
  },
  validationLevel: "moderate",
  validationAction: "warn",
})

// Certificate collection validation
db.runCommand({
  collMod: "certificates",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "certificateId",
        "studentName",
        "course",
        "institution",
        "graduationDate",
        "grade",
        "encryptedData",
        "iv",
        "dataHash",
        "issuedBy",
      ],
      properties: {
        certificateId: {
          bsonType: "string",
          pattern: "^[A-Z]+-[0-9]{4}-[0-9]{6}$",
          description: "Certificate ID must follow format: UNIV-YYYY-NNNNNN",
        },
        studentName: {
          bsonType: "string",
          minLength: 2,
          maxLength: 100,
          description: "Student name must be between 2 and 100 characters",
        },
        course: {
          bsonType: "string",
          minLength: 2,
          maxLength: 200,
          description: "Course name must be between 2 and 200 characters",
        },
        institution: {
          bsonType: "string",
          minLength: 2,
          maxLength: 100,
          description: "Institution name must be between 2 and 100 characters",
        },
        grade: {
          bsonType: "string",
          enum: ["First Class", "Second Class Upper", "Second Class Lower", "Pass", "Distinction", "Merit"],
          description: "Grade must be a valid academic grade",
        },
        status: {
          bsonType: "string",
          enum: ["active", "revoked", "expired"],
          description: "Status must be active, revoked, or expired",
        },
      },
    },
  },
  validationLevel: "moderate",
  validationAction: "warn",
})

print("Database validation rules configured")

// Create text indexes for search functionality
print("Creating text search indexes...")

db.certificates.createIndex(
  {
    studentName: "text",
    course: "text",
    institution: "text",
  },
  {
    name: "certificate_search_index",
    weights: {
      studentName: 10,
      course: 5,
      institution: 3,
    },
  },
)

print("Text search indexes created")

// Set up database statistics collection
print("Configuring database monitoring...")

// Create a collection for storing application metrics
db.createCollection("metrics")
db.metrics.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 }) // 30 days TTL

// Insert initial metrics document
db.metrics.insertOne({
  type: "database_initialized",
  timestamp: new Date(),
  version: "1.0.0",
  collections_created: ["users", "certificates", "metrics"],
  indexes_created: true,
})

print("Database initialization completed successfully!")
print("Collections created: users, certificates, metrics")
print("Indexes created for optimal performance")
print("Validation rules configured")
print("Initial admin user: admin@system.local (change password after first login)")
