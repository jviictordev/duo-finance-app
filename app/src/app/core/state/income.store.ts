import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IncomeApi } from '../api/income.api';
import { IncomeSourceInput, IncomeSummary } from '../models';

@Injectable({ providedIn: 'root' })
export class IncomeStore {
  private readonly api = inject(IncomeApi);

  readonly summary = signal<IncomeSummary | null>(null);

  /** Household net income = server-computed total across both members' sources. */
  readonly householdNetCents = computed(() => this.summary()?.totalNetCents ?? 0);

  load(): void {
    this.api.getSummary().subscribe((s) => this.summary.set(s));
  }

  /** Replace-all for the current user; then reload so both members' totals refresh. */
  async replaceSources(sources: IncomeSourceInput[]): Promise<void> {
    await firstValueFrom(this.api.replaceSources(sources));
    this.load();
  }
}
