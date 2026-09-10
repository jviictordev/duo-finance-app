import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EmergencyFund, NewFundMovement } from '../models';
import { toCents } from '../util/money';
import { API_BASE_URL } from './api.config';

function mapFund(dto: Record<string, unknown>): EmergencyFund {
  return {
    id: dto['id'] as string,
    targetCents: toCents(dto['targetCents'] as string),
    currentCents: toCents(dto['currentCents'] as string),
    progress: (dto['progress'] as number) ?? 0,
    movements: ((dto['movements'] as Record<string, unknown>[]) ?? []).map((m) => ({
      id: m['id'] as string,
      amountCents: toCents(m['amountCents'] as string),
      kind: m['kind'] as EmergencyFund['movements'][number]['kind'],
      note: (m['note'] as string) ?? null,
      createdBy: m['createdBy'] as EmergencyFund['movements'][number]['createdBy'],
      occurredAt: m['occurredAt'] as string,
    })),
  };
}

@Injectable({ providedIn: 'root' })
export class EmergencyFundApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  get(): Observable<EmergencyFund> {
    return this.http.get<Record<string, unknown>>(`${this.base}/emergency-fund`).pipe(map(mapFund));
  }

  setTarget(targetCents: number): Observable<EmergencyFund> {
    return this.http.patch<Record<string, unknown>>(`${this.base}/emergency-fund`, { targetCents }).pipe(map(mapFund));
  }

  addMovement(payload: NewFundMovement): Observable<EmergencyFund> {
    return this.http
      .post<Record<string, unknown>>(`${this.base}/emergency-fund/movements`, payload)
      .pipe(map(mapFund));
  }
}
