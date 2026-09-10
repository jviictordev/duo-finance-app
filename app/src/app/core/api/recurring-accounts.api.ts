import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  NewRecurringAccount,
  PayRecurringAccount,
  RecurringAccountItem,
  RecurringAccountPatch,
  RecurringAccountsResponse,
} from '../models';
import { toCents } from '../util/money';
import { API_BASE_URL } from './api.config';

/**
 * `GET` items carry `remainingBalanceCents`/`progress`; `POST`/`PATCH` return a bare
 * Prisma row without them, so derive both from the installment counters as a fallback.
 */
function mapItem(dto: Record<string, unknown>): RecurringAccountItem {
  const amountCents = toCents(dto['amountCents'] as string);
  const installmentsCount = (dto['installmentsCount'] as number) ?? null;
  const installmentsPaid = (dto['installmentsPaid'] as number) ?? null;

  const derivedRemaining =
    installmentsCount != null
      ? Math.max(0, installmentsCount - (installmentsPaid ?? 0)) * amountCents
      : 0;
  const derivedProgress =
    installmentsCount && installmentsCount > 0 ? (installmentsPaid ?? 0) / installmentsCount : null;

  return {
    id: dto['id'] as string,
    label: dto['label'] as string,
    kind: dto['kind'] as RecurringAccountItem['kind'],
    amountCents,
    dueDay: dto['dueDay'] as number,
    category: (dto['category'] as RecurringAccountItem['category']) ?? null,
    account: (dto['account'] as RecurringAccountItem['account']) ?? null,
    installmentsCount,
    installmentsPaid,
    remainingBalanceCents:
      dto['remainingBalanceCents'] != null ? toCents(dto['remainingBalanceCents'] as string) : derivedRemaining,
    progress: (dto['progress'] as number | undefined) ?? derivedProgress,
  };
}

@Injectable({ providedIn: 'root' })
export class RecurringAccountsApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  list(): Observable<RecurringAccountsResponse> {
    return this.http.get<Record<string, unknown>>(`${this.base}/recurring-accounts`).pipe(
      map((res) => {
        const installments = (res['installments'] as Record<string, unknown>) ?? {};
        return {
          fixed: ((res['fixed'] as Record<string, unknown>[]) ?? []).map(mapItem),
          monthlyFixedTotalCents: toCents(res['monthlyFixedTotalCents'] as string),
          installments: {
            totalRemainingCents: toCents(installments['totalRemainingCents'] as string),
            items: ((installments['items'] as Record<string, unknown>[]) ?? []).map(mapItem),
          },
        } satisfies RecurringAccountsResponse;
      }),
    );
  }

  create(payload: NewRecurringAccount): Observable<RecurringAccountItem> {
    return this.http.post<Record<string, unknown>>(`${this.base}/recurring-accounts`, payload).pipe(map(mapItem));
  }

  update(id: string, patch: RecurringAccountPatch): Observable<RecurringAccountItem> {
    return this.http.patch<Record<string, unknown>>(`${this.base}/recurring-accounts/${id}`, patch).pipe(map(mapItem));
  }

  pay(id: string, payload: PayRecurringAccount = {}): Observable<{ transactionId: string }> {
    return this.http.post<{ transactionId: string }>(`${this.base}/recurring-accounts/${id}/pay`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/recurring-accounts/${id}`);
  }
}
