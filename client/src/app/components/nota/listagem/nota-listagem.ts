
import {
    Component,
    computed,
    inject,
    OnInit,
    signal
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { NotaService } from '../nota.service';
import { NotaResponse } from '../nota';

import { CategoriaService } from '../../categoria/categoria.service';
import { CategoriaResponse } from '../../categoria/categoria';

@Component({
    selector: 'app-nota-listagem',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './nota-listagem.html',
})
export class NotaListagem implements OnInit {

    //========================================
    // INJEÇÃO DE DEPENDÊNCIA
    //========================================

    private readonly service = inject(NotaService);
    private readonly categoriaService = inject(CategoriaService);

    //========================================
    // ESTADOS
    //========================================

    protected readonly notas = signal<NotaResponse[]>([]);
    protected readonly categorias = signal<CategoriaResponse[]>([]);

    protected readonly mensagemErro = signal<string | null>(null);
    protected readonly carregando = signal(false);

    protected readonly termoPesquisa = signal('');
    protected readonly categoriaFiltro = signal('todas');

    protected readonly notaSelecionada = signal<NotaResponse | null>(null);
    protected readonly notaParaExcluir = signal<NotaResponse | null>(null);

    //========================================
    // NOTAS FILTRADAS
    //========================================

    protected readonly notasFiltradas = computed(() => {
        const termo = this.termoPesquisa()
            .trim()
            .toLocaleLowerCase();

        const categoriaId = this.categoriaFiltro();

        return this.notas().filter(nota => {
            const correspondePesquisa =
                !termo ||
                (nota.titulo ?? '').toLocaleLowerCase().includes(termo) ||
                (nota.descricao ?? '').toLocaleLowerCase().includes(termo);

            const correspondeCategoria =
                categoriaId === 'todas' ||
                (nota.categoriaIds ?? []).includes(categoriaId);

            return correspondePesquisa && correspondeCategoria;
        });
    });

    //========================================
    // INICIALIZAÇÃO
    //========================================

    async ngOnInit(): Promise<void> {
        await this.carregarDados();
    }

    //========================================
    // CARREGAR DADOS
    //========================================

    protected async carregarDados(): Promise<void> {
        this.carregando.set(true);
        this.mensagemErro.set(null);

        try {
            const [notas, categorias] = await Promise.all([
                firstValueFrom(this.service.listar()),
                firstValueFrom(this.categoriaService.listar())
            ]);

            this.notas.set(notas);
            this.categorias.set(categorias);
        } catch {
            this.mensagemErro.set(
                'Não foi possível carregar as notas. Tente novamente.'
            );
        } finally {
            this.carregando.set(false);
        }
    }

    protected async listarNotas(): Promise<void> {
        await this.carregarDados();
    }

    //========================================
    // FILTROS
    //========================================

    protected limparFiltros(): void {
        this.termoPesquisa.set('');
        this.categoriaFiltro.set('todas');
    }

    //========================================
    // STATUS
    //========================================

    protected notasPorStatus(status: string): NotaResponse[] {
        return this.notasFiltradas().filter(
            nota => nota.status === status
        );
    }

    protected contarPorStatus(status: string): number {
        return this.notasPorStatus(status).length;
    }

    //========================================
    // CATEGORIAS
    //========================================

    protected nomeCategoria(categoriaId: string): string | undefined {
        return this.categorias().find(
            categoria => categoria.id === categoriaId
        )?.titulo;
    }

    //========================================
    // DETALHES DA NOTA
    //========================================

    protected abrirDetalhes(nota: NotaResponse): void {
        this.notaSelecionada.set(nota);
    }

    protected fecharDetalhes(): void {
        this.notaSelecionada.set(null);
    }

    //========================================
    // EXCLUSÃO DA NOTA
    //========================================

    protected confirmarExclusao(nota: NotaResponse): void {
        this.notaParaExcluir.set(nota);
    }

    protected cancelarExclusao(): void {
        this.notaParaExcluir.set(null);
    }

    protected async excluirNota(): Promise<void> {
        const nota = this.notaParaExcluir();

        if (!nota) {
            return;
        }

        this.mensagemErro.set(null);

        try {
            await firstValueFrom(
                this.service.excluir(nota.id)
            );

            this.notaParaExcluir.set(null);

            await this.carregarDados();
        } catch {
            this.mensagemErro.set(
                'Não foi possível excluir a nota. Tente novamente.'
            );
        }
    }
}
