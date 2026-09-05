import {
  AmountStatus,
  EmergencyFund,
  FundMovementOrigin,
  FundMovementType,
  RecurringAccount,
  Suggestion,
  SuggestionStatus,
  Transaction,
  TransactionReviewStatus,
} from '../models';
import {
  EMERGENCY_FUND,
  INCOMES,
  MONTH_CLOSINGS,
  PENDING_REVIEW_TRANSACTION,
  PEOPLE,
  RECURRING_ACCOUNTS,
  SUGGESTIONS,
  TRANSACTIONS,
} from './fixtures';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/** In-memory mutable "database" seeded from fixtures. Lives for the SPA session only. */
export const db = {
  people: clone(PEOPLE),
  income: clone(INCOMES),
  transactions: clone(TRANSACTIONS) as Transaction[],
  pendingReview: clone(PENDING_REVIEW_TRANSACTION) as Transaction | null,
  recurringAccounts: clone(RECURRING_ACCOUNTS) as RecurringAccount[],
  emergencyFund: clone(EMERGENCY_FUND) as EmergencyFund,
  suggestions: clone(SUGGESTIONS) as Suggestion[],
  monthClosings: clone(MONTH_CLOSINGS),
};

let nextId = 1000;
const genId = (prefix: string) => `${prefix}${nextId++}`;

export function confirmPendingReview(id: string, edits: Partial<Transaction>): Transaction {
  if (!db.pendingReview || db.pendingReview.id !== id) {
    throw new Error('Lançamento pendente não encontrado.');
  }
  const confirmed: Transaction = {
    ...db.pendingReview,
    ...edits,
    reviewStatus: TransactionReviewStatus.CONFIRMED,
  };
  db.transactions.unshift(confirmed);
  db.pendingReview = null;
  return confirmed;
}

export function confirmRecurringAmount(id: string, confirmedAmountCents: number): RecurringAccount {
  const account = db.recurringAccounts.find((a) => a.id === id);
  if (!account) throw new Error('Conta não encontrada.');
  account.confirmedAmountCents = confirmedAmountCents;
  account.amountStatus = AmountStatus.CONFIRMED;
  return account;
}

export function markRecurringPaid(id: string): RecurringAccount {
  const account = db.recurringAccounts.find((a) => a.id === id);
  if (!account) throw new Error('Conta não encontrada.');
  account.paid = true;
  account.paidAt = new Date().toISOString();
  return account;
}

/** Manual confirmation that a finite installment plan has ended — removes it from the recurring list. */
export function closeRecurringAccount(id: string): void {
  const index = db.recurringAccounts.findIndex((a) => a.id === id);
  if (index === -1) throw new Error('Conta não encontrada.');
  db.recurringAccounts.splice(index, 1);
}

export function acceptSuggestion(id: string): Suggestion {
  const suggestion = db.suggestions.find((s) => s.id === id);
  if (!suggestion) throw new Error('Sugestão não encontrada.');
  suggestion.status = SuggestionStatus.CONFIRMED;
  suggestion.resolvedAt = new Date().toISOString();
  db.emergencyFund.balanceCents += suggestion.amountCents;
  db.emergencyFund.movements.unshift({
    id: genId('m'),
    type: FundMovementType.CONTRIBUTION,
    origin: FundMovementOrigin.SUGGESTION_ACCEPTED,
    amountCents: suggestion.amountCents,
    date: new Date().toISOString(),
    label: `Excedente de ${suggestion.period}`,
    relatedSuggestionId: suggestion.id,
  });
  return suggestion;
}

export function rejectSuggestion(id: string): Suggestion {
  const suggestion = db.suggestions.find((s) => s.id === id);
  if (!suggestion) throw new Error('Sugestão não encontrada.');
  suggestion.status = SuggestionStatus.REJECTED;
  suggestion.resolvedAt = new Date().toISOString();
  return suggestion;
}
