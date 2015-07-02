
var menu = require("./menu");
var canvas = require("./canvas");
var Scale = require("./scale");



window.onload = function()
{

	canvas.canvas.DocumentLoaded();
	Scale.scale.SetScale(3);
	var m = new menu.Menu();
	m.Init();
	/*canvas.DocumentLoaded();
	Scale.SetScale(3);
	game = new Game();

	game.init();*/
};