function Platform(x, y, numPlatforms){
	var img = core.GetSpritesImg()

	var x = x;
	var y = y;
	
	var numPlatforms = numPlatforms;
	
	var platform = new StaticImage(img, 143, 0, 14, 8)
	
	this.Draw = function(){
		for (var i = 0; i < numPlatforms; ++i)
			platform.Draw(i*16 + x + 1, y)
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