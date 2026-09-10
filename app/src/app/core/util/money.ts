/** All monetary values are stored as integer cents — never floats. */

/**
 * The NestJS API serializes money as BigInt → string of integer cents ("12430").
 * Every `*.api.ts` converts those strings to `number` at the mapping boundary so
 * the rest of the app keeps working with plain numbers.
 */
export function toCents(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const n = typeof value === 'number' ? value : parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
}

export function formatCents(cents: number): string {
  const value = cents / 100;
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Signed variant for ledgers (reserve movements): "+ R$ 200,00" / "− R$ 150,00". Never red — sign + neutral tone carries the meaning. */
export function formatSignedCents(cents: number): string {
  const sign = cents < 0 ? '−' : '+';
  return `${sign} ${formatCents(Math.abs(cents))}`;
}

/** Parses free-text pt-BR currency input (physical keyboard) into integer cents. */
export function parseCentsFromText(text: string): number {
  const normalized = text.replace(/\./g, '').replace(',', '.');
  const value = parseFloat(normalized);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

/** Seeds an editable pt-BR money field from cents: "80000" → "800,00" (no grouping,
 *  so `parseCentsFromText` round-trips cleanly). "0" cents → "" for a friendlier blank. */
export function centsToInput(cents: number): string {
  if (!cents) return '';
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  });
}

/** Feeds the numeric keypad: digits fill cents right-to-left, capped at 8, no leading zeros. */
export function pushKeypadDigit(digits: string, digit: string): string {
  if (digits.length >= 8) return digits;
  return `${digits}${digit}`.replace(/^0+/, '');
}

export function popKeypadDigit(digits: string): string {
  return digits.slice(0, -1);
}

export function keypadDigitsToCents(digits: string): number {
  return digits ? parseInt(digits, 10) : 0;
}
