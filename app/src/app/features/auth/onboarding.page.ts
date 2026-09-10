import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AccountsApi } from '../../core/api/accounts.api';
import { SpaceApi } from '../../core/api/space.api';
import { AccountKind } from '../../core/models';
import { AuthStore } from '../../core/auth/auth.store';
import { AUTH_STYLES } from './auth-shell.scss';

type Mode = 'create' | 'join';

@Component({
  selector: 'app-onboarding-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <h1 class="brand">Quase lá</h1>
      <p class="lede">Um espaço é a conta compartilhada da dupla. Crie o de vocês ou entre com um convite.</p>

      <div class="seg">
        <button type="button" class="ghost" [class.selected]="mode() === 'create'" (click)="mode.set('create')">Criar espaço</button>
        <button type="button" class="ghost" [class.selected]="mode() === 'join'" (click)="mode.set('join')">Tenho um convite</button>
      </div>

      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }

      @if (mode() === 'create') {
        <label class="field">
          <span class="field-label">Nome do espaço (opcional)</span>
          <input class="text-input" type="text" placeholder="Nosso espaço" [value]="spaceName()" (input)="spaceName.set($any($event.target).value)" />
        </label>
        <button type="button" class="primary" [disabled]="busy()" (click)="createSpace()">
          {{ busy() ? 'Criando…' : 'Criar espaço' }}
        </button>
      } @else {
        <label class="field">
          <span class="field-label">Código do convite</span>
          <input class="text-input" type="text" [value]="token()" (input)="token.set($any($event.target).value)" />
        </label>
        <button type="button" class="primary" [disabled]="busy() || token().trim().length < 10" (click)="acceptInvite()">
          {{ busy() ? 'Entrando…' : 'Entrar no espaço' }}
        </button>
      }

      <p class="switch"><a (click)="signOut()">Sair desta conta</a></p>
    </div>
  `,
  styles: [AUTH_STYLES],
})
export class OnboardingPage {
  private readonly spaceApi = inject(SpaceApi);
  private readonly accountsApi = inject(AccountsApi);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly mode = signal<Mode>('create');
  protected readonly spaceName = signal('');
  protected readonly token = signal('');
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);

  protected async createSpace(): Promise<void> {
    await this.run(async () => {
      await firstValueFrom(this.spaceApi.create({ name: this.spaceName().trim() || undefined }));
      // The API seeds default categories but not an account — a transaction needs one.
      await firstValueFrom(this.accountsApi.create({ name: 'Conta', kind: AccountKind.CHECKING }));
    });
  }

  protected async acceptInvite(): Promise<void> {
    await this.run(() => firstValueFrom(this.spaceApi.acceptInvitation(this.token().trim())));
  }

  private async run(action: () => Promise<unknown>): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      await action();
      await this.auth.refreshMe();
      await this.router.navigateByUrl('/mes');
    } catch (e: unknown) {
      const err = e as { error?: { message?: string } } | undefined;
      this.error.set(err?.error?.message ?? 'Não foi possível concluir.');
    } finally {
      this.busy.set(false);
    }
  }

  protected async signOut(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
