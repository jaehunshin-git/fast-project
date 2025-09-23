const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--bg-primary)",
        "bg-elevated": "var(--bg-elevated)",
        "fg-primary": "var(--fg-primary)",
        "fg-muted": "var(--fg-muted)",
        "accent-primary": "var(--accent-primary)",
        "accent-muted": "var(--accent-muted)",
        "border-subtle": "var(--border-subtle)",
        "accent-ring": "var(--accent-ring)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-space-grotesk)", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: "0 35px 60px -20px rgba(15, 23, 42, 0.45)",
      },
      maxWidth: {
        shell: "72rem",
      },
    },
  },
  plugins: [],
};
