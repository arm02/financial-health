import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CORE_PROVIDERS } from './core/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthInterceptor } from './presentation/auth/auth.interceptor';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'id-ID' },
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '../assets/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'id',
    }),
    ...CORE_PROVIDERS,
  ],
};
