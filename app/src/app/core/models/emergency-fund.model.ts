import { FundMovementOrigin, FundMovementType } from './enums';

export interface FundMovement {
  id: string;
  type: FundMovementType;
  origin: FundMovementOrigin;
  amountCents: number;
  date: string;
  personId?: string;
  label: string;
  relatedSuggestionId?: string;
}

export interface EmergencyFund {
  balanceCents: number;
  monthlyAverageExpenseCents: number;
  goalMonths: number;
  contributionPct: number;
  movements: FundMovement[];
}
