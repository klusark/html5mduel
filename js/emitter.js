/*global image, StaticImage*/

var imagemanager = require("./imagemanager");
var staticimage = require("./staticimage");

/**
 * @constructor
 */
function Emitter(x, y, type) {
	var img = imagemanager.image.GetSpritesImg(),
	emitter = new staticimage.StaticImage(img, type*16+type+92, 9, 16, 16);


	this.Draw = function() {
		emitter.Draw(x, y);
	};

	this.Update = function() {

	};

	this.GetY = function() {
		return y;
	};

	this.GetX = function() {
		return x;
	};
}

module.exports = {
  Emitter: Emitter
};
