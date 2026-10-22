
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../authentication/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './menu.html'
})
export class Menu implements OnInit {

    // =============================================
    // INJEÇÃO DE DEPENDÊNCIA
    // =============================================

    private readonly service = inject(AuthService);
    private readonly router = inject(Router);

    // =============================================
    // ESTADOS
    // =============================================

    readonly nomeUsuario = signal('');
    readonly emailUsuario = signal('');

    // =============================================
    // CICLO DE VIDA
    // =============================================

    ngOnInit(): void {
        this.service.obterUsuario().subscribe({
            next: (usuario) => {
                this.nomeUsuario.set(usuario.nome);
                this.emailUsuario.set(usuario.email);
            }
        });
    }

    // =============================================
    // MÉTODOS
    // =============================================

    sair(): void {
        this.service.sair().subscribe({
            next: () => {
                void this.router.navigateByUrl('/home');
            },
            error: () => {
                // Mesmo se a API falhar, encerra a sessão local.
                void this.router.navigateByUrl('/login');
            }
        });
    }

}
