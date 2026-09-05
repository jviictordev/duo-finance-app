import { inject, Injectable, signal } from '@angular/core';
import { TransactionsApi } from '../api/transactions.api';
import { Transaction } from '../models';

@Injectable({ providedIn: 'root' })
export class TransactionsStore {
  private readonly api = inject(TransactionsApi);

  readonly pendingReview = signal<Transaction | null>(null);
  readonly monthTransactions = signal<Transaction[]>([]);
  readonly loading = signal(false);

  loadPendingReview(): void {
    this.api.getPendingReview().subscribe((t) => this.pendingReview.set(t));
  }

  loadForPeriod(period: string): void {
    this.loading.set(true);
    this.api.listForPeriod(period).subscribe((list) => {
      this.monthTransactions.set(list);
      this.loading.set(false);
    });
  }

  confirmPendingReview(edits: Partial<Transaction>, onDone?: (t: Transaction) => void): void {
    const pending = this.pendingReview();
    if (!pending) return;
    this.api.confirm(pending.id, edits).subscribe((confirmed) => {
      this.pendingReview.set(null);
      this.monthTransactions.update((list) => [confirmed, ...list]);
      onDone?.(confirmed);
    });
  }
}
