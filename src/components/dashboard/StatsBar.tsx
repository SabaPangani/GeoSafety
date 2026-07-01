"use client";

import { useMemo } from "react";

import type { TransactionWithCompany } from "@/lib/services/transactions";
import { formatMoney } from "@/lib/format";
import { StatCard } from "@/components/ui";

interface StatsBarProps {
  /** The full month's transactions (unfiltered by status). */
  transactions: TransactionWithCompany[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

interface Stat {
  label: string;
  count: number;
  sum: number;
}

function summarize(transactions: TransactionWithCompany[]) {
  const total: Stat = { label: "Total", count: 0, sum: 0 };
  const matched: Stat = { label: "Matched", count: 0, sum: 0 };
  const unmatched: Stat = { label: "Unmatched", count: 0, sum: 0 };

  for (const tx of transactions) {
    total.count += 1;
    total.sum += tx.amount;
    if (tx.status === "matched") {
      matched.count += 1;
      matched.sum += tx.amount;
    } else if (tx.status === "unmatched") {
      unmatched.count += 1;
      unmatched.sum += tx.amount;
    }
  }

  const matchRate = total.count > 0 ? (matched.count / total.count) * 100 : 0;
  return { total, matched, unmatched, matchRate };
}

export function StatsBar({ transactions, isLoading, isError }: StatsBarProps) {
  const stats = useMemo(
    () => summarize(transactions ?? []),
    [transactions],
  );

  if (isError) {
    return (
      <div className="rounded-card border border-border bg-unmatched-bg p-4 text-sm text-unmatched">
        Failed to load statistics.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-23 animate-pulse rounded-card border border-border bg-surface-2"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total"
        value={
          <>
            {stats.total.count} tx
            <span className="mt-1 block text-sm font-normal text-muted">
              {formatMoney(stats.total.sum)}
            </span>
          </>
        }
      />
      <StatCard
        label="Matched"
        value={
          <>
            <span className="text-matched">{stats.matched.count} tx</span>
            <span className="mt-1 block text-sm font-normal text-muted">
              {formatMoney(stats.matched.sum)}
            </span>
          </>
        }
      />
      <StatCard
        label="Unmatched"
        value={
          <>
            <span className="text-unmatched">{stats.unmatched.count} tx</span>
            <span className="mt-1 block text-sm font-normal text-muted">
              {formatMoney(stats.unmatched.sum)}
            </span>
          </>
        }
      />
      <StatCard
        variant="hero"
        label="Match rate"
        value={
          <>
            {stats.matchRate.toFixed(1)}%
            <span className="mt-1 block text-sm font-normal text-white/80">
              {stats.matched.count} of {stats.total.count}
            </span>
          </>
        }
      />
    </div>
  );
}
