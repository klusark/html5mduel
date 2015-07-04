var canvas = require("./canvas");
var Scale = require("./scale");

function Button(x, y, w, h, text, onclick) {
	var selected = false,
	boarder = 2,
	selectedColour = "rgb(14,97,54)",
	unselectedColour = "rgb(146,97,0)",
	backgroundColour = "rgb(0,0,0)";

	this.Select = function() {
		selected = true;
	};

	this.Deselect = function() {
		selected = false;
	};

	this.Click = function() {
		onclick();
	};

	this.Draw = function() {
		canvas.canvas.FillStyle(selected ? selectedColour : unselectedColour);
		canvas.canvas.FillRect(x, y, w, h);
		canvas.canvas.FillStyle(backgroundColour);
		canvas.canvas.FillRect(x+boarder, y+boarder, w-(boarder*2), h-(boarder*2));

		canvas.canvas.FillStyle(selected ? selectedColour : unselectedColour);

		//TODO: Add a way to scale the font.
		canvas.canvas.setFont(Scale.scale.GetScale()*0.75 + "em 'Allerta'");
		canvas.canvas.setTextAlign("center");
		canvas.canvas.FillText(text, x+w/2, y+15);
	};
}

module.exports = {
  Button: Button
};

