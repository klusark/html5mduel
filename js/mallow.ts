import { StaticImage } from "./staticimage";
import { Animation } from "./animation";
import { Game } from "./core";
import { Canvas } from "./canvas";

export class Mallow {
    private img: HTMLImageElement;
    private mallowBottom: StaticImage;
    private mallowTopAnimation: Animation;

    constructor(private x: number, private y: number, frame: number, game: Game) {
        this.img = game.GetImageManager().GetSpritesImg();
        this.mallowBottom = new StaticImage(this.img, 75, 9, 16, 16);
        this.mallowTopAnimation = new Animation(null, 75, 1000, 4, 16, 8);
        this.mallowTopAnimation.SetFrame(frame);
    }

    Draw(canvas: Canvas) {
        this.mallowBottom.Draw(this.x, this.y + 8, canvas);
        this.mallowTopAnimation.Draw(this.img, this.x, this.y, canvas);
    }

    Update(deltaT: number) {
        this.mallowTopAnimation.Update(deltaT);
    }

    GetY() {
        return this.y;
    }

    GetX() {
        return this.x;
    }

}
