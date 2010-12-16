function Emitter(x, y, type) {
	var img = image.GetSpritesImg()

	var emitter = new StaticImage(img, type*16+type+92, 9, 16, 16)

	var x = x
	var y = y
	var type = type

	this.Draw = function() {
		emitter.Draw(x, y)
	}

	this.Update = function() {

	}

	this.GetY = function() {
		return y
	}

	this.GetX = function() {
		return x
	}
}
