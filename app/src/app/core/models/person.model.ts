export interface Person {
  id: string;
  name: string;
  /** One of the 4 avatar colors offered in Perfil, stored as a CSS custom property name. */
  avatarColorVar: string;
  initial: string;
}

export interface Couple {
  id: string;
  members: [Person, Person];
  sinceLabel: string;
}
