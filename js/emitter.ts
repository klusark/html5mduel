import { StaticImage } from "./staticimage";
import { Game } from "./core";

export class Emitter {
    private emitter: StaticImage;

    constructor(private x: number, private y: number, type: number, game: Game) {
        let img = game.GetImageManager().GetSpritesImg();
        this.emitter = new StaticImage(img, type * 16 + type + 92, 9, 16, 16);
    }

    Draw() {
        this.emitter.Draw(this.x, this.y);
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
