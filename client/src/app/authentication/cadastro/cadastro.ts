
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { AuthService } from '../auth.service';
import { ProblemDetails } from '../auth';
import { AuthShell } from '../shell/auth-shell';

interface CadastroForm {
    nome: string;
    email: string;
    senha: string;
}

@Component({
    selector: 'app-cadastro',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './cadastro.html'
})
export class Cadastro {

    // ================================================
    // INJEÇÃO DE DEPENDÊNCIA
    // ================================================

    private readonly service = inject(AuthService);
    private readonly router = inject(Router);

    // ================================================
    // ESTADOS
    // ================================================

    readonly mensagemErro = signal<string | null>(null);
    readonly carregando = signal(false);

    readonly formulario = signal<CadastroForm>({
        nome: '',
        email: '',
        senha: ''
    });

    // ================================================
    // MÉTODOS
    // ================================================

    enviarFormulario(): void {
        if (this.carregando()) {
            return;
        }

        this.mensagemErro.set(null);
        this.carregando.set(true);

        this.service.cadastrar(this.formulario())
            .pipe(
                finalize(() => this.carregando.set(false))
            )
            .subscribe({
                next: (resposta) => {
                    void this.router.navigateByUrl('/login', {
                        state: {
                            emailCadastrado: resposta.email
                        }
                    });
                },

                error: (erro: HttpErrorResponse) => {
                    const problema = erro.error as ProblemDetails;

                    this.mensagemErro.set(
                        problema?.detail ??
                        problema?.title ??
                        'Não foi possível realizar o cadastro. Tente novamente.'
                    );
                }
            });
    }
}
