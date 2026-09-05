import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Category } from '../../../core/models';
import { CATEGORY_META } from '../../../core/util/category.util';

@Component({
  selector: 'app-category-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="avatar" [style.width.px]="size()" [style.height.px]="size()" [style.background]="'var(' + meta().colorVar + ')'">
      {{ meta().initial }}
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
  readonly category = input.required<Category>();
  readonly size = input(38);

  readonly meta = computed(() => CATEGORY_META[this.category()]);
}
