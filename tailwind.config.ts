import type { Config } from "tailwindcss";
import fluid, { extract, screens, fontSize } from 'fluid-tailwind'


export default {
  content: {
    files:[
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./slices/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    extract
  },
  theme: {
    screens,
    fontSize,
    extend: {
     fontFamily:{
      sans: ["var(--font-alpino)", "sans-serif"]
     }
    },
  },
  plugins: [
    fluid
  ],
} satisfies Config;
