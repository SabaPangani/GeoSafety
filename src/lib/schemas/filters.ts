import { z } from "zod";

/**
 * Validation schema for the dashboard's filter/search state. Parsing raw input
 * (e.g. URL search params) through this schema applies defaults and guarantees a
 * fully-typed filter object for the transactions service.
 */
export const filtersSchema = z.object({
  status: z.enum(["all", "matched", "unmatched", "ignored"]).default("all"),
  search: z.string().trim().max(100).optional(),
  sortBy: z.enum(["entry_date", "amount"]).default("entry_date"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  month: z.string().regex(/^\d{4}-\d{2}-01$/, {
    message: 'month must be the first day of a month, e.g. "2026-06-01"',
  }),
});

/** Fully-typed, defaults-applied dashboard filter state. */
export type DashboardFilters = z.infer<typeof filtersSchema>;
