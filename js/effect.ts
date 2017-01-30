import { ImageManager } from "./imagemanager";
import { Animation } from "./animation";

export function GreenSmoke(x: number, y: number) {
    let greenSmoke = new Animation(null, 0, 100, 3, 24, 24);
    greenSmoke.Repeat(false);

    return new Effect(x, y, greenSmoke);
}
export function PurpleSmoke(x: number, y: number) {
    let purpleSmoke = new Animation(null, 437, 100, 3, 24, 24);
    purpleSmoke.Repeat(false);

    return new Effect(x, y, purpleSmoke);
}
export function BlackSmoke(x: number, y: number) {
    let blackSmoke = new Animation(null, 512, 100, 4, 24, 24);
    blackSmoke.Repeat(false);

    return new Effect(x, y, blackSmoke);
}
export function BubbleDisolve(x: number, y: number) {
    let bubbleDisolve = new Animation(null, 387, 100, 2, 24, 24);
    bubbleDisolve.Repeat(false);

    return new Effect(x, y, bubbleDisolve);
}
export function BigSplash(x: number, y: number) {
    let bigSplash = new Animation(null, 158, 100, 4, 24, 24);
    bigSplash.Repeat(false);

    return new Effect(x, y, bigSplash);
}
export function SmallSplash(x: number, y: number) {
    let smallSplash = new Animation(null, 687, 100, 3, 24, 24);
    smallSplash.Repeat(false);

    return new Effect(x, y, smallSplash);
}
export function Explode(x: number, y: number) {
    let explode = new Animation(null, 612, 100, 3, 24, 24);
    explode.Repeat(false);

    return new Effect(x, y, explode);
}
export function Lightning(x: number, y: number) {
    let lightning = new Animation(null, 762, 100, 2, 24, 24);
    lightning.Repeat(false);

    return new Effect(x, y, lightning);
}

export class Effect {
    img = new ImageManager().GetSpritesImg();
    currentAnimation: Animation;

    draw = true;
    x: number;
    y: number;


    constructor(x: number, y: number, type: Animation) {
        this.x = x;
        this.y = y;
        this.currentAnimation = type;
    }

    Draw() {
        if (this.draw) {
            this.currentAnimation.Draw(this.img, this.x, this.y);
        }
    };

    Update(deltaT: number) {
        this.currentAnimation.Update(deltaT);
        if (this.currentAnimation.IsAnimationDone()) {
            // handle the animation finishing
            this.draw = false;
        }
    };

    IsDraw() {
        return this.draw;
    };

    GetY() {
        return this.y;
    };

    GetX() {
        return this.x;
    };

}
