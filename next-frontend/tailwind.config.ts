import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        default: "#222222",
        main: "#FFCD33",
      },
      textColor: {
        primary: "#222222",
        contrast: "#F2F2F2",
      },
    },
  },
  plugins: [],
} satisfies Config;
