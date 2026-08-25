/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          secondary: "var(--accent-secondary)",
          foreground: "var(--accent-foreground)",
        },
        border: "var(--border)",
        card: "var(--card)",
        ring: "var(--ring)",
        hero: {
          royal: "var(--hero-royal)",
          "royal-soft": "var(--hero-royal-soft)",
          cream: "var(--hero-cream)",
          "cream-dim": "var(--hero-cream-dim)",
          oak: "var(--hero-oak)",
          "oak-dark": "var(--hero-oak-dark)",
          ink: "var(--hero-ink)",
        },
      },
      fontFamily: {
        display: ["Calistoga", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(to right, var(--accent), var(--accent-secondary))",
        "gradient-accent-diagonal": "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.06)",
        DEFAULT: "0 4px 6px rgba(0,0,0,0.07)",
        md: "0 4px 6px rgba(0,0,0,0.07)",
        lg: "0 10px 15px rgba(0,0,0,0.08)",
        xl: "0 20px 25px rgba(0,0,0,0.1)",
        accent: "0 4px 14px rgba(0,82,255,0.25)",
        "accent-lg": "0 8px 24px rgba(0,82,255,0.35)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      maxWidth: {
        "6xl": "72rem",
      },
      keyframes: {
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: "0.7" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 60s linear infinite",
        float: "float 5s ease-in-out infinite",
        "float-delayed": "float 4s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
