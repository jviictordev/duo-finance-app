export enum Category {
  MERCADO = 'MERCADO',
  RESTAURANTE = 'RESTAURANTE',
  TRANSPORTE = 'TRANSPORTE',
  CASA = 'CASA',
  LAZER = 'LAZER',
  SAUDE = 'SAUDE',
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDITO = 'CREDITO',
  DEBITO = 'DEBITO',
  DINHEIRO = 'DINHEIRO',
}

export enum TransactionScope {
  CASAL = 'CASAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

/** Independent of who logged the expense — never derived from loggedByPersonId. */
export enum TransactionNature {
  ESSENCIAL = 'ESSENCIAL',
  SUPERFLUO = 'SUPERFLUO',
}

export enum TransactionOrigin {
  WHATSAPP = 'WHATSAPP',
  WEB = 'WEB',
  MANUAL = 'MANUAL',
}

export enum TransactionReviewStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  CONFIRMED = 'CONFIRMED',
}

/** Independent of `paid` — correcting the amount does not imply it was paid. */
export enum AmountStatus {
  ESTIMATED = 'ESTIMATED',
  CONFIRMED = 'CONFIRMED',
}

export enum SuggestionKind {
  SURPLUS_TO_RESERVE = 'SURPLUS_TO_RESERVE',
  SURPLUS_TO_INVESTMENT = 'SURPLUS_TO_INVESTMENT',
}

export enum SuggestionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
}

export enum FundMovementType {
  CONTRIBUTION = 'CONTRIBUTION',
  WITHDRAWAL = 'WITHDRAWAL',
}

/** AUTO_CONTRIBUTION never needs confirmation; SUGGESTION_ACCEPTED always came from a confirmed Suggestion. */
export enum FundMovementOrigin {
  AUTO_CONTRIBUTION = 'AUTO_CONTRIBUTION',
  SUGGESTION_ACCEPTED = 'SUGGESTION_ACCEPTED',
  MANUAL = 'MANUAL',
}

export enum IncomeType {
  SALARIO = 'SALARIO',
  FREELA = 'FREELA',
  ALUGUEL = 'ALUGUEL',
  DIVIDENDOS = 'DIVIDENDOS',
  OUTRO = 'OUTRO',
}

export enum IncomeFrequency {
  FIXA = 'FIXA',
  VARIAVEL = 'VARIAVEL',
}

export enum MonthClosingStatus {
  SURPLUS = 'SURPLUS',
  DEFICIT = 'DEFICIT',
}
