import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obus: {
          primary: "#050934",
          accent: "#FC7F05",
          bg: "#F5F7FA",
          "text-primary": "#212121",
          "text-secondary": "#757575",
          "text-light": "#E0E0E0",
        },
      },
    },
  },
} satisfies Config;

export default config;
