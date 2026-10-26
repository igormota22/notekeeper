
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { NotaResponse } from '../nota';
import { CategoriaService } from '../../categoria/categoria.service';

interface NotaForm {
    titulo: string;
    descricao: string;
    status: 'Ativa' | 'Arquivada';
    categoriaIds: string[];
}

@Component({
    standalone: true,
    imports: [FormField, RouterLink],
    selector: 'app-nota-edicao',
    styleUrl: '../nota-styles.css',
    templateUrl: './nota-edicao.html'
})
export class NotaEdicao {

    // ========================================
    // INJEÇÃO DE DEPENDÊNCIAS
    // ========================================

    private readonly service = inject(NotaService);
    private readonly categoriaService = inject(CategoriaService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    // ========================================
    // ESTADOS
    // ========================================

    protected readonly notaId =
        this.route.snapshot.paramMap.get('id');

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
    // CARREGAMENTO DOS DADOS
    // ========================================

    async ngOnInit(): Promise<void> {
        if (!this.notaId) {
            this.mensagemErro.set(
                'Não foi possível identificar a nota que deseja editar.'
            );
            return;
        }

        try {
            const [categorias, nota] = await Promise.all([
                firstValueFrom(this.categoriaService.listar()),
                firstValueFrom(this.service.obterPorId(this.notaId))
            ]);

            this.categorias.set(categorias);

            this.modelo.set({
                titulo: nota.titulo,
                descricao: nota.descricao ?? '',
                status: nota.status as 'Ativa' | 'Arquivada',
                categoriaIds: (nota.categorias ?? []).map(
                    categoria => categoria.id
                )
            });

        } catch (erro) {
            console.error('Erro ao carregar os dados da nota:', erro);

            this.mensagemErro.set(
                'Não foi possível carregar os dados da nota.'
            );
        }
    }

    // ========================================
    // ENVIO DO FORMULÁRIO
    // ========================================

    async enviarFormulario(event: Event): Promise<void> {
        event.preventDefault();
        this.mensagemErro.set(null);

        if (!this.notaId) {
            this.mensagemErro.set(
                'Não foi possível identificar a nota que deseja editar.'
            );
            return;
        }

        try {
            await submit(this.formulario, async () => {
                await firstValueFrom(
                    this.service.editar(
                        this.modelo(),
                        this.notaId!
                    )
                );

                await this.router.navigateByUrl('/notas/listagem');
            });
        } catch (erro) {
            console.error('Erro ao editar a nota:', erro);

            this.mensagemErro.set(
                'Não foi possível salvar as alterações. Tente novamente.'
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
