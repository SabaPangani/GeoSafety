import type { ExpectedVsActualRow } from "@/lib/services/reconciliation";

const HEADER = ["კომპანია", "მოსალოდნელი", "ფაქტობრივი", "სხვაობა"] as const;

const BOM = "﻿";

function escapeField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatNumber(value: number): string {
  return value.toFixed(2);
}


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
