import { computed, inject, Injectable, signal } from '@angular/core';
import { EmergencyFundApi } from '../api/emergency-fund.api';
import { EmergencyFund, NewFundMovement } from '../models';

@Injectable({ providedIn: 'root' })
export class EmergencyFundStore {
  private readonly api = inject(EmergencyFundApi);

  readonly fund = signal<EmergencyFund | null>(null);

  readonly currentCents = computed(() => this.fund()?.currentCents ?? 0);
  readonly targetCents = computed(() => this.fund()?.targetCents ?? 0);
  readonly progressPct = computed(() => Math.round((this.fund()?.progress ?? 0) * 100));

  load(): void {
    this.api.get().subscribe((fund) => this.fund.set(fund));
  }

  refresh(): void {
    this.load();
  }

  setTarget(targetCents: number): void {
    const previous = this.fund();
    if (previous) this.fund.set({ ...previous, targetCents });
    this.api.setTarget(targetCents).subscribe({
      next: (fund) => this.fund.set(fund),
      error: () => previous && this.fund.set(previous),
    });
  }

  /** amountCents is signed: positive aporta, negativo retira. */
  addMovement(payload: NewFundMovement, onDone?: () => void): void {
    this.api.addMovement(payload).subscribe((fund) => {
      this.fund.set(fund);
      onDone?.();
    });
  }
}
