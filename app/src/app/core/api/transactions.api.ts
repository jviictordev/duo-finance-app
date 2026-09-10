import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  NewTransaction,
  NewTransfer,
  TransactionDetail,
  TransactionLine,
  TransactionListPage,
  TransactionPatch,
} from '../models';
import { toCents } from '../util/money';
import { API_BASE_URL } from './api.config';
import { mapTransactionLine } from './transaction.mapper';

export interface TransactionQuery {
  month?: string;
  from?: string;
  to?: string;
  accountId?: string;
  categoryId?: string;
  cursor?: string;
  take?: number;
}

function mapDetail(dto: Record<string, unknown>): TransactionDetail {
  const line = mapTransactionLine(dto);
  const plan = dto['installmentPlan'] as Record<string, unknown> | null;
  return {
    ...line,
    owner: (dto['owner'] as TransactionDetail['owner']) ?? null,
    installmentPlan: plan
      ? {
          id: plan['id'] as string,
          totalCents: toCents(plan['totalCents'] as string),
          installmentsCount: plan['installmentsCount'] as number,
          firstDueDate: plan['firstDueDate'] as string,
        }
      : null,
    attachment: (dto['attachment'] as TransactionDetail['attachment']) ?? null,
    comments: ((dto['comments'] as Record<string, unknown>[]) ?? []).map((c) => ({
      id: c['id'] as string,
      body: c['body'] as string,
      author: c['author'] as TransactionDetail['comments'][number]['author'],
      createdAt: c['createdAt'] as string,
    })),
  };
}

@Injectable({ providedIn: 'root' })
export class TransactionsApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  list(query: TransactionQuery = {}): Observable<TransactionListPage> {
    const params: Record<string, string> = {};
    for (const [k, v] of Object.entries(query)) {
      if (v != null && v !== '') params[k] = String(v);
    }
    return this.http.get<{ items: Record<string, unknown>[]; nextCursor: string | null }>(`${this.base}/transactions`, { params }).pipe(
      map((res) => ({ items: res.items.map(mapTransactionLine), nextCursor: res.nextCursor })),
    );
  }

  listForMonth(month: string): Observable<TransactionLine[]> {
    return this.list({ month, take: 100 }).pipe(map((page) => page.items));
  }

  detail(id: string): Observable<TransactionDetail> {
    return this.http.get<Record<string, unknown>>(`${this.base}/transactions/${id}`).pipe(map(mapDetail));
  }

  create(payload: NewTransaction): Observable<TransactionDetail> {
    return this.http.post<Record<string, unknown>>(`${this.base}/transactions`, payload).pipe(map(mapDetail));
  }

  update(id: string, patch: TransactionPatch): Observable<TransactionDetail> {
    return this.http.patch<Record<string, unknown>>(`${this.base}/transactions/${id}`, patch).pipe(map(mapDetail));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/transactions/${id}`);
  }

  transfer(payload: NewTransfer): Observable<{ outId: string; inId: string }> {
    return this.http.post<{ outId: string; inId: string }>(`${this.base}/transactions/transfer`, payload);
  }
}
