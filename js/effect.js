function Effect(x, y, type){
	var img = core.GetSpritesImg()
	var animations = new Array();
	
	animations["GreenSmoke"] = new Animation(null, 0, 100, 3, 24, 24);
	animations["GreenSmoke"].Repeat(false)
	
	animations["BigSplash"] = new Animation(null, 158, 100, 4, 24, 24);
	animations["BigSplash"].Repeat(false)
	
	var currentAnimation = animations[type]

	var x = x;
	var y = y;
	var draw = true;
	
	this.Draw = function(){
		if (draw)
			currentAnimation.Draw(img, x, y);
	}
	
	this.Update = function(){
		currentAnimation.Update();
		if (currentAnimation.IsAnimationDone()){
			//handle the animation finishing
			draw = false
		}
	}
	
	this.IsDraw = function() {
		return draw
	}
	
	this.GetY = function(){
		return y;
	}
	
	this.GetX = function(){
		return x;
	}

	
}