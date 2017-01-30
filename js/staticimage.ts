import { Canvas } from "./canvas";

export class StaticImage {
	img: HTMLImageElement;
	x: number;
	y: number;
	w: number;
	h: number;
	canvas: Canvas;
	construct(img: HTMLImageElement, x: number, y: number, w: number, h: number) {
		this.canvas = new Canvas();
		this.img = img;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	Draw(dx: number, dy: number) {
		this.canvas.DrawImage(this.img, this.x, this.y, this.w, this.h, Math.floor(dx), Math.floor(dy), this.w, this.h);
	}
}
