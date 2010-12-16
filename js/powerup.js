function PowerupGun(owner){
	this.image = new StaticImage(image.GetSpritesImg(), 284, 0, 12, 12)
	
	var ammo = 5
	var firing = false
	var inPlayer = false

	//HACK!!! fixes "The 'this' problem"
	var self = this
	var other 
	
	this.Use = function() {
		if (inPlayer && ammo && !firing && owner.IsIdle()){
			owner.InterruptAnimation("gundown", true, function(){self.CheckForKill();owner.InterruptAnimation("gunup", true, function(){firing=false})})
			--ammo
			firing = true
		}
	}
	
	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true)
			owner = player
			player.CollectPowerup(this)
			other = game.GetOponentOf(owner)
			var ownerAnimations = owner.GetAnimations()
			if (!ownerAnimations["gundown"]){
				ownerAnimations["gundown"] = new Animation(25, 450, 100, 2, 24, 24);
				ownerAnimations["gundown"].Repeat(false);
				
				ownerAnimations["gunup"] = new Animation(25, 450, 100, 2, 24, 24);
				ownerAnimations["gunup"].Repeat(false);
				ownerAnimations["gunup"].Reverse(true);
			}
			inPlayer = true
		}
	}
	
	this.CheckForKill = function() {
		sound.Play("shot")
		//need to make this work with turning
		if (game.DoesCollide(new function(){
			this.GetX = function() {
				return owner.IsFlipped() ? owner.GetX()+23 - 320 : owner.GetX()+23
			}
			this.GetY = function() {
				return owner.GetY()+8
			}
			this.GetCurrentBounds = function() {
				return  new Bounds(0,0,320,1)
			}
		}, other))
			other.Disolve()
	}

}

powerups.RegisterPowerupType("Gun")

function PowerupSkull(owner){
	this.image = new StaticImage(image.GetSpritesImg(), 258, 0, 12, 12)
	this.CollidePlayer = function(player) {
		player.CollectPowerup(false)
		player.Disolve2()
		owner.SetDone(true)
		sound.Play("buzz2")
	}
	
}

powerups.RegisterPowerupType("Skull")

function PowerupInvis(owner){
	this.image = new StaticImage(image.GetSpritesImg(), 271, 0, 12, 12)
	var invis = false
	var disabled = false
	var nextAllowedTime = 0
	var inPlayer = false
	
	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true)
			owner = player
			player.CollectPowerup(this)
			inPlayer = true
		}
	}
	
	this.ChangeFrom = function() {
		owner.SetDraw(true)
	}
	
	this.Use = function() {
		if (game.GetTime() < nextAllowedTime || !owner.IsIdle())
			return
		if (!invis) {
			sound.Play("beep3")
			invis = true
			owner.SetDraw(false)
			nextAllowedTime = game.GetTime() + 300
		} else {
			sound.Play("beep2")
			disabled = true
			owner.SetDraw(true)
			owner.CollectPowerup(false)
		}
	}
}

powerups.RegisterPowerupType("Invis")

function Mine(x, y, owner) {
	var other = game.GetOponentOf(owner)
	var bounds = new Bounds(0, 0, 1, 1)
	
	sound.Play("beep")
	
	this.Update = function() {

		var collision = game.DoesCollide(this, owner) ? owner : game.DoesCollide(this, other) ? other : undefined
		if (collision && collision.IsOnGround()){
			collision.Explode()
			this.Explode()
		}

	}
	
	this.Explode = function() {
		game.CreateEffect("explode", x-11, y-20)
		game.RemoveEntity(this)
	}
	
	
	this.GetX = function() {
		return x
	}
	
	this.GetY = function() {
		return y
	}
	
	this.GetCurrentBounds = function() {
		return bounds
	}
}

function PowerupMine(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 271, 13, 12, 12)
	var used = false
	//HACK!!! fixes "The 'this' problem"
	var self = this
	var inPlayer = false
	this.Use = function() {
		if (!inPlayer || used || !owner.IsIdle())
			return
		used = true
		owner.InterruptAnimation("crouch", true, function(){self.LayMine();owner.InterruptAnimation("uncrouch", true)})
	}
	
	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true)
			owner = player
			player.CollectPowerup(this)
			inPlayer = true
		}
	}
	
	this.LayMine = function() {
		sound.Play("beep1")
		var xoff = owner.IsFlipped() ? 4 : 20
		game.AddEntity(new Mine(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+23), owner))
	}
}

powerups.RegisterPowerupType("Mine")

function Puck(x, y, owner, direction) {
	var img = image.GetSpritesImg()
	var other = game.GetOponentOf(owner)
	var bounds = new Bounds(0, 0, 5, 2)
	var animation = new Animation(0, 310, 200, 2, 12, 12);
	var xVelocity = direction ? -90 : 90
	var yVelocity = 70
	var lastUpdateTime = game.GetTime()
	
	this.Draw = function() {
		animation.Draw(img, x-4, y-6)
	}
	
	this.Update = function() {
		var currentTime = game.GetTime()
		var deltaT = (currentTime - lastUpdateTime)/1000
		animation.Update()
		x += xVelocity * deltaT
		var ya = y + yVelocity * deltaT
		var platform = game.IsOnGround(y, ya, this)
		if (!platform) {
			y = ya
		} else {
			y = platform.GetY()-2
		}
		var collision = game.DoesCollide(this, owner) ? owner : game.DoesCollide(this, other) ? other : undefined
		if (collision){
			collision.Explode()
			game.CreateEffect("explode", x-11, y-20)
			game.RemoveEntity(this)
			return
		}
		
		var entities = game.GetEntityCollisionsOf(this)
		
		for (var i = 0; i < entities.length; ++i) {
			if (entities[i].__proto__.constructor.name == "Mine")
				entities[i].Explode()
		}
		
		//make sure it is fully off the screen before it is removed
		if (x < -5 || x > 320){
			game.RemoveEntity(this)
			return
		}
		if (y > 180){
			game.RemoveEntity(this)
			game.CreateEffect("SmallSplash", x-11, y-20)
			return
		}
		lastUpdateTime = currentTime
	}
	
	this.GetX = function() {
		return x
	}
	
	this.GetY = function() {
		return y
	}
	
	this.GetCurrentBounds = function() {
		return bounds
	}
}

function PowerupNukepuck(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 310, 0, 12, 12)
	var used = false
	var inPlayer = false
	//HACK!!! fixes "The 'this' problem"
	var self = this
	this.Use = function() {
		if (!inPlayer || used || !owner.IsIdle())
			return
		used = true
		owner.InterruptAnimation("throwpuck", true, function(){self.ThrowPuck()})
	}

	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true)
			owner = player
			player.CollectPowerup(this)
			var ownerAnimations = owner.GetAnimations()
			if (!ownerAnimations["throwpuck"]){
				ownerAnimations["throwpuck"] = new Animation(25, 1050, 100, 2, 24, 24);
				ownerAnimations["throwpuck"].Repeat(false);
			}
			inPlayer = true
		}
	}
	
	this.ThrowPuck = function() {
		var xoff = owner.IsFlipped() ? 0 : 20
		game.AddEntity(new Puck(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+22), owner, owner.IsFlipped()))
	}
}

powerups.RegisterPowerupType("Nukepuck")

function PowerupDestroy(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 284, 13, 12, 12)
	this.Update = function() {
		var platforms = game.GetPlatforms()
		for (var i = 0; i < platforms.length; ++i){
			if (game.DoesCollide(owner, platforms[i])){
				platforms[i].Destroy(owner.GetX())
				owner.SetDone(true)
				return
			}
		}
	}
}

powerups.RegisterPowerupType("Destroy")

function Nade(x, y, owner, direction) {
	var img = image.GetSpritesImg()
	var bounds = new Bounds(0, 0, 5, 4)
	var animation = new StaticImage(image.GetSpritesImg(), 300, 18, 5, 4);
	var xVelocity = direction ? -70 : 70
	var yVelocity = -150
	var yAcceleration = 350
	var lastUpdateTime = game.GetTime()
	
	this.Draw = function() {
		animation.Draw(x, y)
	}
	
	this.Update = function() {
		var currentTime = game.GetTime()
		var deltaT = (currentTime - lastUpdateTime)/1000

		x += xVelocity * deltaT
		yVelocity += yAcceleration * deltaT
		var ya = y + yVelocity * deltaT
		var platform = game.IsOnGround(y, ya, this)
		
		if (platform){
			platform.Destroy(x)
			game.RemoveEntity(this)
		}
		y = ya
		//make sure it is fully off the screen before it is removed
		if (x < -5 || x > 320){
			game.RemoveEntity(this)
			return
		}
		if (y > 180){
			game.RemoveEntity(this)
			game.CreateEffect("SmallSplash", x-11, y-20)
			return
		}
		lastUpdateTime = currentTime
	}
	
	this.GetX = function() {
		return x
	}
	
	this.GetY = function() {
		return y
	}
	
	this.GetCurrentBounds = function() {
		return bounds
	}
}

function PowerupNade(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 297, 13, 12, 12)
	var used = false
	var inPlayer = false

	//HACK!!! fixes "The 'this' problem"
	var self = this
	this.Use = function() {
		if (!inPlayer || used || !owner.IsIdle())
			return
		used = true
		owner.InterruptAnimation("thrownade", true, function(){self.ThrowNade()})
	}
	
	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true)
			owner = player
			player.CollectPowerup(this)
			var ownerAnimations = owner.GetAnimations()
			if (!ownerAnimations["thrownade"]){
				ownerAnimations["thrownade"] = new Animation(25, 1000, 100, 2, 24, 24);
				ownerAnimations["thrownade"].Repeat(false);
			}
			inPlayer = true
		}
	}
	
	
	this.ThrowNade = function() {
		var xoff = owner.IsFlipped() ? 0 : 20
		game.AddEntity(new Nade(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()), owner, owner.IsFlipped()))
	}
}

powerups.RegisterPowerupType("Nade")

function PowerupTeleport(owner) {
	this.image = new function(){this.Draw=function(dx, dy){}}
	//this probably needs some work

	this.CollidePlayer = function(player) {
		game.CreateEffect("GreenSmoke", player.GetX(), player.GetY())
		player.SetX(Math.floor(Math.random()*320))
		player.SetY(Math.floor(Math.random()*150))
		player.StartFall(true)
		owner.SetDone(true)
		player.CollectPowerup(false)
		sound.Play("buzz")
		
	}
}

powerups.RegisterPowerupType("Teleport")

function PowerupChute(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 310, 13, 12, 12)
	var inPlayer = false
	var self = this
	var active = false
	var v = 40
	this.Use = function() {
		if (!inPlayer || owner.IsOnGround() || owner.IsOnRope() || owner.GetYVelocity() < 0)
			return
		this.Animate()
		active = true
		owner.DisableGravity()
		v = owner.IsFlipped() ? -40 : 40
		if (owner.GetXVelocity() == 0)
			v = 0
		log.Log("animate")
	}
	
	this.Update = function() {
		if (active) {
			var keys = owner.GetKeys()
			owner.SetYVelocity(40)
			owner.SetXVelocity(v)
			
			v = keys["right"] ? 40 : keys["left"] ? -40 : v
			log.Log(v)
			owner.SetFlipped(v < 0)
		}
	}
	
	this.ChangeFrom = function() {
		this.Disable()
		owner = false
	}
	
	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true)
			owner = player
			player.CollectPowerup(this)
			var ownerAnimations = owner.GetAnimations()
			if (!ownerAnimations["chute"]){
				ownerAnimations["chute"] = new Animation(25, 1100, 1, 1, 24, 24);
				ownerAnimations["chute"].Repeat(false);
			}
			inPlayer = true
		}
	}
	
	this.Disable = function() {
		owner.DisableAnimationInterrupt()
		owner.EnableGravity()
		if (active)
			owner.StartFall(true)
		active = false
		
	}
	
	this.CollidePlatform = function(platform) {
		if (!inPlayer || !active)
			return
		
		this.Disable()
	}
	
	this.Animate = function() {
		owner.InterruptAnimation("chute", true)
	}
}

powerups.RegisterPowerupType("Chute")

function Powerup1000v(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 258, 13, 12, 12)
	var inPlayer = false
	var img = image.Get1000vImg()
	
	var orrigImg
	this.Is1000V = true
	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true)
			owner = player
			player.CollectPowerup(this)
			orrigImg = owner.GetImage()
			inPlayer = true
		} else {
			var otherPowerup = player.GetCurrentPowerup()
			if (otherPowerup && otherPowerup.Is1000V){
				owner.CollectPowerup(false)
				player.CollectPowerup(false)
				return false
			}
			player.SetYVelocity(-1000)
			player.SetXVelocity(100)
			player.InterruptAnimation("explode", true)
			player.StartFall(true)
			owner.DontCollide()
			game.CreateEffect("Lightning", player.GetX(), player.GetY())
			return true
		}
	}
	
	this.Update = function() {
		if (!inPlayer)
			return
		if (owner.GetImage()!=img)
			owner.SetImage(img)
		else
			owner.SetImage(orrigImg)
	}
	
	this.ChangeFrom = function() {
		owner.SetImage(orrigImg)
	}
}

powerups.RegisterPowerupType("1000v")

function PowerupBoots(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 297, 0, 12, 12)
	var inPlayer = false
	var inAir = false
	var wasInAir = false
	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true)
			owner = player
			player.CollectPowerup(this)
			orrigImg = owner.GetImage()
			inPlayer = true
			
		} 
	}
	
	this.Use = function() {
		if (!inPlayer || !owner.IsOnGround())
			return
		if (owner.IsRunning() || owner.IsIdle()){
			var keys = owner.GetKeys()
			if (keys["right"] || keys["left"]) {
				owner.StartJump()
			} else  {
				owner.StartJumpUp()
			}
			owner.SetYVelocity(-230)
		}
	}
	
}

powerups.RegisterPowerupType("Boots")

function PowerupHook(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 323, 13, 12, 12)
	var inPlayer = false
	var active = false
	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true)
			owner = player
			player.CollectPowerup(this)
			orrigImg = owner.GetImage()
			var ownerAnimations = owner.GetAnimations()
			if (!ownerAnimations["hook"]){
				ownerAnimations["hook"] = new Animation(25, 1200, 100, 2, 24, 24);
				//ownerAnimations["hook"].Repeat(false);
			}
			inPlayer = true
			
		} 
	}
	this.Use = function() {
		if (!inPlayer || owner.IsOnGround() || owner.IsOnRope())
			return
		if (!active) {
			active = true
			owner.InterruptAnimation("hook", true)
		}
		var platforms = game.GetPlatforms()
		for (var i = 0; i < platforms.length; ++i){
			var other = platforms[i]
			var test = game.DoesCollide(new function(){
					this.GetX = function() {
						return owner.IsFlipped() ? owner.GetX()+5 : owner.GetX()+19
					}
					this.GetY = function() {
						return owner.GetY()+8
					}
					this.GetCurrentBounds = function() {
						return new Bounds(0,0,1,1)
					}
				}, other)
			if (test){
				owner.SetYVelocity(-150)
				if (owner.IsJumping())
					owner.Bounce(true)
				return
			}	
		}
		
	}
	this.CollidePlatform = function(platform) {
		if (!inPlayer || !active)
			return
		
		this.Disable()
	}
	this.Disable = function() {
		active = false
		owner.DisableAnimationInterrupt()
	}
	this.ChangeFrom = function() {
		this.Disable()
	}
}

powerups.RegisterPowerupType("Hook")
