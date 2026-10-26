import { Component, input, output } from '@angular/core';
import { NotaResponse } from '../nota';

@Component({
    selector: 'app-modal-nota-detalhes',
    standalone: true,
    styleUrl: '../nota-styles.css',
    templateUrl: './modal-nota-detalhes.html'
})
export class ModalNotaDetalhes {
    readonly nota = input.required<NotaResponse>();
    readonly fechar = output<void>();
}