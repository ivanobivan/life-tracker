import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './common/intercaptors/auth.interceptor';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideAnimations(),
        provideHttpClient(
            withInterceptors([authInterceptor])
        ),
        importProvidersFrom(
            TuiRootModule,
            TuiAlertModule,
            TuiDialogModule
        ),
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: {
                required: 'Обязательно для заполнения',
                maxlength: ({requiredLength}: {requiredLength: string}) =>
                    `Максимум ${requiredLength} символов`,
                minlength: ({requiredLength}: {requiredLength: string}) =>
                    `Минимум ${requiredLength} символов`
            }
        }
    ],
};
