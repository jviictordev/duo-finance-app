import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { AUTH_STYLES } from './auth-shell.scss';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="wrap">
      <h1 class="brand">Junto</h1>
      <p class="lede">Entre para ver o mês de vocês.</p>

      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }

      <label class="field">
        <span class="field-label">E-mail</span>
        <input class="text-input" type="email" autocomplete="email" [value]="email()" (input)="email.set($any($event.target).value)" />
      </label>
      <label class="field">
        <span class="field-label">Senha</span>
        <input class="text-input" type="password" autocomplete="current-password" [value]="password()" (input)="password.set($any($event.target).value)" (keyup.enter)="submit()" />
      </label>

      <button type="button" class="primary" [disabled]="!canSubmit()" (click)="submit()">
        {{ busy() ? 'Entrando…' : 'Entrar' }}
      </button>

      <p class="switch">Ainda não tem conta? <a routerLink="/cadastro">Criar conta</a></p>
    </div>
  `,
  styles: [AUTH_STYLES],
})
export class LoginPage {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);

  protected canSubmit(): boolean {
    return this.email().includes('@') && this.password().length > 0 && !this.busy();
  }

  protected async submit(): Promise<void> {
    if (!this.canSubmit()) return;
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.login({ email: this.email().trim(), password: this.password() });
      await this.router.navigateByUrl(this.auth.hasSpace() ? '/mes' : '/onboarding');
    } catch (e: unknown) {
      this.error.set(readError(e) ?? 'Não foi possível entrar. Confira e-mail e senha.');
    } finally {
      this.busy.set(false);
    }
  }
}

function readError(e: unknown): string | null {
  const err = e as { error?: { message?: string } } | undefined;
  return err?.error?.message ?? null;
}
