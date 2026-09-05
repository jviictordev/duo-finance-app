import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';

addIcons({ 'checkmark-circle': checkmarkCircle });

/**
 * Contained "settle" micro-interaction for closing a finished installment plan.
 * The handoff explicitly rules out decorative animation ("o tom é calmo") — no confetti,
 * just a brief card settle plus a sage seal, done in ~420ms.
 */
@Component({
  selector: 'app-celebration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
  template: `
    <div class="wrap" [class.settle]="playing()">
      <ng-content></ng-content>
      @if (playing()) {
        <div class="seal">
          <ion-icon name="checkmark-circle" aria-hidden="true"></ion-icon>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .wrap { position: relative; }
      .wrap.settle { animation: settle 420ms cubic-bezier(0.2, 0.8, 0.2, 1); }
      @keyframes settle {
        0% { transform: scale(1); }
        40% { transform: scale(1.02); }
        100% { transform: scale(1); }
      }
      .seal {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        color: var(--color-accent-2-600);
        font-size: 22px;
        opacity: 0;
        animation: seal-in 420ms ease forwards;
      }
      @keyframes seal-in {
        0% { opacity: 0; transform: scale(0.7); }
        50% { opacity: 1; transform: scale(1.05); }
        100% { opacity: 1; transform: scale(1); }
      }
    `,
  ],
})
export class CelebrationComponent {
  readonly active = input(false);
  readonly settled = output<void>();

  protected readonly playing = signal(false);

  constructor() {
    effect(() => {
      if (this.active()) {
        this.playing.set(true);
        setTimeout(() => {
          this.playing.set(false);
          this.settled.emit();
        }, 420);
      }
    });
  }
}
