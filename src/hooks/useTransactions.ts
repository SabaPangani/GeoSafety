"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import {
  getTransactions,
  type TransactionWithCompany,
} from "@/lib/services/transactions";
import type { DashboardFilters } from "@/lib/schemas/filters";

import { queryKeys } from "./queryKeys";

/**
 * Fetches the filtered transactions list for the dashboard. Loading and error
 * state are surfaced via the returned query result.
 */
export function useTransactions(
  filters: DashboardFilters,
): UseQueryResult<TransactionWithCompany[], Error> {
  return useQuery({
    queryKey: queryKeys.transactionsList(filters),
    queryFn: () =>
      getTransactions({
        month: filters.month,
        status: filters.status,
        search: filters.search ?? "",
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
      }),
  });
}
