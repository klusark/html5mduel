function Animation(flippedYOffset, startX, frameTime, numFrames, w, h){

	var frameTime = frameTime
	var numFrames = numFrames
	var NextFrameTime = game.GetTime() + frameTime
	var frame = 0
	var w = w
	var h = h
	var repeat = true
	var startReverse = false
	var reverse = false
	var xOffset = 0
	var flipped = false
	var numLoops = 0
	var reverseOnFinish = false
	var reversed = false

	//only usefull if repeat is off
	var isAnimationDone = false;

	this.Update = function() {
		var currentTime = game.GetTime()
		while (NextFrameTime < currentTime) {
			NextFrameTime += frameTime;
			++frame;
			if (frame == numFrames) {
				if (reverseOnFinish && !reversed) {
					reverse = !reverse
					reversed = true
					frame = 0;
				} else if (repeat){
					frame = 0;
					++numLoops;
					reversed = false
				} else {
					frame = numFrames-1;
					isAnimationDone = true;
					reversed = false
				}
			}

		}
	}

	this.IsAnimationDone = function() {
		return isAnimationDone
	}

	this.ChangeTo = function(bflipped) {
		NextFrameTime = game.GetTime() + frameTime;
		flipped = bflipped
		frame = 0;
		isAnimationDone = false
		reverse = startReverse
	}

	this.Repeat = function(shouldRepeat) {
		repeat = shouldRepeat
	}

	this.Reverse = function(shouldReverse) {
		reverse = shouldReverse
		startReverse = shouldReverse
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

	this.ReverseOnFinish = function(rof) {
		reverseOnFinish = rof
	}

	this.SetFlipped = function(f) {
		flipped = f
	}

	this.Draw = function(image, x, y, scale) {
		//rounding is to fix an inconsistancy in firefox vs chrome
		var sx = frame*w + frame + startX
		if (reverse){
			sx = startX + (numFrames-1)*w + numFrames - (frame*w + frame + 1)
		}
		scale = scale || -1
		canvas.DrawImage(image,  sx, (flipped * flippedYOffset), w, h, x, y, w, h, scale);
	}
}
