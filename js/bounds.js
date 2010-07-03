function Bounds(x, y, w, h){
	var x = x;
	var y = y;
	var w = w;
	var h = h;
	this.GetX = function() {
		return x;
	}
	this.GetY = function() {
		return y;
	}
	this.GetWidth = function() {
		return w;
	}
	this.GetHeight = function() {
		return h;
	}
	
}