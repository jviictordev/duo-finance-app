import { TransactionLine } from './transaction.model';

export interface DashboardSummary {
  netIncomeCents: number;
  spentCents: number;
  leftoverCents: number;
  perDayCents: number;
  coupleSpentCents: number;
  individualSpentCents: number;
}

export interface DashboardDay {
  label: string;
  dateISO: string;
  items: TransactionLine[];
}

/** GET /api/dashboard?month= */
export interface Dashboard {
  month: string;
  summary: DashboardSummary;
  days: DashboardDay[];
}
