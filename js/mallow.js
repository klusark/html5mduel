/*global image, Animation, StaticImage*/
/**
 * @constructor
 */
function Mallow(x, y, frame){
	var img = image.GetSpritesImg(),
	mallowBottom = new StaticImage(img, 75, 9, 16, 16),
	mallowTopAnimation = new Animation(null, 75, 1000, 4, 16, 8);
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
