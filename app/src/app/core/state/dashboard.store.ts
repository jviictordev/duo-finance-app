import { inject, Injectable, signal } from '@angular/core';
import { DashboardApi } from '../api/dashboard.api';
import { Dashboard } from '../models';
import { monthKey } from '../util/relative-date';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly api = inject(DashboardApi);

  readonly data = signal<Dashboard | null>(null);
  readonly loading = signal(false);

  load(month: string = monthKey()): void {
    this.loading.set(true);
    this.api.get(month).subscribe({
      next: (d) => {
        this.data.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
