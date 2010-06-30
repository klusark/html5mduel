function Animation(image, flippedYOffset, startX, frameTime, numFrames, w, h){
	var image = image;

	var frameTime = frameTime;
	var numFrames = numFrames;
	var NextFrameTime = new Date().getTime() + frameTime;
	var frame = 0;
	var x = 0;
	var y = 0;
	var w = w;
	var h = h;
	var repeat = true;
	var reverse = false;
	var xOffset = 0;
	var flipped = false;
	
	//only usefull if repeat is off
	var isAnimationDone = false;
	
	this.Update = function(nx ,ny){
		x = nx;
		y = ny;
		var currentTime = new Date().getTime();
		while (NextFrameTime < currentTime){
			NextFrameTime += frameTime;
			++frame;
			if (frame == numFrames){
				if (repeat)
					frame = 0;
				else{
					frame = numFrames-1;
					isAnimationDone = true;
				}
			}

		}
	}
	
	this.IsAnimationDone = function() {
		return isAnimationDone
	}
	
	this.ChangeTo = function(bflipped){
		NextFrameTime = new Date().getTime() + frameTime;
		/*if(flipped)
			currentImage = imgflipped;
		else
			currentImage = image;*/
		flipped = bflipped
		frame = 0;
		isAnimationDone = false
	}
	
	this.Repeat = function(shouldRepeat) {
		repeat = shouldRepeat;
	}
	
	this.Reverse = function(shouldReverse) {
		reverse = shouldReverse;
	}
	
	this.SetXOffset = function(offset) {
		xOffset = offset;
	}
	
	this.SetFrame = function(framenum) {
		frame = framenum;
	}
	
	this.SetNextFrameTime = function(time) {
		NextFrameTime = time;
	}
	
	this.Draw = function(){
		//rounding is to fix an inconsistancy in firefox vs chrome
		var sx = frame*w + frame + startX;
		if (reverse){
			sx = startX + (numFrames-1)*w + numFrames - (frame*w + frame + 1)
		}
		window.ctx.drawImage(image,  sx, (flipped * flippedYOffset), w, h, Math.round(x), Math.round(y), w, h);
	}
}