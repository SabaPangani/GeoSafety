"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import { runInnMatching } from "@/lib/services/matching";

import { queryKeys } from "./queryKeys";

/**
 * Runs the server-side INN matching routine. On success, both the transactions
 * and expected-vs-actual query families are invalidated so the UI reflects the
 * newly matched rows. Resolves to the number of transactions matched.
 */
export function useRunMatching(): UseMutationResult<number, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runInnMatching,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.expectedVsActual,
      });
    },
  });
}
