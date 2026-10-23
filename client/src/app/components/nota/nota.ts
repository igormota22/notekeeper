export interface CriarNotaRequest {
    titulo: string | null;
    descricao: string | null;
    categoriaIds: string[] | null;
}

export interface AtualizarNotaRequest {
    titulo: string | null;
    descricao: string | null;
    status: string | null;
    categoriaIds: string[] | null;
}

export interface NotaResponse {
    id: string;
    titulo: string;
    descricao: string;
    status: string;
    categoriaIds: string[];
}