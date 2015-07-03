
var menu = require("./menu");
var canvas = require("./canvas");
var Scale = require("./scale");
var io = require("socket.io-client");


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
	socket = io('http://localhost:8000');
	//socket.on('connection', function (socket) {
		console.log("connect");
		socket.on("keydown", function(data) {
			game.OnKeyDown({keyCode: data}, false);
			console.log(data);
		});
		socket.on("keyup", function(data) {
			game.OnKeyUp({keyCode: data}, false);
			console.log(data);
		});
		socket.on("state", function(data) {
			game.Deserialize(data);
			console.log(data);
		});
	//});
	
};