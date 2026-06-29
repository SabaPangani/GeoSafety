"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import { ignoreTransaction } from "@/lib/services/transactions";

import {
  invalidateTransactionFamilies,
  rollbackTransactions,
  snapshotAndPatchTransactions,
  type TransactionMutationContext,
} from "./optimisticTransactions";

/**
 * Marks a transaction as ignored. Optimistically updates the cached row, rolls
 * back on error, and invalidates both query families once settled.
 */
export function useIgnoreTransaction(): UseMutationResult<
  void,
  Error,
  string,
  TransactionMutationContext
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ignoreTransaction(id),
    onMutate: async (id) => {
      const previous = await snapshotAndPatchTransactions(queryClient, id, {
        status: "ignored",
      });
      return { previous };
    },
    onError: (_error, _id, context) => {
      rollbackTransactions(queryClient, context?.previous);
    },
    onSettled: () => {
      invalidateTransactionFamilies(queryClient);
    },
  });
}
