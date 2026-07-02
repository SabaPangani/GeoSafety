"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import {
  getExpectedVsActual,
  type ExpectedVsActualRow,
} from "@/lib/services/reconciliation";

import { queryKeys } from "./queryKeys";

/**
 * Fetches expected vs. actual reconciliation rows for the given month.
 *
 * @param month First day of the target month as `"YYYY-MM-01"`.
 */
export function useExpectedVsActual(
  month: string,
): UseQueryResult<ExpectedVsActualRow[], Error> {
  return useQuery({
    queryKey: queryKeys.expectedVsActualForMonth(month),
    queryFn: () => getExpectedVsActual(month),
  });
}
