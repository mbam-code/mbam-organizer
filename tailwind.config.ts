import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-burgundy",
    "hover:bg-burgundy-dark",
    "dark:bg-burgundy",
    "dark:hover:bg-burgundy-dark",
    "text-gold",
  ],
  theme: {
    extend: {
      colors: {
        "burgundy": "#B12B28",
        "burgundy-dark": "#991f1b",
        "gold": "#F7EF31",
      },
    },
  },
  plugins: [],
}
export default config
