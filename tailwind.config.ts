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
        // Neo-Brutalist Companio Core Palette
        ink: {
          DEFAULT: "#141414",
          soft: "#4a4a4a",
          muted: "#737373",
        },
        paper: {
          DEFAULT: "#FFF8EE",
          deep: "#F6EFE3",
        },
        surface: "#FFFFFF",
        lime: {
          DEFAULT: "#C6F432",
          soft: "#EDFBC0",
        },
        sunny: {
          DEFAULT: "#FFD23F",
          soft: "#FFF1BF",
        },
        pink: {
          DEFAULT: "#FF7AC6",
          soft: "#FFD1EA",
        },
        lavender: {
          DEFAULT: "#7B5CF0",
          soft: "#E5DEFF",
        },
        sky: {
          DEFAULT: "#38BDF8",
          soft: "#E0F2FE",
        },
        mint: {
          DEFAULT: "#34D399",
          soft: "#D1FAE5",
        },
        tangerine: {
          DEFAULT: "#FB923C",
          soft: "#FFEDD5",
        },
        danger: {
          DEFAULT: "#EF4444",
          soft: "#FEE2E2",
        },

        // Legacy / Compatibility Palettes
        dark: {
          bg: "#0A0A0A",
          card: "#141414",
          border: "#262626",
          text: "#F5F5F7",
          muted: "#8E8E93",
          accent: "#D4AF37",
        },
        brutal: {
          pink: "#FF7AC6",
          blue: "#70D6FF",
          lime: "#C6F432",
          yellow: "#FFD23F",
          black: "#141414",
          bg: "#FFF8EE",
        },
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-dmsans)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-dmsans)", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        mono: ["Consolas", "Courier New", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0 0 #141414",
        "brutal-sm": "2px 2px 0 0 #141414",
        "brutal-xs": "1.5px 1.5px 0 0 #141414",
        "brutal-lg": "7px 7px 0 0 #141414",
      },
      borderWidth: {
        brutal: "3px",
        "brutal-sm": "2px",
        "brutal-lg": "4px",
      },
    },
  },
  plugins: [],
};

export default config;
