import type { Config } from "tailwindcss";

const color = (token: string) => `oklch(var(${token}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: color("--background"),
        foreground: color("--foreground"),
        card: {
          DEFAULT: color("--card"),
          foreground: color("--card-foreground"),
        },
        popover: {
          DEFAULT: color("--popover"),
          foreground: color("--popover-foreground"),
        },
        primary: {
          DEFAULT: color("--primary"),
          foreground: color("--primary-foreground"),
        },
        secondary: {
          DEFAULT: color("--secondary"),
          foreground: color("--secondary-foreground"),
        },
        muted: {
          DEFAULT: color("--muted"),
          foreground: color("--muted-foreground"),
        },
        accent: {
          DEFAULT: color("--accent"),
          foreground: color("--accent-foreground"),
        },
        destructive: {
          DEFAULT: color("--destructive"),
          foreground: color("--destructive-foreground"),
        },
        border: color("--border"),
        input: color("--input"),
        ring: color("--ring"),
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
      },
    },
  },
  plugins: [],
};

export default config;
