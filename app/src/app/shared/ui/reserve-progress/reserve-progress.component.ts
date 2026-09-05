import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** The reserve's conic-gradient ring — 212px on the Reserva screen, smaller in the desktop side column. */
@Component({
  selector: 'app-reserve-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ring" [style.width.px]="size()" [style.height.px]="size()" [style.background]="gradient()">
      <div class="disc" [style.inset.px]="inset()">
        <span class="months" [style.font-size.px]="size() * 0.22">{{ monthsLabel() }}</span>
        @if (showLabels()) {
          <span class="caption">meses de despesa</span>
          <span class="goal">meta: {{ goalMonths() }} meses</span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .ring {
        border-radius: var(--radius-pill);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      .disc {
        position: absolute;
        border-radius: var(--radius-pill);
        background: var(--color-bg);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .months { font-family: var(--font-heading); font-weight: 400; line-height: 1; }
      .caption { font-size: 11.5px; color: var(--color-neutral-600); margin-top: 2px; }
      .goal { font-size: 11px; color: var(--color-neutral-500); }
    `,
  ],
})
export class ReserveProgressComponent {
  readonly monthsCovered = input.required<number>();
  readonly goalMonths = input.required<number>();
  readonly size = input(212);
  readonly showLabels = input(true);

  readonly progressPct = computed(() => (this.goalMonths() ? Math.min(100, (this.monthsCovered() / this.goalMonths()) * 100) : 0));
  readonly inset = computed(() => Math.round(this.size() * 0.123));
  readonly monthsLabel = computed(() => this.monthsCovered().toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }));

  readonly gradient = computed(
    () => `conic-gradient(var(--color-accent) ${this.progressPct()}%, var(--color-accent-200) 0)`,
  );
}
