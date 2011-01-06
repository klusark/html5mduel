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
		canvas.FillStyle(selected ? selectedColour : unselectedColour);
		canvas.FillRect(x, y, w, h);
		canvas.FillStyle(backgroundColour);
		canvas.FillRect(x+boarder, y+boarder, w-(boarder*2), h-(boarder*2));

		var ctx = canvas.GetContext();
		canvas.FillStyle(selected ? selectedColour : unselectedColour);

		//TODO: Add a way to scale the font.
		ctx.font = Scale.GetScale()*.75 + "em 'Allerta'";
		ctx.textAlign = "center";
		canvas.FillText(text, x+w/2, y+15);
	};
}
