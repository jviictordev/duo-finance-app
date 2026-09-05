import { IncomeFrequency, IncomeType } from './enums';

export interface PayrollDeduction {
  name: string;
  amountCents: number;
}

export interface OtherIncomeEntry {
  name: string;
  amountCents: number;
}

/**
 * type === SALARIO runs the gross → net pipeline (INSS/IRRF) over grossAmountCents.
 * Any other type just adds fixedNetAmountCents straight to household income.
 */
export interface Income {
  id: string;
  personId: string;
  type: IncomeType;
  frequency: IncomeFrequency;
  name: string;
  grossAmountCents?: number;
  dependents?: number;
  payrollDeductions?: PayrollDeduction[];
  fixedNetAmountCents?: number;
  receivedDay: number;
}
