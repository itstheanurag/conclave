/* eslint-disable @typescript-eslint/no-require-imports */
import daisyui from "daisyui";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui, require("@tailwindcss/typography")],
  daisyui: {},
};
export default config;
