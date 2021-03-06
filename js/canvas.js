var Scale = require("./scale");

/**
 * @constructor
 */
function Canvas() {
	var ctx,
	_canvas,
	scale;

	Scale.scale.ScaleCallback(function(scale){this.ScaleChange(scale);}.bind(this));

	this.DocumentLoaded = function() {
		_canvas = document.getElementById('canvas');
		ctx = _canvas.getContext('2d');

		//only works on firefox 3.6 and up
		//hopefuly chrome gets a similar setting soon
		//this really has no use because of my appengine scaling
		ctx.mozImageSmoothingEnabled = false;

		this.Clear();
	};

	this.DrawImage = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
		if (!ctx || !image || !image.complete){
			return;
		}

		ctx.drawImage(image, sx*scale, sy*scale, sw*scale, sh*scale, Math.round(dx*scale), Math.round(dy*scale), dw*scale, dh*scale);
	};

	this.FillRect = function(x, y, w, h) {
		if (!ctx){
			return;
		}
		ctx.fillRect(x*scale, y*scale, w*scale, h*scale);
	};

	this.FillText = function(text, x, y) {
		if (!ctx){
			return;
		}
		ctx.fillText(text, x*scale, y*scale);
	};

	this.FillStyle = function(style) {
		if (ctx){
			ctx.fillStyle = style;
		}
	};

	this.setFont = function(font) {
		if (ctx){
			ctx.font = font;
		}
	};

	this.setTextAlign = function(align) {
		if (ctx){
			ctx.textAlign = align;
		}
	};

	this.Clear = function() {
		if (!ctx){
			return;
		}
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(0, 0, _canvas.width, _canvas.height);
	};

	this.ScaleChange = function(_scale) {
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

	this.GetContext = function() {
		return ctx;
	};
}

module.exports = {
  Canvas: Canvas,
  canvas: new Canvas()
};

