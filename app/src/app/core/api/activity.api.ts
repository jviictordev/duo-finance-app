import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityFeed } from '../models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class ActivityApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  feed(cursor?: string): Observable<ActivityFeed> {
    return this.http.get<ActivityFeed>(`${this.base}/activity`, { params: cursor ? { cursor } : {} });
  }
}
