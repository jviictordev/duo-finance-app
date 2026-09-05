import { AmountStatus, Category } from './enums';

export interface Installment {
  current: number;
  total: number;
}

export interface RecurringAccount {
  id: string;
  name: string;
  category?: Category;
  estimatedAmountCents: number;
  confirmedAmountCents?: number;
  amountStatus: AmountStatus;
  dueDay: number;
  /** Independent of amountStatus: correcting the value doesn't mark it paid. */
  paid: boolean;
  paidAt?: string;
  payerPersonId: string;
  /** Present only for finite accounts (financed purchases). A plain recurring bill has no installments. */
  installments?: Installment;
  cycleMonth: string;
}
