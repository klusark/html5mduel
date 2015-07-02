var canvas = require("./canvas");

/**
 * @constructor
 */
function Animation(flippedYOffset, startX, frameTime, numFrames, w, h){
	var timeCount = 0,
	frame = 0,
	repeat = true,
	startReverse = false,
	reverse = false,
	xOffset = 0,
	flipped = false,
	numLoops = 0,
	reverseOnFinish = false,
	reversed = false,

	//only usefull if repeat is off
	isAnimationDone = false;

	this.Update = function(deltaT) {
		timeCount += deltaT*1000;
		while (timeCount > frameTime) {
			timeCount -= frameTime;
			frame += 1;
			if (frame === numFrames) {
				if (reverseOnFinish && !reversed) {
					reverse = !reverse;
					reversed = true;
					frame = 0;
				} else if (repeat){
					frame = 0;
					numLoops += 1;
					reversed = false;
				} else {
					frame = numFrames - 1;
					isAnimationDone = true;
					reversed = false;
				}
			}

		}
	};

	this.IsAnimationDone = function() {
		return isAnimationDone;
	};

	this.ChangeTo = function(bflipped) {
		timeCount = 0;
		flipped = bflipped;
		frame = 0;
		isAnimationDone = false;
		reverse = startReverse;
	};

	this.Repeat = function(shouldRepeat) {
		repeat = shouldRepeat;
	};

	this.Reverse = function(shouldReverse) {
		reverse = shouldReverse;
		startReverse = shouldReverse;
	};

	this.SetXOffset = function(offset) {
		xOffset = offset;
	};

	this.SetFrame = function(framenum) {
		frame = framenum;
	};

	this.GetNumLoops = function() {
		return numLoops;
	};

	this.ReverseOnFinish = function(rof) {
		reverseOnFinish = rof;
	};

	this.SetFlipped = function(f) {
		flipped = f;
	};

	this.Draw = function(image, x, y) {
		var sx = frame*w + frame + startX;
		if (reverse){
			sx = startX + (numFrames-1)*w + numFrames - (frame*w + frame + 1);
		}
		canvas.canvas.DrawImage(image,  sx, (flipped * flippedYOffset), w, h, x, y, w, h);
	};
}


module.exports = {
  Animation: Animation
};
