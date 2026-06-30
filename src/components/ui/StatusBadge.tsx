type TransactionStatus = "matched" | "unmatched" | "ignored";

const STATUS_STYLES: Record<TransactionStatus, string> = {
  matched: "text-matched bg-matched-bg",
  unmatched: "text-unmatched bg-unmatched-bg",
  ignored: "text-ignored bg-ignored-bg",
};

const STATUS_LABELS: Record<TransactionStatus, string> = {
  matched: "Matched",
  unmatched: "Unmatched",
  ignored: "Ignored",
};

interface StatusBadgeProps {
  status: TransactionStatus;
}

/** Rounded pill tinting itself from the status tokens. */
export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
