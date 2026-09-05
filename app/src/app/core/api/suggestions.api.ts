import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Suggestion, SuggestionStatus } from '../models';
import { API_BASE_URL } from './api.config';

/**
 * Every action that moves money into/out of the reserve goes through here.
 * There is no endpoint that transfers funds directly — accept/reject are the only mutations.
 */
@Injectable({ providedIn: 'root' })
export class SuggestionsApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  list(status?: SuggestionStatus): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(`${this.base}/suggestions`, { params: status ? { status } : {} });
  }

  accept(id: string): Observable<Suggestion> {
    return this.http.post<Suggestion>(`${this.base}/suggestions/${id}/accept`, {});
  }

  reject(id: string): Observable<Suggestion> {
    return this.http.post<Suggestion>(`${this.base}/suggestions/${id}/reject`, {});
  }
}
