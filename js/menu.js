var button = require("./button");
var canvas = require("./canvas");
var gamemanager = require("./gamemanager");

function Menu() {
	var drawInterval,
	buttons = [],
	currentButton = 0,
	ingameMenu = [],
	game;

	this.Init = function() {
		buttons[0] = new button.Button(110, 20, 100, 20, "Start Game", this.StartGame);
		buttons[0].Select();
		buttons[1] = new button.Button(110, 50, 100, 20, "Load Character", this.LoadCharacter);
		buttons[2] = new button.Button(110, 80, 100, 20, "Somthing Else", this.LoadCharacter);
		DrawMenu();

		document.onkeyup = function(e){this.OnKeyUp(e);}.bind(this);
		document.onkeydown = function(e){this.OnKeyDown(e);}.bind(this);
		drawInterval = setInterval(UpdateMenu, 10);
	};

	function UpdateMenu() {
		if (!game) {
			DrawMenu();
		} else if (game.IsGameOver()){
			game = null;
		}

	};

	function DrawMenu() {
		var i;
		canvas.canvas.Clear();
		for (i = 0; i < buttons.length; i += 1){
			buttons[i].Draw();
		}
	};

	this.OnKeyDown = function(event) {
		//if (game) {
		//	game.OnKeyDown(event);
		//}
	};

	this.OnKeyUp = function(event) {
		if (event.keyCode === 109) {
			Scale.SetScale(Scale.GetScale()-1);
		} else if (event.keyCode === 107){
			Scale.SetScale(Scale.GetScale()+1);
		}
		//console.log(event.keyCode);
		if (game) {
		//	game.OnKeyUp(event);
		} else if (game) {
			//this is intentionally left blank.
		} else if (event.keyCode === 38) {
			buttons[currentButton].Deselect();
			currentButton -= 1;
			if (currentButton < 0) {
				currentButton = buttons.length-1;
			}
			buttons[currentButton].Select();
		} else if (event.keyCode === 40) {
			buttons[currentButton].Deselect();
			currentButton += 1;
			if (currentButton > buttons.length-1) {
				currentButton = 0;
			}
			buttons[currentButton].Select();
		} else if (event.keyCode === 13) {
			buttons[currentButton].Click();
		}
	};

	this.StartGame = function() {
		//clearInterval(drawInterval);
		game = new gamemanager.GameManager();
		//game = new Game();
		//game.init();
	};
}




module.exports = {
  Menu: Menu
};
