import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CategoriaService } from '../categoria.service';
import { CategoriaResponse } from '../categoria';

@Component({
    selector: 'app-modal-categoria-detalhes',
    standalone: true,
    templateUrl: './modal-categoria-detalhes.html',
})
export class ModalCategoriaDetalhes implements OnInit {
    private readonly categoriaService = inject(CategoriaService);

    readonly categoriaId = input.required<string>();
    readonly fechar = output<void>();

    protected readonly categoria = signal<CategoriaResponse | null>(null);
    protected readonly carregando = signal(true);
    protected readonly mensagemErro = signal<string | null>(null);

    async ngOnInit(): Promise<void> {
        await this.carregarCategoria();
    }

    private async carregarCategoria(): Promise<void> {
        this.carregando.set(true);
        this.mensagemErro.set(null);

        try {
            const resultado = await firstValueFrom(
                this.categoriaService.obterPorId(this.categoriaId())
            );

            this.categoria.set(resultado);
        } catch {
            this.mensagemErro.set(
                'Não foi possível carregar os detalhes da categoria.'
            );
        } finally {
            this.carregando.set(false);
        }
    }

    protected fecharModal(): void {
        this.fechar.emit();
    }
}