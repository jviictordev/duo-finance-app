import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkOutline, chevronForwardOutline, copyOutline } from 'ionicons/icons';
import { AuthStore } from '../../core/auth/auth.store';
import { AccountKind, SpaceRole } from '../../core/models';
import { IncomeStore } from '../../core/state/income.store';
import { InvitationsStore } from '../../core/state/invitations.store';
import { ReferenceStore } from '../../core/state/reference.store';
import { SessionStore } from '../../core/state/session.store';
import { formatCents } from '../../core/util/money';
import { MoneyAmountComponent, PersonAvatarComponent } from '../../shared/ui';

addIcons({
  'chevron-forward-outline': chevronForwardOutline,
  'copy-outline': copyOutline,
  'checkmark-outline': checkmarkOutline,
  'add-outline': addOutline,
});

/**
 * Perfil — read-only identity (the API has no endpoint to change name/avatar/notifications,
 * see docs/api-migration-gaps.md) plus the couple card / invite flow.
 */
@Component({
  selector: 'app-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, MoneyAmountComponent, PersonAvatarComponent],
  template: `
    <div class="overlay">
      <header class="head">
        <h1 class="text-screen-title">Perfil</h1>
        <button type="button" class="close-btn" (click)="back()" aria-label="Fechar">✕</button>
      </header>

      @if (auth.user(); as me) {
        <div class="me">
          <app-person-avatar [person]="{ name: me.name, avatarUrl: me.avatarUrl }" [size]="76" />
          <div class="me-text">
            <span class="text-list-title">{{ me.name }}</span>
            <span class="text-caption">{{ me.email }}</span>
          </div>
        </div>
      }

      <button type="button" class="renda-btn" (click)="openRenda()">
        <span class="renda-text">
          <span class="renda-label">Renda do casal</span>
          <app-money-amount [amountCents]="income.householdNetCents()" size="lg" />
          <span class="text-caption">líquido/mês</span>
        </span>
        <ion-icon name="chevron-forward-outline" aria-hidden="true"></ion-icon>
      </button>

      <div class="accounts-card">
        <p class="text-list-title">Contas</p>
        @for (acc of reference.activeAccounts(); track acc.id) {
          <div class="account-row">
            <span>{{ acc.name }}</span>
            <span class="text-caption">{{ formatCents(acc.currentBalanceCents) }}</span>
          </div>
        }
        @if (!reference.activeAccounts().length) {
          <p class="text-caption">Nenhuma conta — crie uma para registrar gastos.</p>
        }

        @if (addingAccount()) {
          <div class="account-add">
            <input class="text-input" type="text" placeholder="ex: Nubank, Carteira" [value]="accountName()" (input)="accountName.set($any($event.target).value)" aria-label="Nome da conta" />
            <div class="actions">
              <button type="button" class="ghost" (click)="addingAccount.set(false)">Cancelar</button>
              <button type="button" class="primary" [disabled]="!canAddAccount()" (click)="createAccount()">
                {{ savingAccount() ? 'Criando…' : 'Criar' }}
              </button>
            </div>
          </div>
        } @else {
          <button type="button" class="link-btn add-account" (click)="addingAccount.set(true)">
            <ion-icon name="add-outline" aria-hidden="true"></ion-icon> adicionar conta
          </button>
        }
        @if (accountError()) {
          <p class="invite-error" role="alert">{{ accountError() }}</p>
        }
      </div>

      @if (partner(); as partner) {
        <div class="couple-card">
          <app-person-avatar [person]="partner" [size]="40" />
          <div>
            <p class="text-list-title">Com {{ partner.name }}</p>
            <p class="text-caption">Os dois têm o mesmo acesso a tudo. Não existe dono da conta.</p>
          </div>
        </div>
      } @else if (session.space()) {
        <div class="invite-card">
          <p class="text-list-title">Convide sua dupla</p>

          @if (!isOwner()) {
            <p class="text-caption">Só quem criou o espaço pode convidar.</p>
          } @else if (invitations.pending(); as inv) {
            <p class="text-caption">Convite pendente para <strong>{{ inv.email }}</strong>.</p>

            @if (invitations.createdToken(); as token) {
              <label class="field">
                <span class="field-label">Código do convite — envie para a pessoa</span>
                <div class="token-row">
                  <input class="text-input" type="text" [value]="token" readonly aria-label="Código do convite" />
                  <button type="button" class="icon-btn" (click)="copy(token)" aria-label="Copiar código">
                    <ion-icon [name]="copied() ? 'checkmark-outline' : 'copy-outline'" aria-hidden="true"></ion-icon>
                  </button>
                </div>
              </label>
              <p class="text-caption">A pessoa cria a conta dela e cola esse código em "Tenho um convite".</p>
            } @else {
              <p class="text-caption">O código só aparece no momento em que o convite é criado. Revogue e crie de novo se precisar dele.</p>
            }

            <button type="button" class="ghost" [disabled]="invitations.busy()" (click)="revoke(inv.id)">Revogar convite</button>
          } @else {
            <label class="field">
              <span class="field-label">E-mail da pessoa</span>
              <input class="text-input" type="email" [value]="email()" (input)="email.set($any($event.target).value)" />
            </label>
            <button type="button" class="primary" [disabled]="!canInvite()" (click)="invite()">
              {{ invitations.busy() ? 'Criando…' : 'Criar convite' }}
            </button>
          }

          @if (invitations.error(); as err) {
            <p class="invite-error" role="alert">{{ err }}</p>
          }
        </div>
      }

      <p class="note">Editar nome, cor do avatar e notificações ainda não tem endpoint na API.</p>

      <button type="button" class="logout" (click)="logout()">Sair da conta</button>
    </div>
  `,
  styles: [
    `
      :host { display: block; padding: var(--space-4); padding-top: 50px; padding-bottom: 110px; max-width: 480px; margin: 0 auto; }
      .head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); }
      .close-btn { width: 44px; height: 44px; border-radius: var(--radius-pill); border: none; background: var(--color-surface); font-size: 16px; }
      .me { display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4); }
      .me-text { display: flex; flex-direction: column; gap: 2px; }
      .renda-btn {
        width: 100%; display: flex; align-items: center; gap: var(--space-3);
        background: var(--color-accent-100); border: none; border-radius: var(--radius-content-card);
        padding: var(--space-4); margin-bottom: var(--space-3); text-align: left; cursor: pointer;
      }
      .renda-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
      .renda-label { font-size: 10.5px; letter-spacing: 0.09em; text-transform: uppercase; color: var(--color-accent-700); }
      .renda-btn ion-icon { font-size: 20px; color: var(--color-accent-700); flex: none; }
      .couple-card { display: flex; align-items: center; gap: var(--space-3); background: var(--color-accent-2-100); border-radius: var(--radius-content-card); padding: var(--space-4); }
      .couple-card p { margin: 0; }
      .accounts-card {
        background: var(--color-surface); border-radius: var(--radius-content-card);
        padding: var(--space-4); margin-bottom: var(--space-3); display: flex; flex-direction: column; gap: var(--space-2);
      }
      .accounts-card > p { margin: 0; }
      .account-row { display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) 0; border-top: 1px solid var(--color-divider); }
      .account-row:first-of-type { border-top: none; }
      .account-add { display: flex; flex-direction: column; gap: var(--space-2); }
      .add-account { display: inline-flex; align-items: center; gap: 4px; }
      .invite-card {
        background: var(--color-surface); border-radius: var(--radius-content-card);
        padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2);
      }
      .invite-card p { margin: 0; }
      .token-row { display: flex; gap: var(--space-2); align-items: center; }
      .token-row .text-input { flex: 1; font-size: 13px; }
      .icon-btn {
        width: 46px; height: 46px; flex: none; border: 1px solid var(--color-divider);
        border-radius: var(--radius-pill); background: var(--color-surface); font-size: 18px;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .invite-error { color: var(--color-neutral-800); background: var(--color-accent-2-100); border-radius: var(--radius-content-card); padding: var(--space-3); font-size: 13px; }
      .note { font-size: 12.5px; color: var(--color-neutral-600); margin: var(--space-4) 0; }
      .logout { width: 100%; min-height: 46px; border: 1px solid var(--color-divider); border-radius: var(--radius-pill); background: var(--color-surface); font-size: 14px; }
    `,
  ],
})
export class ProfilePage {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthStore);
  protected readonly session = inject(SessionStore);
  protected readonly income = inject(IncomeStore);
  protected readonly invitations = inject(InvitationsStore);
  protected readonly reference = inject(ReferenceStore);

  protected readonly formatCents = formatCents;

  protected readonly partner = this.session.partner;
  protected readonly isOwner = computed(() => this.session.me()?.role === SpaceRole.OWNER);

  protected readonly email = signal('');
  protected readonly copied = signal(false);

  protected readonly addingAccount = signal(false);
  protected readonly accountName = signal('');
  protected readonly savingAccount = signal(false);
  protected readonly accountError = signal<string | null>(null);

  protected readonly canInvite = computed(() => this.email().includes('@') && !this.invitations.busy());
  protected readonly canAddAccount = computed(() => this.accountName().trim().length > 0 && !this.savingAccount());

  constructor() {
    // reload (not load) so re-opening Perfil picks up a partner who just joined — no SSE yet.
    this.session.reload();
    this.income.load();
    this.reference.load();
    this.invitations.reset();
    this.invitations.load();
  }

  protected createAccount(): void {
    if (!this.canAddAccount()) return;
    this.savingAccount.set(true);
    this.accountError.set(null);
    this.reference.createAccount({ name: this.accountName().trim(), kind: AccountKind.CHECKING }).subscribe({
      next: () => {
        this.savingAccount.set(false);
        this.addingAccount.set(false);
        this.accountName.set('');
      },
      error: (err: unknown) => {
        this.savingAccount.set(false);
        this.accountError.set((err as { error?: { message?: string } })?.error?.message ?? 'Não foi possível criar a conta.');
      },
    });
  }

  protected invite(): void {
    if (!this.canInvite()) return;
    this.invitations.invite(this.email().trim());
    this.email.set('');
  }

  protected revoke(id: string): void {
    this.invitations.revoke(id);
  }

  protected async copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      /* clipboard blocked — the field is selectable as a fallback */
    }
  }

  protected openRenda(): void {
    void this.router.navigateByUrl('/renda');
  }

  protected back(): void {
    void this.router.navigateByUrl('/mes');
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
