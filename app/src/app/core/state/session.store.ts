import { computed, inject, Injectable, signal } from '@angular/core';
import { SpaceApi } from '../api/space.api';
import { AuthStore } from '../auth/auth.store';
import { Space, SpaceMember } from '../models';

/** The couple: the signed-in user plus the space and its members. Replaces the old
 *  `CURRENT_PERSON_ID` fixture and the people half of `ReferenceDataStore`. */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly spaceApi = inject(SpaceApi);
  private readonly auth = inject(AuthStore);

  readonly user = this.auth.user;
  readonly space = signal<Space | null>(null);
  private inFlight = false;

  readonly members = computed<SpaceMember[]>(() => this.space()?.members ?? []);
  readonly currentUserId = computed(() => this.user()?.id ?? '');

  readonly me = computed<SpaceMember | null>(() => {
    const id = this.currentUserId();
    return this.members().find((m) => m.userId === id) ?? null;
  });

  readonly partner = computed<SpaceMember | null>(() => {
    const id = this.currentUserId();
    return this.members().find((m) => m.userId !== id) ?? null;
  });

  memberById(userId: string | null | undefined): SpaceMember | undefined {
    if (!userId) return undefined;
    return this.members().find((m) => m.userId === userId);
  }

  /** Idempotent: fetches the space once. Every screen can call it on init without piling
   *  up `GET /space` requests. Use `reload()` to force a refresh (e.g. after a partner joins). */
  load(): void {
    if (this.space() || this.inFlight || !this.auth.hasSpace()) return;
    this.reload();
  }

  reload(): void {
    if (!this.auth.hasSpace()) return;
    this.inFlight = true;
    this.spaceApi.get().subscribe({
      next: (space) => {
        this.space.set(space);
        this.inFlight = false;
      },
      error: () => {
        this.inFlight = false;
      },
    });
  }
}
