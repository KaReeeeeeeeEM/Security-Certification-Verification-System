const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Optimize images
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },

  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    NEXT_PUBLIC_APP_NAME: "Secure Certificate Verification",
    NEXT_PUBLIC_APP_VERSION: "1.0.0",
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },

  // Redirect configuration for production
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/",
        permanent: false,
      },
    ]
  },

  // Webpack configuration for optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = "all"
    }

    return config
  },

  // Experimental features
  experimental: {
    // Enable app directory (if using Next.js 13+)
    appDir: true,
    // Optimize server components
    serverComponentsExternalPackages: [],
  },

  // Output configuration for deployment
  output: "standalone",

  // Disable x-powered-by header
  poweredByHeader: false,

  // Compression
  compress: true,

  // Development configuration
  ...(process.env.NODE_ENV === "development" && {
    // Enable source maps in development
    productionBrowserSourceMaps: false,
    // Faster builds in development
    swcMinify: true,
  }),
}

module.exports = nextConfig
