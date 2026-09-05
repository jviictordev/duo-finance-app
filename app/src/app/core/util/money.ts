/** All monetary values are stored as integer cents — never floats. */

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

/** Feeds the numeric keypad: digits fill cents right-to-left, capped at 8 digits. */
export function pushKeypadDigit(digits: string, digit: string): string {
  if (digits.length >= 8) return digits;
  return `${digits}${digit}`;
}

export function popKeypadDigit(digits: string): string {
  return digits.slice(0, -1);
}

export function keypadDigitsToCents(digits: string): number {
  return digits ? parseInt(digits, 10) : 0;
}
