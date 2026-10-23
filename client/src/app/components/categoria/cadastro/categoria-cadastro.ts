import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CategoriaService } from "../categoria.service";
import { form, required, minLength, submit, maxLength } from "@angular/forms/signals";
import { firstValueFrom, min } from "rxjs";

interface CategoriaForm {
    titulo: string;
}

@Component({
    imports: [],
    selector: 'app-categoria-cadastro',
    templateUrl: './categoria-cadastro.html'
})

export class CategoriaCadastro {
    // ========================================
    // INJEÇÃO DE DEPENDÊNCIAS
    // ========================================

    private readonly service = inject(CategoriaService);
    private readonly router = inject(Router);

    // ========================================
    // ESTADOS
    // ========================================

    protected readonly mensagemErro = signal<string | null>(null);

    protected readonly modelo = signal<CategoriaForm>({
        titulo: '',
    });

    protected readonly formulario = form(
        this.modelo,
        (caminho) => {
            required(caminho.titulo, {
                message: 'Informe o título da categoria.'
            });

            minLength(caminho.titulo, 2, {
                message: 'O título deve ter no mínimo 2 caracteres.'
            });

            maxLength(caminho.titulo, 100, {
                message: 'O título deve ter no maximo 100 caracteres.'
            })
        }
    );

    // ========================================
    // ENVIO DO FORMULÁRIO
    // ========================================

    async enviarFormulario(event: Event): Promise<void> {
        event.preventDefault();
        this.mensagemErro.set(null);

        try {
            await submit(this.formulario, async () => {
                await firstValueFrom(
                    this.service.cadastrar(this.modelo())
                );

                await this.router.navigateByUrl('/categorias/listagem');
            });
        } catch {
            this.mensagemErro.set(
                'Não foi possível cadastrar a categoria. Tente novamente.'
            );
        }
    }


    cancelar(): void {
        void this.router.navigateByUrl('/categorias/listagem');
    }
}

