import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { IonButton, IonIcon, IonInput, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmark, pencilOutline } from 'ionicons/icons';

import { RecurringAccount } from '../../core/models';
import { RecurringAccountsStore } from '../../core/state/recurring-accounts.store';
import { ReferenceDataStore } from '../../core/state/reference-data.store';
import { CURRENT_CYCLE } from '../../core/mock/fixtures';
import { formatCents, parseCentsFromText } from '../../core/util/money';
import { isReadyToClose, remainingBalanceCents } from '../../core/util/recurring-account.util';
import { AmountStatusBadgeComponent, CelebrationComponent, EmptyStateComponent, MoneyAmountComponent, PersonAvatarComponent } from '../../shared/ui';

addIcons({ 'pencil-outline': pencilOutline, checkmark });

@Component({
  selector: 'app-recurring-accounts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButton, IonIcon, IonInput, AmountStatusBadgeComponent, MoneyAmountComponent, PersonAvatarComponent, CelebrationComponent, EmptyStateComponent],
  templateUrl: './recurring-accounts.page.html',
  styleUrl: './recurring-accounts.page.scss',
})
export class RecurringAccountsPage implements OnInit {
  protected readonly store = inject(RecurringAccountsStore);
  protected readonly reference = inject(ReferenceDataStore);
  private readonly toast = inject(ToastController);

  protected readonly editingId = signal<string | null>(null);
  protected readonly editValue = signal('');
  protected readonly celebratingId = signal<string | null>(null);

  protected readonly isReadyToClose = isReadyToClose;
  protected readonly remainingBalanceCents = remainingBalanceCents;

  protected readonly displayAmount = (a: RecurringAccount) => a.confirmedAmountCents ?? a.estimatedAmountCents;

  protected readonly totalCents = computed(() => this.store.accounts().reduce((sum, a) => sum + this.displayAmount(a), 0));
  protected readonly paidCents = computed(() =>
    this.store.accounts().filter((a) => a.paid).reduce((sum, a) => sum + this.displayAmount(a), 0),
  );
  protected readonly remainingCents = computed(() => this.totalCents() - this.paidCents());
  protected readonly paidCount = computed(() => this.store.accounts().filter((a) => a.paid).length);
  protected readonly progressPct = computed(() => (this.totalCents() ? (this.paidCents() / this.totalCents()) * 100 : 0));

  ngOnInit(): void {
    this.store.load(CURRENT_CYCLE);
    this.reference.load();
  }

  protected startEdit(account: RecurringAccount): void {
    this.editingId.set(account.id);
    this.editValue.set(formatCents(this.displayAmount(account)));
  }

  protected saveEdit(account: RecurringAccount): void {
    this.store.confirmAmount(account.id, parseCentsFromText(this.editValue()));
    this.editingId.set(null);
  }

  protected pay(account: RecurringAccount): void {
    this.store.pay(account.id);
  }

  /** Plays the settle animation first; only calls close() — the one action that removes the account — once it finishes. */
  protected confirmClose(account: RecurringAccount): void {
    this.celebratingId.set(account.id);
  }

  protected async onCelebrationSettled(account: RecurringAccount): Promise<void> {
    this.store.close(account.id);
    this.celebratingId.set(null);
    const toast = await this.toast.create({
      message: `Acabou. Última parcela de ${account.name}.`,
      duration: 2800,
      position: 'bottom',
      cssClass: 'app-toast',
    });
    await toast.present();
  }
}
