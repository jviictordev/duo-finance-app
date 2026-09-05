import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowDownOutline, arrowUpOutline } from 'ionicons/icons';

import { MonthClosingStatus } from '../../core/models';
import { EmergencyFundStore } from '../../core/state/emergency-fund.store';
import { MonthClosingStore } from '../../core/state/month-closing.store';
import { RecurringAccountsStore } from '../../core/state/recurring-accounts.store';
import { SuggestionsStore } from '../../core/state/suggestions.store';
import { CATEGORY_META } from '../../core/util/category.util';
import { monthLabel } from '../../core/util/relative-date';
import { CURRENT_CYCLE } from '../../core/mock/fixtures';
import { EmptyStateComponent, MoneyAmountComponent, SuggestionCardComponent } from '../../shared/ui';

addIcons({ 'arrow-up-outline': arrowUpOutline, 'arrow-down-outline': arrowDownOutline });

@Component({
  selector: 'app-month-closing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, DecimalPipe, SuggestionCardComponent, EmptyStateComponent, MoneyAmountComponent],
  templateUrl: './month-closing.page.html',
  styleUrl: './month-closing.page.scss',
})
export class MonthClosingPage implements OnInit {
  protected readonly store = inject(MonthClosingStore);
  protected readonly suggestions = inject(SuggestionsStore);
  protected readonly emergencyFund = inject(EmergencyFundStore);
  private readonly recurringAccounts = inject(RecurringAccountsStore);

  protected readonly Status = MonthClosingStatus;
  protected readonly categoryMeta = CATEGORY_META;

  protected readonly closing = this.store.latest;
  protected readonly monthLabel = computed(() => (this.closing() ? monthLabel(this.closing()!.period) : ''));

  protected readonly variationPct = computed(() => {
    const c = this.closing();
    if (!c || c.previousPeriodTotalExpenseCents === 0) return 0;
    return ((c.totalExpenseCents - c.previousPeriodTotalExpenseCents) / c.previousPeriodTotalExpenseCents) * 100;
  });

  protected readonly maxCategoryAmount = computed(() => {
    const c = this.closing();
    if (!c) return 1;
    return Math.max(...c.categoryBreakdown.map((b) => b.amountCents), 1);
  });

  protected readonly relatedSuggestion = computed(() => {
    const c = this.closing();
    if (!c?.suggestionId) return null;
    return this.suggestions.pending().find((s) => s.id === c.suggestionId) ?? null;
  });

  protected readonly monthsCoveredAfterSuggestion = computed(() => {
    const fund = this.emergencyFund.fund();
    const suggestion = this.relatedSuggestion();
    if (!fund || !suggestion) return this.emergencyFund.monthsCovered();
    return (fund.balanceCents + suggestion.amountCents) / fund.monthlyAverageExpenseCents;
  });

  protected readonly forecastAccountName = computed(() => {
    const forecast = this.closing()?.deficitForecast;
    if (!forecast) return '';
    return this.recurringAccounts.accounts().find((a) => a.id === forecast.recommendedRecurringAccountId)?.name ?? 'uma conta fixa';
  });

  ngOnInit(): void {
    this.store.load();
    this.suggestions.loadPending();
    this.emergencyFund.load();
    this.recurringAccounts.load(CURRENT_CYCLE);
  }

  protected acceptSuggestion(id: string): void {
    this.suggestions.accept(id);
  }

  protected rejectSuggestion(id: string): void {
    this.suggestions.reject(id);
  }
}
