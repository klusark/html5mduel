import { Scale } from "./scale";

export class Canvas {
	ctx: any;
	_canvas: HTMLCanvasElement;
	scale: number;
	s: Scale;

    constructor() {
		this.s = new Scale();

        this.s.ScaleCallback((_scale: number) => {this.ScaleChange(_scale);});
    }

	DocumentLoaded(): void {
		this._canvas = <HTMLCanvasElement> document.getElementById('canvas');
		this.ctx = this._canvas.getContext('2d');

		//only works on firefox 3.6 and up
		//hopefuly chrome gets a similar setting soon
		//this really has no use because of my appengine scaling
		this.ctx.mozImageSmoothingEnabled = false;

		this.Clear();
	};

	DrawImage(image: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void {
		if (!this.ctx || !image || !image.complete){
			return;
		}

		this.ctx.drawImage(image, sx*this.scale, sy*this.scale, sw*this.scale, sh*this.scale, Math.round(dx*this.scale), Math.round(dy*this.scale), dw*this.scale, dh*this.scale);
	};

	FillRect(x: number, y: number, w: number, h: number) {
		if (!this.ctx){
			return;
		}
		this.ctx.fillRect(x*this.scale, y*this.scale, w*this.scale, h*this.scale);
	};

	FillText(text: string, x: number, y: number): number {
		if (!this.ctx){
			return;
		}
		this.ctx.fillText(text, x*this.scale, y*this.scale);
	};

	FillStyle(style: string) {
		if (this.ctx){
			this.ctx.fillStyle = style;
		}
	};

	setFont(font: string) {
		if (this.ctx){
			this.ctx.font = font;
		}
	};

	setTextAlign(align: string) {
		if (this.ctx){
			this.ctx.textAlign = align;
		}
	};

	Clear() {
		if (!this.ctx){
			return;
		}
		this.ctx.fillStyle = "rgb(0,0,0)";
		this.ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
	};

	ScaleChange(_scale: number) {
		this.scale = _scale;
		this._canvas.width = 320*this.scale;
		this._canvas.height = 200*this.scale;
		//log.Log("ScaleChange "+scale);
		this.Clear();
		//var container = document.getElementById("container").style;
		//container.width = 320*scale;
		//container.height = 200*scale;
		/*var windowwidth = window.innerWidth
		var windowheight = window.innerHeight
		scale = 1
		while (320*(scale+1) < windowwidth && 200*(scale+1) < windowheight)
			++scale
		var canvas = document.getElementById('canvas')
		*/
	};

	GetContext() {
		return this.ctx;
	};
}

