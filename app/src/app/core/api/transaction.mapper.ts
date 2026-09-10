import { TransactionLine } from '../models';
import { toCents } from '../util/money';

/** Shared DTO→model mapping for the transaction "line" shape returned by the API's `toLine`. */
export function mapTransactionLine(dto: Record<string, unknown>): TransactionLine {
  const inst = dto['installment'] as Record<string, unknown> | undefined;
  return {
    id: dto['id'] as string,
    type: dto['type'] as TransactionLine['type'],
    amountCents: toCents(dto['amountCents'] as string),
    description: dto['description'] as string,
    occurredAt: dto['occurredAt'] as string,
    visibility: dto['visibility'] as TransactionLine['visibility'],
    paymentMethod: dto['paymentMethod'] as TransactionLine['paymentMethod'],
    needsDetail: Boolean(dto['needsDetail']),
    isFixed: Boolean(dto['isFixed']),
    category: (dto['category'] as TransactionLine['category']) ?? null,
    account: (dto['account'] as TransactionLine['account']) ?? null,
    createdBy: dto['createdBy'] as TransactionLine['createdBy'],
    commentsCount: (dto['commentsCount'] as number) ?? 0,
    installment: inst
      ? {
          number: inst['number'] as number,
          count: inst['count'] as number,
          remainingBalanceCents: toCents(inst['remainingBalanceCents'] as string),
          progress: inst['progress'] as number,
        }
      : undefined,
  };
}
