import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivityStore } from '../../core/state/activity.store';
import { toCents } from '../../core/util/money';
import { relativeDayLabel } from '../../core/util/relative-date';
import { EmptyStateComponent, MoneyAmountComponent, PersonAvatarComponent } from '../../shared/ui';

/** Chronological feed straight from GET /api/activity — `payload.text` is already rendered pt-BR. */
@Component({
  selector: 'app-activity-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyAmountComponent, PersonAvatarComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <p class="text-section-label">Atividade</p>
      <h1 class="text-screen-title">Vocês dois</h1>

      @if (!store.items().length) {
        <app-empty-state message="Nenhuma atividade ainda." />
      }

      <div class="feed">
        @for (ev of store.items(); track ev.id) {
          <div class="row">
            @if (ev.actor) {
              <app-person-avatar [person]="ev.actor" [size]="32" />
            } @else {
              <div class="dot"></div>
            }
            <div class="text">
              <p class="text-list-title">
                @if (ev.actor) {
                  <strong>{{ ev.actor.name }}</strong>
                }
                {{ ev.payload.text }}
              </p>
              <p class="text-caption">{{ relativeDayLabel(ev.createdAt) }}</p>
            </div>
            @if (ev.payload.amountCents) {
              <app-money-amount [amountCents]="amount(ev.payload.amountCents)" size="sm" />
            }
          </div>
        }
      </div>

      @if (store.nextCursor()) {
        <button type="button" class="more" (click)="store.loadMore()">Mostrar mais</button>
      }
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
      .more { margin: var(--space-4) auto 0; display: block; background: var(--color-surface); border: 1px solid var(--color-divider); border-radius: var(--radius-pill); padding: 10px 20px; font-size: 13px; }
      @media (min-width: 900px) { :host { padding: var(--space-8); } }
    `,
  ],
})
export class ActivityPage implements OnInit {
  protected readonly store = inject(ActivityStore);
  protected readonly relativeDayLabel = relativeDayLabel;

  ngOnInit(): void {
    this.store.load();
  }

  protected amount(raw: string | undefined): number {
    return toCents(raw);
  }
}
