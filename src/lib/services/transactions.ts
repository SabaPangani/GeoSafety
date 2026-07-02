import type { QueryData } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type Tables = Database["public"]["Tables"];
type BankTransactionRow = Tables["bank_transactions"]["Row"];
type BankTransactionUpdate = Tables["bank_transactions"]["Update"];
type CompanyId = Tables["companies"]["Row"]["id"];

/** Columns that may be used to sort the transactions list. */
export type TransactionSortBy = keyof BankTransactionRow;

/** Status filter accepts any persisted status, or `"all"` to disable filtering. */
export type TransactionStatusFilter = BankTransactionRow["status"] | "all";

export interface GetTransactionsParams {
  /** First day of the target month as `"YYYY-MM-01"`. */
  month: string;
  status: TransactionStatusFilter;
  search: string;
  sortBy: TransactionSortBy;
  sortDir: "asc" | "desc";
}

const TRANSACTIONS_SELECT = "*, company:companies(name)" as const;

const transactionsBaseQuery = () =>
  supabase.from("bank_transactions").select(TRANSACTIONS_SELECT);

/** A transaction row joined with the name of its matched company (if any). */
export type TransactionWithCompany = QueryData<
  ReturnType<typeof transactionsBaseQuery>
>[number];

interface MonthBounds {
  /** Inclusive start of the month, `"YYYY-MM-01"`. */
  monthStart: string;
  /** Exclusive start of the next month, `"YYYY-MM-01"`. */
  monthNext: string;
}

/**
 * Derives `[monthStart, monthNext)` boundaries from a `"YYYY-MM-01"` string
 * without relying on `Date`, so it is immune to timezone drift.
 */
function getMonthBounds(month: string): MonthBounds {
  const match = /^(\d{4})-(\d{2})-01$/.exec(month);
  if (!match) {
    throw new Error(`Invalid month "${month}", expected format "YYYY-MM-01".`);
  }

  const year = Number(match[1]);
  const monthNumber = Number(match[2]);
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error(`Invalid month "${month}", month must be between 01 and 12.`);
  }

  const nextYear = monthNumber === 12 ? year + 1 : year;
  const nextMonth = monthNumber === 12 ? 1 : monthNumber + 1;
  const monthNext = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  return { monthStart: month, monthNext };
}

/**
 * Strips characters that are significant in a PostgREST `.or()` filter string
 * before the term is interpolated into one. Commas separate conditions,
 * parentheses group them, and `%`/`*`/`\` are pattern metacharacters — leaving
 * any of these in raw user input would let a search term alter the filter
 * structure rather than just the matched text.
 */
function sanitizeSearchTerm(term: string): string {
  return term.replace(/[,()%*\\]/g, "").trim();
}

export async function getTransactions({
  month,
  status,
  search,
  sortBy,
  sortDir,
}: GetTransactionsParams): Promise<TransactionWithCompany[]> {
  const { monthStart, monthNext } = getMonthBounds(month);

  let query = transactionsBaseQuery()
    .gte("entry_date", monthStart)
    .lt("entry_date", monthNext);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const term = sanitizeSearchTerm(search);
  if (term) {
    query = query.or(
      `sender_name.ilike.%${term}%,sender_inn.ilike.%${term}%`,
    );
  }

  const { data, error } = await query.order(sortBy, {
    ascending: sortDir === "asc",
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Manually links a transaction to a company: marks it matched with full
 * confidence and `match_method = "manual"`.
 */
export async function updateTransactionMatch(
  id: BankTransactionRow["id"],
  companyId: CompanyId,
): Promise<void> {
  const update: BankTransactionUpdate = {
    matched_company_id: companyId,
    match_method: "manual",
    match_confidence: 1.0,
    status: "matched",
  };

  const { error } = await supabase
    .from("bank_transactions")
    .update(update)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/** Marks a transaction as ignored so it is excluded from reconciliation. */
export async function ignoreTransaction(
  id: BankTransactionRow["id"],
): Promise<void> {
  const update: BankTransactionUpdate = { status: "ignored" };

  const { error } = await supabase
    .from("bank_transactions")
    .update(update)
    .eq("id", id);

  if (error) {
    throw error;
  }
}
