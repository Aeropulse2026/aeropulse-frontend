import type { Config } from "tailwindcss";

const config = {
  theme: {
    extend: {
      colors: {
        "brand-primary": {
          DEFAULT: "#123D69",
          foreground: "#FFFFFF",
          hover: "#173D69",
          dark: "#0B1F33",
        },
        "brand-secondary": {
          DEFAULT: "#167C96",
          foreground: "#FFFFFF",
          light: "#D9F3F7",
          hover: "#0F5D71",
        },
        "brand-accent": "#F4B942",
        "brand-background": "#F5F7FA",
        "brand-muted": "#64748B",
        "brand-border": "#D9E2EC",
        "brand-success": "#34D399",
      },
    },
  },
} satisfies Config;

export default config;
