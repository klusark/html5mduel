
var imagemanager = require("./imagemanager");
var staticimage = require("./staticimage");
var canvas = require("./canvas");

/**
 * @constructor
 */
function Rope(x, y, length){
	var img = imagemanager.image.GetSpritesImg(),
	ropeTop = new staticimage.StaticImage(img, 143, 9, 5, 5);

	length -= 2;

	y -= 2;


	this.Draw = function(){
		ropeTop.Draw(x, y);

		canvas.canvas.FillStyle("rgb(146,97,0)");
		canvas.canvas.FillRect(x+2, y+5, 1, length);
	};

	this.Update = function(){
	};

	this.GetLength = function(){
		return length;
	};

	this.GetY = function(){
		return y+5;
	};

	this.GetX = function(){
		return x+2;
	};
	
	this.Serialize = function() {
		return  {x: x, y: y, length: length};
	}
}

module.exports = {
  Rope: Rope
};

