/* eslint-disable @typescript-eslint/no-require-imports */
import daisyui from "daisyui";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#1c4ed8",
        secondary: "#9333ea",
        accent: "#f59e0b",
        neutral: "#1f2937",
        "base-100": "#ffffff",
        info: "#3b82f6",
        success: "#10b981",
        warning: "#f97316",
        error: "#ef4444",
      },
    },
  },
  plugins: [daisyui, require("@tailwindcss/typography")],
  daisyui: {},
};
export default config;
