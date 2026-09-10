import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthSession, IssuedTokens, Me } from '../models';
import { API_BASE_URL } from '../api/api.config';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  register(payload: RegisterPayload): Observable<AuthSession> {
    return this.http.post<AuthSession>(`${this.base}/auth/register`, payload);
  }

  login(payload: LoginPayload): Observable<AuthSession> {
    return this.http.post<AuthSession>(`${this.base}/auth/login`, payload);
  }

  refresh(refreshToken: string): Observable<IssuedTokens> {
    return this.http.post<IssuedTokens>(`${this.base}/auth/refresh`, { refreshToken });
  }

  logout(refreshToken: string): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/logout`, { refreshToken });
  }

  me(): Observable<Me> {
    return this.http.get<Me>(`${this.base}/auth/me`);
  }
}
