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

export function MonthNavigator({ month, onChange }: MonthNavigatorProps) {
  return (
    <div
      role="group"
      aria-label="Select month"
      className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm"
    >
      {MONTHS.map((option) => {
        const isActive = option.value === month;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
