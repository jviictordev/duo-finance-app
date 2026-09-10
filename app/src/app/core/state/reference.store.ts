import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AccountsApi } from '../api/accounts.api';
import { CategoriesApi } from '../api/categories.api';
import { Account, Category, CategoryKind, NewAccount } from '../models';

/** Space-scoped lookups shared across features: accounts and categories. */
@Injectable({ providedIn: 'root' })
export class ReferenceStore {
  private readonly accountsApi = inject(AccountsApi);
  private readonly categoriesApi = inject(CategoriesApi);

  readonly accounts = signal<Account[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loaded = signal(false);

  readonly activeAccounts = computed(() => this.accounts().filter((a) => !a.archivedAt));
  readonly expenseCategories = computed(() =>
    this.categories().filter((c) => c.kind === CategoryKind.EXPENSE && !c.archivedAt),
  );
  readonly defaultAccount = computed<Account | null>(() => this.activeAccounts()[0] ?? null);

  accountById(id: string | null | undefined): Account | undefined {
    return id ? this.accounts().find((a) => a.id === id) : undefined;
  }

  categoryById(id: string | null | undefined): Category | undefined {
    return id ? this.categories().find((c) => c.id === id) : undefined;
  }

  load(): void {
    this.accountsApi.list().subscribe((list) => this.accounts.set(list));
    this.categoriesApi.list().subscribe((list) => {
      this.categories.set(list);
      this.loaded.set(true);
    });
  }

  reloadAccounts(): void {
    this.accountsApi.list().subscribe((list) => this.accounts.set(list));
  }

  createAccount(payload: NewAccount): Observable<Account> {
    return this.accountsApi.create(payload).pipe(
      tap((account) => this.accounts.update((list) => [...list, account])),
    );
  }
}
