import mongoose, { type Document, Schema } from "mongoose"

export interface ICertificate extends Document {
  certificateId: string
  studentName: string
  course: string
  institution: string
  graduationDate: Date
  grade: string
  encryptedData: string
  iv: string
  salt: string
  tag: string
  dataHash: string
  issuedBy: mongoose.Types.ObjectId
  issuedAt: Date
  status: "active" | "revoked" | "expired"
  verifyIntegrity(originalData: any): boolean
}

const certificateSchema = new Schema<ICertificate>(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: [/^[A-Z]+-\d{4}-\d{6}$/, "Invalid certificate ID format"],
      index: true, // Keep this as the single index definition
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    course: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    graduationDate: {
      type: Date,
      required: true,
    },
    grade: {
      type: String,
      required: true,
      enum: ["First Class", "Second Class Upper", "Second Class Lower", "Pass", "Distinction", "Merit"],
    },
    // Enhanced encryption fields for AES-256-GCM
    encryptedData: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    dataHash: {
      type: String,
      required: true,
    },
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "revoked", "expired"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
)

// Method to verify certificate integrity
certificateSchema.methods.verifyIntegrity = function (originalData: any): boolean {
  const encryptionService = require("@/utils/encryption")
  const currentHash = encryptionService.generateHash(originalData)
  return currentHash === this.dataHash
}

// Indexes for performance
certificateSchema.index({ studentName: 1 })
certificateSchema.index({ institution: 1 })
certificateSchema.index({ status: 1 })

export default mongoose.models.Certificate || mongoose.model<ICertificate>("Certificate", certificateSchema)
