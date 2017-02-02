import { ImageManager } from "./imagemanager";
import { Animation } from "./animation";

export class Effect {
    private img = new ImageManager().GetSpritesImg();

    private draw = true;

    constructor(private x: number, private y: number, private currentAnimation: Animation) {
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

export class GreenSmoke extends Effect {
    constructor(x: number, y: number) {
        let greenSmoke = new Animation(null, 0, 100, 3, 24, 24);
        greenSmoke.Repeat(false);
        super(x, y, greenSmoke);
    }
}

export class PurpleSmoke extends Effect {
    constructor(x: number, y: number) {
        let purpleSmoke = new Animation(null, 437, 100, 3, 24, 24);
        purpleSmoke.Repeat(false);
        super(x, y, purpleSmoke);
    }
}

export class BlackSmoke extends Effect {
    constructor(x: number, y: number) {
        let blackSmoke = new Animation(null, 512, 100, 4, 24, 24);
        blackSmoke.Repeat(false);
        super(x, y, blackSmoke);
    }
}

export class BubbleDisolve extends Effect {
    constructor(x: number, y: number) {
        let bubbleDisolve = new Animation(null, 387, 100, 2, 24, 24);
        bubbleDisolve.Repeat(false);
        super(x, y, bubbleDisolve);
    }
}

export class BigSplash extends Effect {
    constructor(x: number, y: number) {
        let bigSplash = new Animation(null, 158, 100, 4, 24, 24);
        bigSplash.Repeat(false);
        super(x, y, bigSplash);
    }
}

export class SmallSplash extends Effect {
    constructor(x: number, y: number) {
        let smallSplash = new Animation(null, 687, 100, 3, 24, 24);
        smallSplash.Repeat(false);
        super(x, y, smallSplash);
    }
}

export class Explode extends Effect {
    constructor(x: number, y: number) {
        let explode = new Animation(null, 612, 100, 3, 24, 24);
        explode.Repeat(false);
        super(x, y, explode);
    }
}

export class Lighting extends Effect {
    constructor(x: number, y: number) {
        let lightning = new Animation(null, 762, 100, 2, 24, 24);
        lightning.Repeat(false);
        super(x, y, lightning);
    }
}

