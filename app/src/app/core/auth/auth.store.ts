import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, firstValueFrom, map, Observable, shareReplay, tap, throwError } from 'rxjs';
import { AuthSession, AuthUser, IssuedTokens } from '../models';
import { AuthApi, LoginPayload, RegisterPayload } from './auth.api';

const ACCESS_KEY = 'duo.access';
const REFRESH_KEY = 'duo.refresh';

type AuthStatus = 'loading' | 'anon' | 'authed';

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* private mode / storage disabled — session just won't survive a reload */
  }
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly api = inject(AuthApi);

  private readonly _access = signal<string | null>(read(ACCESS_KEY));
  private readonly _refresh = signal<string | null>(read(REFRESH_KEY));

  readonly user = signal<AuthUser | null>(null);
  readonly hasSpace = signal(false);
  readonly status = signal<AuthStatus>('loading');

  readonly isAuthed = computed(() => this.status() === 'authed');

  accessToken(): string | null {
    return this._access();
  }

  refreshToken(): string | null {
    return this._refresh();
  }

  private setTokens(tokens: IssuedTokens): void {
    this._access.set(tokens.accessToken);
    this._refresh.set(tokens.refreshToken);
    write(ACCESS_KEY, tokens.accessToken);
    write(REFRESH_KEY, tokens.refreshToken);
  }

  clear(): void {
    this._access.set(null);
    this._refresh.set(null);
    write(ACCESS_KEY, null);
    write(REFRESH_KEY, null);
    this.user.set(null);
    this.hasSpace.set(false);
    this.status.set('anon');
  }

  private applySession(session: AuthSession): void {
    this.setTokens(session);
    this.user.set(session.user);
    this.status.set('authed');
  }

  /** APP_INITIALIZER — resolve the current session from the stored refresh token. */
  async bootstrap(): Promise<void> {
    if (!this._refresh()) {
      this.status.set('anon');
      return;
    }
    try {
      await this.refreshMe();
    } catch {
      // interceptor already tried a token refresh; landing here means it failed for good
      this.clear();
    }
  }

  async refreshMe(): Promise<void> {
    const me = await firstValueFrom(this.api.me());
    this.user.set({ id: me.id, name: me.name, email: me.email, avatarUrl: me.avatarUrl });
    this.hasSpace.set(me.hasSpace);
    this.status.set('authed');
  }

  async login(payload: LoginPayload): Promise<void> {
    const session = await firstValueFrom(this.api.login(payload));
    this.applySession(session);
    await this.refreshMe();
  }

  async register(payload: RegisterPayload): Promise<void> {
    const session = await firstValueFrom(this.api.register(payload));
    this.applySession(session);
    this.hasSpace.set(false);
  }

  async logout(): Promise<void> {
    const token = this._refresh();
    if (token) {
      try {
        await firstValueFrom(this.api.logout(token));
      } catch {
        /* best effort */
      }
    }
    this.clear();
  }

  // -- Refresh coordination for the interceptor -----------------------------

  private inflightRefresh: Observable<string> | null = null;

  /** Single-flight token refresh — concurrent 401s share one call. Emits the new access token. */
  refreshAccess(): Observable<string> {
    if (this.inflightRefresh) return this.inflightRefresh;

    const token = this._refresh();
    if (!token) return throwError(() => new Error('no refresh token'));

    this.inflightRefresh = this.api.refresh(token).pipe(
      tap((tokens) => this.setTokens(tokens)),
      map((tokens) => tokens.accessToken),
      finalize(() => (this.inflightRefresh = null)),
      shareReplay(1),
    );
    return this.inflightRefresh;
  }
}
