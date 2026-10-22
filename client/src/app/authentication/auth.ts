export interface CadastroRequest {
    nome: string | null;
    email: string | null;
    senha: string | null;
}

export interface LoginRequest {
    email: string | null;
    senha: string | null;
}

export interface UsuarioDto {
    id: string;
    nome: string;
    email: string;
}

export interface TokenDto {
    usuarioId: string;
    nome: string;
    email: string;
    accessToken: string;
    dataExpiracaoEmUtc: string;
}