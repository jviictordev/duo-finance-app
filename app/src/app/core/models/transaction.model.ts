import { CategoryRef } from './category.model';
import { PaymentMethod, TransactionType, TransactionVisibility } from './enums';

export interface AccountRef {
  id: string;
  name: string;
}

export interface UserRef {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface InstallmentInfo {
  number: number;
  count: number;
  remainingBalanceCents: number;
  progress: number;
}

/** One row from GET /api/transactions `items` (the service's `toLine`). */
export interface TransactionLine {
  id: string;
  type: TransactionType;
  amountCents: number;
  description: string;
  occurredAt: string;
  visibility: TransactionVisibility;
  paymentMethod: PaymentMethod;
  needsDetail: boolean;
  isFixed: boolean;
  category: CategoryRef | null;
  account: AccountRef | null;
  createdBy: UserRef;
  commentsCount: number;
  installment?: InstallmentInfo;
}

export interface TransactionComment {
  id: string;
  body: string;
  author: UserRef;
  createdAt: string;
}

/** GET /api/transactions/:id */
export interface TransactionDetail extends TransactionLine {
  owner: { id: string; name: string } | null;
  installmentPlan: {
    id: string;
    totalCents: number;
    installmentsCount: number;
    firstDueDate: string;
  } | null;
  attachment: { id: string; mime: string } | null;
  comments: TransactionComment[];
}

export interface TransactionListPage {
  items: TransactionLine[];
  nextCursor: string | null;
}

/** POST /api/transactions body. */
export interface NewTransaction {
  type?: TransactionType;
  amountCents: number;
  description: string;
  occurredAt?: string;
  accountId: string;
  categoryId?: string;
  visibility?: TransactionVisibility;
  paymentMethod?: PaymentMethod;
  needsDetail?: boolean;
  attachmentId?: string;
  installmentsCount?: number;
}

export type TransactionPatch = Partial<{
  amountCents: number;
  description: string;
  occurredAt: string;
  accountId: string;
  categoryId: string | null;
  visibility: TransactionVisibility;
  paymentMethod: PaymentMethod;
  needsDetail: boolean;
  attachmentId: string | null;
}>;

export interface NewTransfer {
  amountCents: number;
  description?: string;
  occurredAt?: string;
  fromAccountId: string;
  toAccountId: string;
}
