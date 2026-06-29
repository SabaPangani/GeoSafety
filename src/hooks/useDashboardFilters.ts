"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { filtersSchema, type DashboardFilters } from "@/lib/schemas/filters";

/** First day of the current month as `"YYYY-MM-01"`, used as the default month. */
function currentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

export interface UseDashboardFiltersResult {
  /** Validated filter state, with schema defaults applied. */
  filters: DashboardFilters;
  /** Merge a partial update into the current filters and persist to the URL. */
  setFilters: (next: Partial<DashboardFilters>) => void;
}

/**
 * Reads the dashboard filter state from the URL, parses it through
 * `filtersSchema` (applying defaults / dropping invalid values), and exposes a
 * setter that writes merged filters back to the query string.
 */
export function useDashboardFilters(): UseDashboardFiltersResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<DashboardFilters>(() => {
    const raw = {
      status: searchParams.get("status") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      sortDir: searchParams.get("sortDir") ?? undefined,
      month: searchParams.get("month") ?? currentMonth(),
    };

    const parsed = filtersSchema.safeParse(raw);
    // Fall back to a clean default set if the URL carries invalid params.
    return parsed.success
      ? parsed.data
      : filtersSchema.parse({ month: currentMonth() });
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<DashboardFilters>) => {
      const merged: DashboardFilters = { ...filters, ...next };
      const params = new URLSearchParams();
      params.set("month", merged.month);
      params.set("status", merged.status);
      params.set("sortBy", merged.sortBy);
      params.set("sortDir", merged.sortDir);
      const search = merged.search?.trim();
      if (search) {
        params.set("search", search);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [filters, pathname, router],
  );

  return { filters, setFilters };
}
