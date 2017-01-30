import { Canvas } from "./canvas";

export class StaticImage {
	canvas: Canvas;
	constructor(private img: HTMLImageElement, private x: number, private y: number, private w: number, private h: number) {
		this.canvas = new Canvas();
	}
	Draw(dx: number, dy: number) {
		this.canvas.DrawImage(this.img, this.x, this.y, this.w, this.h, Math.floor(dx), Math.floor(dy), this.w, this.h);
	}
}
