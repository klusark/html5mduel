function PowerupGun(owner){
	this.image = new StaticImage(core.GetSpritesImg(), 284, 0, 12, 12)
	
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
			other = core.GetOponentOf(owner)
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
		core.PlaySound("shot")
		//need to make this work with turning
		if (core.DoesCollide(new function(){
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

core.RegisterPowerupType("Gun")

function PowerupSkull(owner){
	this.image = new StaticImage(core.GetSpritesImg(), 258, 0, 12, 12)
	this.CollidePlayer = function(player) {
		player.CollectPowerup(false)
		player.Disolve2()
		owner.SetDone(true)
		core.PlaySound("buzz2")
	}
	
}

core.RegisterPowerupType("Skull")

function PowerupInvis(owner){
	this.image = new StaticImage(core.GetSpritesImg(), 271, 0, 12, 12)
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
		if (core.GetTime() < nextAllowedTime || !owner.IsIdle())
			return
		if (!invis) {
			core.PlaySound("beep3")
			invis = true
			owner.SetDraw(false)
			nextAllowedTime = core.GetTime() + 300
		} else {
			core.PlaySound("beep2")
			disabled = true
			owner.SetDraw(true)
			owner.CollectPowerup(false)
		}
	}
}

core.RegisterPowerupType("Invis")

function Mine(x, y, owner) {
	var other = core.GetOponentOf(owner)
	var bounds = new Bounds(0, 0, 1, 1)
	
	core.PlaySound("beep")
	
	this.Update = function() {

		var collision = core.DoesCollide(this, owner) ? owner : core.DoesCollide(this, other) ? other : undefined
		if (collision && collision.IsOnGround()){
			collision.Explode()
			this.Explode()
		}

	}
	
	this.Explode = function() {
		core.CreateEffect("explode", x-11, y-20)
		core.RemoveEntity(this)
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
	this.image = new StaticImage(core.GetSpritesImg(), 271, 13, 12, 12)
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
		core.PlaySound("beep1")
		var xoff = owner.IsFlipped() ? 4 : 20
		core.AddEntity(new Mine(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+23), owner))
	}
}

core.RegisterPowerupType("Mine")

function Puck(x, y, owner, direction) {
	var img = core.GetSpritesImg()
	var other = core.GetOponentOf(owner)
	var bounds = new Bounds(0, 0, 5, 2)
	var animation = new Animation(0, 310, 200, 2, 12, 12);
	var xVelocity = direction ? -90 : 90
	var yVelocity = 70
	var lastUpdateTime = core.GetTime()
	
	this.Draw = function() {
		animation.Draw(img, x-4, y-6)
	}
	
	this.Update = function() {
		var currentTime = core.GetTime()
		var deltaT = (currentTime - lastUpdateTime)/1000
		animation.Update()
		x += xVelocity * deltaT
		var ya = y + yVelocity * deltaT
		var platform = core.IsOnGround(y, ya, this)
		if (!platform) {
			y = ya
		} else {
			y = platform.GetY()-2
		}
		var collision = core.DoesCollide(this, owner) ? owner : core.DoesCollide(this, other) ? other : undefined
		if (collision){
			collision.Explode()
			core.CreateEffect("explode", x-11, y-20)
			core.RemoveEntity(this)
			return
		}
		
		var entities = core.GetEntityCollisionsOf(this)
		
		for (var i = 0; i < entities.length; ++i) {
			if (entities[i].__proto__.constructor.name == "Mine")
				entities[i].Explode()
		}
		
		//make sure it is fully off the screen before it is removed
		if (x < -5 || x > 320){
			core.RemoveEntity(this)
			return
		}
		if (y > 180){
			core.RemoveEntity(this)
			core.CreateEffect("SmallSplash", x-11, y-20)
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
	this.image = new StaticImage(core.GetSpritesImg(), 310, 0, 12, 12)
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
		core.AddEntity(new Puck(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+22), owner, owner.IsFlipped()))
	}
}

core.RegisterPowerupType("Nukepuck")

function PowerupDestroy(owner) {
	this.image = new StaticImage(core.GetSpritesImg(), 284, 13, 12, 12)
	this.Update = function() {
		var platforms = core.GetPlatforms()
		for (var i = 0; i < platforms.length; ++i){
			if (core.DoesCollide(owner, platforms[i])){
				platforms[i].Destroy(owner.GetX())
				owner.SetDone(true)
				return
			}
		}
	}
}

core.RegisterPowerupType("Destroy")

function Nade(x, y, owner, direction) {
	var img = core.GetSpritesImg()
	var bounds = new Bounds(0, 0, 5, 4)
	var animation = new StaticImage(core.GetSpritesImg(), 300, 18, 5, 4);
	var xVelocity = direction ? -70 : 70
	var yVelocity = -150
	var yAcceleration = 350
	var lastUpdateTime = core.GetTime()
	
	this.Draw = function() {
		animation.Draw(x, y)
	}
	
	this.Update = function() {
		var currentTime = core.GetTime()
		var deltaT = (currentTime - lastUpdateTime)/1000

		x += xVelocity * deltaT
		yVelocity += yAcceleration * deltaT
		var ya = y + yVelocity * deltaT
		var platform = core.IsOnGround(y, ya, this)
		
		if (platform){
			platform.Destroy(x)
			core.RemoveEntity(this)
		}
		y = ya
		//make sure it is fully off the screen before it is removed
		if (x < -5 || x > 320){
			core.RemoveEntity(this)
			return
		}
		if (y > 180){
			core.RemoveEntity(this)
			core.CreateEffect("SmallSplash", x-11, y-20)
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
	this.image = new StaticImage(core.GetSpritesImg(), 297, 13, 12, 12)
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
		core.AddEntity(new Nade(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()), owner, owner.IsFlipped()))
	}
}

core.RegisterPowerupType("Nade")

function PowerupTeleport(owner) {
	this.image = new function(){this.Draw=function(dx, dy){}}
	//this probably needs some work

	this.CollidePlayer = function(player) {
		core.CreateEffect("GreenSmoke", player.GetX(), player.GetY())
		player.SetX(Math.floor(Math.random()*320))
		player.SetY(Math.floor(Math.random()*150))
		player.StartFall(true)
		owner.SetDone(true)
		player.CollectPowerup(false)
		core.PlaySound("buzz")
		
	}
}

core.RegisterPowerupType("Teleport")

function PowerupChute(owner) {
	this.image = new StaticImage(core.GetSpritesImg(), 310, 13, 12, 12)
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
		console.log("animate")
	}
	
	this.Update = function() {
		if (active) {
			var keys = owner.GetKeys()
			owner.SetYVelocity(40)
			owner.SetXVelocity(v)
			
			v = keys["right"] ? 40 : keys["left"] ? -40 : v
			console.log(v)
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

core.RegisterPowerupType("Chute")

function Powerup1000v(owner) {
	this.image = new StaticImage(core.GetSpritesImg(), 258, 13, 12, 12)
	var inPlayer = false
	var img = new Image()
	img.src = "generate?c=4&m=" + core.GetScale()
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
			core.CreateEffect("Lightning", player.GetX(), player.GetY())
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

core.RegisterPowerupType("1000v")

function PowerupBoots(owner) {
	this.image = new StaticImage(core.GetSpritesImg(), 297, 0, 12, 12)
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

core.RegisterPowerupType("Boots")

function PowerupHook(owner) {
	this.image = new StaticImage(core.GetSpritesImg(), 323, 13, 12, 12)
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
		var platforms = core.GetPlatforms()
		for (var i = 0; i < platforms.length; ++i){
			var other = platforms[i]
			var test = core.DoesCollide(new function(){
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

core.RegisterPowerupType("Hook")