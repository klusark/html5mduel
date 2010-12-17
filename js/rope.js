/*global image, StaticImage, canvas*/
/**
 * @constructor
 */
function Rope(x, y, length){
	var img = image.GetSpritesImg(),
	ropeTop = new StaticImage(img, 143, 9, 5, 5);

	length -= 2;

	y -= 2;


	this.Draw = function(){
		ropeTop.Draw(x, y);

		canvas.FillStyle("rgb(146,97,0)");
		canvas.FillRect(x+2, y+5, 1, length);
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
}
