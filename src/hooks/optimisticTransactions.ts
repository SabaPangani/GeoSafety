import type { QueryClient, QueryKey } from "@tanstack/react-query";

import type { TransactionWithCompany } from "@/lib/services/transactions";

import { queryKeys } from "./queryKeys";

/** Snapshot of every cached transactions list, keyed by its query key. */
export type TransactionsSnapshot = [
  QueryKey,
  TransactionWithCompany[] | undefined,
][];

/** Context returned by `onMutate` so `onError` can roll back. */
export interface TransactionMutationContext {
  previous: TransactionsSnapshot;
}

/**
 * Cancels in-flight transaction queries, snapshots the current cache, and
 * applies `patch` to the matching row across every cached transactions list.
 * Returns the snapshot for rollback.
 */
export async function snapshotAndPatchTransactions(
  queryClient: QueryClient,
  id: TransactionWithCompany["id"],
  patch: Partial<TransactionWithCompany>,
): Promise<TransactionsSnapshot> {
  await queryClient.cancelQueries({ queryKey: queryKeys.transactions });

  const previous = queryClient.getQueriesData<TransactionWithCompany[]>({
    queryKey: queryKeys.transactions,
  });

  queryClient.setQueriesData<TransactionWithCompany[]>(
    { queryKey: queryKeys.transactions },
    (old) => old?.map((row) => (row.id === id ? { ...row, ...patch } : row)),
  );

  return previous;
}

/** Restores a snapshot taken by `snapshotAndPatchTransactions`. */
export function rollbackTransactions(
  queryClient: QueryClient,
  snapshot: TransactionsSnapshot | undefined,
): void {
  snapshot?.forEach(([key, data]) => queryClient.setQueryData(key, data));
}

/** Invalidates both the transactions and expected-vs-actual query families. */
export function invalidateTransactionFamilies(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
  void queryClient.invalidateQueries({ queryKey: queryKeys.expectedVsActual });
}
