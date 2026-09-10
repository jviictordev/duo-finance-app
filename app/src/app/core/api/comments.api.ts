import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionComment } from '../models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class CommentsApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  list(transactionId: string): Observable<TransactionComment[]> {
    return this.http.get<TransactionComment[]>(`${this.base}/transactions/${transactionId}/comments`);
  }

  create(transactionId: string, body: string): Observable<TransactionComment> {
    return this.http.post<TransactionComment>(`${this.base}/transactions/${transactionId}/comments`, { body });
  }

  remove(transactionId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/transactions/${transactionId}/comments/${commentId}`);
  }
}
