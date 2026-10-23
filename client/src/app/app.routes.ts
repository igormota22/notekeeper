import { Routes } from '@angular/router';
import { AuthShell } from './authentication/shell/auth-shell';
import { E_ANONIMOGUARD } from './authentication/auth.guard';
import { CategoriaShell } from './components/categoria/shell/categoria-shell';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./components/home/home')
                .then(m => m.Home)
    },
    {
        path: 'categorias',
        component: CategoriaShell,
        children: [
            {
                path: 'listagem',
                loadComponent: () =>
                    import('./components/categoria/listagem/categoria-listagem')
                        .then(m => m.CategoriaListagem)
            }
        ]
    },
    {
        path: 'cadastro',
        component: AuthShell,
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./authentication/cadastro/cadastro')
                        .then(m => m.Cadastro)
            },
        ]
    },
    {
        path: 'login',
        component: AuthShell,
        canActivate: [E_ANONIMOGUARD],
        canActivateChild: [E_ANONIMOGUARD],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./authentication/login/login')
                        .then(m => m.Login)
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];