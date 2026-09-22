import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f6f3ee",
        "cream-deep": "#ece6dc",
        ink: "#1b365d",
        "ink-soft": "#2a4a73",
        mist: "#d4dde8",
        mute: "#5c6b7a",
        paper: "#ffffff",
        wash: "#e4ebf4",
      },
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
