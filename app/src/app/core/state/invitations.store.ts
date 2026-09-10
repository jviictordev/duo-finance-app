import { computed, inject, Injectable, signal } from '@angular/core';
import { Invitation, SpaceApi } from '../api/space.api';
import { InvitationStatus } from '../models';

/** Space invitations — the API allows a single PENDING invite at a time, OWNER-only.
 *  No e-mail transport yet, so `createdToken` holds the raw token to show/copy. */
@Injectable({ providedIn: 'root' })
export class InvitationsStore {
  private readonly api = inject(SpaceApi);

  readonly invitations = signal<Invitation[]>([]);
  readonly createdToken = signal<string | null>(null);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  readonly pending = computed<Invitation | null>(
    () => this.invitations().find((i) => i.status === InvitationStatus.PENDING) ?? null,
  );

  load(): void {
    this.api.listInvitations().subscribe({
      next: (list) => this.invitations.set(list),
      error: () => this.invitations.set([]),
    });
  }

  invite(email: string): void {
    this.busy.set(true);
    this.error.set(null);
    this.api.invite(email).subscribe({
      next: (created) => {
        this.createdToken.set(created.token);
        this.busy.set(false);
        this.load();
      },
      error: (err: unknown) => {
        this.error.set(readMessage(err) ?? 'Não foi possível criar o convite.');
        this.busy.set(false);
      },
    });
  }

  revoke(id: string): void {
    this.busy.set(true);
    this.api.revokeInvitation(id).subscribe({
      next: () => {
        this.createdToken.set(null);
        this.busy.set(false);
        this.load();
      },
      error: (err: unknown) => {
        this.error.set(readMessage(err) ?? 'Não foi possível revogar.');
        this.busy.set(false);
      },
    });
  }

  reset(): void {
    this.createdToken.set(null);
    this.error.set(null);
  }
}

function readMessage(err: unknown): string | null {
  return (err as { error?: { message?: string } } | undefined)?.error?.message ?? null;
}
