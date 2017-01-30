import { scale } from "./scale";

class Canvas {
	ctx: any;
	_canvas: any;
	scale: number;

    constructor() {

        scale.ScaleCallback((scale: number) => {this.ScaleChange(scale);});
    }

	DocumentLoaded(): void {
		_canvas = document.getElementById('canvas');
		ctx = _canvas.getContext('2d');

		//only works on firefox 3.6 and up
		//hopefuly chrome gets a similar setting soon
		//this really has no use because of my appengine scaling
		ctx.mozImageSmoothingEnabled = false;

		this.Clear();
	};

	DrawImage(image, sx, sy, sw, sh, dx, dy, dw, dh): void {
		if (!ctx || !image || !image.complete){
			return;
		}

		ctx.drawImage(image, sx*scale, sy*scale, sw*scale, sh*scale, Math.round(dx*scale), Math.round(dy*scale), dw*scale, dh*scale);
	};

	FillRect(x, y, w, h) {
		if (!ctx){
			return;
		}
		ctx.fillRect(x*scale, y*scale, w*scale, h*scale);
	};

	FillText(text, x, y) {
		if (!ctx){
			return;
		}
		ctx.fillText(text, x*scale, y*scale);
	};

	FillStyle(style) {
		if (ctx){
			ctx.fillStyle = style;
		}
	};

	setFont(font) {
		if (ctx){
			ctx.font = font;
		}
	};

	setTextAlign(align) {
		if (ctx){
			ctx.textAlign = align;
		}
	};

	Clear() {
		if (!ctx){
			return;
		}
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(0, 0, _canvas.width, _canvas.height);
	};

	ScaleChange(_scale: number) {
		scale = _scale;
		_canvas.width = 320*scale;
		_canvas.height = 200*scale;
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
		return ctx;
	};
}

module.exports = {
  Canvas: Canvas,
  canvas: new Canvas()
};

