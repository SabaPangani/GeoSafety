import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  ghost: "border border-border text-text hover:bg-surface-2",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** "primary" is the accent fill; "ghost" is the bordered secondary. */
  variant?: ButtonVariant;
  children: ReactNode;
}

/** Control-radius button in an accent (primary) or bordered (ghost) variant. */
export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`cursor-pointer rounded-ctrl px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        VARIANTS[variant]
      }${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
