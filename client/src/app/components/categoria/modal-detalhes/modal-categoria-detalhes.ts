import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CategoriaService } from '../categoria.service';
import { CategoriaResponse } from '../categoria';

@Component({
    selector: 'app-modal-categoria-detalhes',
    standalone: true,
    templateUrl: './modal-categoria-detalhes.html',
})
export class ModalCategoriaDetalhes {
    private readonly categoriaService = inject(CategoriaService);

    readonly categoriaId = input.required<string>();
    readonly fechar = output<void>();

    protected fecharModal(): void {
        this.fechar.emit();
    }
}