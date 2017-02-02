import { Canvas } from "./canvas";

export class StaticImage {
    constructor(private img: HTMLImageElement, private x: number, private y: number, private w: number, private h: number) {
    }
    Draw(dx: number, dy: number, canvas: Canvas) {
        canvas.DrawImage(this.img, this.x, this.y, this.w, this.h, Math.floor(dx), Math.floor(dy), this.w, this.h);
    }
}
