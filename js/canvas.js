function Canvas() {
	var ctx
	var _canvas
	var scale

	Scale.ScaleCallback(function(scale){canvas.ScaleChange(scale)})
	
	this.DocumentLoaded = function() {
		_canvas = document.getElementById('canvas')
		ctx = _canvas.getContext('2d')
		
		//only works on firefox 3.6 and up
		//hopefuly chrome gets a similar setting soon
		//this really has no use because of my appengine scaling
		ctx.mozImageSmoothingEnabled = false
	}
	
	this.DrawImage = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
		if (!ctx || !image || !image.complete)
			return;
		
		var iscale = scale
		//log.Log(""+sx+", "+sy+", "+sw+", "+sh+", "+dx+", "+dy+", "+dw+", "+dh)
		
		ctx.drawImage(image, sx*iscale, sy*iscale, sw*iscale, sh*iscale, Math.round(dx*iscale), Math.round(dy*iscale), dw*iscale, dh*iscale)
	}


	this.FillRect = function(x, y, w, h) {
		if (!ctx)
			return;
		ctx.fillRect(x*scale, y*scale, w*scale, h*scale)
	}
	this.FillStyle = function(style) {
		if (ctx)
			ctx.fillStyle = style
	}
		
	this.Clear = function() {
		if (!ctx)
			return
		ctx.fillStyle = "rgb(0,0,0)"
		ctx.fillRect(0, 0, _canvas.width, _canvas.height)
	}
	
	this.ScaleChange = function(_scale) {
		scale = _scale
		_canvas.width = 320*scale
		_canvas.height = 200*scale
		log.Log("ScaleChange "+scale);
		var container = document.getElementById("container").style
		container.width = 320*scale
		container.height = 200*scale
		/*var windowwidth = window.innerWidth
		var windowheight = window.innerHeight
		scale = 1
		while (320*(scale+1) < windowwidth && 200*(scale+1) < windowheight)
			++scale
		var canvas = document.getElementById('canvas')
		*/
	}
}

canvas = new Canvas()

