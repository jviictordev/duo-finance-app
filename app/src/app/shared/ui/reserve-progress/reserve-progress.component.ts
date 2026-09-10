import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** The reserve's conic-gradient ring — now driven by the API's 0..1 `progress`. */
@Component({
  selector: 'app-reserve-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ring" [style.width.px]="size()" [style.height.px]="size()" [style.background]="gradient()">
      <div class="disc" [style.inset.px]="inset()">
        <span class="pct" [style.font-size.px]="size() * 0.22">{{ pctLabel() }}</span>
        @if (showLabels()) {
          <span class="caption">da meta</span>
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
      .pct { font-family: var(--font-heading); font-weight: 400; line-height: 1; }
      .caption { font-size: 11.5px; color: var(--color-neutral-600); margin-top: 2px; }
    `,
  ],
})
export class ReserveProgressComponent {
  /** 0..1 */
  readonly progress = input.required<number>();
  readonly size = input(212);
  readonly showLabels = input(true);

  readonly progressPct = computed(() => Math.min(100, Math.max(0, this.progress() * 100)));
  readonly inset = computed(() => Math.round(this.size() * 0.123));
  readonly pctLabel = computed(() => `${Math.round(this.progressPct())}%`);
  readonly gradient = computed(
    () => `conic-gradient(var(--color-accent) ${this.progressPct()}%, var(--color-accent-200) 0)`,
  );
}
