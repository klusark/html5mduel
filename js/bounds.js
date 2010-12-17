/**
 * @constructor
 */
function Bounds(xI, yI, wI, hI){
	var x = xI,
	y = yI,
	w = wI,
	h = hI;
	this.GetX = function() {
		return x;
	};
	this.GetY = function() {
		return y;
	};
	this.GetWidth = function() {
		return w;
	};
	this.GetHeight = function() {
		return h;
	};
}
