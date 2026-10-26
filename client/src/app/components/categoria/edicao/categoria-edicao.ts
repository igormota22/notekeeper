
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    form,
    required,
    minLength,
    maxLength,
    submit
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { CategoriaService } from '../categoria.service';

interface CategoriaForm {
    titulo: string;
}

@Component({
    selector: 'app-categoria-edicao',
    standalone: true,
    styleUrl: '../categoria-styles.css',
    templateUrl: './categoria-edicao.html'
})
export class CategoriaEdicao implements OnInit {
    private readonly service = inject(CategoriaService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    protected readonly categoriaId =
        this.route.snapshot.paramMap.get('id');

    protected readonly mensagemErro = signal<string | null>(null);
    protected readonly carregando = signal(true);
    protected readonly salvando = signal(false);

    protected readonly modelo = signal<CategoriaForm>({
        titulo: ''
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
                message: 'O título deve ter no máximo 100 caracteres.'
            });
        }
    );

    async ngOnInit(): Promise<void> {
        if (!this.categoriaId) {
            this.mensagemErro.set(
                'Identificador da categoria não informado.'
            );
            this.carregando.set(false);
            return;
        }

        try {
            const categoria = await firstValueFrom(
                this.service.obterPorId(this.categoriaId)
            );

            this.modelo.set({
                titulo: categoria.titulo
            });
        } catch {
            this.mensagemErro.set(
                'Não foi possível carregar a categoria.'
            );
        } finally {
            this.carregando.set(false);
        }
    }

    async enviarFormulario(event: Event): Promise<void> {
        event.preventDefault();

        if (!this.categoriaId || this.salvando()) {
            return;
        }

        this.mensagemErro.set(null);
        this.salvando.set(true);

        try {
            await submit(this.formulario, async () => {
                await firstValueFrom(
                    this.service.editar(
                        this.modelo(),
                        this.categoriaId!,
                    )
                );

                await this.router.navigateByUrl(
                    '/categorias/listagem'
                );
            });
        } catch {
            this.mensagemErro.set(
                'Não foi possível atualizar a categoria. Tente novamente.'
            );
        } finally {
            this.salvando.set(false);
        }
    }

    cancelar(): void {
        void this.router.navigateByUrl('/categorias/listagem');
    }
}

