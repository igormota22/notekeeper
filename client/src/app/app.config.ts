import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { autenticacaoInterceptor } from './authentication/autenticacao.interceptor';
import { environment } from '../enviroments/enviroment.development';
import { TOKEN_ARMAZENADO, URL_API } from './authentication/auth.tokens';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([autenticacaoInterceptor])
    ),
    {
      provide: URL_API,
      useValue: environment.urlApi,
    },
    {
      provide: TOKEN_ARMAZENADO,
      useValue: 'NoteKeeper_Acesso'
    },
  ]
};
