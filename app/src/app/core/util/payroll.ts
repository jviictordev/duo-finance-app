import { Income, IncomeType } from '../models';

/**
 * Hard-coded brackets, mirroring the design prototype. Real implementation must
 * source these from server-side config versioned by validity date (they change yearly).
 */
const INSS_BRACKETS = [
  { upTo: 151800, rate: 0.075 },
  { upTo: 279388, rate: 0.09 },
  { upTo: 419083, rate: 0.12 },
  { upTo: 815741, rate: 0.14 },
];

const IRRF_BRACKETS = [
  { upTo: 242880, rate: 0, deduction: 0 },
  { upTo: 282665, rate: 0.075, deduction: 18216 },
  { upTo: 375105, rate: 0.15, deduction: 39416 },
  { upTo: 466468, rate: 0.225, deduction: 67549 },
  { upTo: Infinity, rate: 0.275, deduction: 90873 },
];

const DEPENDENT_DEDUCTION_CENTS = 18959;

export function calcInss(grossCents: number): number {
  let total = 0;
  let lowerBound = 0;
  for (const bracket of INSS_BRACKETS) {
    const taxableInBracket = Math.max(0, Math.min(grossCents, bracket.upTo) - lowerBound);
    total += taxableInBracket * bracket.rate;
    lowerBound = bracket.upTo;
    if (grossCents <= bracket.upTo) break;
  }
  return Math.round(total);
}

export function calcIrrf(grossCents: number, inssCents: number, dependents: number): number {
  const base = Math.max(0, grossCents - inssCents - dependents * DEPENDENT_DEDUCTION_CENTS);
  const bracket = IRRF_BRACKETS.find((b) => base <= b.upTo)!;
  const irrf = base * bracket.rate - bracket.deduction;
  return Math.max(0, Math.round(irrf));
}

export interface SalaryBreakdown {
  gross: number;
  inss: number;
  irrf: number;
  otherDeductions: number;
  net: number;
}

export function calcSalaryBreakdown(income: Income): SalaryBreakdown {
  const gross = income.grossAmountCents ?? 0;
  const inss = calcInss(gross);
  const irrf = calcIrrf(gross, inss, income.dependents ?? 0);
  const otherDeductions = (income.payrollDeductions ?? []).reduce((sum, d) => sum + d.amountCents, 0);
  const net = Math.max(0, gross - inss - irrf - otherDeductions);
  return { gross, inss, irrf, otherDeductions, net };
}

/** Net contribution of a single income entry to household income, regardless of type. */
export function calcIncomeNet(income: Income): number {
  if (income.type === IncomeType.SALARIO) {
    return calcSalaryBreakdown(income).net;
  }
  return income.fixedNetAmountCents ?? 0;
}

export function calcHouseholdIncome(incomes: Income[]): number {
  return incomes.reduce((sum, income) => sum + calcIncomeNet(income), 0);
}
