import { ActivityType } from './enums';
import { UserRef } from './transaction.model';

/** Renderable payload the API builds per event — `text` is already pt-BR. */
export interface ActivityPayload {
  text?: string;
  amountCents?: string;
  transactionId?: string;
  commentId?: string;
  movementId?: string;
  month?: string;
  target?: string;
  [key: string]: unknown;
}

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  actor: UserRef | null;
  payload: ActivityPayload;
  createdAt: string;
}

/** GET /api/activity?cursor= */
export interface ActivityFeed {
  items: ActivityEvent[];
  nextCursor: string | null;
}
