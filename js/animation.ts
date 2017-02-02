import { Canvas } from "./canvas";

export class Animation {

    private timeCount = 0;
    private frame = 0;
    private repeat = true;
    private startReverse = false;
    private reverse = false;
    private xOffset = 0;
    private flipped = false;
    private numLoops = 0;
    private reverseOnFinish = false;
    private reversed = false;

    // only usefull if repeat is off
    private isAnimationDone: boolean = false;

    constructor (private flippedYOffset: number, private startX: number, private frameTime: number, private numFrames: number, private w: number, private h: number) {
    }

    Update(deltaT: number) {
        this.timeCount += deltaT * 1000;
        while (this.timeCount > this.frameTime) {
            this.timeCount -= this.frameTime;
            this.frame += 1;
            if (this.frame === this.numFrames) {
                if (this.reverseOnFinish && !this.reversed) {
                    this.reverse = !this.reverse;
                    this.reversed = true;
                    this.frame = 0;
                } else if (this.repeat) {
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
    }

    IsAnimationDone(): boolean {
        return this.isAnimationDone;
    }

    ChangeTo(bflipped: boolean) {
        this.timeCount = 0;
        this.flipped = bflipped;
        this.frame = 0;
        this.isAnimationDone = false;
        this.reverse = this.startReverse;
    }

    Repeat(shouldRepeat: boolean) {
        this.repeat = shouldRepeat;
    }

    Reverse(shouldReverse: boolean) {
        this.reverse = shouldReverse;
        this.startReverse = shouldReverse;
    }

    SetXOffset(offset: number) {
        this.xOffset = offset;
    }

    SetFrame(framenum: number) {
        this.frame = framenum;
    }

    GetNumLoops() {
        return this.numLoops;
    }

    ReverseOnFinish(rof: boolean) {
        this.reverseOnFinish = rof;
    }

    SetFlipped(f: boolean) {
        this.flipped = f;
    }

    Draw(image: HTMLImageElement, x: number, y: number, canvas: Canvas) {
        let sx = this.frame * this.w + this.frame + this.startX;
        if (this.reverse) {
            sx = this.startX + (this.numFrames - 1) * this.w + this.numFrames - (this.frame * this.w + this.frame + 1);
        }
        canvas.DrawImage(image,  sx, this.flipped ? this.flippedYOffset : 0, this.w, this.h, x, y, this.w, this.h);
    }
}
