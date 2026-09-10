import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, chevronForwardOutline } from 'ionicons/icons';

import { DashboardStore } from '../../core/state/dashboard.store';
import { EmergencyFundStore } from '../../core/state/emergency-fund.store';
import { RecurringAccountsStore } from '../../core/state/recurring-accounts.store';
import { SessionStore } from '../../core/state/session.store';
import { categoryLabel } from '../../core/util/category.util';
import { monthKey, monthLabel, relativeDayLabel } from '../../core/util/relative-date';
import {
  AvatarStackComponent,
  CategoryAvatarComponent,
  EmptyStateComponent,
  MoneyAmountComponent,
  PersonAvatarComponent,
} from '../../shared/ui';

addIcons({ 'calendar-outline': calendarOutline, 'chevron-forward-outline': chevronForwardOutline });

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, AvatarStackComponent, MoneyAmountComponent, PersonAvatarComponent, CategoryAvatarComponent, EmptyStateComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  private readonly router = inject(Router);
  protected readonly dashboard = inject(DashboardStore);
  protected readonly session = inject(SessionStore);
  protected readonly emergencyFund = inject(EmergencyFundStore);
  protected readonly recurringAccounts = inject(RecurringAccountsStore);

  protected readonly categoryLabel = categoryLabel;
  protected readonly relativeDayLabel = relativeDayLabel;
  protected readonly monthLabel = monthLabel(monthKey());

  protected readonly summary = computed(() => this.dashboard.data()?.summary ?? null);
  protected readonly days = computed(() => this.dashboard.data()?.days ?? []);
  protected readonly hasItems = computed(() => this.days().some((d) => d.items.length > 0));

  protected readonly incomeCents = computed(() => this.summary()?.netIncomeCents ?? 0);
  protected readonly expenseCents = computed(() => this.summary()?.spentCents ?? 0);
  protected readonly coupleCents = computed(() => this.summary()?.coupleSpentCents ?? 0);
  protected readonly individualCents = computed(() => this.summary()?.individualSpentCents ?? 0);
  protected readonly balanceCents = computed(() => this.summary()?.leftoverCents ?? 0);

  protected readonly avatarPeople = computed(() => this.session.members());

  protected readonly recurringPaidCount = computed(
    () => this.recurringAccounts.installments().filter((a) => (a.progress ?? 0) >= 1).length,
  );
  protected readonly recurringTotalCount = computed(() => this.recurringAccounts.all().length);
  protected readonly recurringMonthlyCents = computed(() => this.recurringAccounts.monthlyFixedTotalCents());

  ngOnInit(): void {
    this.dashboard.load();
    this.emergencyFund.load();
    this.recurringAccounts.load();
    this.session.load();
  }

  protected openProfile(): void {
    void this.router.navigateByUrl('/perfil');
  }

  protected openRecurringAccounts(): void {
    void this.router.navigateByUrl('/contas-fixas');
  }
}
