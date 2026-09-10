import { AccountKind } from './enums';

/** GET /api/accounts (list adds `currentBalanceCents`). Cents already numeric after mapping. */
export interface Account {
  id: string;
  name: string;
  kind: AccountKind;
  openingBalanceCents: number;
  currentBalanceCents: number;
  color: string | null;
  archivedAt: string | null;
}

export interface NewAccount {
  name: string;
  kind?: AccountKind;
  openingBalanceCents?: number;
  color?: string;
}

export type AccountPatch = Partial<{
  name: string;
  kind: AccountKind;
  color: string | null;
  archived: boolean;
}>;
