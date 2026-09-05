import { RecurringAccount } from '../models';

/** True on the account's last installment — the "pronta para encerrar" state. */
export function isReadyToClose(account: RecurringAccount): boolean {
  return !!account.installments && account.installments.current >= account.installments.total;
}

export function isInstallmentPlan(account: RecurringAccount): boolean {
  return !!account.installments;
}

export function remainingBalanceCents(account: RecurringAccount): number {
  if (!account.installments) return 0;
  const amount = account.confirmedAmountCents ?? account.estimatedAmountCents;
  const { current, total } = account.installments;
  return Math.max(0, amount * (total - current));
}
