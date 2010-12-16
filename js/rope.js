function Rope(x, y, length){
	var img = image.GetSpritesImg()

	var length = length-2;
	var x = x;
	var y = y-2;
	
	var ropeTop = new StaticImage(img, 143, 9, 5, 5)
	
	this.Draw = function(){
		ropeTop.Draw(x, y)

		canvas.FillStyle("rgb(146,97,0)")
		canvas.FillRect(x+2, y+5, 1, length)
	}
	
	this.Update = function(){
	}
	
	this.GetLength = function(){
		return length
	}
	
	this.GetY = function(){
		return y+5
	}
	this.GetX = function(){
		return x+2
	}

	
}
