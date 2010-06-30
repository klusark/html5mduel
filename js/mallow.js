function Mallow(x, y, frame){
	var img = new Image();
	img.src = 'images/sprites.png';
	
	var mallowTopAnimation = new Animation(img, null, 75, 1000, 4, 16, 8);
	mallowTopAnimation.SetFrame(frame);

	var x = x;
	var y = y;
	
	this.Draw = function(){
		window.ctx.drawImage(img, 75, 9, 16, 16, x, y+8, 16, 16);
		//window.ctx.drawImage(mallowimg, x, y+8);
		mallowTopAnimation.Draw();
	}
	
	this.Update = function(){
		//currentTime = new Date().getTime();
		//var deltaT = currentTime - lastUpdateTime;



		//lastUpdateTime = currentTime;
		mallowTopAnimation.Update(x, y);
	}
	this.GetY = function(){
		return y;
	}
	this.GetX = function(){
		return x;
	}

	
}