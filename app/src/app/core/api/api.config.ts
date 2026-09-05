import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Every *.api.ts service talks only to this base path — swapping the mock interceptor
 *  for the real NestJS API later means changing environment.apiBaseUrl, not components. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl,
});
