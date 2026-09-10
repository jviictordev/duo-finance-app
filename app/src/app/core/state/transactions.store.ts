import { inject, Injectable, signal } from '@angular/core';
import { TransactionsApi } from '../api/transactions.api';
import { NewTransaction, TransactionLine } from '../models';
import { monthKey } from '../util/relative-date';

@Injectable({ providedIn: 'root' })
export class TransactionsStore {
  private readonly api = inject(TransactionsApi);

  readonly monthTransactions = signal<TransactionLine[]>([]);
  readonly loading = signal(false);

  loadForMonth(month: string = monthKey()): void {
    this.loading.set(true);
    this.api.listForMonth(month).subscribe({
      next: (list) => {
        this.monthTransactions.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  /** Manual "novo gasto" from the + sheet. */
  addTransaction(payload: NewTransaction, onSettled?: (t: TransactionLine | null) => void): void {
    this.api.create(payload).subscribe({
      next: (created) => {
        this.prepend(created);
        onSettled?.(created);
      },
      error: () => onSettled?.(null),
    });
  }

  private prepend(tx: TransactionLine): void {
    this.monthTransactions.update((list) => (list.some((t) => t.id === tx.id) ? list : [tx, ...list]));
  }
}
