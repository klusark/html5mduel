import { StaticImage } from "./staticimage";
import { Bounds } from "./bounds";
import { Game } from "./core";
import { Sound } from "./sound";
import { BlackSmoke } from "./effect";
import { Canvas } from "./canvas";

export class Platform {
    private bounds: Bounds;
    private platform: StaticImage;

    constructor(private x: number, private y: number, private numPlatforms: number, private game: Game) {
        this.bounds = new Bounds(0, 0, this.numPlatforms * 16, 8);
        this.platform = new StaticImage(game.GetImageManager().GetSpritesImg(), 143, 0, 14, 8);
    }

    Draw(canvas: Canvas) {
        for (let i = 0; i < this.numPlatforms; i += 1) {
            this.platform.Draw(i * 16 + this.x + 1, this.y, canvas);
        }
    }

    Update(deltaT: number) {
    }

    GetNumPlatforms() {
        return this.numPlatforms;
    }

    GetEnd() {
        return this.numPlatforms * 16 + this.x - 3;
    }

    GetY() {
        return this.y;
    }

    GetX() {
        return this.x;
    }

    GetCurrentBounds() {
        return this.bounds;
    }

    Destroy(xpos: number) {
        xpos = Math.floor(xpos);
        let dist = xpos - this.x,
        x1 = (dist - dist % 16) + this.x + 32,
        x2 = this.GetNumPlatforms() * 16 + this.x;
        if (x1 !== x2) {
            this.game.MakeFloor((dist - dist % 16) + this.x + 32, this.GetNumPlatforms() * 16 + this.x, this.y);
        }
        // TODO: make this have an effect for each platform that is destroyed
        this.game.AddEffect(new BlackSmoke(xpos, this.y - 10, this.game));

        this.numPlatforms = (dist - dist % 16) / 16;
        this.bounds = new Bounds(0, 0, this.numPlatforms * 16, 8);
        if (this.numPlatforms === 0) {
            this.game.RemovePlatform(this);
        }
        new Sound().Play("buzz");

    }

    Serialize() {
        return  {x: this.x, y: this.y, numPlatforms: this.numPlatforms};
    }

    Deserialize(data: any) {
        this.x = data.x;
        this.y = data.y;
        this.numPlatforms = data.numPlatforms;
    }
}
