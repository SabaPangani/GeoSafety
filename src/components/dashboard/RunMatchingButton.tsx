"use client";

import { useRunMatching } from "@/hooks/useRunMatching";
import { Button } from "@/components/ui";

export function RunMatchingButton() {
  const { mutate, isPending, isError, data, isSuccess } = useRunMatching();

  return (
    <div className="flex items-center gap-3">
      <Button onClick={() => mutate()} disabled={isPending}>
        {isPending ? "Matching…" : "Run matching"}
      </Button>
      {isSuccess && (
        <span className="text-sm text-matched">
          Matched {data} transaction{data === 1 ? "" : "s"}.
        </span>
      )}
      {isError && <span className="text-sm text-unmatched">Matching failed.</span>}
    </div>
  );
}
