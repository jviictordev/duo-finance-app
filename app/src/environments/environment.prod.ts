export const environment = {
  production: true,

  /**
   * Base path for every API call.
   *
   * - Web, same-origin deploy (recommended): keep '/api'. The front is served by the
   *   same Caddy that reverse-proxies '/api', '/health' and '/stream' to the API
   *   container — no CORS, cookies/headers just work. See docs/deploy.md (topology A).
   *
   * - Separate API domain OR native (Capacitor) build: set the absolute URL here, e.g.
   *   'https://api.duofinance.app/api', and add that front origin to CORS_ORIGINS in
   *   the API's .env.production (topology B).
   */
  apiBaseUrl: '/api',
};
