function Emitter(x, y, type){
	var img = new Image();
	img.src = 'images/sprites.png';

	var x = x;
	var y = y;
	var type = type;
	this.Draw = function(){
		window.ctx.drawImage(img, type*16+type+92, 9, 16, 16, x, y, 16, 16);

	}
	
	this.Update = function(){

	}
	
	
	this.GetY = function(){
		return y;
	}
	this.GetX = function(){
		return x;
	}

	
}