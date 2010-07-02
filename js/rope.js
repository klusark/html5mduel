function Rope(x, y, length){
	var img = core.GetSpritesImg()

	var length = length-2;
	var x = x;
	var y = y-2;
	
	this.Draw = function(){
		core.DrawImage(img, 143, 9, 5, 5, x, y, 5, 5);
		ctx.fillStyle = "rgb(146,97,0)";  
		core.FillRect(x+2, y+5, 1, length);
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