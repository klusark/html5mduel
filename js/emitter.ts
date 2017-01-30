import { ImageManager} from "./imagemanager";
import { StaticImage } from "./staticimage";

export class Emitter {
    emitter: StaticImage;

    constructor(private x: number, private y: number, type: number) {
        let img = new ImageManager().GetSpritesImg();
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
