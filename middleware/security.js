const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
}

// General API rate limiting
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  "Too many requests from this IP, please try again later",
)

// Strict rate limiting for authentication endpoints
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  "Too many authentication attempts, please try again later",
)

// Certificate verification rate limiting (more lenient for public access)
const verificationLimiter = createRateLimiter(
  1 * 60 * 1000, // 1 minute
  20, // limit each IP to 20 requests per minute
  "Too many verification requests, please try again later",
)

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true)

    const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", process.env.FRONTEND_URL].filter(Boolean)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

// Security headers configuration
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any keys that start with '$' or contain '.'
  mongoSanitize()(req, res, () => {
    // Clean user input from malicious HTML
    xss()(req, res, next)
  })
}

// Security logging middleware
const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString()
  const ip = req.ip || req.connection.remoteAddress
  const userAgent = req.get("User-Agent") || "Unknown"

  // Log suspicious activities
  if (req.path.includes("admin") || req.path.includes("..")) {
    console.log(`[SECURITY] ${timestamp} - Suspicious request from ${ip}: ${req.method} ${req.path}`)
  }

  next()
}

module.exports = {
  generalLimiter,
  authLimiter,
  verificationLimiter,
  corsOptions,
  helmetConfig,
  sanitizeInput,
  securityLogger,
  helmet,
}
