import { inject } from '@angular/core';
import {
    HttpInterceptorFn
} from '@angular/common/http';
import { AuthService } from './auth.service';


export const autenticacaoInterceptor: HttpInterceptorFn =
    (req, next) => {
        const authService = inject(AuthService);
        const token = authService.autenticacao();

        if (!token) {
            return next(req);
        }

        const requisicaoAutenticada = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(requisicaoAutenticada);
    };