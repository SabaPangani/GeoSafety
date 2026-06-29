"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import { updateTransactionMatch } from "@/lib/services/transactions";

import {
  invalidateTransactionFamilies,
  rollbackTransactions,
  snapshotAndPatchTransactions,
  type TransactionMutationContext,
} from "./optimisticTransactions";

export interface UpdateMatchVariables {
  id: string;
  companyId: string;
}

/**
 * Manually matches a transaction to a company. Optimistically marks the row as
 * matched in the cache, rolls back on error, and invalidates both query
 * families once settled.
 */
export function useUpdateMatch(): UseMutationResult<
  void,
  Error,
  UpdateMatchVariables,
  TransactionMutationContext
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, companyId }: UpdateMatchVariables) =>
      updateTransactionMatch(id, companyId),
    onMutate: async ({ id, companyId }) => {
      const previous = await snapshotAndPatchTransactions(queryClient, id, {
        matched_company_id: companyId,
        status: "matched",
        match_method: "manual",
        match_confidence: 1,
      });
      return { previous };
    },
    onError: (_error, _variables, context) => {
      rollbackTransactions(queryClient, context?.previous);
    },
    onSettled: () => {
      invalidateTransactionFamilies(queryClient);
    },
  });
}
