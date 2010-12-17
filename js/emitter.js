/*global image, StaticImage*/
/**
 * @constructor
 */
function Emitter(xI, yI, typeI) {
	var img = image.GetSpritesImg(),
	type = typeI,
	emitter = new StaticImage(img, type*16+type+92, 9, 16, 16),

	x = xI,
	y = yI;


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
