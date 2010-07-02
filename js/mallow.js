function Mallow(x, y, frame){
	var img = core.GetSpritesImg()
	
	var mallowTopAnimation = new Animation(null, 75, 1000, 4, 16, 8);
	mallowTopAnimation.SetFrame(frame);

	var x = x;
	var y = y;
	
	this.Draw = function(){
		core.DrawImage(img, 75, 9, 16, 16, x, y+8, 16, 16);
		//window.ctx.drawImage(mallowimg, x, y+8);
		mallowTopAnimation.Draw(img, x, y);
	}
	
	this.Update = function(){
		mallowTopAnimation.Update();
	}
	
	this.GetY = function(){
		return y;
	}
	this.GetX = function(){
		return x;
	}

	
}