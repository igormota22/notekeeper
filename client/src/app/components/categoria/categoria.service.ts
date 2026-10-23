import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { URL_API } from "../../authentication/auth.tokens";
import { Observable } from "rxjs";
import { CategoriaRequest, CategoriaResponse } from "./categoria";

@Injectable({
    providedIn: 'root'
})

export class CategoriaService {
    //======================================
    // INJECAO DEPENDENCIA
    //======================================

    private readonly http = inject(HttpClient);
    private readonly urlApi = inject(URL_API);

    //=======================================
    // METODOS
    //=======================================

    listar(): Observable<CategoriaResponse[]> {
        return this.http.get<CategoriaResponse[]>(`${this.urlApi}/categorias`);
    }

    obterPorId(categoriaId: string): Observable<CategoriaResponse> {
        return this.http.get<CategoriaResponse>(
            `${this.urlApi}/categorias/${categoriaId}`
        );
    }

    cadastrar(categoria: CategoriaRequest) {
        const request: CategoriaRequest = {
            ...categoria
        };

        return this.http.post<CategoriaResponse>(
            `${this.urlApi}/categorias`,
            request
        );


    }


    editar(categoria: CategoriaRequest, categoriaId: string) {
        const request: CategoriaRequest = {
            ...categoria
        };

        return this.http.put<CategoriaResponse>(
            `${this.urlApi}/categorias/${categoriaId}`,
            request
        );


    }

    excluir(categoriaId: string) {
        return this.http.delete<void>(
            `${this.urlApi}/categorias/${categoriaId}`
        );
    }


}