import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonInput } from '@ionic/angular';

import { TransactionsStore } from '../../core/state/transactions.store';
import { Category, PaymentMethod, TransactionNature, TransactionScope } from '../../core/models';
import { CATEGORY_LIST, CATEGORY_META } from '../../core/util/category.util';
import { formatCents, parseCentsFromText } from '../../core/util/money';
import { CategoryAvatarComponent, OriginBadgeComponent } from '../../shared/ui';

const PAYMENT_METHODS: PaymentMethod[] = [PaymentMethod.PIX, PaymentMethod.CREDITO, PaymentMethod.DEBITO, PaymentMethod.DINHEIRO];

/**
 * Post-WhatsApp confirmation: amount, category and nature already come parsed (the
 * WhatsApp parsing itself is on standby — this fixture just represents its output).
 * Every field opens editable; there's no separate edit mode, "Confirmar" commits inline edits.
 */
@Component({
  selector: 'app-confirm-expense-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButton, IonInput, CategoryAvatarComponent, OriginBadgeComponent],
  templateUrl: './confirm-expense.page.html',
  styleUrl: './confirm-expense.page.scss',
})
export class ConfirmExpensePage implements OnInit {
  private readonly store = inject(TransactionsStore);
  private readonly router = inject(Router);

  protected readonly categories = CATEGORY_LIST;
  protected readonly categoryMeta = CATEGORY_META;
  protected readonly paymentMethods = PAYMENT_METHODS;
  protected readonly Nature = TransactionNature;
  protected readonly Scope = TransactionScope;

  protected readonly pending = this.store.pendingReview;

  protected readonly amountCents = signal(0);
  protected readonly amountText = signal('');
  protected readonly category = signal<Category>(Category.MERCADO);
  protected readonly nature = signal<TransactionNature>(TransactionNature.ESSENCIAL);
  protected readonly scope = signal<TransactionScope>(TransactionScope.CASAL);
  protected readonly paymentMethod = signal<PaymentMethod>(PaymentMethod.PIX);
  protected readonly description = signal('');

  protected readonly canConfirm = computed(() => this.amountCents() > 0 && !!this.category());

  /** Tracks which pending transaction's fields have already seeded the draft, so a later
   *  re-render (e.g. after the mock HTTP delay resolves) doesn't clobber in-progress edits. */
  private readonly syncedId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const tx = this.pending();
      if (!tx || this.syncedId() === tx.id) return;
      this.amountCents.set(tx.amountCents);
      this.amountText.set(formatCents(tx.amountCents));
      if (tx.category) this.category.set(tx.category);
      if (tx.nature) this.nature.set(tx.nature);
      this.scope.set(tx.scope);
      this.paymentMethod.set(tx.paymentMethod);
      this.description.set(tx.description ?? '');
      this.syncedId.set(tx.id);
    });
  }

  ngOnInit(): void {
    this.store.loadPendingReview();
  }

  protected onAmountChange(value: string): void {
    this.amountText.set(value);
    this.amountCents.set(parseCentsFromText(value));
  }

  protected confirm(): void {
    this.store.confirmPendingReview(
      {
        amountCents: this.amountCents(),
        category: this.category(),
        nature: this.nature(),
        scope: this.scope(),
        paymentMethod: this.paymentMethod(),
        description: this.description() || undefined,
      },
      () => this.router.navigateByUrl('/mes'),
    );
  }

  protected dismiss(): void {
    this.router.navigateByUrl('/mes');
  }
}
