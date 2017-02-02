import { Animation } from "./animation";
import { Bounds } from "./bounds";
import { Powerup } from "./powerup";
import { Game } from "./core";
import { Player } from "./player";

export class Bubble {
    private img: HTMLImageElement;

    private animation_ = new Animation(25, 336, 200, 3, 16, 16);

    private powerup: Powerup;

    private done = false;

    private currentBounds = new Bounds(0, 0, 16, 16);
    private name: string;

    constructor (private x: number, private y: number, private xVelocity: number, private yVelocity: number, private game: Game) {
        this.img = this.game.GetImageManager().GetSpritesImg();
    }

    SetCurrentPowerup(npowerup: any) {
        this.powerup = npowerup.powerup;
        this.name = npowerup.name;
    }

    Draw() {
        this.animation_.Draw(this.img, this.x, this.y);
        this.powerup.Draw(this.x + 2, this.y + 2);
    }

    Update(deltaT: number) {
        let ya = this.y + deltaT * this.yVelocity;

        this.x += deltaT * this.xVelocity;
        if (this.powerup && this.powerup.CollidePlatform) {
            let platform = this.game.IsOnGround(this.y, ya, this);
            if (platform) {
                this.powerup.CollidePlatform(platform);
            }
        }
        this.y = ya;
        if (this.powerup && this.powerup.Update) {
            this.powerup.Update(deltaT);
        }

        if (this.y > 163) {
            this.y = 163;
            this.yVelocity *= -1;
        } else if (this.y < -2) {
            this.y = -2;
            this.yVelocity *= -1;
        }
        if (this.x > 306) {
            this.x = 306;
            this.xVelocity *= -1;
        } else if (this.x < -2) {
            this.x = -2;
            this.xVelocity *= -1;
        }

        this.animation_.Update(deltaT);
    }

    CollidePlayer(player: Player) {
        if (this.powerup && this.powerup.CollidePlayer) {
            this.powerup.CollidePlayer(player);
        }
    }

    SetImage(image: HTMLImageElement) {
        this.img = image;
    }

    GetY() {
        return this.y;
    }

    GetX() {
        return this.x;
    }

    GetXVelocity() {
        return this.xVelocity;
    }

    GetYVelocity() {
        return this.yVelocity;
    }

    SetY(ny: number) {
        this.y = ny;
    }

    SetX(nx: number) {
        this.x = nx;
    }

    IsDone() {
        return this.done;
    }

    SetDone(nDone: boolean) {
        this.done = nDone;
    }

    GetCurrentBounds() {
        return this.currentBounds;
    }

    Serialize() {
        return  {x: this.x, y: this.y, xVelocity: this.xVelocity, yVelocity: this.yVelocity, name: this.name};
    }

    Deserialize(data: any) {
        this.x = data.x;
        this.y = data.y;
        this.xVelocity = data.xVelocity;
        this.yVelocity = data.yVelocity;
        this.name = data.name;
    }

    GetPowerupName() {
        return this.name;
    }
}
