import { Category } from '../models';

/** Mirrors the CATS table in the design prototype (v2 .dc.html) — label, avatar color, initial. */
export const CATEGORY_META: Record<Category, { label: string; colorVar: string; initial: string }> = {
  [Category.MERCADO]: { label: 'Mercado', colorVar: '--color-accent-200', initial: 'M' },
  [Category.RESTAURANTE]: { label: 'Restaurante', colorVar: '--color-accent-2-200', initial: 'R' },
  [Category.TRANSPORTE]: { label: 'Transporte', colorVar: '--color-accent-300', initial: 'T' },
  [Category.CASA]: { label: 'Casa', colorVar: '--color-accent-2-300', initial: 'C' },
  [Category.LAZER]: { label: 'Lazer', colorVar: '--color-neutral-200', initial: 'L' },
  [Category.SAUDE]: { label: 'Saúde', colorVar: '--color-accent-100', initial: 'S' },
};

export const CATEGORY_LIST = Object.keys(CATEGORY_META) as Category[];
