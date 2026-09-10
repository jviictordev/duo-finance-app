# Deploy do front (Junto)

`ng build` gera a SPA estática em `www/` (a config `production` já é o default do
`angular.json`: minificação, hash nos arquivos, `environment.prod.ts`).

O front só precisa de duas coisas em produção:

1. um servidor estático com **SPA fallback** (rotas como `/reserva`, `/perfil` devem
   servir `index.html`);
2. saber **onde está a API** — via `environment.prod.ts` (`apiBaseUrl`).

---

## Topologia A — origem única (recomendada)

Um Caddy serve a SPA **e** faz proxy de `/api`, `/health` e `/stream` para a API.
Sem CORS, sem `apiBaseUrl` absoluto. É o que os arquivos deste repo montam.

```
navegador ─┬─ GET /            → www/index.html
           ├─ GET /reserva     → www/index.html   (SPA fallback)
           ├─ /api/*  /health  → api:3333
           └─ /stream          → api:3333 (sem buffer, SSE)
```

**Passos (VPS com Docker):**

1. Suba a API **sem o Caddy dela** e numa rede compartilhada:
   ```bash
   docker network create duo
   # em duo-finance-api/docker-compose.prod.yml:
   #  - remova (ou não suba) o serviço `caddy`
   #  - no serviço `api`, troque `expose: ['3333']` por:  networks: [duo]
   #  - adicione no fim:  networks: { duo: { external: true } }
   cd duo-finance-api
   docker compose -f docker-compose.prod.yml up -d api postgres redis
   ```
2. Configure e suba o front:
   ```bash
   cd ../duo-finance-app/app
   cp .env.production.example .env.production   # ajuste CADDY_SITE
   #  API_UPSTREAM=api:3333  já funciona (mesmo nome de serviço, rede `duo`)
   docker compose -f docker-compose.prod.yml up -d --build
   ```
3. Aponte o DNS de `CADDY_SITE` para o VPS. O Caddy emite o TLS sozinho.

`environment.prod.ts` fica com `apiBaseUrl: '/api'` (não mexer).

---

## Vercel (topologia B — só o front)

O Vercel hospeda **apenas o front** (SPA estática). A API (NestJS + Fastify + Postgres
+ Redis + storage) **não roda em serverless** — suba ela num VPS (o `docker-compose.prod.yml`
do repo `duo-finance-api` já faz isso), Railway, Render, Fly.io, etc., com uma URL
HTTPS pública (ex.: `https://api.duofinance.app`).

**No Vercel:**

1. New Project → importe o repo `jviictordev/ui-finance-app`.
2. **Root Directory: `app`** (o front está na subpasta, não na raiz do repo).
3. Framework Preset: **Other** — o [`vercel.json`](../vercel.json) já define
   `installCommand`, `buildCommand` (`npm run build`), `outputDirectory` (`www`) e o
   rewrite de SPA. Não precisa mexer em mais nada.
4. Deploy.

**Ligar na API (uma edição de código + uma na API):**

1. [`src/environments/environment.prod.ts`](../src/environments/environment.prod.ts) →
   ```ts
   apiBaseUrl: 'https://api.duofinance.app/api',
   ```
   (commit — o Vercel builda a partir do repo)
2. No `.env.production` da API →
   ```
   CORS_ORIGINS=https://SEU-APP.vercel.app,https://app.duofinance.app
   ```
   (inclua tanto o domínio `*.vercel.app` quanto o custom domain, se tiver)

Pronto: `https://SEU-APP.vercel.app` serve o app; o navegador fala direto com
`https://api.duofinance.app`. Preview deployments do Vercel usam URLs novas a cada PR —
se for testar login neles, adicione o padrão de preview no CORS ou use um domínio fixo.

---

## Topologia B — domínios separados (genérico)

Front num host estático (Netlify / Vercel / Cloudflare Pages / S3+CDN / nginx),
API em `api.SEU-DOMINIO`.

1. `environment.prod.ts` → `apiBaseUrl: 'https://api.SEU-DOMINIO/api'`
2. API `.env.production` → `CORS_ORIGINS=https://app.SEU-DOMINIO` (o back já manda
   `Access-Control-Allow-Credentials: true`)
3. `ng build` e publique `www/` no host. Configure o SPA fallback:
   - **Netlify** — `www/_redirects`: `/*  /index.html  200`
   - **Vercel** — `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
   - **nginx** — `try_files $uri /index.html;`
   - **Cloudflare Pages** — automático para SPA

O SSE (`/stream`) funciona cross-origin porque o token vai na query string
(`?token=`), mas o front **ainda não consome SSE** — irrelevante por ora.

---

## Build nativo (Capacitor / iOS / Android)

`/api` relativo não resolve dentro do WebView nativo — **precisa** de URL absoluta.

1. `environment.prod.ts` → `apiBaseUrl: 'https://api.SEU-DOMINIO/api'`
2. A API já tem `capacitor://localhost`, `ionic://localhost`, `https://localhost` em
   `CORS_ORIGINS` — mantenha.
3. `npm run build && npx cap sync` e siga o fluxo normal do Xcode / Android Studio.
   `appId` = `com.junto.financas`, `appName` = `Junto` (`capacitor.config.ts`).

---

## Checklist antes de subir

- [ ] `npm ci && npm run build` limpo (sem erro; warnings de budget/browserslist são ok)
- [ ] `npm run lint` limpo
- [ ] `environment.prod.ts` com o `apiBaseUrl` da topologia escolhida
- [ ] API: `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` reais (o `.env` de dev tem placeholder)
- [ ] API: storage de anexos apontando para S3/R2/MinIO (`S3_*`) — hoje o default grava
      em `/app/storage` (volume no compose; sobrevive a redeploy, mas não escala)
- [ ] API: `DATABASE_URL` / `REDIS_URL` de produção; `npx prisma migrate deploy`
      (o Dockerfile da API já roda no boot)
- [ ] DNS do `CADDY_SITE` (e de `api.*` na topologia B) apontando para o servidor
- [ ] Teste pós-deploy: cadastro → criar espaço → lançar um gasto → fechar um mês
