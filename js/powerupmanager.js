function PowerupManager(){
	var registerdPowerups = new Array()
	var selectedPowerups = new Array()

	this.RegisterPowerupType = function(name) {
		if (window["Powerup" + name]){
			var test = new window["Powerup" + name]()
			if (test.image)
				registerdPowerups.push(name)
				if (localStorage["Powerup" + name] != "disabled") {
					selectedPowerups.push(name)
				}
		}
	}
	this.GetRandomPowerup = function(bubble) {
		return new window["Powerup"+selectedPowerups[Math.floor(Math.random()*selectedPowerups.length)]](bubble)
	}
}

var powerups = new PowerupManager()
