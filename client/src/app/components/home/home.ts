import { Component, computed, inject } from "@angular/core";
import { Menu } from "../menu/menu";
import { AuthService } from "../../authentication/auth.service";
import { RouterLink } from "@angular/router";

@Component({
    imports: [RouterLink, Menu],
    selector: 'app-home',
    templateUrl: './home.html'
})

export class Home {
    private readonly authService = inject(AuthService);

    readonly sessaoInicializada = this.authService.sessaoInicializada;

    readonly autenticado = computed(
        () => this.sessaoInicializada() &&
            this.authService.autenticacao() !== null
    );
}