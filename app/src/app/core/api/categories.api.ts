import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CategoryPatch, NewCategory } from '../models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class CategoriesApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  list(includeArchived = false): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`, {
      params: includeArchived ? { includeArchived: 'true' } : {},
    });
  }

  create(payload: NewCategory): Observable<Category> {
    return this.http.post<Category>(`${this.base}/categories`, payload);
  }

  update(id: string, patch: CategoryPatch): Observable<Category> {
    return this.http.patch<Category>(`${this.base}/categories/${id}`, patch);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/categories/${id}`);
  }
}
