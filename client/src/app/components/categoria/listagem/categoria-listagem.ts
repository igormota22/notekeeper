import { Component, inject, signal } from "@angular/core";
import { CategoriaService } from "../categoria.service";
import { CategoriaResponse } from "../categoria";
import { RouterLink } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { ModalExclusao } from "../modal-exclusao/modal-exclusao";
import { ModalCategoriaDetalhes } from "../modal-detalhes/modal-categoria-detalhes";

@Component({
    imports: [ModalCategoriaDetalhes, ModalExclusao, RouterLink],
    selector: 'app-categoria-listagem',
    templateUrl: './categoria-listagem.html'
})

export class CategoriaListagem {
    //========================================
    // INJEÇÃO DE DEPENDÊNCIA
    //========================================

    private readonly service = inject(CategoriaService);

    //========================================
    // ESTADOS
    //========================================

    protected categorias = signal<CategoriaResponse[]>([]);
    protected mensagemErro = signal<string | null>(null);
    protected carregando = signal(false);

    protected readonly categoriaSelecionada =
        signal<CategoriaResponse | null>(null);

    protected readonly excluindo = signal(false);
    protected readonly mensagemErroExclusao = signal<string | null>(null);
    protected readonly categoriaDetalheId = signal<string | null>(null);


    //========================================
    // CICLO DE VIDA
    //========================================

    ngOnInit(): void {
        this.exibirCategorias();
    }

    //========================================
    // MÉTODOS
    //========================================

    exibirCategorias(): void {
        this.carregando.set(true);
        this.mensagemErro.set(null);

        this.service.listar().subscribe({
            next: (categorias) => {
                this.categorias.set(categorias);
                this.carregando.set(false);
            },
            error: () => {
                this.mensagemErro.set(
                    'Não foi possível carregar as categorias.'
                );
                this.carregando.set(false);
            }
        });
    }

    protected confirmarExclusao(categoria: CategoriaResponse): void {
        this.categoriaSelecionada.set(categoria);
        this.mensagemErroExclusao.set(null);
    }

    protected cancelarExclusao(): void {
        if (this.excluindo()) {
            return;
        }

        this.categoriaSelecionada.set(null);
        this.mensagemErroExclusao.set(null);
    }

    protected async excluirCategoria(): Promise<void> {
        const categoria = this.categoriaSelecionada();

        if (!categoria || this.excluindo()) {
            return;
        }

        this.excluindo.set(true);
        this.mensagemErroExclusao.set(null);

        try {
            await firstValueFrom(
                this.service.excluir(categoria.id)
            );

            this.categoriaSelecionada.set(null);
            this.exibirCategorias();
        } catch {
            this.mensagemErroExclusao.set(
                'Não foi possível excluir esta categoria. Tente novamente.'
            );
        } finally {
            this.excluindo.set(false);
        }
    }
    protected abrirDetalhes(categoria: CategoriaResponse): void {
        this.categoriaDetalheId.set(categoria.id);
    }

    protected fecharDetalhes(): void {
        this.categoriaDetalheId.set(null);
    }
}