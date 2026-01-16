import type { Config } from "tailwindcss";
import aspectRatio from "@tailwindcss/aspect-ratio";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

const tailwindConfig = {
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./modules/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Theme palette
        cream: {
          DEFAULT: "#FFFCEA",
          50: "#FFFEF7",
          100: "#FFFCEA",
          200: "#FFF9D6",
          300: "#FFF5C2",
          400: "#FFF0A8",
        },
        mint: {
          DEFAULT: "#A5F2E7",
          50: "#E8FCF9",
          100: "#C7F7F0",
          200: "#A5F2E7",
          300: "#6BE4D3",
          400: "#3DD4BD",
          500: "#20B8A2",
        },
        periwinkle: {
          DEFAULT: "#8983F3",
          50: "#EEEDFD",
          100: "#D5D3FB",
          200: "#B0ACFA",
          300: "#8983F3",
          400: "#6B64E8",
          500: "#5148D8",
        },
        "deep-purple": {
          DEFAULT: "#3A0077",
          50: "#F3E8FF",
          100: "#DFC2FF",
          200: "#7E3FBB",
          300: "#5C1F99",
          400: "#3A0077",
          500: "#2A0055",
        },
      },
      animation: {
        "rainbow-glow": "rainbow-glow 3s linear infinite",
      },
      keyframes: {
        "rainbow-glow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [aspectRatio, typography, forms],
} satisfies Config;

export default tailwindConfig;
