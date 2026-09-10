import { FundMovementKind } from './enums';
import { UserRef } from './transaction.model';

export interface FundMovement {
  id: string;
  /** Signed: positive = aporte, negative = retirada. */
  amountCents: number;
  kind: FundMovementKind;
  note: string | null;
  createdBy: UserRef;
  occurredAt: string;
}

/** GET /api/emergency-fund */
export interface EmergencyFund {
  id: string;
  targetCents: number;
  currentCents: number;
  /** 0..1 */
  progress: number;
  movements: FundMovement[];
}

export interface NewFundMovement {
  /** Signed. Positive aporta, negativo retira. */
  amountCents: number;
  note?: string;
}
