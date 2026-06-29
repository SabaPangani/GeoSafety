"use client";

import { useRunMatching } from "@/hooks/useRunMatching";

export function RunMatchingButton() {
  const { mutate, isPending, isError, data, isSuccess } = useRunMatching();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => mutate()}
        disabled={isPending}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Matching…" : "Run matching"}
      </button>
      {isSuccess && (
        <span className="text-sm text-green-600">
          Matched {data} transaction{data === 1 ? "" : "s"}.
        </span>
      )}
      {isError && (
        <span className="text-sm text-red-600">Matching failed.</span>
      )}
    </div>
  );
}
