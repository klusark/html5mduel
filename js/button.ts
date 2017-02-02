import { Canvas } from "./canvas";
import { Scale } from "./scale";

export class Button {
    private selected = false;
    private boarder = 2;
    private selectedColour = "rgb(14,97,54)";
    private unselectedColour = "rgb(146,97,0)";
    private backgroundColour = "rgb(0,0,0)";

    constructor (private x: number, private y: number, private w: number, private h: number,
                    private text: string, private onclick: any/*TODO*/, private scale: Scale, private canvas: Canvas) {
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
        this.canvas.FillRect(this.x + this.boarder, this.y + this.boarder, this.w - (this.boarder * 2), this.h - (this.boarder * 2));

        this.canvas.FillStyle(this.selected ? this.selectedColour : this.unselectedColour);

        // TODO: Add a way to scale the font.
        this.canvas.setFont(this.scale.GetScale() * 0.75 + "em 'Allerta'");
        this.canvas.setTextAlign("center");
        this.canvas.FillText(this.text, this.x + this.w / 2, this.y + 15);
    };
}

