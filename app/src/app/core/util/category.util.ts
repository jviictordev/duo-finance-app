import { Category, CategoryRef } from '../models';

/** Rotating palette for categories that don't carry an explicit `color` from the API. */
const FALLBACK_COLOR_VARS = [
  '--color-accent-200',
  '--color-accent-2-200',
  '--color-accent-300',
  '--color-accent-2-300',
  '--color-neutral-200',
  '--color-accent-100',
];

type AnyCategory = Category | CategoryRef | { id: string; name: string; color?: string | null; icon?: string | null };

export function categoryInitial(category: AnyCategory | null | undefined): string {
  const name = category?.name?.trim();
  return name ? name[0]!.toUpperCase() : '?';
}

export function categoryLabel(category: AnyCategory | null | undefined): string {
  return category?.name ?? 'Sem categoria';
}

/** A CSS custom-property name (without `var(...)`) for the category's avatar tint. */
export function categoryColorVar(category: AnyCategory | null | undefined): string {
  const explicit = (category as { color?: string | null } | null)?.color;
  if (explicit && explicit.startsWith('--')) return explicit;
  const id = category?.id ?? category?.name ?? '';
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return FALLBACK_COLOR_VARS[Math.abs(hash) % FALLBACK_COLOR_VARS.length]!;
}
