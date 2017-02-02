import { StaticImage } from "./staticimage";
import { Game } from "./core";
import { Canvas } from "./canvas";

export class Emitter {
    private emitter: StaticImage;

    constructor(private x: number, private y: number, type: number, game: Game) {
        let img = game.GetImageManager().GetSpritesImg();
        this.emitter = new StaticImage(img, type * 16 + type + 92, 9, 16, 16);
    }

    Draw(canvas: Canvas) {
        this.emitter.Draw(this.x, this.y, canvas);
    };

    Update() {

    };

    GetY() {
        return this.y;
    };

    GetX() {
        return this.x;
    };
}
