import { CategoryRef } from './category.model';
import { RecurrenceKind } from './enums';
import { AccountRef } from './transaction.model';

/** One item from GET /api/recurring-accounts (`fixed[]` or `installments.items[]`). */
export interface RecurringAccountItem {
  id: string;
  label: string;
  kind: RecurrenceKind;
  amountCents: number;
  dueDay: number;
  category: CategoryRef | null;
  account: AccountRef | null;
  installmentsCount: number | null;
  installmentsPaid: number | null;
  remainingBalanceCents: number;
  progress: number | null;
}

/** GET /api/recurring-accounts */
export interface RecurringAccountsResponse {
  fixed: RecurringAccountItem[];
  monthlyFixedTotalCents: number;
  installments: {
    totalRemainingCents: number;
    items: RecurringAccountItem[];
  };
}

export interface NewRecurringAccount {
  label: string;
  kind?: RecurrenceKind;
  amountCents: number;
  dueDay: number;
  accountId?: string;
  categoryId?: string;
  installmentsCount?: number;
  installmentsPaid?: number;
  startDate?: string;
}

export type RecurringAccountPatch = Partial<{
  label: string;
  amountCents: number;
  dueDay: number;
  accountId: string | null;
  categoryId: string | null;
  installmentsPaid: number;
  archived: boolean;
}>;

export interface PayRecurringAccount {
  amountCents?: number;
  occurredAt?: string;
  accountId?: string;
}
