import { inject, Injectable, signal } from '@angular/core';
import { ActivityApi } from '../api/activity.api';
import { ActivityEvent } from '../models';

@Injectable({ providedIn: 'root' })
export class ActivityStore {
  private readonly api = inject(ActivityApi);

  readonly items = signal<ActivityEvent[]>([]);
  readonly nextCursor = signal<string | null>(null);
  readonly loading = signal(false);

  load(): void {
    this.loading.set(true);
    this.api.feed().subscribe({
      next: (feed) => {
        this.items.set(feed.items);
        this.nextCursor.set(feed.nextCursor);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadMore(): void {
    const cursor = this.nextCursor();
    if (!cursor || this.loading()) return;
    this.loading.set(true);
    this.api.feed(cursor).subscribe({
      next: (feed) => {
        this.items.update((cur) => [...cur, ...feed.items]);
        this.nextCursor.set(feed.nextCursor);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
