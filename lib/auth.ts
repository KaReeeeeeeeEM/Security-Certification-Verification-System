import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable")
}

export interface TokenData {
  success: boolean
  userId?: string
  email?: string
  role?: string
  message?: string
}

export async function verifyToken(request: NextRequest): Promise<TokenData> {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return {
        success: false,
        message: "Access token required",
      }
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    return {
      success: true,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        message: "Token has expired",
      }
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        success: false,
        message: "Invalid token",
      }
    }

    console.error("Authentication error:", error)
    return {
      success: false,
      message: "Authentication failed",
    }
  }
}

export function requireAdmin(tokenData: TokenData) {
  if (!tokenData.success) {
    return {
      success: false,
      message: "Authentication required",
    }
  }

  if (tokenData.role !== "admin") {
    return {
      success: false,
      message: "Admin access required",
    }
  }

  return { success: true }
}
