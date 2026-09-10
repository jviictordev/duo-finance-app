import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { AUTH_STYLES } from './auth-shell.scss';

@Component({
  selector: 'app-register-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="wrap">
      <h1 class="brand">Junto</h1>
      <p class="lede">Crie sua conta. Depois vocês montam o espaço da dupla.</p>

      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }

      <label class="field">
        <span class="field-label">Nome</span>
        <input class="text-input" type="text" autocomplete="name" [value]="name()" (input)="name.set($any($event.target).value)" />
      </label>
      <label class="field">
        <span class="field-label">E-mail</span>
        <input class="text-input" type="email" autocomplete="email" [value]="email()" (input)="email.set($any($event.target).value)" />
      </label>
      <label class="field">
        <span class="field-label">Senha</span>
        <input class="text-input" type="password" autocomplete="new-password" [value]="password()" (input)="password.set($any($event.target).value)" (keyup.enter)="submit()" />
        <span class="switch" style="text-align:left">mínimo 8 caracteres</span>
      </label>

      <button type="button" class="primary" [disabled]="!canSubmit()" (click)="submit()">
        {{ busy() ? 'Criando…' : 'Criar conta' }}
      </button>

      <p class="switch">Já tem conta? <a routerLink="/login">Entrar</a></p>
    </div>
  `,
  styles: [AUTH_STYLES],
})
export class RegisterPage {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);

  protected canSubmit(): boolean {
    return this.name().trim().length >= 2 && this.email().includes('@') && this.password().length >= 8 && !this.busy();
  }

  protected async submit(): Promise<void> {
    if (!this.canSubmit()) return;
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.register({ name: this.name().trim(), email: this.email().trim(), password: this.password() });
      await this.router.navigateByUrl('/onboarding');
    } catch (e: unknown) {
      const err = e as { error?: { message?: string } } | undefined;
      this.error.set(err?.error?.message ?? 'Não foi possível criar a conta.');
    } finally {
      this.busy.set(false);
    }
  }
}
