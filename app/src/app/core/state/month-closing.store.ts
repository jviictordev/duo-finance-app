import { computed, inject, Injectable, signal } from '@angular/core';
import { MonthClosingApi } from '../api/month-closing.api';
import { MonthClosing, MonthClosingStatus } from '../models';
import { monthKey, shiftMonthKey } from '../util/relative-date';

@Injectable({ providedIn: 'root' })
export class MonthClosingStore {
  private readonly api = inject(MonthClosingApi);

  /** The month currently on screen — defaults to last month (the one you'd close). */
  readonly period = signal<string>(shiftMonthKey(monthKey(), -1));
  readonly closing = signal<MonthClosing | null>(null);
  readonly loading = signal(false);

  readonly isClosed = computed(() => this.closing()?.status === MonthClosingStatus.CLOSED);
  readonly canClose = computed(() => {
    const c = this.closing();
    return !!c && c.status === MonthClosingStatus.OPEN && c.month < monthKey();
  });

  load(period = this.period()): void {
    this.period.set(period);
    this.loading.set(true);
    this.api.get(period).subscribe({
      next: (c) => {
        this.closing.set(c);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  step(delta: number): void {
    this.load(shiftMonthKey(this.period(), delta));
  }

  close(contributionCents?: number, onDone?: () => void): void {
    const month = this.period();
    this.api.close({ month, contributionCents }).subscribe((c) => {
      this.closing.set(c);
      onDone?.();
    });
  }
}
