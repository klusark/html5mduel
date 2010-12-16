/*global Scale, image, Animation*/
function Effect(xI, yI, type){

	var img = image.GetSpritesImg(),
	animations = [],
	currentAnimation,

	x = xI,
	y = yI,
	draw = true;

	animations.GreenSmoke = new Animation(null, 0, 100, 3, 24, 24);
	animations.GreenSmoke.Repeat(false);

	animations.PurpleSmoke = new Animation(null, 437, 100, 3, 24, 24);
	animations.PurpleSmoke.Repeat(false);

	animations.BlackSmoke = new Animation(null, 512, 100, 4, 24, 24);
	animations.BlackSmoke.Repeat(false);

	animations.BubbleDisolve = new Animation(null, 387, 100, 2, 24, 24);
	animations.BubbleDisolve.Repeat(false);

	animations.BigSplash = new Animation(null, 158, 100, 4, 24, 24);
	animations.BigSplash.Repeat(false);

	animations.SmallSplash = new Animation(null, 687, 100, 3, 24, 24);
	animations.SmallSplash.Repeat(false);

	animations.explode = new Animation(null, 612, 100, 3, 24, 24);
	animations.explode.Repeat(false);

	animations.Lightning = new Animation(null, 762, 100, 2, 24, 24);
	animations.Lightning.Repeat(false);

	currentAnimation = animations[type];

	this.Draw = function(){
		if (draw){
			currentAnimation.Draw(img, x, y);
		}
	};

	this.Update = function(){
		currentAnimation.Update();
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
