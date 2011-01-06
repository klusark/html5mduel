/*global image, Bounds, StaticImage, game, sound*/
/**
 * @constructor
 */
function Platform(x, y, numPlatforms) {
	var img = image.GetSpritesImg(),

	platform = new StaticImage(img, 143, 0, 14, 8),

	bounds = new Bounds(0, 0, numPlatforms * 16, 8);

	this.Draw = function() {
		var i;
		for (i = 0; i < numPlatforms; i += 1){
			platform.Draw(i*16 + x + 1, y);
		}
	};

	this.GetNumPlatforms = function() {
		return numPlatforms;
	};

	this.GetEnd = function() {
		return numPlatforms * 16 + x - 3;
	};

	this.GetY = function() {
		return y;
	};

	this.GetX = function() {
		return x;
	};

	this.GetCurrentBounds = function() {
		return bounds;
	};

	this.Destroy = function(xpos) {
		xpos = Math.floor(xpos);
		var dist = xpos - x,
		x1 = (dist - dist%16)+x+32,
		x2 = this.GetNumPlatforms() * 16 + x;
		if (x1!==x2){
			game.MakeFloor((dist - dist%16)+x+32, this.GetNumPlatforms() * 16 + x, y);
		}
		//TODO: make this have an effect for each platform that is destroyed
		game.CreateEffect(BlackSmoke, xpos, y-10);

		numPlatforms = (dist - dist%16)/16;
		bounds = new Bounds(0, 0, numPlatforms * 16, 8);
		if (numPlatforms === 0){
			game.RemovePlatform(this);
		}
		sound.Play("buzz");

	};

}
