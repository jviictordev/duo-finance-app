import { computed, inject, Injectable, signal } from '@angular/core';
import { IncomeApi } from '../api/income.api';
import { PeopleApi } from '../api/people.api';
import { Income, Person } from '../models';
import { calcHouseholdIncome } from '../util/payroll';

/** Static-ish lookups (couple members, income) shared across features — avatars, income totals. */
@Injectable({ providedIn: 'root' })
export class ReferenceDataStore {
  private readonly peopleApi = inject(PeopleApi);
  private readonly incomeApi = inject(IncomeApi);

  readonly people = signal<Person[]>([]);
  readonly income = signal<Income[]>([]);

  readonly householdIncomeCents = computed(() => calcHouseholdIncome(this.income()));

  personById(id: string): Person | undefined {
    return this.people().find((p) => p.id === id);
  }

  load(): void {
    this.peopleApi.list().subscribe((list) => this.people.set(list));
    this.incomeApi.list().subscribe((list) => this.income.set(list));
  }
}
