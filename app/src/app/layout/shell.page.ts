import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonIcon, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  barChartOutline,
  cardOutline,
  peopleOutline,
  pulseOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

import { ActivityStore } from '../core/state/activity.store';
import { EmergencyFundStore } from '../core/state/emergency-fund.store';
import { ReferenceStore } from '../core/state/reference.store';
import { SessionStore } from '../core/state/session.store';
import { toCents } from '../core/util/money';
import { MoneyAmountComponent, PersonAvatarComponent, ReserveProgressComponent } from '../shared/ui';

addIcons({
  'bar-chart-outline': barChartOutline,
  'pulse-outline': pulseOutline,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  'card-outline': cardOutline,
  'people-outline': peopleOutline,
});

/**
 * Mobile: bottom tab bar (Mês/Atividade/Reserva/Fechar) + a central FAB into Confirmação de gasto.
 * Desktop: sidebar with nav pills + a persistent right column (reserve + recent activity).
 */
@Component({
  selector: 'app-shell-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IonIcon, DecimalPipe, ReserveProgressComponent, MoneyAmountComponent, PersonAvatarComponent],
  templateUrl: './shell.page.html',
  styleUrl: './shell.page.scss',
})
export class ShellPage implements OnInit {
  private readonly modalCtrl = inject(ModalController);
  protected readonly session = inject(SessionStore);
  protected readonly reference = inject(ReferenceStore);
  protected readonly emergencyFund = inject(EmergencyFundStore);
  protected readonly activity = inject(ActivityStore);

  protected readonly recentActivity = computed(() => this.activity.items().slice(0, 4));

  ngOnInit(): void {
    this.session.load();
    this.reference.load();
    this.emergencyFund.load();
    this.activity.load();
  }

  protected amountOf(raw: string | undefined): number {
    return toCents(raw);
  }

  protected async openConfirmExpense(): Promise<void> {
    const { ConfirmExpensePage } = await import('../features/transactions/confirm-expense.page');
    const modal = await this.modalCtrl.create({
      component: ConfirmExpensePage,
      cssClass: 'confirm-sheet',
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      handle: true,
    });
    await modal.present();
  }
}
