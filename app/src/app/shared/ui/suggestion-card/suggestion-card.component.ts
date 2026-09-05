import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircleOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { Suggestion, SuggestionStatus } from '../../../core/models';
import { MoneyAmountComponent } from '../money-amount/money-amount.component';

addIcons({ 'shield-checkmark-outline': shieldCheckmarkOutline, 'checkmark-circle': checkmarkCircle, 'close-circle-outline': closeCircleOutline });

/**
 * The one component every money-moving suggestion in the app renders through — the reserve
 * (or any account) never moves on its own; only a `confirm` here does. Reused for surplus
 * redirection today, ready for future suggestion kinds without changing this contract.
 */
@Component({
  selector: 'app-suggestion-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButton, IonIcon, MoneyAmountComponent, DecimalPipe],
  template: `
    <div class="card" [class.resolved]="!isPending()">
      @if (isPending()) {
        <div class="icon"><ion-icon name="shield-checkmark-outline" aria-hidden="true"></ion-icon></div>
        <div class="body">
          <p class="message">{{ suggestion().message }}</p>
          <app-money-amount [amountCents]="suggestion().amountCents" size="lg" />

          @if (showReserveProgress()) {
            <div class="progress-track">
              <div class="fill fill-before" [style.width.%]="beforePct()"></div>
              <div class="fill fill-after" [style.left.%]="beforePct()" [style.width.%]="afterPct() - beforePct()"></div>
            </div>
            <p class="progress-caption">
              Reserva vai de {{ beforePct() | number: '1.0-0' }}% para {{ afterPct() | number: '1.0-0' }}% da meta
            </p>
          }

          <div class="actions">
            <ion-button fill="clear" size="small" (click)="reject.emit(suggestion().id)">Agora não</ion-button>
            <ion-button size="small" (click)="confirm.emit(suggestion().id)">Confirmar</ion-button>
          </div>
        </div>
      } @else {
        <div class="icon resolved-icon">
          <ion-icon [name]="isConfirmed() ? 'checkmark-circle' : 'close-circle-outline'" aria-hidden="true"></ion-icon>
        </div>
        <p class="resolved-message">{{ isConfirmed() ? 'Confirmado — já está na reserva.' : 'Sugestão recusada.' }}</p>
      }
    </div>
  `,
  styles: [
    `
      .card {
        display: flex;
        gap: var(--space-3);
        background: var(--color-accent-100);
        border-radius: var(--radius-content-card);
        padding: var(--space-4);
        box-shadow: var(--shadow-sm);
        align-items: flex-start;
      }
      .card.resolved {
        align-items: center;
        background: var(--color-surface);
      }
      .icon {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-pill);
        background: var(--color-accent-200);
        color: var(--color-accent-700);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
      }
      .resolved-icon { background: transparent; font-size: 24px; color: var(--color-accent-2-600); }
      .body { flex: 1; min-width: 0; }
      .message { margin: 0 0 var(--space-2); font-size: 14.5px; color: var(--color-text); }
      .resolved-message { margin: 0; font-size: 13.5px; color: var(--color-neutral-600); }
      .progress-track {
        position: relative;
        height: 6px;
        border-radius: var(--radius-pill);
        background: var(--color-accent-200);
        margin-top: var(--space-3);
        overflow: hidden;
      }
      .fill { position: absolute; top: 0; height: 100%; }
      .fill-before { left: 0; background: var(--color-accent-500); }
      .fill-after { background: var(--color-accent-300); }
      .progress-caption { margin: 6px 0 0; font-size: 12px; color: var(--color-neutral-600); }
      .actions { display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-3); }
    `,
  ],
})
export class SuggestionCardComponent {
  readonly suggestion = input.required<Suggestion>();
  readonly showReserveProgress = input(false);
  readonly reserveGoalMonths = input(6);
  readonly reserveMonthsCoveredBefore = input(0);
  readonly reserveMonthsCoveredAfter = input(0);

  readonly confirm = output<string>();
  readonly reject = output<string>();

  readonly isPending = computed(() => this.suggestion().status === SuggestionStatus.PENDING);
  readonly isConfirmed = computed(() => this.suggestion().status === SuggestionStatus.CONFIRMED);

  readonly beforePct = computed(() => Math.min(100, (this.reserveMonthsCoveredBefore() / this.reserveGoalMonths()) * 100));
  readonly afterPct = computed(() => Math.min(100, (this.reserveMonthsCoveredAfter() / this.reserveGoalMonths()) * 100));
}
