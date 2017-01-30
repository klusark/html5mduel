import { ImageManager } from "./imagemanager";
import { StaticImage } from "./staticimage";
import { Animation } from "./animation";

export class Mallow {
	imgMgr: ImageManager;
	img;
	mallowBottom: StaticImage;
	mallowTopAnimation: StaticImage;

	constructor(x, y, frame) {
		this.imgMgr = new ImageManager();
		this.img = this.imgMgr.GetSpritesImg();
		this.mallowBottom = new StaticImage(this.img, 75, 9, 16, 16);
		this.mallowTopAnimation = new Animation(null, 75, 1000, 4, 16, 8);
		this.mallowTopAnimation.SetFrame(frame);
	}

	Draw() {
		this.mallowBottom.Draw(this.x, this.y+8);
		this.mallowTopAnimation.Draw(this.img, this.x, this.y);
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
