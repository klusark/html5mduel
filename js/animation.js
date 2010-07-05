function Animation(flippedYOffset, startX, frameTime, numFrames, w, h){

	var frameTime = frameTime
	var numFrames = numFrames
	var NextFrameTime = core.GetTime() + frameTime
	var frame = 0
	var w = w
	var h = h
	var repeat = true
	var reverse = false
	var xOffset = 0
	var flipped = false
	var numLoops = 0
	
	//only usefull if repeat is off
	var isAnimationDone = false;
	
	this.Update = function() {
		var currentTime = core.GetTime()
		while (NextFrameTime < currentTime) {
			NextFrameTime += frameTime;
			++frame;
			if (frame == numFrames) {
				if (repeat){
					frame = 0;
					++numLoops;
				} else {
					frame = numFrames-1;
					isAnimationDone = true;
				}
			}

		}
	}
	
	this.IsAnimationDone = function() {
		return isAnimationDone
	}
	
	this.ChangeTo = function(bflipped) {
		NextFrameTime = core.GetTime() + frameTime;
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
	
	this.GetNumLoops = function() {
		return numLoops
	}
	
	this.Draw = function(image, x, y, scale) {
		//rounding is to fix an inconsistancy in firefox vs chrome
		var sx = frame*w + frame + startX
		if (reverse){
			sx = startX + (numFrames-1)*w + numFrames - (frame*w + frame + 1)
		}
		scale = scale || -1
		core.DrawImage(image,  sx, (flipped * flippedYOffset), w, h, Math.round(x), Math.round(y), w, h, scale);
	}
}