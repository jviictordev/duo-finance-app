import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { IonButton, IonIcon, IonInput, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, checkmark, closeOutline, pencilOutline } from 'ionicons/icons';

import { RecurrenceKind, RecurringAccountItem } from '../../core/models';
import { RecurringAccountsStore } from '../../core/state/recurring-accounts.store';
import { ReferenceStore } from '../../core/state/reference.store';
import { formatCents, parseCentsFromText } from '../../core/util/money';
import { isReadyToClose } from '../../core/util/recurring-account.util';
import { CelebrationComponent, EmptyStateComponent, MoneyAmountComponent } from '../../shared/ui';

addIcons({ 'pencil-outline': pencilOutline, checkmark, 'add-outline': addOutline, 'close-outline': closeOutline });

@Component({
  selector: 'app-recurring-accounts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButton, IonIcon, IonInput, MoneyAmountComponent, CelebrationComponent, EmptyStateComponent],
  templateUrl: './recurring-accounts.page.html',
  styleUrl: './recurring-accounts.page.scss',
})
export class RecurringAccountsPage implements OnInit {
  protected readonly store = inject(RecurringAccountsStore);
  protected readonly reference = inject(ReferenceStore);
  private readonly toast = inject(ToastController);

  protected readonly isReadyToClose = isReadyToClose;
  protected readonly formatCents = formatCents;

  protected readonly editingId = signal<string | null>(null);
  protected readonly editValue = signal('');
  protected readonly celebratingId = signal<string | null>(null);

  // -- "Nova conta fixa" form ------------------------------------------------
  protected readonly formOpen = signal(false);
  protected readonly submitting = signal(false);
  protected readonly draftName = signal('');
  protected readonly draftAmount = signal('');
  protected readonly draftCategoryId = signal('');
  protected readonly draftAccountId = signal('');
  protected readonly draftDueDay = signal(5);
  protected readonly draftInstallments = signal(false);
  protected readonly draftInstPaid = signal(0);
  protected readonly draftInstTotal = signal(12);

  protected readonly canSubmit = computed(
    () => this.draftName().trim().length > 0 && parseCentsFromText(this.draftAmount()) > 0 && !this.submitting(),
  );

  constructor() {
    effect(() => {
      const acc = this.reference.defaultAccount();
      if (acc && !this.draftAccountId()) this.draftAccountId.set(acc.id);
    });
  }

  ngOnInit(): void {
    this.store.load();
    this.reference.load();
  }

  protected toggleForm(): void {
    this.formOpen.update((open) => !open);
  }

  protected clampDueDay(delta: number): void {
    this.draftDueDay.update((d) => Math.max(1, Math.min(28, d + delta)));
  }

  protected clampInst(which: 'paid' | 'total', delta: number): void {
    if (which === 'paid') {
      this.draftInstPaid.update((n) => Math.max(0, Math.min(this.draftInstTotal(), n + delta)));
    } else {
      this.draftInstTotal.update((n) => Math.max(2, Math.min(120, n + delta)));
      if (this.draftInstPaid() > this.draftInstTotal()) this.draftInstPaid.set(this.draftInstTotal());
    }
  }

  protected submitForm(): void {
    if (!this.canSubmit()) return;
    this.submitting.set(true);
    const isInst = this.draftInstallments();
    this.store.add(
      {
        label: this.draftName().trim(),
        kind: isInst ? RecurrenceKind.INSTALLMENT : RecurrenceKind.FIXED,
        amountCents: parseCentsFromText(this.draftAmount()),
        dueDay: this.draftDueDay(),
        accountId: this.draftAccountId() || undefined,
        categoryId: this.draftCategoryId() || undefined,
        installmentsCount: isInst ? this.draftInstTotal() : undefined,
        installmentsPaid: isInst ? this.draftInstPaid() : undefined,
      },
      (created) => {
        this.submitting.set(false);
        this.resetForm();
        void this.notify(`${created.label} entrou nas contas fixas.`);
      },
    );
  }

  private resetForm(): void {
    this.formOpen.set(false);
    this.draftName.set('');
    this.draftAmount.set('');
    this.draftCategoryId.set('');
    this.draftDueDay.set(5);
    this.draftInstallments.set(false);
    this.draftInstPaid.set(0);
    this.draftInstTotal.set(12);
  }

  // -----------------------------------------------------------------------

  protected startEdit(account: RecurringAccountItem): void {
    this.editingId.set(account.id);
    this.editValue.set(formatCents(account.amountCents));
  }

  protected saveEdit(account: RecurringAccountItem): void {
    this.store.updateAmount(account.id, parseCentsFromText(this.editValue()));
    this.editingId.set(null);
  }

  protected pay(account: RecurringAccountItem): void {
    const accountId = account.account?.id ?? this.reference.defaultAccount()?.id;
    if (!accountId) {
      void this.notify('Cadastre uma conta antes de registrar o pagamento.');
      return;
    }
    this.store.pay(account.id, { accountId }, () => this.notify(`${account.label} — lançamento entrou no mês.`));
  }

  protected confirmClose(account: RecurringAccountItem): void {
    this.celebratingId.set(account.id);
  }

  protected async onCelebrationSettled(account: RecurringAccountItem): Promise<void> {
    this.store.remove(account.id);
    this.celebratingId.set(null);
    await this.notify(`Acabou. Última parcela de ${account.label}.`);
  }

  private async notify(message: string): Promise<void> {
    const toast = await this.toast.create({ message, duration: 2600, position: 'bottom', cssClass: 'app-toast' });
    await toast.present();
  }
}
