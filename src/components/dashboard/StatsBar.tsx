"use client";

import { useMemo } from "react";

import type { TransactionWithCompany } from "@/lib/services/transactions";
import { formatMoney } from "@/lib/format";

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

function StatCard({
  label,
  primary,
  secondary,
  accent,
}: {
  label: string;
  primary: string;
  secondary: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-semibold ${accent}`}>{primary}</p>
      <p className="mt-0.5 text-sm text-gray-500">{secondary}</p>
    </div>
  );
}

export function StatsBar({ transactions, isLoading, isError }: StatsBarProps) {
  const stats = useMemo(
    () => summarize(transactions ?? []),
    [transactions],
  );

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
            className="h-[88px] animate-pulse rounded-xl border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total"
        primary={`${stats.total.count} tx`}
        secondary={formatMoney(stats.total.sum)}
        accent="text-gray-900"
      />
      <StatCard
        label="Matched"
        primary={`${stats.matched.count} tx`}
        secondary={formatMoney(stats.matched.sum)}
        accent="text-green-600"
      />
      <StatCard
        label="Unmatched"
        primary={`${stats.unmatched.count} tx`}
        secondary={formatMoney(stats.unmatched.sum)}
        accent="text-red-600"
      />
      <StatCard
        label="Match rate"
        primary={`${stats.matchRate.toFixed(1)}%`}
        secondary={`${stats.matched.count} of ${stats.total.count}`}
        accent="text-gray-900"
      />
    </div>
  );
}
