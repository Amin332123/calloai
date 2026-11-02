import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17241f",
        muted: "#78837d",
        canvas: "#f7f9f7",
        brand: {
          50: "#eff9f3",
          100: "#d9f0e2",
          500: "#39a66d",
          600: "#248d57",
          700: "#1d7048",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 16px 48px -30px rgba(27, 55, 39, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
