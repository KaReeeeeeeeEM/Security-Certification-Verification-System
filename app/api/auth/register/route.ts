import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { z } from "zod"

// Input validation schema
const registerSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
  role: z.enum(["admin", "user"]).default("user"),
  institution: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const { email, password, role, institution } = validatedData

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        { status: 400 },
      )
    }

    // Validate admin role requirements
    if (role === "admin" && !institution) {
      return NextResponse.json(
        {
          success: false,
          message: "Institution is required for admin accounts",
        },
        { status: 400 },
      )
    }

    // Create new user (password will be automatically hashed by the pre-save middleware)
    const user = new User({
      email,
      password,
      role,
      institution: role === "admin" ? institution : undefined,
    })

    await user.save()

    // Generate JWT token
    const jwt = require("jsonwebtoken")
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    )

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          institution: user.institution,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)

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
        message: "Registration failed. Please try again.",
      },
      { status: 500 },
    )
  }
}
