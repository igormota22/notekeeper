import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { URL_API } from "../../authentication/auth.tokens";
import { Observable } from "rxjs";
import { AtualizarNotaRequest, CriarNotaRequest, NotaResponse } from "./nota";

@Injectable({
    providedIn: 'root'
})

export class NotaService {
    //======================================
    // INJECAO DEPENDENCIA
    //======================================

    private readonly http = inject(HttpClient);
    private readonly urlApi = inject(URL_API);

    //=======================================
    // METODOS
    //=======================================

    listar(): Observable<NotaResponse[]> {
        return this.http.get<NotaResponse[]>(`${this.urlApi}/notas`);
    }

    obterPorId(notaId: string): Observable<NotaResponse> {
        return this.http.get<NotaResponse>(
            `${this.urlApi}/notas/${notaId}`
        );
    }

    cadastrar(nota: CriarNotaRequest) {
        const request: CriarNotaRequest = {
            ...nota
        };

        return this.http.post<NotaResponse>(
            `${this.urlApi}/notas`,
            request
        );


    }


    editar(nota: AtualizarNotaRequest, notaId: string) {
        const request: AtualizarNotaRequest = {
            ...nota
        };

        return this.http.put<NotaResponse>(
            `${this.urlApi}/notas/${notaId}`,
            request
        );


    }

    excluir(notaId: string) {
        return this.http.delete<void>(
            `${this.urlApi}/notas/${notaId}`
        );
    }


}