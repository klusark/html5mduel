var gm = require("./gamemanager");


var io = require("socket.io");

var managers = {};

var socket = io(8000);
socket.on("connection", function (socket) {
    var g, interval;
    console.log("asdf");
    socket.on("keydown", function(data) {
        if (typeof g != "undefined") {
            g.getGame().OnKeyDown({keyCode: data});
            console.log(data);
            socket.broadcast.emit("keydown", data);
        }
    });
    socket.on("keyup", function(data) {
        if (typeof g != "undefined") {
            g.getGame().OnKeyUp({keyCode: data});
            console.log(data);
            socket.broadcast.emit("keyup", data);
        }
    });
    socket.on("joingame", function(data) {
        g = managers[data];
        if (typeof g == "undefined") {
            g = new gm.GameManager();
            managers[data] = g;
            console.log("create game");
        }

    });
    interval = setInterval(function() {
        if (typeof g != "undefined") {
            socket.emit("state", g.getGame().Serialize());
        }
    },1000);
});



