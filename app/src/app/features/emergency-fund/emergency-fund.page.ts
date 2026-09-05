import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FundMovement, FundMovementType } from '../../core/models';
import { EmergencyFundStore } from '../../core/state/emergency-fund.store';
import { ReferenceDataStore } from '../../core/state/reference-data.store';
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
  protected readonly reference = inject(ReferenceDataStore);

  protected readonly MovementType = FundMovementType;
  protected readonly relativeDayLabel = relativeDayLabel;

  protected readonly signedAmount = (m: FundMovement) => (m.type === FundMovementType.WITHDRAWAL ? -m.amountCents : m.amountCents);

  ngOnInit(): void {
    this.store.load();
    this.reference.load();
  }
}
