import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { Menu } from "../../menu/menu";
import { CursorPersonalizado } from "../../../cursor-personalizado/cursor-personalizado";

@Component({
    imports: [RouterLinkActive, RouterLink, RouterOutlet, Menu, CursorPersonalizado],
    selector: 'app-categoria-shell',
    styleUrl: '../categoria-styles.css',
    templateUrl: './categoria-shell.html'
})

export class CategoriaShell {

}