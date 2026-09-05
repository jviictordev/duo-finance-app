import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  barChartOutline,
  cardOutline,
  peopleOutline,
  pulseOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

import { CURRENT_CYCLE, CURRENT_PERSON_ID } from '../core/mock/fixtures';
import { EmergencyFundStore } from '../core/state/emergency-fund.store';
import { ReferenceDataStore } from '../core/state/reference-data.store';
import { TransactionsStore } from '../core/state/transactions.store';
import { relativeDayLabel } from '../core/util/relative-date';
import { MoneyAmountComponent, OriginBadgeComponent, PersonAvatarComponent, ReserveProgressComponent } from '../shared/ui';

addIcons({
  'bar-chart-outline': barChartOutline,
  'pulse-outline': pulseOutline,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  'card-outline': cardOutline,
  'people-outline': peopleOutline,
});

/**
 * Mobile: bottom tab bar (Mês/Atividade/Reserva/Fechar) + a central FAB into Confirmação de gasto.
 * Desktop: sidebar with nav pills + a persistent right column (reserve + recent activity),
 * matching the handoff's "views substituem a coluna central" pattern via the shared router-outlet.
 */
@Component({
  selector: 'app-shell-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IonIcon, DecimalPipe, ReserveProgressComponent, MoneyAmountComponent, PersonAvatarComponent, OriginBadgeComponent],
  templateUrl: './shell.page.html',
  styleUrl: './shell.page.scss',
})
export class ShellPage implements OnInit {
  private readonly router = inject(Router);
  protected readonly reference = inject(ReferenceDataStore);
  protected readonly emergencyFund = inject(EmergencyFundStore);
  protected readonly transactions = inject(TransactionsStore);

  protected readonly currentPersonId = CURRENT_PERSON_ID;

  ngOnInit(): void {
    this.reference.load();
    this.emergencyFund.load();
    this.transactions.loadForPeriod(CURRENT_CYCLE);
  }

  protected openConfirmExpense(): void {
    this.router.navigateByUrl('/confirmar-gasto');
  }

  protected currentPerson() {
    return this.reference.personById(this.currentPersonId);
  }

  protected partner() {
    return this.reference.people().find((p) => p.id !== this.currentPersonId);
  }

  protected recentActivity() {
    return this.transactions.monthTransactions().slice(0, 4);
  }
}
