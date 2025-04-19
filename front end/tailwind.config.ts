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
        primary: "#0f1729",
        textColor: `#cbd5e1`,
        primaryHover: `#1d283a`,
        secondary: "#121a2d",
        purple: `#8449fd`,
        purpleHover: "#6f35f5",
      },
    },
  },
  plugins: [],
} satisfies Config;
