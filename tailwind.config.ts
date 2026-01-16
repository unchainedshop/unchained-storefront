import type { Config } from "tailwindcss";
import aspectRatio from "@tailwindcss/aspect-ratio";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

const tailwindConfig = {
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./modules/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
