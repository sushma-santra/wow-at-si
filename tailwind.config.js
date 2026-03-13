// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50:  "#f3f2ff",
          100: "#ebe9fe",
          200: "#d9d6fd",
          300: "#bfb8fb",
          400: "#a093f8",
          500: "#5F52FF",
          600: "#5247e5",
          700: "#443ccc",
          800: "#3730aa",
          900: "#2a2585",
        },
        soft: {
          50:  "#f5f4ff",
          100: "#edeaff",
          200: "#dcd8ff",
          300: "#c3bdff",
          400: "#a59bff",
          500: "#7b72ff",
          600: "#5F52FF",
          700: "#4a3fe0",
          800: "#3c32b8",
          900: "#2e2690",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
  },
  plugins: [],
};
