import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarPerson, PersonAvatarComponent } from '../person-avatar/person-avatar.component';

/** Overlapping couple avatars — doubles as the button that opens Perfil, per the handoff. */
@Component({
  selector: 'app-avatar-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PersonAvatarComponent],
  template: `
    <span class="stack">
      @for (person of people(); track $index; let i = $index) {
        <span class="item" [style.z-index]="i" [style.margin-left.px]="i === 0 ? 0 : -10">
          <app-person-avatar [person]="person" [size]="size()" />
        </span>
      }
    </span>
  `,
  styles: [
    `
      .stack { display: inline-flex; align-items: center; }
      .item { display: inline-flex; }
    `,
  ],
})
export class AvatarStackComponent {
  readonly people = input.required<AvatarPerson[]>();
  readonly size = input(34);
}
