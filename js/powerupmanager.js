/*global window, localStorage*/

var powerup = require("./powerup");

/**
 * @constructor
 */
function PowerupManager(game){
	var registerdPowerups = [],
	selectedPowerups = [];

	this.RegisterPowerupType = function(name) {
		if (powerup[name]){
			var test = new powerup[name]();
			if (test.image){
				registerdPowerups.push(name);
				// TODO: Local storage on node
				selectedPowerups.push(name);
				/*if (localStorage[name] !== "disabled") {
					selectedPowerups.push(name);
				}*/
			}
		}
	};

	this.ReigisterPowerups = function() {
		var p, v;
		for (p in powerup){
			if (!p){
				continue;
			}
			v = p.match("Powerup");
			if (v && v.length && v[0] === "Powerup"){
				this.RegisterPowerupType(p);
			}
		}
	};

	this.GetRandomPowerup = function(bubble) {
		return new powerup[selectedPowerups[Math.floor(Math.random()*selectedPowerups.length)]](bubble, game);
	};
}

module.exports = {
  PowerupManager: PowerupManager
};

