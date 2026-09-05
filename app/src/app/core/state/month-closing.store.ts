import { computed, inject, Injectable, signal } from '@angular/core';
import { MonthClosingApi } from '../api/month-closing.api';
import { MonthClosing } from '../models';

@Injectable({ providedIn: 'root' })
export class MonthClosingStore {
  private readonly api = inject(MonthClosingApi);

  readonly closings = signal<MonthClosing[]>([]);

  /** Most recently frozen month — what the Fechamento screen opens on. */
  readonly latest = computed<MonthClosing | null>(() => this.closings()[0] ?? null);

  load(): void {
    this.api.list().subscribe((list) => this.closings.set(list));
  }
}
