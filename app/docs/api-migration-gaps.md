# Migração mock → API real — o que ficou faltando

O front foi migrado do mock HTTP interceptor (`src/app/core/mock/`, removido) para a
API NestJS real (`../duo-finance-api`, `localhost:3333`, prefixo `/api`). A maior parte
dos recursos tinha equivalente direto. Esta tabela registra o que **não tinha** e como
cada ponto foi resolvido.

| Capacidade do mock | Status no front migrado | O que faltaria na API |
|---|---|---|
| `GET /people` (lista da dupla) | Resolvido via `GET /api/auth/me` + `GET /api/space` (`SessionStore`) | — |
| `PATCH /people/:id` (nome + cor do avatar) | **Removido** — Perfil virou somente leitura | `PATCH /api/users/me` com `{ name, avatarUrl }` |
| `PATCH /people/:id/notifications` (toggles) | **Removido da UI** | modelo `NotificationPreference` + `GET/PATCH /api/notifications/preferences` |
| `PATCH /emergency-fund { contributionPct }` (% da renda p/ reserva) | **Removido** — reserva agora usa **meta em R$** (`PATCH /api/emergency-fund { targetCents }`) | campo `contributionPct` no `EmergencyFund` + lógica de aporte mensal no dia 1 |
| Reserva: `goalMonths`, `monthlyAverageExpenseCents`, "meses de despesa cobertos" | **Removido** — anel agora mostra `% da meta` (campo `progress` da API) | esses campos derivados no `GET /api/emergency-fund` |
| `GET /transactions/pending-review` (gasto do WhatsApp aguardando confirmação) | **Removido** — não há fila de revisão | endpoint de "inbox" de lançamentos + parser do WhatsApp |
| `POST /transactions/:id/confirm` | Mapeado para `PATCH /api/transactions/:id` (a flag `needsDetail` existe no back) | endpoint dedicado de confirmação, se a semântica for diferente de um PATCH |
| Transação: `nature` ESSENCIAL/SUPÉRFLUO | **Removido do form** — o back deriva "essencial" da **categoria** (`Category.essential`) | — (é decisão de modelagem; ok assim) |
| Transação: `origin` WHATSAPP/WEB/MANUAL + badge | **Removido** — a API não expõe origem | campo `origin` na `Transaction` |
| Transação: `scope` CASAL/INDIVIDUAL | Mapeado para `visibility` SHARED/PRIVATE | — |
| `POST /recurring-accounts/:id/confirm-amount` | Mapeado para `PATCH /api/recurring-accounts/:id { amountCents }` | — |
| `POST /recurring-accounts/:id/close` | Mapeado para `DELETE /api/recurring-accounts/:id` (arquiva) | — |
| Conta fixa: `payerPersonId` ("quem paga") | **Removido** — a API vincula conta fixa a `accountId`/`categoryId`, não a uma pessoa | campo `payerUserId` no `RecurringAccount` |
| Conta fixa: estado "paga neste ciclo" (`paid`, `paidAt`, contador "X de Y pagas" por mês) | **Removido** — a API não tem ciclo mensal de contas fixas; `POST /:id/pay` só cria o lançamento | modelo de ocorrência mensal (`RecurringAccountOccurrence`) com `paidAt` por `cycleMonth` |
| Conta fixa: `amountStatus` ESTIMATED/CONFIRMED + badge | **Removido** | campo `amountStatus` no `RecurringAccount` |
| `GET /income` + CRUD por entrada (`type`, `frequency`, `receivedDay`, `payrollDeductions[]`) | **Substituído** por `GET /api/income` (fontes já com breakdown INSS/IRRF) + `PUT /api/income/sources` (replace-all, só do usuário logado) | `receivedDay` e `payrollDeductions` por fonte; endpoint que permita um usuário editar as fontes do parceiro |
| Renda: `frequency` FIXA/VARIÁVEL por entrada | Mapeado para `kind` FIXED/VARIABLE da `IncomeSource` | — |
| Cálculo de INSS/IRRF no front (`core/util/payroll.ts`) | **Removido** — agora é server-side (`TaxService` + `TaxTable` com vigência) | — |
| `GET /month-closings` (lista) + `MonthClosing` com `previousPeriodTotalExpenseCents`, `categoryBreakdown` (enum), `deficitForecast`, `suggestionId` | **Substituído** por `GET /api/month-closing?month=` (um mês por vez, OPEN/CLOSED) + `byCategory` | comparativo com mês anterior; `deficitForecast` (previsão de qual conta fixa absorve o rombo) |
| `/suggestions` inteiro (`GET`, `/:id/accept`, `/:id/reject`) — redirecionamento de excedente para a reserva com card de confirmação | **Removido** (`SuggestionsApi`, `SuggestionsStore`, `SuggestionCardComponent`, models) | módulo `Suggestion` no back; hoje o excedente vira aporte automático no `POST /api/month-closing` |
| Reações e comentários em lançamento | **Não implementado na UI** (endpoints `/transactions/:id/comments` existem; reações não) | telas de detalhe do lançamento + endpoint de reação |

## Itens do back ainda sem uso no front

- `GET /api/dashboard` — **em uso** (tela `/mes`).
- `POST /api/transactions/transfer` — sem UI de transferência.
- `POST /api/attachments` + `GET /api/attachments/:id/raw|thumb` — upload de recibo não ligado.
- `GET /stream` (SSE) — realtime não consumido; o app recarrega sob demanda.
- `POST /api/space/invitations*` — **implementado** no Perfil (criar/revogar convite, código copiável; aceitar convite fica no onboarding). Sem transporte de e-mail, o dono compartilha o código manualmente.
- `POST /api/auth/stream-token` — só faz sentido junto com o SSE.
