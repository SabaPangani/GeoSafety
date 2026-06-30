import type { ReactNode } from "react";

type StatCardVariant = "default" | "hero";

interface StatCardProps {
  /** Small uppercase caption above the value. */
  label: string;
  /** The figure itself; rendered large, bold and tabular. */
  value: ReactNode;
  /** "hero" paints the coral gradient for the headline metric. */
  variant?: StatCardVariant;
}

/** A single headline metric. The "hero" variant carries the coral gradient. */
export function StatCard({ label, value, variant = "default" }: StatCardProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={
        isHero
          ? "rounded-card bg-linear-to-br from-hero-from to-hero-to p-5"
          : "rounded-card border border-border bg-surface p-5"
      }
    >
      <p
        className={`text-xs font-medium uppercase tracking-wide ${
          isHero ? "text-white/80" : "text-muted"
        }`}
      >
        {label}
      </p>
      <p
        className={`tabular mt-2 text-3xl font-bold ${
          isHero ? "text-white" : "text-text"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
