import { Canvas } from "./canvas";
import { Scale } from "./scale";

export class Button {
    selected = false;
    boarder = 2;
    selectedColour = "rgb(14,97,54)";
    unselectedColour = "rgb(146,97,0)";
    backgroundColour = "rgb(0,0,0)";
    canvas = new Canvas();
    scale = new Scale();
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
    onclick: any/*TODO*/;

    constructor (x: number, y: number, w: number, h: number, text: string, onclick: any/*TODO*/) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.onclick = onclick;
    }

    Select() {
        this.selected = true;
    };

    Deselect() {
        this.selected = false;
    };

    Click() {
        this.onclick();
    };

    Draw() {
        this.canvas.FillStyle(this.selected ? this.selectedColour : this.unselectedColour);
        this.canvas.FillRect(this.x, this.y, this.w, this.h);
        this.canvas.FillStyle(this.backgroundColour);
        this.canvas.FillRect(this.x+this.boarder, this.y+this.boarder, this.w-(this.boarder*2), this.h-(this.boarder*2));

        this.canvas.FillStyle(this.selected ? this.selectedColour : this.unselectedColour);

        //TODO: Add a way to scale the font.
        this.canvas.setFont(this.scale.GetScale()*0.75 + "em 'Allerta'");
        this.canvas.setTextAlign("center");
        this.canvas.FillText(this.text, this.x+this.w/2, this.y+15);
    };
}

