import { Suggestion, SuggestionKind, SuggestionStatus } from '../../models';

export const SUGGESTIONS: Suggestion[] = [
  {
    id: 's1',
    kind: SuggestionKind.SURPLUS_TO_RESERVE,
    status: SuggestionStatus.PENDING,
    amountCents: 151877,
    period: '2026-08',
    message: 'Sobrou R$ 1.518,77 em agosto. Mandar para a reserva de emergência?',
    createdAt: '2026-09-01T09:00:00-03:00',
  },
];
