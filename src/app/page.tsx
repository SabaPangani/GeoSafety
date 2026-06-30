"use client";

import { useCallback, useMemo, useState } from "react";

import { MonthNavigator } from "@/components/dashboard/MonthNavigator";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { ExpectedVsActual } from "@/components/dashboard/ExpectedVsActual";
import { RunMatchingButton } from "@/components/dashboard/RunMatchingButton";
import { StatCard, StatusBadge, Button } from "@/components/ui";
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
        {/* Design system preview — temporary; remove once the dark theme is wired into the dashboard. */}
        <section className="rounded-card bg-background p-6 ring-1 ring-border">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">
            Design system preview
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Total volume" value="₾ 128,450.00" />
            <StatCard variant="hero" label="Match rate" value="92.4%" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusBadge status="matched" />
            <StatusBadge status="unmatched" />
            <StatusBadge status="ignored" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button>Run matching</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </section>

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
