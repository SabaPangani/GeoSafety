import type { Config } from "tailwindcss";

/**
 * Dark-only design system. Every value here is a semantic alias onto a CSS
 * custom property defined in `globals.css` — components reference the names
 * (bg-surface, text-muted, border-border, …), never raw hex.
 *
 * Loaded by Tailwind v4 through the `@config` directive in `globals.css`.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // surfaces
        background: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",

        // text
        text: "var(--text)",
        muted: "var(--text-muted)",
        dim: "var(--text-dim)",

        // primary accent
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",

        // status — text color + translucent bg tint
        matched: "var(--matched)",
        "matched-bg": "var(--matched-bg)",
        unmatched: "var(--unmatched)",
        "unmatched-bg": "var(--unmatched-bg)",
        ignored: "var(--ignored)",
        "ignored-bg": "var(--ignored-bg)",

        // hero gradient stops
        "hero-from": "var(--hero-from)",
        "hero-to": "var(--hero-to)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        ctrl: "var(--radius-ctrl)",
      },
    },
  },
};

export default config;
