# ─── build ─────────────────────────────────────────────
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# angular.json defaults `ng build` to the production configuration
RUN npm run build

# ─── runtime (Caddy serves the SPA + proxies the API) ──
FROM caddy:2-alpine AS runtime
COPY --from=build /app/www /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443
