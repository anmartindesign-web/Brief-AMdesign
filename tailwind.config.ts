import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        turquoise: {
          50: "#eefcfb",
          100: "#d4f6f3",
          200: "#aeece8",
          300: "#79dcd6",
          400: "#42c3bd",
          500: "#22a8a3",
          600: "#178884",
          700: "#166d6b",
          800: "#175856",
          900: "#174a49",
          950: "#082b2b",
        },
        ink: {
          50: "#f6f7f8",
          100: "#eceef0",
          200: "#d5dade",
          300: "#b1bac0",
          400: "#86929b",
          500: "#67757f",
          600: "#535f6a",
          700: "#454e57",
          800: "#3b424a",
          900: "#22262b",
          950: "#15181b",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(20, 30, 30, 0.04), 0 1px 6px -2px rgba(20, 30, 30, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
