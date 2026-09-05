import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceDataStore } from '../../core/state/reference-data.store';
import { CURRENT_PERSON_ID } from '../../core/mock/fixtures';
import { PersonAvatarComponent } from '../../shared/ui';

/** Overlay stub — Renda (INSS/IRRF) is out of this pass's scope; kept navigable per the shell. */
@Component({
  selector: 'app-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PersonAvatarComponent],
  template: `
    <div class="overlay">
      <header class="head">
        <h1 class="text-screen-title">Perfil</h1>
        <button type="button" class="close-btn" (click)="back()" aria-label="Fechar">✕</button>
      </header>

      @if (reference.personById(currentId); as me) {
        <div class="me">
          <app-person-avatar [person]="me" [size]="76" />
          <p class="text-list-title">{{ me.name }}</p>
        </div>
      }

      @if (partner(); as partner) {
        <div class="couple-card">
          <app-person-avatar [person]="partner" [size]="40" />
          <div>
            <p class="text-list-title">Vocês dois</p>
            <p class="text-caption">Os dois têm o mesmo acesso a tudo. Não existe dono da conta.</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host { display: block; padding: var(--space-4); padding-top: 50px; max-width: 480px; margin: 0 auto; }
      .head { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); }
      .close-btn { width: 44px; height: 44px; border-radius: var(--radius-pill); border: none; background: var(--color-surface); font-size: 16px; }
      .me { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); margin-bottom: var(--space-6); }
      .couple-card { display: flex; align-items: center; gap: var(--space-3); background: var(--color-accent-2-100); border-radius: var(--radius-content-card); padding: var(--space-4); }
      .couple-card p { margin: 0; }
    `,
  ],
})
export class ProfilePage implements OnInit {
  private readonly router = inject(Router);
  protected readonly reference = inject(ReferenceDataStore);
  protected readonly currentId = CURRENT_PERSON_ID;

  protected partner() {
    return this.reference.people().find((p) => p.id !== this.currentId);
  }

  ngOnInit(): void {
    this.reference.load();
  }

  protected back(): void {
    this.router.navigateByUrl('/mes');
  }
}
