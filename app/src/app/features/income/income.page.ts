import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, chevronBackOutline, closeOutline } from 'ionicons/icons';

import { IncomeKind, IncomeSourceInput, IncomeSourceLine } from '../../core/models';
import { EmergencyFundStore } from '../../core/state/emergency-fund.store';
import { IncomeStore } from '../../core/state/income.store';
import { SessionStore } from '../../core/state/session.store';
import { centsToInput, formatCents, parseCentsFromText } from '../../core/util/money';
import { MoneyAmountComponent } from '../../shared/ui';

addIcons({ 'chevron-back-outline': chevronBackOutline, 'close-outline': closeOutline, 'add-outline': addOutline });

interface DraftSource {
  label: string;
  kind: IncomeKind;
  gross: string;
  applyInss: boolean;
  applyIrrf: boolean;
  dependents: number;
}

/**
 * Renda do casal. The API computes the INSS/IRRF breakdown server-side and only exposes
 * PUT /income/sources (replace-all) for the CURRENT user — so this screen edits your own
 * sources and shows your partner's read-only. Contribution-% is gone; the reserve target
 * lives here now (PATCH /emergency-fund).
 */
@Component({
  selector: 'app-income-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, MoneyAmountComponent],
  templateUrl: './income.page.html',
  styleUrl: './income.page.scss',
})
export class IncomePage implements OnInit {
  private readonly router = inject(Router);
  protected readonly income = inject(IncomeStore);
  protected readonly session = inject(SessionStore);
  protected readonly emergencyFund = inject(EmergencyFundStore);

  protected readonly formatCents = formatCents;
  protected readonly Kind = IncomeKind;

  protected readonly currentUserId = this.session.currentUserId;

  protected readonly mySources = computed(() =>
    (this.income.summary()?.sources ?? []).filter((s) => s.userId === this.currentUserId()),
  );
  protected readonly partnerSources = computed(() =>
    (this.income.summary()?.sources ?? []).filter((s) => s.userId !== this.currentUserId()),
  );

  protected readonly drafts = signal<DraftSource[]>([]);
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);

  protected readonly targetDraft = signal('');
  protected readonly editingTarget = signal(false);

  private seeded = false;

  constructor() {
    effect(() => {
      const mine = this.mySources();
      if (!this.seeded && this.income.summary()) {
        this.seeded = true;
        this.drafts.set(mine.map((s) => this.toDraft(s)));
      }
    });
  }

  /** Uses the raw inputs when the API echoes them back (report #A); otherwise best-effort. */
  private toDraft(s: IncomeSourceLine): DraftSource {
    return {
      label: s.label,
      kind: s.kind,
      gross: centsToInput(s.grossCents),
      applyInss: s.applyInss ?? (s.inssCents > 0 || s.kind === IncomeKind.FIXED),
      applyIrrf: s.applyIrrf ?? (s.irrfCents > 0 || s.kind === IncomeKind.FIXED),
      dependents: s.dependents ?? 0,
    };
  }

  ngOnInit(): void {
    this.income.load();
    this.emergencyFund.load();
    this.session.load();
  }

  protected back(): void {
    void this.router.navigateByUrl('/perfil');
  }

  protected memberName(userId: string): string {
    return this.session.memberById(userId)?.name ?? 'seu par';
  }

  // -- My sources editor --------------------------------------------------

  protected startEdit(): void {
    this.editing.set(true);
  }

  protected addDraft(): void {
    this.drafts.update((d) => [...d, { label: '', kind: IncomeKind.FIXED, gross: '', applyInss: true, applyIrrf: true, dependents: 0 }]);
  }

  protected removeDraft(index: number): void {
    this.drafts.update((d) => d.filter((_, i) => i !== index));
  }

  protected patchDraft(index: number, patch: Partial<DraftSource>): void {
    this.drafts.update((d) => d.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  protected async saveSources(): Promise<void> {
    this.saving.set(true);
    const payload: IncomeSourceInput[] = this.drafts()
      .filter((d) => d.label.trim().length > 0)
      .map((d) => ({
        label: d.label.trim(),
        kind: d.kind,
        grossCents: parseCentsFromText(d.gross),
        applyInss: d.applyInss,
        applyIrrf: d.applyIrrf,
        dependents: d.dependents,
      }));
    try {
      await this.income.replaceSources(payload);
      this.editing.set(false);
    } finally {
      this.saving.set(false);
    }
  }

  // -- Reserve target ----------------------------------------------------

  protected startEditTarget(): void {
    this.targetDraft.set(centsToInput(this.emergencyFund.targetCents()));
    this.editingTarget.set(true);
  }

  protected saveTarget(): void {
    const cents = parseCentsFromText(this.targetDraft());
    if (cents >= 0) this.emergencyFund.setTarget(cents);
    this.editingTarget.set(false);
  }
}
