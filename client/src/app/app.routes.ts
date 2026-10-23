import { Routes } from '@angular/router';
import { AuthShell } from './authentication/shell/auth-shell';
import { E_ANONIMOGUARD, E_AUTENTICADOGUARD } from './authentication/auth.guard';
import { CategoriaShell } from './components/categoria/shell/categoria-shell';
import { NotaShell } from './components/nota/shell/nota-shell';

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
        canActivate: [E_AUTENTICADOGUARD],
        canActivateChild: [E_AUTENTICADOGUARD],
        children: [
            {
                path: 'listagem',
                loadComponent: () =>
                    import('./components/categoria/listagem/categoria-listagem')
                        .then(m => m.CategoriaListagem)
            },
            {
                path: 'cadastro',
                loadComponent: () =>
                    import('./components/categoria/cadastro/categoria-cadastro')
                        .then(m => m.CategoriaCadastro)
            },
            {
                path: 'edicao/:id',
                loadComponent: () =>
                    import('./components/categoria/edicao/categoria-edicao')
                        .then(m => m.CategoriaEdicao)
            }


        ]

    },
    {
        path: 'notas',
        component: NotaShell,
        canActivate: [E_AUTENTICADOGUARD],
        canActivateChild: [E_AUTENTICADOGUARD],
        children: [
            {
                path: 'listagem',
                loadComponent: () =>
                    import('./components/nota/listagem/nota-listagem')
                        .then(m => m.NotaListagem)
            },
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