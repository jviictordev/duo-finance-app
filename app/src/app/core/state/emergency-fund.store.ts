import { computed, inject, Injectable, signal } from '@angular/core';
import { EmergencyFundApi } from '../api/emergency-fund.api';
import { EmergencyFund } from '../models';

@Injectable({ providedIn: 'root' })
export class EmergencyFundStore {
  private readonly api = inject(EmergencyFundApi);

  readonly fund = signal<EmergencyFund | null>(null);

  readonly monthsCovered = computed(() => {
    const fund = this.fund();
    if (!fund || fund.monthlyAverageExpenseCents === 0) return 0;
    return fund.balanceCents / fund.monthlyAverageExpenseCents;
  });

  readonly goalProgressPct = computed(() => {
    const fund = this.fund();
    if (!fund || fund.goalMonths === 0) return 0;
    return Math.min(100, (this.monthsCovered() / fund.goalMonths) * 100);
  });

  load(): void {
    this.api.get().subscribe((fund) => this.fund.set(fund));
  }

  /** Called after a Suggestion is accepted elsewhere — keeps this store's balance in sync. */
  refresh(): void {
    this.load();
  }
}
