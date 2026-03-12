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
          50: "#fdf8f6",
          100: "#fceee6",
          200: "#f8dcc8",
          300: "#f4c9aa",
          400: "#edb48d",
          500: "#e89d6f",
          600: "#d98b5e",
          700: "#c9754d",
          800: "#b9603c",
          900: "#a94c2b",
        },
        soft: {
          50: "#fdf9f7",
          100: "#f5ebe6",
          200: "#e8d4c8",
          300: "#e0c0b0",
          400: "#d4a898",
          500: "#c99080",
          600: "#b67e6e",
          700: "#a06d5d",
          800: "#8a5c4c",
          900: "#744b3b",
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
