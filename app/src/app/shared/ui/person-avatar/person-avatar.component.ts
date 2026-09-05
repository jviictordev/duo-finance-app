import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Person } from '../../../core/models';

@Component({
  selector: 'app-person-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="avatar"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.background]="'var(' + person().avatarColorVar + ')'"
      [style.font-size.px]="size() * 0.42"
      [title]="person().name"
    >
      {{ person().initial }}
    </span>
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
      }
    `,
  ],
})
export class PersonAvatarComponent {
  readonly person = input.required<Person>();
  readonly size = input(22);
}
