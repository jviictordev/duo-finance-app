import { IncomeKind } from './enums';

/** One computed row from GET /api/income `sources` — breakdown already done server-side. */
export interface IncomeSourceLine {
  id: string;
  userId: string;
  label: string;
  kind: IncomeKind;
  grossCents: number;
  inssCents: number;
  irrfBaseCents: number;
  irrfCents: number;
  netCents: number;
  /** Present once the API echoes the raw inputs back (see integration-test-report #A).
   *  Until then the editor falls back to guessing from the breakdown. */
  applyInss?: boolean;
  applyIrrf?: boolean;
  dependents?: number;
}

/** GET /api/income */
export interface IncomeSummary {
  sources: IncomeSourceLine[];
  totalGrossCents: number;
  totalNetCents: number;
}

/** One entry in the PUT /api/income/sources body (replace-all for the current user). */
export interface IncomeSourceInput {
  label: string;
  kind: IncomeKind;
  grossCents: number;
  applyInss: boolean;
  applyIrrf: boolean;
  dependents: number;
}
