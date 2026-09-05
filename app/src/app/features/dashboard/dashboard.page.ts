import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, chevronForwardOutline } from 'ionicons/icons';

import { TransactionNature } from '../../core/models';
import { CURRENT_CYCLE } from '../../core/mock/fixtures';
import { EmergencyFundStore } from '../../core/state/emergency-fund.store';
import { RecurringAccountsStore } from '../../core/state/recurring-accounts.store';
import { ReferenceDataStore } from '../../core/state/reference-data.store';
import { TransactionsStore } from '../../core/state/transactions.store';
import { CATEGORY_META } from '../../core/util/category.util';
import { monthLabel, relativeDayLabel } from '../../core/util/relative-date';
import { AvatarStackComponent, MoneyAmountComponent, OriginBadgeComponent, PersonAvatarComponent, CategoryAvatarComponent, EmptyStateComponent } from '../../shared/ui';

addIcons({ 'calendar-outline': calendarOutline, 'chevron-forward-outline': chevronForwardOutline });

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, DecimalPipe, AvatarStackComponent, MoneyAmountComponent, OriginBadgeComponent, PersonAvatarComponent, CategoryAvatarComponent, EmptyStateComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  private readonly router = inject(Router);
  protected readonly transactions = inject(TransactionsStore);
  protected readonly reference = inject(ReferenceDataStore);
  protected readonly emergencyFund = inject(EmergencyFundStore);
  protected readonly recurringAccounts = inject(RecurringAccountsStore);

  protected readonly categoryMeta = CATEGORY_META;
  protected readonly monthLabel = monthLabel(CURRENT_CYCLE);
  protected readonly relativeDayLabel = relativeDayLabel;

  protected readonly incomeCents = this.reference.householdIncomeCents;

  protected readonly expenseCents = computed(() => this.transactions.monthTransactions().reduce((sum, t) => sum + t.amountCents, 0));
  protected readonly essentialCents = computed(() =>
    this.transactions.monthTransactions().filter((t) => t.nature === TransactionNature.ESSENCIAL).reduce((sum, t) => sum + t.amountCents, 0),
  );
  protected readonly discretionaryCents = computed(() =>
    this.transactions.monthTransactions().filter((t) => t.nature === TransactionNature.SUPERFLUO).reduce((sum, t) => sum + t.amountCents, 0),
  );
  protected readonly balanceCents = computed(() => this.incomeCents() - this.expenseCents());
  protected readonly perDayCents = computed(() => Math.round(this.expenseCents() / new Date().getDate()));

  protected readonly recurringPaidCount = computed(() => this.recurringAccounts.accounts().filter((a) => a.paid).length);
  protected readonly recurringTotalCount = computed(() => this.recurringAccounts.accounts().length);
  protected readonly recurringRemainingCents = computed(() =>
    this.recurringAccounts
      .accounts()
      .filter((a) => !a.paid)
      .reduce((sum, a) => sum + (a.confirmedAmountCents ?? a.estimatedAmountCents), 0),
  );

  ngOnInit(): void {
    this.transactions.loadForPeriod(CURRENT_CYCLE);
    this.reference.load();
    this.emergencyFund.load();
    this.recurringAccounts.load(CURRENT_CYCLE);
  }

  protected openProfile(): void {
    this.router.navigateByUrl('/perfil');
  }

  protected openRecurringAccounts(): void {
    this.router.navigateByUrl('/contas-fixas');
  }
}
