import { Game } from "./core";
import { Bubble } from "./bubble";

export class PowerupManager {
	registerdPowerups: string[];
	selectedPowerups: string[];
	game: Game;

	constructor(game: Game) {
		this.game = game;
	}

	RegisterPowerupType(name: string) {
		/*if (powerup[name]){
			var test = new powerup[name]();
			if (test.image){
				this.registerdPowerups.push(name);
				// TODO: Local storage on node
				this.selectedPowerups.push(name);
				/*if (localStorage[name] !== "disabled") {
					selectedPowerups.push(name);
				}*//*
			}
		}*/
	};

	ReigisterPowerups() {
		/*var p, v;
		for (p in powerup){
			if (!p){
				continue;
			}
			v = p.match("Powerup");
			if (v && v.length && v[0] === "Powerup"){
				this.RegisterPowerupType(p);
			}
		}*/
	};

	GetRandomPowerup(bubble: Bubble) {
		/*var name = this.selectedPowerups[Math.floor(Math.random() * this.selectedPowerups.length)];
		return {name: name, powerup: new powerup[name](bubble, this.game)};*/
	};

	CreatePowerupByName(name: string, bubble: Bubble) {
		/*console.log(name);
		return {name: name, powerup: new powerup[name](bubble, this.game)};*/
	};
}


