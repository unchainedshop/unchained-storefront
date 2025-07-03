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
        "dark-gray": "#495057",
        "color-light-dark": "#454545",
        "light-black": "#ced4da",
        "light-blue": "#80bdff",
        "color-brand": "#232323",
        "color-brand-lightest": "#e7e7e7",
        "color-brand-darker": "#121212",
        "color-dark": "#232323",
        "color-grey-lightest": "#ececec",
        "color-danger-100": "#FEE2E2",
        "color-danger-200": "#FECACA",
        "color-danger-600": "#DC2626",
        "color-danger-900": "#7F1D1D",
        "color-warning-100": "#FEF3C7",
        "color-warning-200": "#FDE68A",
        "color-warning-900": "#78350F",
        "color-success-100": "#D1FAE5",
        "color-success-200": "#A7F3D0",
        "color-success-900": "#064E3B",
      },
      boxShadow: {
        0: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
      },
      flex: {
        2: "0 0 50%",
        3: "0 0 100%",
        4: "0 0 33.333333%",
        5: "0 0 25%",
        6: "0 0 66.666667%%",
        7: "0 0 75%",
      },
      maxWidth: {
        "1/2": "50%",
        "1/3": "33.333333%",
        "1/4": "25%",
        "2/3": "66.666667%%",
        "3/4": "75%",
      },
      content: {
        star: 'url("/storefront/public/static/img/icon-streamline/arrow-button-down.svg")',
      },
      spacing: {
        sp: "calc(1em - 5px)",
        "sp-1": "calc(100% + 3em)",
      },
    },
  },
  plugins: [aspectRatio, typography, forms],
} satisfies Config;

export default tailwindConfig;

// const tailwindConfig = {
//   theme: {},
//   // corePlugins: {
//   //   aspectRatio: false,
//   // },
//   // plugins: [
//   // ],
// };

// export default tailwindConfig;
