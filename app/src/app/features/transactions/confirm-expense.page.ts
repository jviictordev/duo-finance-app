import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { IonButton, IonInput, ModalController } from '@ionic/angular';

import { PaymentMethod, TransactionType, TransactionVisibility } from '../../core/models';
import { ReferenceStore } from '../../core/state/reference.store';
import { TransactionsStore } from '../../core/state/transactions.store';
import { formatCents, keypadDigitsToCents, popKeypadDigit, pushKeypadDigit } from '../../core/util/money';
import { CategoryAvatarComponent } from '../../shared/ui';

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: PaymentMethod.PIX, label: 'Pix' },
  { value: PaymentMethod.CREDIT, label: 'Crédito' },
  { value: PaymentMethod.DEBIT, label: 'Débito' },
  { value: PaymentMethod.CASH, label: 'Dinheiro' },
  { value: PaymentMethod.OTHER, label: 'Outro' },
];

const KEYPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '⌫'];
const BACKSPACE = '⌫';

/**
 * The + sheet — "Novo gasto". A manual expense the person logs by hand: valor, categoria,
 * conta (obrigatória para a API), escopo e forma de pagamento.
 */
@Component({
  selector: 'app-confirm-expense-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButton, IonInput, CategoryAvatarComponent],
  templateUrl: './confirm-expense.page.html',
  styleUrl: './confirm-expense.page.scss',
})
export class ConfirmExpensePage implements OnInit {
  private readonly store = inject(TransactionsStore);
  protected readonly reference = inject(ReferenceStore);
  private readonly modalCtrl = inject(ModalController);

  protected readonly paymentMethods = PAYMENT_METHODS;
  protected readonly Visibility = TransactionVisibility;
  protected readonly keypadKeys = KEYPAD_KEYS;

  protected readonly digits = signal('');
  protected readonly amountCents = computed(() => keypadDigitsToCents(this.digits()));
  protected readonly amountLabel = computed(() => formatCents(this.amountCents()));

  protected readonly categoryId = signal<string>('');
  protected readonly accountId = signal<string>('');
  protected readonly visibility = signal<TransactionVisibility>(TransactionVisibility.SHARED);
  protected readonly paymentMethod = signal<PaymentMethod>(PaymentMethod.PIX);
  protected readonly description = signal('');
  protected readonly submitting = signal(false);

  protected readonly selectedCategory = computed(() => this.reference.categoryById(this.categoryId()) ?? null);

  protected readonly canConfirm = computed(
    () => this.amountCents() > 0 && this.accountId().length > 0 && this.description().trim().length > 0 && !this.submitting(),
  );

  constructor() {
    effect(() => {
      const acc = this.reference.defaultAccount();
      if (acc && !this.accountId()) this.accountId.set(acc.id);
    });
  }

  ngOnInit(): void {
    this.reference.load();
  }

  protected pressKey(key: string): void {
    if (key === ',') return;
    this.digits.update((d) => (key === BACKSPACE ? popKeypadDigit(d) : pushKeypadDigit(d, key)));
  }

  protected confirm(): void {
    if (!this.canConfirm()) return;
    this.submitting.set(true);
    this.store.addTransaction(
      {
        type: TransactionType.EXPENSE,
        amountCents: this.amountCents(),
        description: this.description().trim(),
        accountId: this.accountId(),
        categoryId: this.categoryId() || undefined,
        visibility: this.visibility(),
        paymentMethod: this.paymentMethod(),
      },
      (created) => {
        if (created) void this.modalCtrl.dismiss(null, 'confirmed');
        else this.submitting.set(false);
      },
    );
  }

  protected dismiss(): void {
    void this.modalCtrl.dismiss();
  }
}
