import type { Config } from "tailwindcss";

const config = {
  theme: {
    extend: {
      colors: {
        "brand-primary": {
          DEFAULT: "var(--aero-navy)",
          foreground: "var(--aero-white)",
          hover: "var(--aero-navy-hover)",
          dark: "var(--aero-ink)",
        },
        "brand-secondary": {
          DEFAULT: "var(--aero-teal)",
          foreground: "var(--aero-white)",
          light: "var(--aero-teal-soft)",
          hover: "var(--aero-teal-deep)",
        },
        "brand-accent": "var(--aero-amber)",
        "brand-background": "var(--aero-page)",
        "brand-muted": "var(--aero-muted)",
        "brand-border": "var(--aero-border)",
        "brand-success": "var(--aero-success)",
      },
    },
  },
} satisfies Config;

export default config;
