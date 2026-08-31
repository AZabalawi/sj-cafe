// Money is handled as integer fils (1 AED = 100 fils) everywhere it's summed
// or stored, so cart/order totals never depend on floating-point addition.
// `data/menu.ts` still authors prices as whole AED for readability — this is
// the one place that converts.

export function aedToFils(aed: number): number {
  return Math.round(aed * 100);
}

export function filsToAedLabel(fils: number): string {
  const aed = fils / 100;
  return Number.isInteger(aed) ? String(aed) : aed.toFixed(2);
}
