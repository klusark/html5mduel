var gm = require("./gamemanager");


var io = require("socket.io");

var gamemanager = new gm.GameManager();


var socket = io(8000);
socket.on('connection', function (socket) {
	console.log("asdf");
	socket.on("keydown", function(data) {
		game.OnKeyDown({keyCode: data});
		console.log(data);
		socket.broadcast.emit("keydown", data);
	});
	socket.on("keyup", function(data) {
		game.OnKeyUp({keyCode: data});
		console.log(data);
		socket.broadcast.emit("keyup", data);
	});
	setInterval(function() {
		socket.emit("state", game.Serialize());
	},1000);
});



