/*global image, StaticImage*/

var imagemanager = require("./imagemanager");
var staticimage = require("./staticimage");

/**
 * @constructor
 */
function Emitter(x, y, type) {
	var img = imagemanager.image.GetSpritesImg(),
	emitter = new staticimage.StaticImage(img, type*16+type+92, 9, 16, 16);


	Draw() {
		emitter.Draw(x, y);
	};

	Update() {

	};

	GetY() {
		return y;
	};

	GetX() {
		return x;
	};
}

module.exports = {
  Emitter: Emitter
};
