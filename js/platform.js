function Platform(x, y, numPlatforms){
	var img = new Image();
	img.src = 'images/sprites.png';
	//var lastUpdateTime = new Date().getTime();

	var x = x;
	var y = y;
	
	var numPlatforms = numPlatforms;
	
	this.Draw = function(){
		for (var i = 0; i < numPlatforms; ++i)
			window.ctx.drawImage(img, 143, 0, 14, 8, i*16 + x + 1, y, 14, 8);

	}
	
	this.Update = function(){
		//currentTime = new Date().getTime();
		//var deltaT = currentTime - lastUpdateTime;



		//lastUpdateTime = currentTime;
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