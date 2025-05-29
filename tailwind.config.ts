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
      colors: {
        ...shadcnConfig.theme.extend.colors,
        primary: {
          50: "rgb(240 249 255)",
          100: "rgb(224 242 254)",
          200: "rgb(186 230 253)",
          300: "rgb(125 211 252)",
          400: "rgb(56 189 248)",
          500: "rgb(14 165 233)",
          600: "rgb(2 132 199)",
          700: "rgb(3 105 161)",
          800: "rgb(7 89 133)",
          900: "rgb(12 74 110)",
        },
        secondary: {
          50: "rgb(240 253 244)",
          100: "rgb(220 252 231)",
          200: "rgb(187 247 208)",
          300: "rgb(134 239 172)",
          400: "rgb(74 222 128)",
          500: "rgb(34 197 94)",
          600: "rgb(22 163 74)",
          700: "rgb(21 128 61)",
          800: "rgb(22 101 52)",
          900: "rgb(20 83 45)",
        },
        accent: {
          50: "rgb(255 251 235)",
          100: "rgb(254 243 199)",
          200: "rgb(253 230 138)",
          300: "rgb(252 211 77)",
          400: "rgb(251 191 36)",
          500: "rgb(245 158 11)",
          600: "rgb(217 119 6)",
          700: "rgb(180 83 9)",
          800: "rgb(146 64 14)",
          900: "rgb(120 53 15)",
        },
        success: {
          50: "rgb(240 253 244)",
          500: "rgb(34 197 94)",
          600: "rgb(22 163 74)",
        },
        warning: {
          50: "rgb(255 251 235)",
          500: "rgb(245 158 11)",
          600: "rgb(217 119 6)",
        },
        error: {
          50: "rgb(254 242 242)",
          500: "rgb(239 68 68)",
          600: "rgb(220 38 38)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      fontSize: {
        "responsive-xl": "clamp(1.5rem, 4vw, 3rem)",
        "responsive-lg": "clamp(1.25rem, 3vw, 2rem)",
        "responsive-md": "clamp(1rem, 2.5vw, 1.5rem)",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pulse-success": "pulse-success 2s infinite",
        "pulse-error": "pulse-error 2s infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        certificate:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "certificate-verified":
          "0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -1px rgba(34, 197, 94, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "certificate-error":
          "0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, rgb(14 165 233) 0%, rgb(3 105 161) 100%)",
        "gradient-secondary": "linear-gradient(135deg, rgb(34 197 94) 0%, rgb(21 128 61) 100%)",
        "gradient-accent": "linear-gradient(135deg, rgb(251 191 36) 0%, rgb(217 119 6) 100%)",
        "gradient-hero": "linear-gradient(135deg, rgb(2 132 199) 0%, rgb(22 163 74) 50%, rgb(245 158 11) 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [...shadcnConfig.plugins],
}
