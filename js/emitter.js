/*global image, StaticImage*/
/**
 * @constructor
 */
function Emitter(x, y, type) {
	var img = image.GetSpritesImg(),
	emitter = new StaticImage(img, type*16+type+92, 9, 16, 16);


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
