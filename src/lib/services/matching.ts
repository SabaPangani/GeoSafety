import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

/** Number of transactions matched by the INN routine. */
type MatchedCount =
  Database["public"]["Functions"]["match_transactions_by_inn"]["Returns"];

/**
 * Runs the server-side `match_transactions_by_inn` routine, which links every
 * unmatched transaction whose `sender_inn` equals a company `tax_id`.
 * Returns the number of transactions that were matched.
 */
export async function runInnMatching(): Promise<MatchedCount> {
  const { data, error } = await supabase.rpc("match_transactions_by_inn");

  if (error) {
    throw error;
  }

  return data;
}
