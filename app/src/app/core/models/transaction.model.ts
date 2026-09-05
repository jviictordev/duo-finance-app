import { Category, PaymentMethod, TransactionNature, TransactionOrigin, TransactionReviewStatus, TransactionScope } from './enums';

export interface Reaction {
  type: 'LIKE' | 'AGREED';
  personId: string;
}

export interface Comment {
  id: string;
  personId: string;
  text: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  amountCents: number;
  /** null while the transaction is "a detalhar" (receipt saved without amount/category). */
  category: Category | null;
  description?: string;
  scope: TransactionScope;
  nature: TransactionNature | null;
  date: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  loggedByPersonId: string;
  origin: TransactionOrigin;
  reviewStatus: TransactionReviewStatus;
  recurringAccountId?: string;
  reactions: Reaction[];
  comments: Comment[];
  createdAt: string;
}
