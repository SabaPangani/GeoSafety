const gelFormatter = new Intl.NumberFormat("ka-GE", {
  style: "currency",
  currency: "GEL",
});

/** Formats a number as Georgian Lari currency. */
export function formatMoney(amount: number): string {
  return gelFormatter.format(amount);
}
