/*global image, Animation, StaticImage*/

var imagemanager = require("./imagemanager");
var staticimage = require("./staticimage");
var animation = require("./animation");

/**
 * @constructor
 */
function Mallow(x, y, frame){
	var img = imagemanager.image.GetSpritesImg(),
	mallowBottom = new staticimage.StaticImage(img, 75, 9, 16, 16),
	mallowTopAnimation = new animation.Animation(null, 75, 1000, 4, 16, 8);
	mallowTopAnimation.SetFrame(frame);

	this.Draw = function(){
		mallowBottom.Draw(x, y+8);
		mallowTopAnimation.Draw(img, x, y);
	};

	this.Update = function(){
		mallowTopAnimation.Update();
	};

	this.GetY = function(){
		return y;
	};

	this.GetX = function(){
		return x;
	};

}

module.exports = {
  Mallow: Mallow
};
