
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
    form,
    required,
    minLength,
    maxLength,
    submit,
    FormField
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { NotaService } from '../nota.service';
import { CategoriaService } from '../../categoria/categoria.service';

interface NotaForm {
    titulo: string;
    descricao: string;
    status: string;
    categoriaIds: string[];
}

@Component({
    imports: [FormField],
    selector: 'app-nota-cadastro',
    styleUrl: '../nota-styles.css',
    templateUrl: './nota-cadastro.html'
})
export class NotaCadastro {

    // ========================================
    // INJEÇÃO DE DEPENDÊNCIAS
    // ========================================

    private readonly service = inject(NotaService);
    private readonly categoriaService = inject(CategoriaService);
    private readonly router = inject(Router);

    // ========================================
    // ESTADOS
    // ========================================

    protected readonly mensagemErro = signal<string | null>(null);

    protected readonly categorias = signal<
        { id: string; titulo: string }[]
    >([]);

    protected readonly modelo = signal<NotaForm>({
        titulo: '',
        descricao: '',
        status: 'Ativa',
        categoriaIds: []
    });

    // ========================================
    // FORMULÁRIO E VALIDAÇÕES
    // ========================================

    protected readonly formulario = form(
        this.modelo,
        (caminho) => {
            required(caminho.titulo, {
                message: 'Informe o título da nota.'
            });

            minLength(caminho.titulo, 2, {
                message: 'O título deve ter no mínimo 2 caracteres.'
            });

            maxLength(caminho.titulo, 200, {
                message: 'O título deve ter no máximo 200 caracteres.'
            });

            maxLength(caminho.descricao, 300, {
                message: 'A descrição deve ter no máximo 300 caracteres.'
            });
        }
    );

    // ========================================
    // CARREGAMENTO DAS CATEGORIAS
    // ========================================

    async ngOnInit(): Promise<void> {
        try {
            const categorias = await firstValueFrom(
                this.categoriaService.listar()
            );

            this.categorias.set(categorias);
        } catch {
            this.mensagemErro.set(
                'Não foi possível carregar as categorias.'
            );
        }
    }

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

                await this.router.navigateByUrl('/notas/listagem');
            });
        } catch {
            this.mensagemErro.set(
                'Não foi possível cadastrar a nota. Tente novamente.'
            );
        }
    }

    // ========================================
    // CANCELAMENTO
    // ========================================

    cancelar(): void {
        void this.router.navigateByUrl('/notas/listagem');
    }

}
