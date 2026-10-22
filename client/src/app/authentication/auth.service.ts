
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { catchError, finalize, of, tap } from "rxjs";
import { TOKEN_ARMAZENADO, URL_API } from "./auth.tokens";
import { CadastroRequest, LoginRequest, TokenDto, UsuarioDto } from "./auth"


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    //==============================================
    // INJEÇÃO DE DEPENDÊNCIA
    //==============================================

    private readonly http = inject(HttpClient);
    private readonly urlApi = inject(URL_API);
    private readonly token = inject(TOKEN_ARMAZENADO);

    //==============================================
    // ESTADOS
    //==============================================

    private readonly _usuarioAutenticado =
        signal<UsuarioDto | null>(null);

    readonly usuarioAutenticado =
        this._usuarioAutenticado.asReadonly();

    private readonly _autenticacao =
        signal<string | null>(null);

    readonly autenticacao =
        this._autenticacao.asReadonly();

    private readonly _sessaoInicializada = signal(false);
    readonly sessaoInicializada = this._sessaoInicializada.asReadonly();

    //==============================================
    // CONSTRUTOR
    //==============================================

    constructor() {
        const tokenArmazenado = localStorage.getItem(this.token);

        if (!tokenArmazenado) {
            this._sessaoInicializada.set(true);
            return;
        }

        this._autenticacao.set(tokenArmazenado);

        this.obterUsuario().pipe(
            catchError((erro: HttpErrorResponse) => {
                console.error(
                    'Erro ao restaurar a sessão:',
                    erro.status,
                    erro.message
                );

                // Limpa a sessão somente se a API rejeitar
                // a autenticação.
                if (erro.status === 401 || erro.status === 403) {
                    this.limparSessao();
                }

                return of(null);
            }),
            finalize(() => {
                this._sessaoInicializada.set(true);
            })
        ).subscribe();
    }
    //==============================================
    // CADASTRO
    //==============================================

    cadastrar(request: CadastroRequest) {
        return this.http.post<UsuarioDto>(
            `${this.urlApi}/auth/cadastro`,
            request
        );
    }

    //==============================================
    // LOGIN
    //==============================================

    login(request: LoginRequest) {
        return this.http.post<TokenDto>(
            `${this.urlApi}/auth/login`,
            request
        ).pipe(
            tap(resposta => {
                localStorage.setItem(
                    this.token,
                    resposta.accessToken
                );

                this._autenticacao.set(resposta.accessToken);

                this._usuarioAutenticado.set({
                    id: resposta.usuarioId,
                    nome: resposta.nome,
                    email: resposta.email
                });
            })
        );
    }

    //==============================================
    // OBTER USUÁRIO
    //==============================================

    obterUsuario() {
        return this.http.get<UsuarioDto>(
            `${this.urlApi}/auth/me`
        ).pipe(
            tap(usuario =>
                this._usuarioAutenticado.set(usuario)
            )
        );
    }

    //==============================================
    // LOGOUT
    //==============================================
    sair() {
        return this.http.post<void>(
            `${this.urlApi}/auth/logout`,
            {}
        ).pipe(
            finalize(() => this.limparSessao())
        );
    }

    //==============================================
    // LIMPAR SESSAO
    //==============================================

    private limparSessao(): void {
        localStorage.removeItem(this.token);
        this._autenticacao.set(null);
        this._usuarioAutenticado.set(null);
    }

}
