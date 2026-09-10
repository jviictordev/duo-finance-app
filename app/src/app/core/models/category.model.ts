import { CategoryKind } from './enums';

/** GET /api/categories */
export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  essential: boolean;
  icon: string | null;
  color: string | null;
  archivedAt: string | null;
}

/** Slim category reference embedded in transaction / recurring-account rows. */
export interface CategoryRef {
  id: string;
  name: string;
  icon?: string | null;
  essential?: boolean;
}

export interface NewCategory {
  name: string;
  kind?: CategoryKind;
  essential?: boolean;
  icon?: string;
  color?: string;
}

export type CategoryPatch = Partial<{
  name: string;
  essential: boolean;
  icon: string | null;
  color: string | null;
  archived: boolean;
}>;
