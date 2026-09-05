import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="empty">{{ message() }}</p>`,
  styles: [
    `
      .empty {
        margin: 0;
        padding: var(--space-4) 0;
        text-align: center;
        font-size: 14px;
        color: var(--color-neutral-500);
      }
    `,
  ],
})
export class EmptyStateComponent {
  readonly message = input.required<string>();
}
