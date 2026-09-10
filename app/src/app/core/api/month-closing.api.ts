import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CloseMonth, MonthClosing } from '../models';
import { toCents } from '../util/money';
import { API_BASE_URL } from './api.config';

function mapClosing(dto: Record<string, unknown>): MonthClosing {
  return {
    month: dto['month'] as string,
    status: dto['status'] as MonthClosing['status'],
    netIncomeCents: toCents(dto['netIncomeCents'] as string),
    spentCents: toCents(dto['spentCents'] as string),
    leftoverCents: toCents(dto['leftoverCents'] as string),
    contributionCents: toCents(dto['contributionCents'] as string),
    byCategory: ((dto['byCategory'] as Record<string, unknown>[]) ?? []).map((b) => ({
      categoryId: (b['categoryId'] as string) ?? null,
      name: b['name'] as string,
      essential: Boolean(b['essential']),
      icon: (b['icon'] as string) ?? null,
      spentCents: toCents(b['spentCents'] as string),
    })),
    closedBy: (dto['closedBy'] as MonthClosing['closedBy']) ?? null,
    closedAt: (dto['closedAt'] as string) ?? null,
  };
}

@Injectable({ providedIn: 'root' })
export class MonthClosingApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  get(month?: string): Observable<MonthClosing> {
    return this.http
      .get<Record<string, unknown>>(`${this.base}/month-closing`, { params: month ? { month } : {} })
      .pipe(map(mapClosing));
  }

  close(payload: CloseMonth): Observable<MonthClosing> {
    return this.http.post<Record<string, unknown>>(`${this.base}/month-closing`, payload).pipe(map(mapClosing));
  }
}
