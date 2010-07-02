function Platform(x, y, numPlatforms){
	var img = core.GetSpritesImg()

	var x = x;
	var y = y;
	
	var numPlatforms = numPlatforms;
	
	this.Draw = function(){
		for (var i = 0; i < numPlatforms; ++i)
			core.DrawImage(img, 143, 0, 14, 8, i*16 + x + 1, y, 14, 8);

	}
	
	this.GetNumPlatforms = function(){
		return numPlatforms
	}
	
	this.GetEnd = function(){
		return this.GetNumPlatforms() * 16 + x - 3;
	}
	
	this.GetY = function(){
		return y;
	}
	this.GetX = function(){
		return x;
	}

	
}