"use client";

import { useExpectedVsActual } from "@/hooks/useExpectedVsActual";
import type { ExpectedVsActualRow } from "@/lib/services/reconciliation";
import { formatMoney } from "@/lib/format";
import { expectedVsActualToCsv } from "@/lib/export/csv";
import { Card, Button } from "@/components/ui";

interface ExpectedVsActualProps {
  month: string;
}

/** Semantic color for the difference cell: gray when nothing came in, green
 *  when actual covers expected, coral when short. */
function differenceClass(row: ExpectedVsActualRow): string {
  if (row.actual === 0 && row.expected > 0) {
    return "text-ignored";
  }
  if (row.actual >= row.expected) {
    return "text-matched";
  }
  return "text-unmatched";
}

const COLUMN_COUNT = 4;

export function ExpectedVsActual({ month }: ExpectedVsActualProps) {
  const { data, isLoading, isError } = useExpectedVsActual(month);

  const hasRows = !!data && data.length > 0;

  const handleExport = () => {
    if (!data || data.length === 0) {
      return;
    }
    const csv = expectedVsActualToCsv(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `reconciliation-${month.slice(0, 7)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Card padding="none">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="text-base font-semibold text-text">
          Expected vs. actual
        </h2>
        <Button
          variant="ghost"
          onClick={handleExport}
          disabled={isLoading || !hasRows}
        >
          ექსპორტი CSV
        </Button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 text-right font-medium">Expected</th>
              <th className="px-4 py-3 text-right font-medium">Actual</th>
              <th className="px-4 py-3 text-right font-medium">Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isError ? (
              <tr>
                <td
                  colSpan={COLUMN_COUNT}
                  className="px-4 py-10 text-center text-sm text-unmatched"
                >
                  Failed to load reconciliation data.
                </td>
              </tr>
            ) : isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: COLUMN_COUNT }).map((__, cell) => (
                    <td key={cell} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-surface-2" />
                    </td>
                  ))}
                </tr>
              ))
            ) : !data || data.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_COUNT}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No reconciliation data for this month.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.company_id}
                  className="text-text/90 transition-colors hover:bg-surface-2"
                >
                  <td className="px-4 py-3 font-medium">{row.company_name}</td>
                  <td className="tabular whitespace-nowrap px-4 py-3 text-right text-muted">
                    {formatMoney(row.expected)}
                  </td>
                  <td className="tabular whitespace-nowrap px-4 py-3 text-right">
                    {formatMoney(row.actual)}
                  </td>
                  <td
                    className={`tabular whitespace-nowrap px-4 py-3 text-right font-medium ${differenceClass(
                      row,
                    )}`}
                  >
                    {formatMoney(row.difference)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
