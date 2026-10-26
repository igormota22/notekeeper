import { Component } from "@angular/core";
import { Menu } from "../../menu/menu";
import { RouterOutlet } from "@angular/router";
import { CursorPersonalizado } from "../../../cursor-personalizado/cursor-personalizado";

@Component({
    imports: [RouterOutlet, Menu, CursorPersonalizado],
    selector: 'app-nota-shell',
    styleUrl: '../nota-styles.css',
    templateUrl: './nota-shell.html'

})

export class NotaShell { }