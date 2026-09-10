import { computed, inject, Injectable, signal } from '@angular/core';
import { RecurringAccountsApi } from '../api/recurring-accounts.api';
import {
  NewRecurringAccount,
  PayRecurringAccount,
  RecurringAccountItem,
  RecurringAccountPatch,
  RecurringAccountsResponse,
} from '../models';

@Injectable({ providedIn: 'root' })
export class RecurringAccountsStore {
  private readonly api = inject(RecurringAccountsApi);

  readonly data = signal<RecurringAccountsResponse | null>(null);
  readonly loading = signal(false);

  readonly fixed = computed<RecurringAccountItem[]>(() => this.data()?.fixed ?? []);
  readonly installments = computed<RecurringAccountItem[]>(() => this.data()?.installments.items ?? []);
  readonly all = computed<RecurringAccountItem[]>(() => [...this.fixed(), ...this.installments()]);
  readonly monthlyFixedTotalCents = computed(() => this.data()?.monthlyFixedTotalCents ?? 0);
  readonly installmentsRemainingCents = computed(() => this.data()?.installments.totalRemainingCents ?? 0);

  load(): void {
    this.loading.set(true);
    this.api.list().subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  add(payload: NewRecurringAccount, onDone?: (created: RecurringAccountItem) => void): void {
    this.api.create(payload).subscribe((created) => {
      this.load();
      onDone?.(created);
    });
  }

  /** Correcting the value — was `confirmAmount` against the mock. */
  updateAmount(id: string, amountCents: number): void {
    this.api.update(id, { amountCents }).subscribe(() => this.load());
  }

  update(id: string, patch: RecurringAccountPatch, onDone?: () => void): void {
    this.api.update(id, patch).subscribe(() => {
      this.load();
      onDone?.();
    });
  }

  pay(id: string, payload: PayRecurringAccount, onDone?: (transactionId: string) => void): void {
    this.api.pay(id, payload).subscribe((res) => {
      this.load();
      onDone?.(res.transactionId);
    });
  }

  /** Ends a finite plan / archives a bill — was `close` against the mock. */
  remove(id: string, onDone?: () => void): void {
    this.api.remove(id).subscribe(() => {
      this.load();
      onDone?.();
    });
  }
}
