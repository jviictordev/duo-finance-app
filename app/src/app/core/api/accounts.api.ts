import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Account, AccountPatch, NewAccount } from '../models';
import { toCents } from '../util/money';
import { API_BASE_URL } from './api.config';

interface AccountDto {
  id: string;
  name: string;
  kind: Account['kind'];
  openingBalanceCents: string | number;
  currentBalanceCents?: string | number;
  color: string | null;
  archivedAt: string | null;
}

function mapAccount(dto: AccountDto): Account {
  return {
    id: dto.id,
    name: dto.name,
    kind: dto.kind,
    openingBalanceCents: toCents(dto.openingBalanceCents),
    currentBalanceCents: toCents(dto.currentBalanceCents ?? dto.openingBalanceCents),
    color: dto.color,
    archivedAt: dto.archivedAt,
  };
}

@Injectable({ providedIn: 'root' })
export class AccountsApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);

  list(): Observable<Account[]> {
    return this.http.get<AccountDto[]>(`${this.base}/accounts`).pipe(map((rows) => rows.map(mapAccount)));
  }

  create(payload: NewAccount): Observable<Account> {
    return this.http.post<AccountDto>(`${this.base}/accounts`, payload).pipe(map(mapAccount));
  }

  update(id: string, patch: AccountPatch): Observable<Account> {
    return this.http.patch<AccountDto>(`${this.base}/accounts/${id}`, patch).pipe(map(mapAccount));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/accounts/${id}`);
  }
}
