import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SuggestionStatus } from '../models';
import {
  acceptSuggestion,
  closeRecurringAccount,
  confirmPendingReview,
  confirmRecurringAmount,
  db,
  markRecurringPaid,
  rejectSuggestion,
} from './mock-db';

const LATENCY_MS = 280;

function ok(body: unknown): Observable<HttpResponse<unknown>> {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(LATENCY_MS));
}

function fail(status: number, message: string): Observable<never> {
  return throwError(() => new HttpErrorResponse({ status, error: { message } })).pipe(delay(LATENCY_MS));
}

/**
 * Stands in for the NestJS API during frontend development. Every *.api.ts service
 * calls `${environment.apiBaseUrl}/...` — swap `environment.useMockInterceptor` to
 * false (or remove this provider) to hit the real backend with zero component changes.
 */
export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMockInterceptor || !req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  const path = req.url.slice(environment.apiBaseUrl.length);
  const [pathname, query] = path.split('?');
  const params = new URLSearchParams(query ?? '');
  const segments = pathname.split('/').filter(Boolean);

  // GET /people
  if (req.method === 'GET' && pathname === '/people') {
    return ok(db.people);
  }

  // GET /income
  if (req.method === 'GET' && pathname === '/income') {
    return ok(db.income);
  }

  // GET /transactions/pending-review
  if (req.method === 'GET' && pathname === '/transactions/pending-review') {
    return ok(db.pendingReview);
  }

  // GET /transactions?period=YYYY-MM
  if (req.method === 'GET' && pathname === '/transactions') {
    const period = params.get('period');
    const list = period ? db.transactions.filter((t) => t.date.startsWith(period)) : db.transactions;
    return ok(list);
  }

  // POST /transactions/:id/confirm
  if (req.method === 'POST' && segments[0] === 'transactions' && segments[2] === 'confirm') {
    try {
      return ok(confirmPendingReview(segments[1], (req.body as Record<string, unknown>) ?? {}));
    } catch (e) {
      return fail(404, (e as Error).message);
    }
  }

  // GET /recurring-accounts?cycle=YYYY-MM
  if (req.method === 'GET' && pathname === '/recurring-accounts') {
    const cycle = params.get('cycle');
    const list = cycle ? db.recurringAccounts.filter((a) => a.cycleMonth === cycle) : db.recurringAccounts;
    return ok(list);
  }

  // POST /recurring-accounts/:id/confirm-amount { confirmedAmountCents }
  if (req.method === 'POST' && segments[0] === 'recurring-accounts' && segments[2] === 'confirm-amount') {
    try {
      const { confirmedAmountCents } = req.body as { confirmedAmountCents: number };
      return ok(confirmRecurringAmount(segments[1], confirmedAmountCents));
    } catch (e) {
      return fail(404, (e as Error).message);
    }
  }

  // POST /recurring-accounts/:id/pay
  if (req.method === 'POST' && segments[0] === 'recurring-accounts' && segments[2] === 'pay') {
    try {
      return ok(markRecurringPaid(segments[1]));
    } catch (e) {
      return fail(404, (e as Error).message);
    }
  }

  // POST /recurring-accounts/:id/close
  if (req.method === 'POST' && segments[0] === 'recurring-accounts' && segments[2] === 'close') {
    try {
      closeRecurringAccount(segments[1]);
      return ok({ closed: true });
    } catch (e) {
      return fail(404, (e as Error).message);
    }
  }

  // GET /emergency-fund
  if (req.method === 'GET' && pathname === '/emergency-fund') {
    return ok(db.emergencyFund);
  }

  // GET /suggestions?status=PENDING
  if (req.method === 'GET' && pathname === '/suggestions') {
    const status = params.get('status') as SuggestionStatus | null;
    const list = status ? db.suggestions.filter((s) => s.status === status) : db.suggestions;
    return ok(list);
  }

  // POST /suggestions/:id/accept
  if (req.method === 'POST' && segments[0] === 'suggestions' && segments[2] === 'accept') {
    try {
      return ok(acceptSuggestion(segments[1]));
    } catch (e) {
      return fail(404, (e as Error).message);
    }
  }

  // POST /suggestions/:id/reject
  if (req.method === 'POST' && segments[0] === 'suggestions' && segments[2] === 'reject') {
    try {
      return ok(rejectSuggestion(segments[1]));
    } catch (e) {
      return fail(404, (e as Error).message);
    }
  }

  // GET /month-closings/:period
  if (req.method === 'GET' && segments[0] === 'month-closings' && segments[1]) {
    const closing = db.monthClosings.find((c) => c.period === segments[1]);
    return closing ? ok(closing) : fail(404, 'Fechamento não encontrado.');
  }

  // GET /month-closings
  if (req.method === 'GET' && pathname === '/month-closings') {
    return ok(db.monthClosings);
  }

  return fail(404, `Rota mock não implementada: ${req.method} ${pathname}`);
};
