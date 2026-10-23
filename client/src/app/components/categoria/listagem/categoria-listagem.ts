import { Component, inject, signal } from "@angular/core";
import { CategoriaService } from "../categoria.service";
import { CategoriaResponse } from "../categoria";
import { RouterLink } from "@angular/router";

@Component({
    imports: [RouterLink],
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
}