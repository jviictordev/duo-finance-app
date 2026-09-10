import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvitationStatus, Space } from '../models';
import { API_BASE_URL } from './api.config';

export interface CreateSpacePayload {
  name?: string;
  sinceDate?: string;
}

export interface Invitation {
  id: string;
  email: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
}

/** createInvitation also returns the raw token (no e-mail transport yet). */
export interface CreatedInvitation {
  id: string;
  email: string;
  expiresAt: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class SpaceApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  get(): Observable<Space> {
    return this.http.get<Space>(`${this.base}/space`);
  }

  create(payload: CreateSpacePayload): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/space`, payload);
  }

  listInvitations(): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`${this.base}/space/invitations`);
  }

  invite(email: string): Observable<CreatedInvitation> {
    return this.http.post<CreatedInvitation>(`${this.base}/space/invitations`, { email });
  }

  revokeInvitation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/space/invitations/${id}`);
  }

  acceptInvitation(token: string): Observable<{ spaceId: string }> {
    return this.http.post<{ spaceId: string }>(`${this.base}/space/invitations/accept`, { token });
  }
}
