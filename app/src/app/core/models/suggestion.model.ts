import { SuggestionKind, SuggestionStatus } from './enums';

/**
 * Every action that moves money into/out of the reserve (beyond the automatic
 * monthly contribution) is represented as a Suggestion. The app never executes
 * a transfer on its own — only accepting a Suggestion creates a FundMovement.
 */
export interface Suggestion {
  id: string;
  kind: SuggestionKind;
  status: SuggestionStatus;
  amountCents: number;
  period: string;
  message: string;
  createdAt: string;
  resolvedAt?: string;
}
