import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type ExpectedVsActualFn =
  Database["public"]["Functions"]["get_expected_vs_actual"];

type ExpectedVsActualArgs = ExpectedVsActualFn["Args"];

/** A single company's expected vs. actual reconciliation figures for a month. */
export type ExpectedVsActualRow = ExpectedVsActualFn["Returns"][number];

/**
 * Fetches expected vs. actual totals per company for the given month via the
 * `get_expected_vs_actual` routine.
 *
 * @param month First day of the target month as `"YYYY-MM-01"`.
 */
export async function getExpectedVsActual(
  month: ExpectedVsActualArgs["p_month"],
): Promise<ExpectedVsActualRow[]> {
  const { data, error } = await supabase.rpc("get_expected_vs_actual", {
    p_month: month,
  });

  if (error) {
    throw error;
  }

  return data;
}
