/*global window, localStorage*/
/**
 * @constructor
 */
function PowerupManager(){
	var registerdPowerups = [],
	selectedPowerups = [];

	this.RegisterPowerupType = function(name) {
		if (window[name]){
			var test = new window[name]();
			if (test.image){
				registerdPowerups.push(name);
				if (localStorage[name] !== "disabled") {
					selectedPowerups.push(name);
				}
			}
		}
	};

	this.ReigisterPowerups = function() {
		var p, v;
		for (p in window){
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
		return new window[selectedPowerups[Math.floor(Math.random()*selectedPowerups.length)]](bubble);
	};
}

