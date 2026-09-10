import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Dashboard } from '../models';
import { toCents } from '../util/money';
import { API_BASE_URL } from './api.config';
import { mapTransactionLine } from './transaction.mapper';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  get(month?: string): Observable<Dashboard> {
    return this.http
      .get<Record<string, unknown>>(`${this.base}/dashboard`, { params: month ? { month } : {} })
      .pipe(
        map((res) => {
          const s = (res['summary'] as Record<string, unknown>) ?? {};
          return {
            month: res['month'] as string,
            summary: {
              netIncomeCents: toCents(s['netIncomeCents'] as string),
              spentCents: toCents(s['spentCents'] as string),
              leftoverCents: toCents(s['leftoverCents'] as string),
              perDayCents: toCents(s['perDayCents'] as string),
              coupleSpentCents: toCents(s['coupleSpentCents'] as string),
              individualSpentCents: toCents(s['individualSpentCents'] as string),
            },
            days: ((res['days'] as Record<string, unknown>[]) ?? []).map((d) => ({
              label: d['label'] as string,
              dateISO: d['dateISO'] as string,
              items: ((d['items'] as Record<string, unknown>[]) ?? []).map(mapTransactionLine),
            })),
          } satisfies Dashboard;
        }),
      );
  }
}
