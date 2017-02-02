import { Canvas } from "./canvas";
import { StaticImage } from "./staticimage";
import { Game } from "./core";

export class Rope {
    ropeTop: StaticImage;

    constructor (private x: number, private y: number, private length: number, game: Game) {

        this.length -= 2;

        this.y -= 2;

        let img = game.GetImageManager().GetSpritesImg();
        this.ropeTop = new StaticImage(img, 143, 9, 5, 5);
    }

    Draw(canvas: Canvas) {
        this.ropeTop.Draw(this.x, this.y, canvas);

        canvas.FillStyle("rgb(146,97,0)");
        canvas.FillRect(this.x + 2, this.y + 5, 1, this.length);
    }

    Update() {
    }

    GetLength() {
        return this.length;
    }

    GetY() {
        return this.y + 5;
    }

    GetX() {
        return this.x + 2;
    }

    Serialize() {
        return  {x: this.x, y: this.y, length: this.length};
    }

    Deserialize(data: any) {
        this.x = data.x;
        this.y = data.y;
        this.length = data.length;
    }
}
