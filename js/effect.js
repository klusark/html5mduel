/*global Scale, image, Animation*/

var animation = require("./animation");
var imagemanager = require("./imagemanager");

function GreenSmoke(x, y){
	var greenSmoke = new animation.Animation(null, 0, 100, 3, 24, 24);
	greenSmoke.Repeat(false);

	return new Effect(x, y, greenSmoke);
}
function PurpleSmoke(x, y){
	var purpleSmoke = new animation.Animation(null, 437, 100, 3, 24, 24);
	purpleSmoke.Repeat(false);

	return new Effect(x, y, purpleSmoke);
}
function BlackSmoke(x, y){
	var blackSmoke = new animation.Animation(null, 512, 100, 4, 24, 24);
	blackSmoke.Repeat(false);

	return new Effect(x, y, blackSmoke);
}
function BubbleDisolve(x, y){
	var bubbleDisolve = new animation.Animation(null, 387, 100, 2, 24, 24);
	bubbleDisolve.Repeat(false);

	return new Effect(x, y, bubbleDisolve);
}
function BigSplash(x, y){
	var bigSplash = new animation.Animation(null, 158, 100, 4, 24, 24);
	bigSplash.Repeat(false);

	return new Effect(x, y, bigSplash);
}
function SmallSplash(x, y){
	var smallSplash = new animation.Animation(null, 687, 100, 3, 24, 24);
	smallSplash.Repeat(false);

	return new Effect(x, y, smallSplash);
}
function Explode(x, y){
	var explode = new animation.Animation(null, 612, 100, 3, 24, 24);
	explode.Repeat(false);

	return new Effect(x, y, explode);
}
function Lightning(x, y){
	var lightning = new animation.Animation(null, 762, 100, 2, 24, 24);
	lightning.Repeat(false);

	return new Effect(x, y, lightning);
}

/**
 * @constructor
 */
function Effect(x, y, type){

	var img = imagemanager.image.GetSpritesImg(),
	currentAnimation,

	draw = true;

	currentAnimation = type;

	this.Draw = function(){
		if (draw){
			currentAnimation.Draw(img, x, y);
		}
	};

	this.Update = function(deltaT) {
		currentAnimation.Update(deltaT);
		if (currentAnimation.IsAnimationDone()){
			//handle the animation finishing
			draw = false;
		}
	};

	this.IsDraw = function() {
		return draw;
	};

	this.GetY = function(){
		return y;
	};

	this.GetX = function(){
		return x;
	};

}

module.exports = {
  GreenSmoke : GreenSmoke,
  PurpleSmoke : PurpleSmoke,
  BlackSmoke : BlackSmoke,
  BubbleDisolve : BubbleDisolve,
  BigSplash : BigSplash,
  SmallSplash : SmallSplash,
  Explode : Explode,
  Lightning : Lightning
};

