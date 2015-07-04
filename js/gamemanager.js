var time_ = require("./time");
var canvas = require("./canvas");
var Scale = require("./scale");
var core = require("./core");

function GameManager() {
	function PlayerInfo(name) {
		this.name = name;
		this.score = 0;
	}
	var time = new time_.Time(),
	players = [],
	updateInterval,
	firstRound = true,
	betweenRounds = true,
	lastRoundEnd = time.Get(),
	updateInterval = setInterval(Update, 10),
	gameOver = false,
	maxScore = 3,
	game;

	players[0] = new PlayerInfo("Player 1");
	players[1] = new PlayerInfo("Player 2");

	this.IsGameOver = function() {
		return gameOver && time.Get() > lastRoundEnd + 3000;
	};

	function Draw() {
		var text, name, s1, s2, other;

		if (betweenRounds) {
			canvas.canvas.Clear();
			if (firstRound) {
				text = players[0].name + " vs. " + players[1].name;
			} else if (players[0].score === maxScore || players[1].score === maxScore) {
				if (players[0].score === maxScore){
					text = players[0].name;
					other = players[1].score;
				} else {
					text = players[1].name;
					other = players[0].score;
				}
				text += " wins the series, " + maxScore + " - " + other + ".";
				gameOver = true;
				clearInterval(updateInterval);
			} else if (players[0].score === players[1].score) {
				score = players[0].score;
				text = "Series tied, " + score + " - " + score + ".";
			} else{
				if (players[0].score < players[1].score) {
					name = players[1].name;
					s1 = players[1].score;
					s2 = players[0].score;
				} else {
					name = players[0].name;
					s1 = players[0].score;
					s2 = players[1].score;
				}
				text = name + " leads the series, " + s1 + " - " + s2 + ".";
			}
			canvas.canvas.FillStyle("rgb(166,65,166)");
			canvas.canvas.setFont(Scale.scale.GetScale() + "em 'Allerta'");
			canvas.canvas.setTextAlign("center");
			canvas.canvas.FillText(text, 160, 100);
		}
	}

	function Update() {
		var endTime, ttime, winner;
		if (betweenRounds && !gameOver) {
			ttime = time.Get();

			// I think 2000 is for showing the game description screen
			if (lastRoundEnd /*+ 2000*/ < ttime) {
				betweenRounds = false;
				time.StartTime();
				game = new core.Game(time);
				game.init();
			}
		} else if (game) {
			endTime = game.GetGameEndTime();
			if (endTime !== 0 && endTime + 1000 < time.Get()) {
				firstRound = false;
				winner = game.GetWinner();
				if (winner === 0){
					players[0].score += 1;
				} else if (winner === 1) {
					players[1].score += 1;
				}
				game.End();
				game = null;
				betweenRounds = true;
				lastRoundEnd = time.Get();
			}
		}
		Draw();
	}

}

module.exports = {
  GameManager: GameManager
};