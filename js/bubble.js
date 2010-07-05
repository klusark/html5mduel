function Bubble(x, y, xVelocity, yVelocity){
	var img = core.GetSpritesImg()
	var lastUpdateTime = core.GetTime()
	
	var animation = new Animation(25, 336, 200, 3, 16, 16);

	
	var powerups = new Array()
	powerups[0] = new StaticImage(img, 284, 0, 12, 12)
	powerups[0].name = "gun"
	
	powerups[1] = new StaticImage(img, 258, 0, 12, 12)
	powerups[1].name = "skull"
	
	powerups[2] = new StaticImage(img, 258, 13, 12, 12)
	powerups[2].name = "10000v"
	
	powerups[3] = new StaticImage(img, 271, 0, 12, 12)
	powerups[3].name = "invis"
	
	powerups[4] = new StaticImage(img, 271, 13, 12, 12)
	powerups[4].name = "mine"
	
	powerups[5] = new StaticImage(img, 284, 13, 12, 12)
	powerups[5].name = "destroy"
	
	powerups[6] = new StaticImage(img, 297, 0, 12, 12)
	powerups[6].name = "boots"
	
	powerups[7] = new StaticImage(img, 297, 13, 12, 12)
	powerups[7].name = "nade"

	powerups[8] = new StaticImage(img, 310, 0, 12, 12)
	powerups[8].name = "nukepuck"
	
	powerups[9] = new StaticImage(img, 310, 13, 12, 12)
	powerups[9].name = "chut"
	
	powerups[10] = new StaticImage(img, 323, 0, 12, 12)
	powerups[10].name = "hook"
	

	var currentPowerup = powerups[Math.floor(Math.random()*powerups.length)]
	
	var x = x
	var y = y
	var yVelocity = yVelocity
	var xVelocity = xVelocity

	var done = false

	var currentBounds = new Bounds(0, 0, 16, 16)
	


	this.Draw = function(){
		animation.Draw(img, x, y)
		currentPowerup.Draw(x+2, y+2)
	}
	
	this.Update = function(){
		currentTime = core.GetTime()
		var deltaT = (currentTime - lastUpdateTime)/1000
		
		
		x += deltaT*xVelocity
		y += deltaT*yVelocity	
		
		if (y > 160){
			y = 160
			yVelocity *= -1
		} else if (y < 0) {
			y = 0
			yVelocity *= -1
		}
		if (x > 300) {
			x = 300
			xVelocity *= -1
		} else if (x < 0) {
			x = 0
			xVelocity *= -1
		}
		
		animation.Update()

		lastUpdateTime = currentTime
		
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