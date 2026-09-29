/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",

        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "foreground-secondary":
          "rgb(var(--foreground-secondary) / <alpha-value>)",

        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-hover":
          "rgb(var(--primary-hover) / <alpha-value>)",
        "primary-foreground":
          "rgb(var(--primary-foreground) / <alpha-value>)",

        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",

        profit: "rgb(var(--profit) / <alpha-value>)",
        loss: "rgb(var(--loss) / <alpha-value>)",

        buy: "rgb(var(--buy) / <alpha-value>)",
        sell: "rgb(var(--sell) / <alpha-value>)",

        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        hover: "rgb(var(--hover) / <alpha-value>)",

        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground":
          "rgb(var(--muted-foreground) / <alpha-value>)",

        ring: "rgb(var(--ring) / <alpha-value>)",
      },
    },
  },

  plugins: [],
};