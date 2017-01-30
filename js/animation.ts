import { Canvas } from "./canvas";

export class Animation {
	
	timeCount = 0;
	frame = 0;
	repeat = true;
	startReverse = false;
	reverse = false;
	xOffset = 0;
	flipped = false;
	numLoops = 0;
	reverseOnFinish = false;
	reversed = false;
	flippedYOffset: number;
	startX: number;
	frameTime: number;
	numFrames: number;
	w: number;
	h: number;

	// only usefull if repeat is off
	isAnimationDone = false;

	canvas: Canvas;

	constructor (flippedYOffset: number, startX: number, frameTime: number, numFrames: number, w: number, h: number) {
		this.flippedYOffset = flippedYOffset;
		this.startX = startX;
		this.frameTime = frameTime;
		this.numFrames = numFrames;
		this.w = w;
		this.h = h;
		this.canvas = new Canvas();
	}

	Update(deltaT: number) {
		this.timeCount += deltaT*1000;
		while (this.timeCount > this.frameTime) {
			this.timeCount -= this.frameTime;
			this.frame += 1;
			if (this.frame === this.numFrames) {
				if (this.reverseOnFinish && !this.reversed) {
					this.reverse = !this.reverse;
					this.reversed = true;
					this.frame = 0;
				} else if (this.repeat){
					this.frame = 0;
					this.numLoops += 1;
					this.reversed = false;
				} else {
					this.frame = this.numFrames - 1;
					this.isAnimationDone = true;
					this.reversed = false;
				}
			}

		}
	};

	IsAnimationDone = function() {
		return this.isAnimationDone;
	};

	ChangeTo = function(bflipped: boolean) {
		this.timeCount = 0;
		this.flipped = bflipped;
		this.frame = 0;
		this.isAnimationDone = false;
		this.reverse = this.startReverse;
	};

	Repeat = function(shouldRepeat: boolean) {
		this.repeat = shouldRepeat;
	};

	Reverse = function(shouldReverse: boolean) {
		this.reverse = shouldReverse;
		this.startReverse = shouldReverse;
	};

	SetXOffset = function(offset: number) {
		this.xOffset = offset;
	};

	SetFrame = function(framenum: number) {
		this.frame = framenum;
	};

	GetNumLoops = function() {
		return this.numLoops;
	};

	ReverseOnFinish = function(rof: boolean) {
		this.reverseOnFinish = rof;
	};

	SetFlipped = function(f: boolean) {
		this.flipped = f;
	};

	Draw = function(image: HTMLImageElement, x: number, y: number) {
		var sx = this.frame*this.w + this.frame + this.startX;
		if (this.reverse){
			sx = this.startX + (this.numFrames-1)*this.w + this.numFrames - (this.frame*this.w + this.frame + 1);
		}
		this.canvas.DrawImage(image,  sx, (this.flipped * this.flippedYOffset), this.w, this.h, x, y, this.w, this.h);
	};
}
