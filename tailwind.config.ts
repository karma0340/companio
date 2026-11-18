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
        // Cinematic Showroom Palette (Dark luxury)
        dark: {
          bg: "#0A0A0A",
          card: "#141414",
          border: "#262626",
          text: "#F5F5F7",
          muted: "#8E8E93",
          accent: "#D4AF37",
        },
        // Live App Palette (Neo-Brutalist energetic)
        brutal: {
          pink: "#FF7AC6",
          blue: "#70D6FF",
          lime: "#E9FF70",
          yellow: "#FFD670",
          black: "#102A43",
          bg: "#FFFDF9",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Helvetica Neue", "Arial", "sans-serif"],
        mono: ["Consolas", "Courier New", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #102A43",
        "brutal-sm": "2px 2px 0px 0px #102A43",
        "brutal-lg": "6px 6px 0px 0px #102A43",
      },
    },
  },
  plugins: [],
};

export default config;
