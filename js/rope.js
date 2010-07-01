function Rope(x, y, length){
	var img = new Image();
	img.src = 'images/sprites.png';

	var length = length-2;
	var x = x;
	var y = y-2;
	
	this.Draw = function(){
		window.ctx.drawImage(img, 143, 9, 5, 5, x, y, 5, 5);
		ctx.fillStyle = "rgb(146,97,0)";  
		window.ctx.fillRect(x+2, y+5, 1, length);
	}
	
	this.Update = function(){
	}
	
	this.GetLength = function(){
		return length;
	}
	
	this.GetY = function(){
		return y+5;
	}
	this.GetX = function(){
		return x+2;
	}

	
}