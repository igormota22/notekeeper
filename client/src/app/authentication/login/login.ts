
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../auth.service';
import { ProblemDetails } from '../auth';

interface LoginForm {
    email: string;
    senha: string;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, FormsModule],
    templateUrl: './login.html'
})
export class Login {

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
    readonly mostrarSenha = signal(false);

    readonly formulario = signal<LoginForm>({
        email: '',
        senha: ''
    });

    // ================================================
    // MÉTODOS
    // ================================================

    atualizarCampo(
        campo: keyof LoginForm,
        valor: string
    ): void {
        this.formulario.update(formulario => ({
            ...formulario,
            [campo]: valor
        }));
    }

    alternarVisibilidadeSenha(): void {
        this.mostrarSenha.update(valor => !valor);
    }

    enviarFormulario(): void {
        if (this.carregando()) {
            return;
        }

        this.mensagemErro.set(null);
        this.carregando.set(true);

        this.service.login(this.formulario())
            .pipe(
                finalize(() => this.carregando.set(false))
            )
            .subscribe({
                next: (resposta) => {
                    void this.router.navigateByUrl('/home', {
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
                        'Não foi possível realizar o login. Verifique suas credenciais e tente novamente.'
                    );
                }
            });
    }
}
