import { RecurringAccountItem, RecurrenceKind } from '../models';

export function isInstallmentPlan(account: RecurringAccountItem): boolean {
  return account.kind === RecurrenceKind.INSTALLMENT && !!account.installmentsCount;
}

/** True on the last installment — the "pronta para encerrar" state. */
export function isReadyToClose(account: RecurringAccountItem): boolean {
  return (
    isInstallmentPlan(account) &&
    (account.installmentsPaid ?? 0) >= (account.installmentsCount ?? 0)
  );
}

export function installmentLabel(account: RecurringAccountItem): string {
  if (!isInstallmentPlan(account)) return '';
  return `${account.installmentsPaid ?? 0} de ${account.installmentsCount} pagas`;
}

export function progressPct(account: RecurringAccountItem): number {
  return Math.round((account.progress ?? 0) * 100);
}
