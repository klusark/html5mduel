
var menu = require("./menu");
var canvas = require("./canvas");
var Scale = require("./scale");
var gm = require("./gamemanager");
var io = require("socket.io-client");

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

var gameToJoin = location.hash;

if (gameToJoin == "") {
	gameToJoin = getRandomInt(1000, 5000);
	location.hash = gameToJoin;
}





window.onload = function()
{

	canvas.canvas.DocumentLoaded();
	Scale.scale.SetScale(3);
	//var m = new menu.Menu();
	//m.Init();
	/*canvas.DocumentLoaded();
	Scale.SetScale(3);
	game = new Game();


	game.init();*/

	var g = new gm.GameManager();
	socket = io('http://mduel.teichroeb.net:8000');
	//socket.on('connection', function (socket) {
		console.log("connect");
		socket.emit("joingame", gameToJoin);
		socket.on("keydown", function(data) {
			g.getGame().OnKeyDown({keyCode: data}, false);
			console.log(data);
		});
		socket.on("keyup", function(data) {
			g.getGame().OnKeyUp({keyCode: data}, false);
			console.log(data);
		});
		socket.on("state", function(data) {
			g.getGame().Deserialize(data);
			console.log(data);
			g.getGame().SetBubbleDisabled(true);
		});
	//});

};
