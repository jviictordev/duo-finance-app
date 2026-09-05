import { Category, MonthClosingStatus } from './enums';

export interface CategoryBreakdown {
  category: Category;
  amountCents: number;
}

/**
 * On DEFICIT there is no reserve-withdrawal action — only an alert plus a
 * forecast pointing at the recurring account most likely to absorb the gap
 * next month. Nothing here ever moves money by itself.
 */
export interface DeficitForecast {
  recommendedRecurringAccountId: string;
  note: string;
}

export interface MonthClosing {
  period: string;
  status: MonthClosingStatus;
  totalIncomeCents: number;
  totalEssentialExpenseCents: number;
  totalDiscretionaryExpenseCents: number;
  totalExpenseCents: number;
  balanceCents: number;
  previousPeriodTotalExpenseCents: number;
  categoryBreakdown: CategoryBreakdown[];
  suggestionId?: string;
  deficitForecast?: DeficitForecast;
}
