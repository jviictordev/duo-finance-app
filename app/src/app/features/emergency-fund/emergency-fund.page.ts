import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FundMovement } from '../../core/models';
import { EmergencyFundStore } from '../../core/state/emergency-fund.store';
import { centsToInput, parseCentsFromText } from '../../core/util/money';
import { relativeDayLabel } from '../../core/util/relative-date';
import { EmptyStateComponent, MoneyAmountComponent, PersonAvatarComponent, ReserveProgressComponent } from '../../shared/ui';

@Component({
  selector: 'app-emergency-fund-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, ReserveProgressComponent, MoneyAmountComponent, PersonAvatarComponent, EmptyStateComponent],
  templateUrl: './emergency-fund.page.html',
  styleUrl: './emergency-fund.page.scss',
})
export class EmergencyFundPage implements OnInit {
  protected readonly store = inject(EmergencyFundStore);
  protected readonly relativeDayLabel = relativeDayLabel;

  protected readonly editingTarget = signal(false);
  protected readonly targetDraft = signal('');
  protected readonly movementDraft = signal('');
  protected readonly movementNote = signal('');
  protected readonly movementOpen = signal(false);

  ngOnInit(): void {
    this.store.load();
  }

  protected startEditTarget(): void {
    this.targetDraft.set(centsToInput(this.store.targetCents()));
    this.editingTarget.set(true);
  }

  protected saveTarget(): void {
    const cents = parseCentsFromText(this.targetDraft());
    if (cents >= 0) this.store.setTarget(cents);
    this.editingTarget.set(false);
  }

  protected submitMovement(sign: 1 | -1): void {
    const cents = parseCentsFromText(this.movementDraft());
    if (cents <= 0) return;
    this.store.addMovement({ amountCents: sign * cents, note: this.movementNote().trim() || undefined }, () => {
      this.movementDraft.set('');
      this.movementNote.set('');
      this.movementOpen.set(false);
    });
  }

  protected isWithdrawal(m: FundMovement): boolean {
    return m.amountCents < 0;
  }
}
