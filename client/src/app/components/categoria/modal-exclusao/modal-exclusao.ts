
import { Component, input, output } from '@angular/core';
import { CategoriaResponse } from '../categoria';

@Component({
    selector: 'app-modal-exclusao',
    standalone: true,
    styleUrl: '../categoria-styles.css',
    templateUrl: './modal-exclusao.html',
})
export class ModalExclusao {
    readonly categoria = input.required<CategoriaResponse>();
    readonly carregando = input(false);
    readonly mensagemErro = input<string | null>(null);

    readonly cancelar = output<void>();
    readonly confirmar = output<void>();
}
