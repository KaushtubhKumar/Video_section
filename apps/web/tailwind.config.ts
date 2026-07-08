import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0c",
        "bg-elevated": "#131316",
        "bg-hover": "#1a1a1d",
        surface: "#111113",
        sidebar: "#09090b",
        navbar: "#0b0b0d",
        border: "rgba(255,255,255,0.06)",
        "border-strong": "rgba(255,255,255,0.1)",
        primary: "#ffffff",
        secondary: "#d4d4d8",
        muted: "#a1a1aa",
        disabled: "#6b6b70",
        accent: "#5e6ad2",
        "accent-soft": "rgba(94,106,210,0.14)",
        "accent-hover": "#7c88f5",
        success: "#4cb782",
        danger: "#eb5757",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      maxWidth: {
        content: "1240px",
      },
      borderRadius: {
        card: "16px",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
        fadeUp: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        popIn: "popIn 0.18s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;