# Relatório de teste de integração — front ↔ API

Data: 2026-09-09. API (`duo-finance-api`) e front rodando local; testes feitos via proxy
`localhost:4200/api → localhost:3333`.

## Resumo

- **`ng build` (dev + prod) e `ng lint` limpos** sob `strict` + `strictTemplates`.
  → não há erro de tipo entre os models do front e o contrato da API.
- **48/48 endpoints exercitados retornam o shape esperado** pelos mappers
  (`auth, space, invitations, accounts, categories, transactions +transfer +comments,
  recurring-accounts +pay, emergency-fund +movements, month-closing, income, dashboard,
  activity`). Fluxo completo testado: registrar → criar espaço → conta → categoria →
  lançamento (simples e parcelado) → listar/detalhar/editar/apagar → conta fixa →
  pagar → reserva (meta + aporte + retirada) → renda → dashboard → fechar mês →
  atividade → convidar → aceitar → logout.

Os problemas abaixo são **comportamentais / de borda**, não de compilação.

---

> **Atualização 2026-09-09:** todos os itens marcados _(FRONT)_ abaixo já foram corrigidos
> neste branch. Falta o lado da API: **#A** (`GET /income` devolver `applyInss`/`applyIrrf`/
> `dependents`), **#B** CORS, **#C** storage S3, **#D** secrets.

## Bugs

### 1. `logout` nunca revoga a sessão no servidor  — ✅ CORRIGIDO (FRONT)
`POST /api/auth/logout` **exige** `Authorization: Bearer` (não é `@Public()` na API),
mas `authInterceptor.isAuthEndpoint()` casa `/auth/logout$` e **não anexa o token** →
a chamada sempre volta `401`.
`AuthStore.logout()` engole o erro e faz `clear()` local, então o usuário "sai", mas a
**família do refresh token continua válida por 30 dias** no banco.

- Arquivo: [src/app/core/auth/auth.interceptor.ts](../src/app/core/auth/auth.interceptor.ts) — a regex
  `isAuthEndpoint` deve cobrir só `login|register|refresh`. `logout` precisa do bearer
  como qualquer rota autenticada.

### 2. Editor de renda corrompe `applyInss` / `applyIrrf` / `dependents` ao re-salvar  — **corrigir / decidir**
`GET /api/income` **não devolve** `applyInss`, `applyIrrf` nem `dependents` — só o
breakdown já calculado (`inssCents`, `irrfCents`, …). O editor
([income.page.ts](../src/app/features/income/income.page.ts), effect que popula `drafts`) tenta
adivinhar:
```ts
applyInss: s.inssCents > 0 || s.kind === IncomeKind.FIXED,   // FIXED → sempre true
applyIrrf: s.irrfCents > 0 || s.kind === IncomeKind.FIXED,
dependents: 0,                                                // sempre zera
```
Consequência: abrir "Editar" numa fonte FIXED com `applyInss:false` e salvar → volta pra
`true`; qualquer `dependents` vira `0`.

Opções: (a) API passa a incluir esses 3 campos no `GET /income`; (b) guardar os inputs
do último `PUT` em `localStorage` e re-hidratar daí; (c) assumir que "Editar" recomeça do
zero e obrigar re-preencher INSS/IRRF/dependentes. Está registrado em
[api-migration-gaps.md](api-migration-gaps.md).

### 3. `RecurringAccountsApi.mapRow` lê campos que o `POST`/`PATCH` não retornam  — **cosmético**
`POST`/`PATCH /recurring-accounts` devolvem a row crua do Prisma (sem
`remainingBalanceCents` / `progress`). `mapRow` lê esses campos → item retornado tem
`remainingBalanceCents: 0`, `progress: null`.
Sem impacto real: `RecurringAccountsStore` chama `load()` logo após `add/update/pay/remove`,
e o callback só usa `.label`. Mas o objeto `created` entregue ao componente é enganoso.
- Arquivo: [src/app/core/api/recurring-accounts.api.ts](../src/app/core/api/recurring-accounts.api.ts)

---

## Menor prioridade / UX

| # | Item | Onde |
|---|---|---|
| 4 | **Sem criação de conta fora do onboarding.** Se o dono arquivar/apagar a única conta, "novo gasto" e "pagar conta fixa" travam sem saída no app. Onboarding cria uma "Conta" automática — é o único caminho. | `confirm-expense`, `recurring-accounts`, considerar "adicionar conta" no Perfil |
| 5 | **Inputs de dinheiro sem máscara** — meta da reserva e bruto da renda mostram `(cents/100).toString()` → "50000" em vez de "500,00". Faz round-trip certo via `parseCentsFromText`, mas confunde. | `emergency-fund.page.ts`, `income.page.ts` |
| 6 | **Dono vê espaço desatualizado depois que o parceiro entra** (sem SSE). Precisa reabrir o Perfil. | `session.store.ts` / `profile.page.ts` |
| 7 | **`session.load()` refetch redundante** — shell, dashboard e profile chamam `session.load()` a cada navegação (3× `GET /space`). Sem bug, só ruído. Adicionar guard "carregado". | `session.store.ts` |
| 8 | **`DecimalPipe` importado e não usado** em `dashboard.page.ts` e `income.page.ts`. Tree-shaken, mas sujeira. | remover import |
| 9 | **"Novo gasto" agora exige descrição** (API: `description` min 1). O mock aceitava vazio. | esperado, só ciência |
| 10 | Se o usuário abre o "+" antes das contas/categorias carregarem, os chips vêm vazios e `Salvar` fica travado até o load. O `effect` corrige o `accountId` sozinho quando chega. | `confirm-expense.page.ts` |

---

## Endpoints com contrato OK mas sem UI (fora do escopo do plano)

`POST /transactions/transfer` · `/transactions/:id/comments` (existe API, sem tela) ·
`POST /attachments` (recibo) · `GET /stream` (SSE / realtime) ·
`POST /auth/stream-token`. Ver [api-migration-gaps.md](api-migration-gaps.md).

---

## Testes manuais que ainda faltam (precisam de navegador)

1. **Refresh transparente**: baixar `JWT_ACCESS_TTL` no `.env` da API para `30s`, logar,
   esperar expirar, navegar → a próxima chamada deve renovar o token sozinha (interceptor
   401→refresh→retry) sem cair no `/login`. Lógica revisada, não executada.
2. **Refresh inválido** → deve limpar tokens e mandar pra `/login`.
3. **Reload da página mantém sessão** (tokens em `localStorage`, `APP_INITIALIZER`).
4. **Modal "+"** abrindo do FAB no mobile e no desktop.
5. **Fluxo de convite ponta a ponta** entre dois navegadores/perfis.
6. **`ng serve` precisa ser reiniciado** depois de mudar `angular.json` (proxy) — já
   confirmado que funciona em server novo.

---

## Notas para deploy (rascunho — discutir depois)

- **Proxy é só de dev.** Em produção o front (estático) e a API precisam da mesma origem
  (reverse proxy: `/api` e `/health`/`/stream` → API; resto → `index.html` SPA fallback),
  **ou** CORS liberado para o domínio do front + `apiBaseUrl` absoluto no
  `environment.prod.ts`. O `Caddyfile` da API já aponta nessa direção.
- **API precisa de**: Postgres, Redis (SSE/rate-limit/filas), storage S3-compatível
  (hoje `StorageService` grava em disco local — trocar por R2/MinIO antes do deploy),
  e os `JWT_*_SECRET` / `MAIL_*` reais (`.env` hoje tem placeholders).
- **CORS_ORIGINS** no `.env` da API não inclui o domínio de produção do front.
- Front: `ng build` gera `www/` (config prod já com `fileReplacements`).
- Sem transporte de e-mail: convite depende do dono copiar o código manualmente.
