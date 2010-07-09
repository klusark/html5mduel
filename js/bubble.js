
function Bubble(x, y, xVelocity, yVelocity) {
	var img = core.GetSpritesImg()
	var lastUpdateTime = core.GetTime()
	
	var animation = new Animation(25, 336, 200, 3, 16, 16);

	
	/*var powerups = new Array()
	powerups[0] = new StaticImage(core.GetSpritesImg(), 284, 0, 12, 12)
	powerups[0].name = "Gun"
	
	powerups[1] = new StaticImage(img, 258, 0, 12, 12)
	powerups[1].name = "Skull"
	
	powerups[2] = new StaticImage(img, 258, 13, 12, 12)
	powerups[2].name = "1000v"
	
	powerups[3] = new StaticImage(img, 271, 0, 12, 12)
	powerups[3].name = "Invis"
	
	powerups[4] = new StaticImage(img, 271, 13, 12, 12)
	powerups[4].name = "Mine"
	
	powerups[5] = new StaticImage(img, 284, 13, 12, 12)
	powerups[5].name = "Destroy"
	
	powerups[6] = new StaticImage(img, 297, 0, 12, 12)
	powerups[6].name = "Boots"
	
	powerups[7] = new StaticImage(img, 297, 13, 12, 12)
	powerups[7].name = "Nade"

	powerups[8] = new StaticImage(img, 310, 0, 12, 12)
	powerups[8].name = "Nukepuck"
	
	powerups[9] = new StaticImage(img, 310, 13, 12, 12)
	powerups[9].name = "Chute"
	
	powerups[10] = new StaticImage(img, 323, 13, 12, 12)
	powerups[10].name = "Hook"
	
	//dont you love javascript?
	powerups[11] = new function(){this.Draw=function(dx, dy){}}
	powerups[11].name = "Teleport"
	
	do {
		var currentPowerup = powerups[Math.floor(Math.random()*powerups.length)]
		var powerup
		if (window["Powerup"+currentPowerup.name])
			powerup = new window["Powerup"+powerups[Math.floor(Math.random()*powerups.length)]](this)
		else
			console.log("implement Powerup" + currentPowerup.name)
	} while(!window["Powerup"+currentPowerup.name])*/
	var powerup
	var x = x
	var y = y
	var yVelocity = yVelocity
	var xVelocity = xVelocity

	var done = false

	var currentBounds = new Bounds(0, 0, 16, 16)
	
	this.SetCurrentPowerup = function(npowerup) {
		powerup = npowerup
	}

	this.Draw = function() {
		animation.Draw(img, x, y)
		powerup.image.Draw(x+2, y+2)
	}
	
	this.Update = function() {
		currentTime = core.GetTime()
		var deltaT = (currentTime - lastUpdateTime)/1000
		
		
		x += deltaT*xVelocity
		var ya = y+ deltaT*yVelocity
		if (powerup && powerup.CollidePlatform){
			var platform = core.IsOnGround(y, ya, this)
			if (platform)
				powerup.CollidePlatform(platform)
		}
		y = ya
		if (powerup && powerup.Update){
			powerup.Update()
		}
		
		if (y > 163){
			y = 163
			yVelocity *= -1
		} else if (y < -2) {
			y = -2
			yVelocity *= -1
		}
		if (x > 306) {
			x = 306
			xVelocity *= -1
		} else if (x < -2) {
			x = -2
			xVelocity *= -1
		}
		
		animation.Update()

		lastUpdateTime = currentTime
		
	}
	
	this.CollidePlayer = function(player) {
		if (powerup && powerup.CollidePlayer)
			powerup.CollidePlayer(player)
	}
	
	this.GetPowerupName = function() {
		return currentPowerup.name
	}

	this.SetImage = function(image){
		img = image
	}
	
	this.GetY = function(){
		return y
	}
	
	this.GetX = function(){
		return x
	}
	
	this.GetXVelocity = function() {
		return xVelocity
	}
	
	this.GetYVelocity = function() {
		return yVelocity
	}
	
	this.SetY = function(ny) {
		y = ny
	}
	
	this.SetX = function(nx) {
		x = nx
	}
	
	this.IsDone = function() {
		return done
	}
	
	this.SetDone = function(nDone) {
		done = nDone
	}

	
	this.GetCurrentBounds = function() {
		return currentBounds
	}
	
}