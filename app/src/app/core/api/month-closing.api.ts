import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MonthClosing } from '../models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class MonthClosingApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  list(): Observable<MonthClosing[]> {
    return this.http.get<MonthClosing[]>(`${this.base}/month-closings`);
  }

  get(period: string): Observable<MonthClosing> {
    return this.http.get<MonthClosing>(`${this.base}/month-closings/${period}`);
  }
}
