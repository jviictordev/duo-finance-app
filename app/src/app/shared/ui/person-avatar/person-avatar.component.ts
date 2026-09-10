import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Accepts any "person-ish" object — a SpaceMember, an AuthUser, or an activity actor. */
export interface AvatarPerson {
  name: string;
  avatarUrl?: string | null;
  /** Optional CSS custom-property name for the fallback tint. */
  avatarColorVar?: string | null;
}

const TINTS = ['--color-accent-500', '--color-accent-2-500', '--color-accent-700', '--color-neutral-500'];

@Component({
  selector: 'app-person-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (person().avatarUrl) {
      <img class="avatar img" [src]="person().avatarUrl" [alt]="person().name" [style.width.px]="size()" [style.height.px]="size()" />
    } @else {
      <span
        class="avatar"
        [style.width.px]="size()"
        [style.height.px]="size()"
        [style.background]="'var(' + tint() + ')'"
        [style.font-size.px]="size() * 0.42"
        [title]="person().name"
      >
        {{ initial() }}
      </span>
    }
  `,
  styles: [
    `
      .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-pill);
        color: #fff;
        font-family: var(--font-body);
        font-weight: 700;
        flex-shrink: 0;
        border: 2px solid var(--color-bg);
        object-fit: cover;
      }
    `,
  ],
})
export class PersonAvatarComponent {
  readonly person = input.required<AvatarPerson>();
  readonly size = input(22);

  readonly initial = computed(() => this.person().name?.trim()?.[0]?.toUpperCase() ?? '?');
  readonly tint = computed(() => {
    const explicit = this.person().avatarColorVar;
    if (explicit) return explicit;
    const name = this.person().name ?? '';
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) | 0;
    return TINTS[Math.abs(hash) % TINTS.length]!;
  });
}
