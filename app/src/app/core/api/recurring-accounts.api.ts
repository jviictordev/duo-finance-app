import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecurringAccount } from '../models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class RecurringAccountsApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  listForCycle(cycle: string): Observable<RecurringAccount[]> {
    return this.http.get<RecurringAccount[]>(`${this.base}/recurring-accounts`, { params: { cycle } });
  }

  confirmAmount(id: string, confirmedAmountCents: number): Observable<RecurringAccount> {
    return this.http.post<RecurringAccount>(`${this.base}/recurring-accounts/${id}/confirm-amount`, { confirmedAmountCents });
  }

  pay(id: string): Observable<RecurringAccount> {
    return this.http.post<RecurringAccount>(`${this.base}/recurring-accounts/${id}/pay`, {});
  }

  /** Manual confirmation that a finite installment plan has ended. */
  close(id: string): Observable<{ closed: true }> {
    return this.http.post<{ closed: true }>(`${this.base}/recurring-accounts/${id}/close`, {});
  }
}
