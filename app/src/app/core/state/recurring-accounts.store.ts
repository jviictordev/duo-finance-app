import { inject, Injectable, signal } from '@angular/core';
import { RecurringAccountsApi } from '../api/recurring-accounts.api';
import { RecurringAccount } from '../models';

@Injectable({ providedIn: 'root' })
export class RecurringAccountsStore {
  private readonly api = inject(RecurringAccountsApi);

  readonly accounts = signal<RecurringAccount[]>([]);
  readonly loading = signal(false);

  load(cycle: string): void {
    this.loading.set(true);
    this.api.listForCycle(cycle).subscribe((list) => {
      this.accounts.set(list);
      this.loading.set(false);
    });
  }

  confirmAmount(id: string, confirmedAmountCents: number): void {
    this.api.confirmAmount(id, confirmedAmountCents).subscribe((updated) => this.replace(updated));
  }

  pay(id: string): void {
    this.api.pay(id).subscribe((updated) => this.replace(updated));
  }

  /** Manual confirmation only — the app never closes a finite plan on its own. */
  close(id: string): void {
    this.api.close(id).subscribe(() => {
      this.accounts.update((list) => list.filter((a) => a.id !== id));
    });
  }

  private replace(updated: RecurringAccount): void {
    this.accounts.update((list) => list.map((a) => (a.id === updated.id ? updated : a)));
  }
}
