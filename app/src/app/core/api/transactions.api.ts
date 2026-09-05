import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class TransactionsApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  listForPeriod(period: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.base}/transactions`, { params: { period } });
  }

  getPendingReview(): Observable<Transaction | null> {
    return this.http.get<Transaction | null>(`${this.base}/transactions/pending-review`);
  }

  confirm(id: string, edits: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.base}/transactions/${id}/confirm`, edits);
  }
}
