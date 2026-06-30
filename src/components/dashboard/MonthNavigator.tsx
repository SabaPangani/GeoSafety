"use client";

interface MonthOption {
  value: string;
  label: string;
}

const MONTHS: readonly MonthOption[] = [
  { value: "2026-04-01", label: "April 2026" },
  { value: "2026-05-01", label: "May 2026" },
  { value: "2026-06-01", label: "June 2026" },
];

interface MonthNavigatorProps {
  month: string;
  onChange: (month: string) => void;
}

/** Uppercases the month label and sets the year off with a comma: "JUNE, 2026". */
function formatLabel(label: string): string {
  return label.replace(" ", ", ").toUpperCase();
}

export function MonthNavigator({ month, onChange }: MonthNavigatorProps) {
  const index = MONTHS.findIndex((option) => option.value === month);
  const current = index === -1 ? undefined : MONTHS[index];
  const previous = index > 0 ? MONTHS[index - 1] : undefined;
  const next =
    index !== -1 && index < MONTHS.length - 1 ? MONTHS[index + 1] : undefined;

  return (
    <div
      role="group"
      aria-label="Select month"
      className="inline-flex items-center gap-1 rounded-ctrl border border-border bg-surface p-1"
    >
      <button
        type="button"
        aria-label="Previous month"
        disabled={!previous}
        onClick={() => previous && onChange(previous.value)}
        className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted"
      >
        ‹
      </button>
      <span className="min-w-36 px-2 text-center text-sm font-semibold uppercase tracking-wide text-text">
        {current ? formatLabel(current.label) : "—"}
      </span>
      <button
        type="button"
        aria-label="Next month"
        disabled={!next}
        onClick={() => next && onChange(next.value)}
        className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted"
      >
        ›
      </button>
    </div>
  );
}
