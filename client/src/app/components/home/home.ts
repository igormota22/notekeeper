import { Component } from "@angular/core";
import { Menu } from "../menu/menu";

@Component({
    imports: [Menu],
    selector: 'app-home',
    templateUrl: './home.html'
})

export class Home { }