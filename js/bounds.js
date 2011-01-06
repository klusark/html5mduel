/**
 * @constructor
 */
function Bounds(x, y, w, h){
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
