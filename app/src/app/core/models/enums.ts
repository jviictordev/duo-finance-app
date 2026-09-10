/** Mirrors the Prisma enums exposed by the NestJS API. Values are the wire format. */

export enum AccountKind {
  CASH = 'CASH',
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT_CARD = 'CREDIT_CARD',
  WALLET = 'WALLET',
}

export enum CategoryKind {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export enum TransactionVisibility {
  SHARED = 'SHARED',
  PRIVATE = 'PRIVATE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  PIX = 'PIX',
  OTHER = 'OTHER',
}

export enum RecurrenceKind {
  FIXED = 'FIXED',
  INSTALLMENT = 'INSTALLMENT',
}

export enum FundMovementKind {
  MANUAL = 'MANUAL',
  AUTO_CLOSING = 'AUTO_CLOSING',
}

export enum IncomeKind {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
}

export enum MonthClosingStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum SpaceRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
}

export enum ActivityType {
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_UPDATED = 'TRANSACTION_UPDATED',
  COMMENT_CREATED = 'COMMENT_CREATED',
  FUND_CONTRIBUTION = 'FUND_CONTRIBUTION',
  FUND_WITHDRAWAL = 'FUND_WITHDRAWAL',
  MONTH_CLOSED = 'MONTH_CLOSED',
  MEMBER_JOINED = 'MEMBER_JOINED',
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}
