import type { HTMLAttributes, ReactNode } from "react";

type CardPadding = "none" | "sm" | "md" | "lg";

const PADDING: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Inner padding; defaults to "md". */
  padding?: CardPadding;
  children: ReactNode;
}

/** Surface-background panel with a subtle border and the card radius. */
export function Card({
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-card border border-border bg-surface ${PADDING[padding]}${
        className ? ` ${className}` : ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
}
