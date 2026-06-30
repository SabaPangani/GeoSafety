"use client";

import { useCallback, useMemo, useState } from "react";

import { MonthNavigator } from "@/components/dashboard/MonthNavigator";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { ExpectedVsActual } from "@/components/dashboard/ExpectedVsActual";
import { RunMatchingButton } from "@/components/dashboard/RunMatchingButton";
import { useTransactions } from "@/hooks/useTransactions";
import { useIgnoreTransaction } from "@/hooks/useIgnoreTransaction";
import { filtersSchema, type DashboardFilters } from "@/lib/schemas/filters";

const DEFAULT_MONTH = "2026-06-01";

export default function DashboardPage() {
  // Raw, user-controlled filter input; validated through the Zod schema below.
  const [rawFilters, setRawFilters] = useState<Partial<DashboardFilters>>({
    month: DEFAULT_MONTH,
  });

  const filters = useMemo(() => filtersSchema.parse(rawFilters), [rawFilters]);

  // Stats reflect the whole month regardless of the table's status filter.
  const monthFilters = useMemo(
    () => filtersSchema.parse({ month: filters.month }),
    [filters.month],
  );

  const statsQuery = useTransactions(monthFilters);
  const tableQuery = useTransactions(filters);
  const ignore = useIgnoreTransaction();

  const setMonth = (month: string) =>
    setRawFilters((prev) => ({ ...prev, month }));

  const setStatus = (status: DashboardFilters["status"]) =>
    setRawFilters((prev) => ({ ...prev, status }));

  // Stable identity so SearchInput's debounce effect isn't reset each render.
  const setSearch = useCallback(
    (search: string) =>
      setRawFilters((prev) => ({ ...prev, search: search || undefined })),
    [],
  );

  const handleSort = (column: DashboardFilters["sortBy"]) =>
    setRawFilters((prev) => {
      const isSameColumn = (prev.sortBy ?? "entry_date") === column;
      const currentDir = prev.sortDir ?? "desc";
      return {
        ...prev,
        sortBy: column,
        sortDir: isSameColumn && currentDir === "asc" ? "desc" : "asc",
      };
    });

  return (
    <main className="min-h-full w-full bg-gray-50 text-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Payment Reconciliation
            </h1>
            <p className="text-sm text-gray-500">
              Match bank transactions to companies and track expected income.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <MonthNavigator month={filters.month} onChange={setMonth} />
            <RunMatchingButton />
          </div>
        </header>

        <StatsBar
          transactions={statsQuery.data}
          isLoading={statsQuery.isLoading}
          isError={statsQuery.isError}
        />

        <TransactionsTable
          transactions={tableQuery.data}
          isLoading={tableQuery.isLoading}
          isError={tableQuery.isError}
          sortBy={filters.sortBy}
          sortDir={filters.sortDir}
          statusFilter={filters.status}
          search={filters.search ?? ""}
          onSort={handleSort}
          onStatusFilterChange={setStatus}
          onSearchChange={setSearch}
          onIgnore={(id) => ignore.mutate(id)}
          ignoringId={ignore.isPending ? ignore.variables : null}
        />

        <ExpectedVsActual month={filters.month} />
      </div>
    </main>
  );
}
