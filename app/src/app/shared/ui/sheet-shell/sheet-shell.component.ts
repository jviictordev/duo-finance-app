import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

/**
 * Bottom sheet chrome shared by Registro/Confirmação/Detalhe: handle, 34px top radius,
 * scrim, and the 260ms cubic-bezier(.2,.8,.2,1) entrance from the handoff.
 */
@Component({
  selector: 'app-sheet-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scrim" [class.in]="entered()" (click)="dismiss.emit()"></div>
    <div class="sheet" [class.in]="entered()" (click)="$event.stopPropagation()">
      <div class="handle"></div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: block;
      }
      .scrim {
        position: absolute;
        inset: 0;
        background: rgba(26, 31, 46, 0.42);
        opacity: 0;
        transition: opacity 160ms ease;
      }
      .scrim.in { opacity: 1; }
      .sheet {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        max-height: 94%;
        overflow-y: auto;
        background: var(--color-bg);
        border-radius: var(--radius-sheet);
        box-shadow: var(--shadow-lg);
        padding: 10px var(--space-4) var(--space-6);
        transform: translateY(16px);
        opacity: 0;
        transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .sheet.in { transform: translateY(0); opacity: 1; }
      .handle {
        width: 44px;
        height: 5px;
        border-radius: var(--radius-pill);
        background: var(--color-neutral-300);
        margin: 0 auto var(--space-3);
      }
    `,
  ],
})
export class SheetShellComponent {
  readonly dismiss = output<void>();
  protected readonly entered = signal(false);

  constructor() {
    setTimeout(() => this.entered.set(true));
  }
}
