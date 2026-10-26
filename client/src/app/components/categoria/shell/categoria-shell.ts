import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { Menu } from "../../menu/menu";

@Component({
    imports: [RouterLinkActive, RouterLink, RouterOutlet, Menu],
    selector: 'app-categoria-shell',
    styleUrl: '../categoria-styles.css',
    templateUrl: './categoria-shell.html'
})

export class CategoriaShell {

}