import { Category, MonthClosing, MonthClosingStatus } from '../../models';

export const MONTH_CLOSINGS: MonthClosing[] = [
  {
    period: '2026-08',
    status: MonthClosingStatus.SURPLUS,
    totalIncomeCents: 1266877,
    totalEssentialExpenseCents: 650000,
    totalDiscretionaryExpenseCents: 250000,
    totalExpenseCents: 900000,
    balanceCents: 151877,
    previousPeriodTotalExpenseCents: 1050000,
    categoryBreakdown: [
      { category: Category.MERCADO, amountCents: 320000 },
      { category: Category.CASA, amountCents: 280000 },
      { category: Category.RESTAURANTE, amountCents: 140000 },
      { category: Category.TRANSPORTE, amountCents: 90000 },
      { category: Category.LAZER, amountCents: 45000 },
      { category: Category.SAUDE, amountCents: 25000 },
    ],
    suggestionId: 's1',
  },
  {
    period: '2026-07',
    status: MonthClosingStatus.DEFICIT,
    totalIncomeCents: 1180000,
    totalEssentialExpenseCents: 780000,
    totalDiscretionaryExpenseCents: 270000,
    totalExpenseCents: 1050000,
    balanceCents: -65000,
    previousPeriodTotalExpenseCents: 940000,
    categoryBreakdown: [
      { category: Category.CASA, amountCents: 400000 },
      { category: Category.MERCADO, amountCents: 300000 },
      { category: Category.RESTAURANTE, amountCents: 160000 },
      { category: Category.TRANSPORTE, amountCents: 100000 },
      { category: Category.LAZER, amountCents: 90000 },
    ],
    deficitForecast: {
      recommendedRecurringAccountId: 'ra5',
      note: 'R$ 650,00 é próximo do valor mensal desta conta — ajustá-la no mês que vem cobre a diferença:',
    },
  },
];
