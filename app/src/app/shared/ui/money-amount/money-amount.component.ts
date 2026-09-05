import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatCents, formatSignedCents } from '../../../core/util/money';

export type MoneyAmountSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Never renders red. Outflow/withdrawal is a "−" sign in neutral ink, inflow is "+" in sage —
 * the sign carries the meaning, not alarm color, matching the "never punitive" tone rule.
 */
@Component({
  selector: 'app-money-amount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="amount" [class]="'size-' + size()" [style.color]="color()">{{ text() }}</span>`,
  styles: [
    `
      .amount { font-family: var(--font-body); font-weight: 700; white-space: nowrap; }
      .size-sm { font-size: 13px; }
      .size-md { font-size: 15.5px; }
      .size-lg { font-family: var(--font-heading); font-weight: 400; font-size: 26px; }
      .size-xl { font-family: var(--font-heading); font-weight: 400; font-size: 34px; }
    `,
  ],
})
export class MoneyAmountComponent {
  readonly amountCents = input.required<number>();
  readonly signed = input(false);
  readonly size = input<MoneyAmountSize>('md');

  readonly text = computed(() => (this.signed() ? formatSignedCents(this.amountCents()) : formatCents(this.amountCents())));

  readonly color = computed(() => {
    if (!this.signed()) return 'inherit';
    return this.amountCents() < 0 ? 'var(--color-outflow)' : 'var(--color-inflow)';
  });
}
