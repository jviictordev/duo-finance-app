import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IncomeSourceInput, IncomeSummary } from '../models';
import { toCents } from '../util/money';
import { API_BASE_URL } from './api.config';

function mapSummary(dto: Record<string, unknown>): IncomeSummary {
  return {
    sources: ((dto['sources'] as Record<string, unknown>[]) ?? []).map((s) => ({
      id: s['id'] as string,
      userId: s['userId'] as string,
      label: s['label'] as string,
      kind: s['kind'] as IncomeSummary['sources'][number]['kind'],
      grossCents: toCents(s['grossCents'] as string),
      inssCents: toCents(s['inssCents'] as string),
      irrfBaseCents: toCents(s['irrfBaseCents'] as string),
      irrfCents: toCents(s['irrfCents'] as string),
      netCents: toCents(s['netCents'] as string),
      applyInss: s['applyInss'] as boolean | undefined,
      applyIrrf: s['applyIrrf'] as boolean | undefined,
      dependents: s['dependents'] as number | undefined,
    })),
    totalGrossCents: toCents(dto['totalGrossCents'] as string),
    totalNetCents: toCents(dto['totalNetCents'] as string),
  };
}

@Injectable({ providedIn: 'root' })
export class IncomeApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  getSummary(): Observable<IncomeSummary> {
    return this.http.get<Record<string, unknown>>(`${this.base}/income`).pipe(map(mapSummary));
  }

  /** Replaces every income source of the CURRENT user (the API keys off the JWT). */
  replaceSources(sources: IncomeSourceInput[]): Observable<unknown> {
    return this.http.put<unknown>(`${this.base}/income/sources`, { sources });
  }
}
