import type { Config } from 'tailwindcss';
import aspectRatio from '@tailwindcss/aspect-ratio';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

const tailwindConfig = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './modules/**/*.{js,ts,jsx,tsx}'],
  plugins: [aspectRatio, typography, forms],
} satisfies Config;

export default tailwindConfig;
