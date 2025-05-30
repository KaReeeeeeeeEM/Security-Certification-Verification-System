/** @type {import('tailwindcss').Config} */
const shadcnConfig = require("./node_modules/ui/tailwind.config.js")

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      ...shadcnConfig.theme.extend,
      screens: {
        xs: "475px",
        ...shadcnConfig.theme.extend.screens,
      },
      colors: {
        // border: "hsl(var(--border))", // Removed duplicate to resolve the error
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Removed duplicate primary property to resolve the error
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ...shadcnConfig.theme.extend.colors,
        // Removed duplicate background property to resolve the error
        surface: "#111111",
        "surface-elevated": "#1a1a1a",
        "surface-hover": "#222222",
        "text-primary": "#ffffff",
        "text-secondary": "#a1a1aa",
        "text-muted": "#71717a",
        border: "#27272a", // Retained this border property
        "border-hover": "#3f3f46",
        primary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
        },
        success: "#22c55e",
        "success-bg": "#052e16",
        warning: "#f59e0b",
        "warning-bg": "#451a03",
        error: "#ef4444",
        "error-bg": "#450a0a",
        info: "#3b82f6",
        "info-bg": "#1e3a8a",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        ...shadcnConfig.theme.extend.borderRadius,
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
        ...shadcnConfig.theme.extend.fontFamily,
      },
      fontSize: {
        "responsive-xl": "clamp(1.5rem, 4vw, 3rem)",
        "responsive-lg": "clamp(1.25rem, 3vw, 2rem)",
        "responsive-md": "clamp(1rem, 2.5vw, 1.5rem)",
        ...shadcnConfig.theme.extend.fontSize,
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        ...shadcnConfig.theme.extend.spacing,
      },
      animation: {
        "slide-in-top": "slideInFromTop 0.5s ease-out",
        "slide-in-right": "slideInFromRight 0.3s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
        gradient: "gradient-shift 3s ease infinite",
        ...shadcnConfig.theme.extend.animation,
      },
      backdropBlur: {
        xs: "2px",
        ...shadcnConfig.theme.extend.backdropBlur,
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(168, 85, 247, 0.3)",
        "glow-success": "0 0 20px rgba(34, 197, 94, 0.2)",
        "glow-error": "0 0 20px rgba(239, 68, 68, 0.2)",
        ...shadcnConfig.theme.extend.boxShadow,
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
        "gradient-hero": "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d1b69 100%)",
        "gradient-card": "linear-gradient(145deg, #111111 0%, #1a1a1a 100%)",
        ...shadcnConfig.theme.extend.backgroundImage,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
