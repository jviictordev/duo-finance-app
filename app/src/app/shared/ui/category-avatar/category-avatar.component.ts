import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CategoryRef } from '../../../core/models';
import { categoryColorVar, categoryInitial } from '../../../core/util/category.util';

@Component({
  selector: 'app-category-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="avatar" [style.width.px]="size()" [style.height.px]="size()" [style.background]="'var(' + colorVar() + ')'">
      {{ icon() || initial() }}
    </span>
  `,
  styles: [
    `
      .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-pill);
        font-family: var(--font-heading);
        font-weight: 400;
        color: var(--color-text);
        flex-shrink: 0;
      }
    `,
  ],
})
export class CategoryAvatarComponent {
  /** null renders a neutral "?" tile — matches "sem categoria" rows. */
  readonly category = input.required<CategoryRef | null>();
  readonly size = input(38);

  readonly initial = computed(() => categoryInitial(this.category()));
  readonly icon = computed(() => this.category()?.icon ?? '');
  readonly colorVar = computed(() => categoryColorVar(this.category()));
}
