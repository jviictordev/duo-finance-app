import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CURRENT_CYCLE } from '../../core/mock/fixtures';
import { EmergencyFundStore } from '../../core/state/emergency-fund.store';
import { ReferenceDataStore } from '../../core/state/reference-data.store';
import { TransactionsStore } from '../../core/state/transactions.store';
import { CATEGORY_META } from '../../core/util/category.util';
import { relativeDayLabel } from '../../core/util/relative-date';
import { EmptyStateComponent, MoneyAmountComponent, PersonAvatarComponent } from '../../shared/ui';

interface FeedItem {
  id: string;
  date: string;
  personName: string | null;
  text: string;
  amountCents?: number;
}

/** Simple chronological feed — not a priority screen, kept functional for navigation. */
@Component({
  selector: 'app-activity-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyAmountComponent, PersonAvatarComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <p class="text-section-label">Atividade</p>
      <h1 class="text-screen-title">Vocês dois</h1>

      @if (!feed().length) {
        <app-empty-state message="Nenhuma atividade ainda." />
      }

      <div class="feed">
        @for (item of feed(); track item.id) {
          <div class="row">
            @if (personOf(item.personName); as person) {
              <app-person-avatar [person]="person" [size]="32" />
            } @else {
              <div class="dot"></div>
            }
            <div class="text">
              <p class="text-list-title">{{ item.text }}</p>
              <p class="text-caption">{{ relativeDayLabel(item.date) }}</p>
            </div>
            @if (item.amountCents !== undefined) {
              <app-money-amount [amountCents]="item.amountCents" size="sm" />
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; padding: var(--space-4); padding-bottom: 110px; }
      .page { max-width: 560px; margin: 0 auto; }
      .feed { display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-4); }
      .row { display: flex; align-items: center; gap: var(--space-3); background: var(--color-surface); border-radius: var(--radius-list-card); padding: var(--space-3); }
      .text { flex: 1; min-width: 0; }
      .text p { margin: 0; }
      .dot { width: 32px; height: 32px; border-radius: var(--radius-pill); background: var(--color-neutral-200); flex-shrink: 0; }
      @media (min-width: 900px) { :host { padding: var(--space-8); } }
    `,
  ],
})
export class ActivityPage implements OnInit {
  private readonly transactions = inject(TransactionsStore);
  private readonly emergencyFund = inject(EmergencyFundStore);
  protected readonly reference = inject(ReferenceDataStore);

  protected readonly relativeDayLabel = relativeDayLabel;

  protected readonly feed = computed<FeedItem[]>(() => {
    const txItems: FeedItem[] = this.transactions.monthTransactions().map((t) => ({
      id: `tx-${t.id}`,
      date: t.date,
      personName: t.loggedByPersonId,
      text: `lançou ${t.category ? CATEGORY_META[t.category].label.toLowerCase() : 'um gasto'} de ${(t.amountCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
      amountCents: undefined,
    }));
    const fundItems: FeedItem[] = (this.emergencyFund.fund()?.movements ?? []).map((m) => ({
      id: `fund-${m.id}`,
      date: m.date,
      personName: m.personId ?? null,
      text: m.label,
      amountCents: m.amountCents,
    }));
    return [...txItems, ...fundItems].sort((a, b) => (a.date < b.date ? 1 : -1));
  });

  ngOnInit(): void {
    this.transactions.loadForPeriod(CURRENT_CYCLE);
    this.emergencyFund.load();
    this.reference.load();
  }

  protected personOf(personId: string | null) {
    return personId ? this.reference.personById(personId) : undefined;
  }
}
