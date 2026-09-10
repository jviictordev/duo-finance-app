import { MonthClosingStatus } from './enums';

export interface MonthCategoryBreakdown {
  categoryId: string | null;
  name: string;
  essential: boolean;
  icon: string | null;
  spentCents: number;
}

/** GET /api/month-closing?month= — either a live OPEN preview or a frozen CLOSED snapshot. */
export interface MonthClosing {
  month: string;
  status: MonthClosingStatus;
  netIncomeCents: number;
  spentCents: number;
  leftoverCents: number;
  contributionCents: number;
  byCategory: MonthCategoryBreakdown[];
  closedBy?: { id: string; name: string } | null;
  closedAt?: string | null;
}

export interface CloseMonth {
  month: string;
  contributionCents?: number;
}
