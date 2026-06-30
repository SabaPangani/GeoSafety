"use client";

import { useExpectedVsActual } from "@/hooks/useExpectedVsActual";
import type { ExpectedVsActualRow } from "@/lib/services/reconciliation";
import { formatMoney } from "@/lib/format";
import { expectedVsActualToCsv } from "@/lib/export/csv";

interface ExpectedVsActualProps {
  month: string;
}

/** Tailwind row styling per the expected/actual relationship. */
function rowClass(row: ExpectedVsActualRow): string {
  if (row.actual === 0 && row.expected > 0) {
    return "bg-gray-50 text-gray-500";
  }
  if (row.actual >= row.expected) {
    return "bg-green-50 text-green-800";
  }
  return "bg-red-50 text-red-800";
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
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900">
          Expected vs. actual
        </h2>
        <button
          type="button"
          onClick={handleExport}
          disabled={isLoading || !hasRows}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ექსპორტი CSV
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 text-right font-medium">Expected</th>
              <th className="px-4 py-3 text-right font-medium">Actual</th>
              <th className="px-4 py-3 text-right font-medium">Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isError ? (
              <tr>
                <td
                  colSpan={COLUMN_COUNT}
                  className="px-4 py-10 text-center text-sm text-red-600"
                >
                  Failed to load reconciliation data.
                </td>
              </tr>
            ) : isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: COLUMN_COUNT }).map((__, cell) => (
                    <td key={cell} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              ))
            ) : !data || data.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_COUNT}
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  No reconciliation data for this month.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.company_id} className={rowClass(row)}>
                  <td className="px-4 py-3 font-medium">{row.company_name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {formatMoney(row.expected)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {formatMoney(row.actual)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium">
                    {formatMoney(row.difference)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
