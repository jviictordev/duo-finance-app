import { EmergencyFund, FundMovementOrigin, FundMovementType } from '../../models';

export const EMERGENCY_FUND: EmergencyFund = {
  balanceCents: 1840000,
  monthlyAverageExpenseCents: 780000,
  goalMonths: 6,
  contributionPct: 17,
  movements: [
    {
      id: 'm1',
      type: FundMovementType.CONTRIBUTION,
      origin: FundMovementOrigin.AUTO_CONTRIBUTION,
      amountCents: 215000,
      date: '2026-09-01T00:05:00-03:00',
      label: 'Aporte automático de setembro',
    },
    {
      id: 'm2',
      type: FundMovementType.CONTRIBUTION,
      origin: FundMovementOrigin.SUGGESTION_ACCEPTED,
      amountCents: 98000,
      date: '2026-08-02T19:20:00-03:00',
      personId: 'p2',
      label: 'Excedente de julho',
      relatedSuggestionId: 's0',
    },
    {
      id: 'm3',
      type: FundMovementType.CONTRIBUTION,
      origin: FundMovementOrigin.AUTO_CONTRIBUTION,
      amountCents: 210000,
      date: '2026-08-01T00:05:00-03:00',
      label: 'Aporte automático de agosto',
    },
    {
      id: 'm4',
      type: FundMovementType.CONTRIBUTION,
      origin: FundMovementOrigin.AUTO_CONTRIBUTION,
      amountCents: 205000,
      date: '2026-07-01T00:05:00-03:00',
      label: 'Aporte automático de julho',
    },
  ],
};
