function StaticImage(img, x, y, w, h) {
	this.Draw = function(dx, dy) {
		core.DrawImage(img, x, y, w, h, dx, dy, w, h)
	}
}