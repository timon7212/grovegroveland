import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#FFFFFF", subtle: "#FAFAFA", elevated: "#F0F0F0" },
        border: { DEFAULT: "#E5E7EB", strong: "#D1D5DB" },
        text: { primary: "#2C2D30", secondary: "#88898B", tertiary: "#B0B1B3" },
        accent: { DEFAULT: "#16A34A", dark: "#15803D", light: "#DCFCE7" },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "pulse-dot": "pulse-dot 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
