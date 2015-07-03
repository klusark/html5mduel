/*global image, Bounds, StaticImage, game, sound*/

var image = require("./imagemanager");
var staticimage = require("./staticimage");
var bounds = require("./bounds");
var effect = require("./effect");
var sound = require("./sound");

/**
 * @constructor
 */
function Platform(x, y, numPlatforms, game) {
	var img = image.image.GetSpritesImg(),

	platform = new staticimage.StaticImage(img, 143, 0, 14, 8),

	bounds_ = new bounds.Bounds(0, 0, numPlatforms * 16, 8);

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
		return bounds_;
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
		game.CreateEffect(effect.BlackSmoke, xpos, y-10);

		numPlatforms = (dist - dist%16)/16;
		bounds_ = new bounds.Bounds(0, 0, numPlatforms * 16, 8);
		if (numPlatforms === 0){
			game.RemovePlatform(this);
		}
		sound.sound.Play("buzz");

	};

}

module.exports = {
  Platform: Platform
};
