function StaticImage(img, x, y, w, h) {
	this.Draw = function(dx, dy) {
		core.DrawImage(img, x, y, w, h, Math.floor(dx), Math.floor(dy), w, h)
	}
}