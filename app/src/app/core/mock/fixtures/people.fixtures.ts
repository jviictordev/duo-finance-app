import { Couple, Person } from '../../models';

export const PEOPLE: Person[] = [
  { id: 'p1', name: 'João', avatarColorVar: '--color-accent-500', initial: 'J' },
  { id: 'p2', name: 'Letícia', avatarColorVar: '--color-accent-2-500', initial: 'L' },
];

export const CURRENT_PERSON_ID = 'p1';

export const COUPLE: Couple = {
  id: 'c1',
  members: [PEOPLE[0], PEOPLE[1]],
  sinceLabel: 'março',
};
