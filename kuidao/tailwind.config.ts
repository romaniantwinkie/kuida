import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        "surface-2": token("surface-2"),
        line: token("line"),
        ink: token("ink"),
        muted: token("muted"),
        brand: token("brand"),
        "brand-ink": token("brand-ink"),
        "brand-soft": token("brand-soft"),
        accent: token("accent"),
        "accent-ink": token("accent-ink"),
        "accent-soft": token("accent-soft"),
        ok: token("ok"),
        warn: token("warn"),
        danger: token("danger"),
        info: token("info"),
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        card: "0 1px 2px rgb(16 24 22 / 0.04), 0 8px 24px -12px rgb(16 24 22 / 0.12)",
        lift: "0 2px 4px rgb(16 24 22 / 0.06), 0 24px 48px -20px rgb(16 24 22 / 0.25)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        ping2: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        ping2: "ping2 1.8s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
