import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { createOutline, globeOutline, logoWhatsapp } from 'ionicons/icons';
import { TransactionOrigin } from '../../../core/models';

addIcons({ 'logo-whatsapp': logoWhatsapp, 'globe-outline': globeOutline, 'create-outline': createOutline });

const CONFIG: Record<TransactionOrigin, { label: string; icon: string }> = {
  [TransactionOrigin.WHATSAPP]: { label: 'WhatsApp', icon: 'logo-whatsapp' },
  [TransactionOrigin.WEB]: { label: 'Web', icon: 'globe-outline' },
  [TransactionOrigin.MANUAL]: { label: 'Manual', icon: 'create-outline' },
};

@Component({
  selector: 'app-origin-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
  template: `
    <span class="origin">
      <ion-icon [name]="config().icon" aria-hidden="true"></ion-icon>
      {{ config().label }}
    </span>
  `,
  styles: [
    `
      .origin {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 11.5px;
        color: var(--color-neutral-600);
      }
      ion-icon { font-size: 13px; }
    `,
  ],
})
export class OriginBadgeComponent {
  readonly origin = input.required<TransactionOrigin>();
  readonly config = computed(() => CONFIG[this.origin()]);
}
