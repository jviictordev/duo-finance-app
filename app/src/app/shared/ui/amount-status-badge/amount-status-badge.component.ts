import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AmountStatus } from '../../../core/models';

/** The one place "estimado" vs "confirmado" gets its visual distinction — every recurring-account row uses it. */
@Component({
  selector: 'app-amount-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class.confirmed]="isConfirmed()">{{ label() }}</span>`,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        font-family: var(--font-body);
        font-weight: 600;
        font-size: 11px;
        letter-spacing: 0.02em;
        padding: 3px 10px;
        border-radius: var(--radius-pill);
        background: var(--color-neutral-200);
        color: var(--color-neutral-700);
        border: 1px dashed var(--color-neutral-400);
      }
      .badge.confirmed {
        background: var(--color-accent-2-100);
        color: var(--color-accent-2-700);
        border: 1px solid transparent;
      }
    `,
  ],
})
export class AmountStatusBadgeComponent {
  readonly status = input.required<AmountStatus>();

  readonly isConfirmed = computed(() => this.status() === AmountStatus.CONFIRMED);
  readonly label = computed(() => (this.isConfirmed() ? 'Confirmado' : 'Estimado'));
}
