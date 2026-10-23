
import { Component, input, output } from '@angular/core';
import { NotaResponse } from '../nota';

@Component({
    selector: 'app-modal-nota-exclusao',
    standalone: true,
    templateUrl: './modal-nota-exclusao.html',
})
export class ModalNotaExclusao {
    readonly nota = input.required<NotaResponse>();
    readonly carregando = input(false);
    readonly mensagemErro = input<string | null>(null);

    readonly cancelar = output<void>();
    readonly confirmar = output<void>();
}
