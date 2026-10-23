import { Component } from "@angular/core";
import { Menu } from "../../menu/menu";
import { RouterOutlet } from "@angular/router";

@Component({
    imports: [RouterOutlet, Menu],
    selector: 'app-nota-shell',
    templateUrl: './nota-shell.html'

})

export class NotaShell { }