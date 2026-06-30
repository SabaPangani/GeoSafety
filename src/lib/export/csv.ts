import type { ExpectedVsActualRow } from "@/lib/services/reconciliation";

/** Georgian column headers for the reconciliation export. */
const HEADER = ["კომპანია", "მოსალოდნელი", "ფაქტობრივი", "სხვაობა"] as const;

/** UTF-8 BOM so Excel detects UTF-8 and renders Georgian text correctly. */
const BOM = "﻿";

/** Escapes a single field per RFC 4180: quote when it contains a comma, quote, or newline, and double embedded quotes. */
function escapeField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Formats a numeric column as a plain, machine-readable value with two decimals. */
function formatNumber(value: number): string {
  return value.toFixed(2);
}

/**
 * Builds an RFC-4180 CSV string for the expected-vs-actual reconciliation rows.
 * Prepended with a UTF-8 BOM so Excel renders Georgian text correctly.
 */
export function expectedVsActualToCsv(rows: ExpectedVsActualRow[]): string {
  const lines = [
    HEADER.map(escapeField).join(","),
    ...rows.map((row) =>
      [
        escapeField(row.company_name),
        escapeField(formatNumber(row.expected)),
        escapeField(formatNumber(row.actual)),
        escapeField(formatNumber(row.difference)),
      ].join(","),
    ),
  ];

  return BOM + lines.join("\r\n");
}
