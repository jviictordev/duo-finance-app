import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

import { MonthCategoryBreakdown } from '../../core/models';
import { MonthClosingStore } from '../../core/state/month-closing.store';
import { categoryColorVar } from '../../core/util/category.util';
import { monthKey, monthLabel } from '../../core/util/relative-date';
import { EmptyStateComponent, MoneyAmountComponent } from '../../shared/ui';

addIcons({ 'chevron-back-outline': chevronBackOutline, 'chevron-forward-outline': chevronForwardOutline });

@Component({
  selector: 'app-month-closing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, EmptyStateComponent, MoneyAmountComponent],
  templateUrl: './month-closing.page.html',
  styleUrl: './month-closing.page.scss',
})
export class MonthClosingPage implements OnInit {
  protected readonly store = inject(MonthClosingStore);

  protected readonly closing = this.store.closing;
  protected readonly monthLabel = computed(() => monthLabel(this.store.period()));
  protected readonly submitting = signal(false);

  /** Don't page past the current month — nothing to see and nothing to close there. */
  protected readonly atLatest = computed(() => this.store.period() >= monthKey());

  protected readonly isDeficit = computed(() => (this.closing()?.leftoverCents ?? 0) < 0);

  protected readonly sortedCategories = computed<MonthCategoryBreakdown[]>(() =>
    [...(this.closing()?.byCategory ?? [])].sort((a, b) => b.spentCents - a.spentCents),
  );

  private readonly maxCategoryAmount = computed(() =>
    Math.max(1, ...this.sortedCategories().map((b) => b.spentCents)),
  );

  ngOnInit(): void {
    this.store.load();
  }

  protected barPct(cents: number): number {
    return Math.round((cents / this.maxCategoryAmount()) * 100);
  }

  protected catColor(b: MonthCategoryBreakdown): string {
    return categoryColorVar({ id: b.categoryId ?? b.name, name: b.name });
  }

  protected close(): void {
    this.submitting.set(true);
    this.store.close(undefined, () => this.submitting.set(false));
  }
}
