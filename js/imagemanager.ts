import { Scale } from "./scale";

/*if (typeof Image === 'undefined') {
	Image = function() {
		this.complete = true;
	};
}*/

export class ImageManager {
	player1Img = new Image();
	player2Img = new Image();
	spritesImg = new Image();

	//make this not needed.
	lightningImg = new Image();
	scale: Scale;

	constructor() {
		this.scale = new Scale();
		this.scale.ScaleCallback((scale: number) => {this.ScaleChange(scale);} );
	}

	/*if (this.IsOnAppEngine()){
		this.SetScale(scale)
	}else{
		player1Img.src = "/images/player.png"
		player2Img.src = "/images/player.png"
		spritesImg.src = "/images/sprites.png"
	}*/
	ScaleChange(scale: number) {

		var base = "http://mduel.teichroeb.net:5000/generate?m="+scale+"&c=",
		// TODO: Fix local storage
		colour0 = /*window.localStorage.colour0 ||*/ 0,
		colour1 = /*window.localStorage.colour1 ||*/ 1;
		this.player1Img.src = base + colour0;
		this.player2Img.src = base + colour1;
		this.lightningImg.src = base + "4";
		this.spritesImg.src = "http://mduel.teichroeb.net:5000/generate?s&m="+scale;
	};

	GetSpritesImg() {
		return this.spritesImg;
	};

	GetPlayer1Img() {
		return this.player1Img;
	};

	GetPlayer2Img() {
		return this.player2Img;
	};

	Get1000vImg() {
		return this.lightningImg;
	};

	IsLoaded() {
		return this.player1Img.complete && this.player2Img.complete && this.spritesImg.complete;
	};
}

