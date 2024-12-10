import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/**/*.js",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // primary: "#312F2F" ,
        // secondary: "#EA2B1F",
        primary: {
          DEFAULT: "#312F2F",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#EA2B1F",
          foreground: "#FFFFFF",
        },
        neutral: {
          100: "#FAFAF8",
          200: "#F0EFEA",
          300: "#E6E4DD",
          400: "#C4C3BB",
          500: "#A3A299",
          600: "#828179",
          700: "#605F5B",
          800: "#3A3935",
        },
        accent: {
          purple: "#8989DE",
          blue: "#61AAF2",
          green: "#7EBF8E",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
} satisfies Config;