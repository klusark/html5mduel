/*global Scale, window*/
var image;
function ImageManager()
{
	var player1Img = new Image(),
	player2Img = new Image(),
	spritesImg = new Image(),

	//make this not needed.
	lightningImg = new Image();

	Scale.ScaleCallback(function(scale){image.ScaleChange(scale);});

	/*if (this.IsOnAppEngine()){
		this.SetScale(scale)
	}else{
		player1Img.src = "/images/player.png"
		player2Img.src = "/images/player.png"
		spritesImg.src = "/images/sprites.png"
	}*/
	this.ScaleChange = function(scale) {

		var base = "generate?m="+scale+"&c=",
		colour0 = window.localStorage.colour0 || 0,
		colour1 = window.localStorage.colour1 || 1;
		player1Img.src = base + colour0;
		player2Img.src = base + colour1;
		lightningImg.src = base + "4";
		spritesImg.src = "generate?s&m="+scale;
	};

	this.GetSpritesImg = function() {
		return spritesImg;
	};

	this.GetPlayer1Img = function() {
		return player1Img;
	};

	this.GetPlayer2Img = function() {
		return player2Img;
	};

	this.Get1000vImg = function() {
		return lightningImg;
	};

	this.IsLoaded = function() {
		return player1Img.complete && player2Img.complete && spritesImg.complete;
	};
}

image = new ImageManager();
