"use client";

import type { TransactionWithCompany } from "@/lib/services/transactions";
import type { DashboardFilters } from "@/lib/schemas/filters";
import { formatMoney } from "@/lib/format";

import { SearchInput } from "./SearchInput";

type SortColumn = DashboardFilters["sortBy"];
type StatusFilter = DashboardFilters["status"];

interface TransactionsTableProps {
  transactions: TransactionWithCompany[] | undefined;
  isLoading: boolean;
  isError: boolean;
  sortBy: SortColumn;
  sortDir: DashboardFilters["sortDir"];
  statusFilter: StatusFilter;
  search: string;
  onSort: (column: SortColumn) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
  onSearchChange: (search: string) => void;
  onIgnore: (id: string) => void;
  ignoringId: string | null;
}

const STATUS_FILTERS: readonly StatusFilter[] = [
  "all",
  "matched",
  "unmatched",
  "ignored",
];

const STATUS_STYLES: Record<string, string> = {
  matched: "bg-green-100 text-green-700",
  unmatched: "bg-red-100 text-red-700",
  ignored: "bg-gray-100 text-gray-600",
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      {status}
    </span>
  );
}

function SortHeader({
  label,
  column,
  sortBy,
  sortDir,
  onSort,
  className,
}: {
  label: string;
  column: SortColumn;
  sortBy: SortColumn;
  sortDir: DashboardFilters["sortDir"];
  onSort: (column: SortColumn) => void;
  className?: string;
}) {
  const isActive = sortBy === column;
  const indicator = isActive ? (sortDir === "asc" ? "↑" : "↓") : "↕";
  return (
    <th className={`px-4 py-3 font-medium ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`inline-flex items-center gap-1 hover:text-gray-900 ${
          isActive ? "text-gray-900" : "text-gray-500"
        }`}
      >
        {label}
        <span aria-hidden className="text-xs">
          {indicator}
        </span>
      </button>
    </th>
  );
}

const COLUMN_COUNT = 7;

export function TransactionsTable({
  transactions,
  isLoading,
  isError,
  sortBy,
  sortDir,
  statusFilter,
  search,
  onSort,
  onStatusFilterChange,
  onSearchChange,
  onIgnore,
  ignoringId,
}: TransactionsTableProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900">Transactions</h2>
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search sender or INN"
          />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            Status
            <select
              value={statusFilter}
              onChange={(event) =>
                onStatusFilterChange(event.target.value as StatusFilter)
              }
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm capitalize text-gray-900"
            >
              {STATUS_FILTERS.map((value) => (
                <option key={value} value={value} className="capitalize">
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <SortHeader
                label="Date"
                column="entry_date"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
              />
              <th className="px-4 py-3 font-medium">Sender</th>
              <th className="px-4 py-3 font-medium">INN</th>
              <SortHeader
                label="Amount"
                column="amount"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
                className="text-right"
              />
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Matched company</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isError ? (
              <tr>
                <td
                  colSpan={COLUMN_COUNT}
                  className="px-4 py-10 text-center text-sm text-red-600"
                >
                  Failed to load transactions.
                </td>
              </tr>
            ) : isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: COLUMN_COUNT }).map((__, cell) => (
                    <td key={cell} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              ))
            ) : !transactions || transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMN_COUNT}
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  No transactions for this month.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="text-gray-700">
                  <td className="whitespace-nowrap px-4 py-3">{tx.entry_date}</td>
                  <td className="px-4 py-3">{tx.sender_name ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {tx.sender_inn ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-900">
                    {formatMoney(tx.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-4 py-3">{tx.company?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    {tx.status === "unmatched" ? (
                      <button
                        type="button"
                        onClick={() => onIgnore(tx.id)}
                        disabled={ignoringId === tx.id}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {ignoringId === tx.id ? "Ignoring…" : "Ignore"}
                      </button>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
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
