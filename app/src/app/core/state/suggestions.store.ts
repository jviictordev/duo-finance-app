import { inject, Injectable, signal } from '@angular/core';
import { SuggestionsApi } from '../api/suggestions.api';
import { Suggestion, SuggestionStatus } from '../models';
import { EmergencyFundStore } from './emergency-fund.store';

@Injectable({ providedIn: 'root' })
export class SuggestionsStore {
  private readonly api = inject(SuggestionsApi);
  private readonly emergencyFund = inject(EmergencyFundStore);

  readonly pending = signal<Suggestion[]>([]);

  loadPending(): void {
    this.api.list(SuggestionStatus.PENDING).subscribe((list) => this.pending.set(list));
  }

  accept(id: string, onDone?: (s: Suggestion) => void): void {
    this.api.accept(id).subscribe((updated) => {
      this.pending.update((list) => list.filter((s) => s.id !== id));
      this.emergencyFund.refresh();
      onDone?.(updated);
    });
  }

  reject(id: string, onDone?: (s: Suggestion) => void): void {
    this.api.reject(id).subscribe((updated) => {
      this.pending.update((list) => list.filter((s) => s.id !== id));
      onDone?.(updated);
    });
  }
}
