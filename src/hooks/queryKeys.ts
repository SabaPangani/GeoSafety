import type { DashboardFilters } from "@/lib/schemas/filters";

/**
 * Centralised query keys. The base keys (`transactions`, `expectedVsActual`)
 * are used for invalidation; the specific factories build the per-query keys.
 */
export const queryKeys = {
  transactions: ["transactions"] as const,
  transactionsList: (filters: DashboardFilters) =>
    ["transactions", filters.month, filters] as const,
  expectedVsActual: ["expected-vs-actual"] as const,
  expectedVsActualForMonth: (month: string) =>
    ["expected-vs-actual", month] as const,
};
