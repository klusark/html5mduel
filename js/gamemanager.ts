import { Game } from "./core";
import { Time } from "./time";
import { Scale } from "./scale";
import { Canvas } from "./canvas";

class PlayerInfo {
	name: string;
	score: number;
	constructor(name: string) {
		this.name = name;
		this.score = 0;
	}
}

export class GameManager {
	time = new Time();
	players: PlayerInfo[] = [];
	updateInterval: number;
	firstRound = true;
	betweenRounds = true;
	lastRoundEnd = this.time.Get();
	gameOver = false;
	maxScore = 3;
	game: Game;
	canvas = new Canvas();
	scale = new Scale();

	constructor() {
		this.players[0] = new PlayerInfo("Player 1");
		this.players[1] = new PlayerInfo("Player 2");
		this.updateInterval = setInterval(() => this.Update, 10);
	}

	getGame() {
		return this.game;
	};

	IsGameOver() {
		return this.gameOver && this.time.Get() > this.lastRoundEnd + 3000;
	};

	private Draw() {
		var text, name, s1, s2, other;

		if (this.betweenRounds) {
			this.canvas.Clear();
			if (this.firstRound) {
				text = this.players[0].name + " vs. " + this.players[1].name;
			} else if (this.players[0].score === this.maxScore || this.players[1].score === this.maxScore) {
				if (this.players[0].score === this.maxScore){
					text = this.players[0].name;
					other = this.players[1].score;
				} else {
					text = this.players[1].name;
					other = this.players[0].score;
				}
				text += " wins the series, " + this.maxScore + " - " + other + ".";
				this.gameOver = true;
				clearInterval(this.updateInterval);
			} else if (this.players[0].score === this.players[1].score) {
				let score = this.players[0].score;
				text = "Series tied, " + score + " - " + score + ".";
			} else{
				if (this.players[0].score < this.players[1].score) {
					name = this.players[1].name;
					s1 = this.players[1].score;
					s2 = this.players[0].score;
				} else {
					name = this.players[0].name;
					s1 = this.players[0].score;
					s2 = this.players[1].score;
				}
				text = name + " leads the series, " + s1 + " - " + s2 + ".";
			}
			this.canvas.FillStyle("rgb(166,65,166)");
			this.canvas.setFont(this.scale.GetScale() + "em 'Allerta'");
			this.canvas.setTextAlign("center");
			this.canvas.FillText(text, 160, 100);
		}
	}

	private Update() {
		var endTime, ttime, winner;
		if (this.betweenRounds && !this.gameOver) {
			ttime = this.time.Get();

			// I think 2000 is for showing the game description screen
			if (this.lastRoundEnd /*+ 2000*/ < ttime) {
				this.betweenRounds = false;
				this.time.StartTime();
				this.game = new Game(this.time);
				this.game.init();
			}
		} else if (this.game) {
			endTime = this.game.GetGameEndTime();
			if (endTime !== 0 && endTime + 1000 < this.time.Get()) {
				this.firstRound = false;
				winner = this.game.GetWinner();
				if (winner === 0){
					this.players[0].score += 1;
				} else if (winner === 1) {
					this.players[1].score += 1;
				}
				this.game.End();
				this.game = null;
				this.betweenRounds = true;
				this.lastRoundEnd = this.time.Get();
			}
		}
		this.Draw();
	}

}
