import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";

export const E_AUTENTICADOGUARD: CanActivateFn = (): true | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.autenticacao()) return true;

    return router.createUrlTree(['/login']);
}

export const E_ANONIMOGUARD: CanActivateFn = (): true | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.autenticacao()) return true;

    return router.createUrlTree(['/']);
}