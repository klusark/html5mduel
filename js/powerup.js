function PowerupGun(owner){
	var ammo = 5
	var firing = false
	var ownerAnimations = owner.GetAnimations()
	if (!ownerAnimations["gun"]){
		ownerAnimations["gundown"] = new Animation(25, 450, 100, 2, 24, 24);
		ownerAnimations["gundown"].Repeat(false);
		
		ownerAnimations["gunup"] = new Animation(25, 450, 100, 2, 24, 24);
		ownerAnimations["gunup"].Repeat(false);
		ownerAnimations["gunup"].Reverse(true);
	}
	//HACK!!! fixes "The 'this' problem"
	var self = this
	var other = core.GetOponentOf(owner)
	this.Use = function() {
		if (ammo && !firing && owner.IsIdle()){
			owner.InterruptAnimation("gundown", true, function(){self.CheckForKill();owner.InterruptAnimation("gunup", true, function(){firing=false})})
			--ammo
			firing = true
		}
	}
	
	this.CheckForKill = function() {
		//need to make this work with turning
		if (core.DoesCollide(new function(){this.GetX = function(){return owner.GetX()+23};this.GetY = function(){return owner.GetY()+8};this.GetCurrentBounds = function(){return new Bounds(0,0,320,1)}}, other))
			other.Disolve()
	}

}

function PowerupSkull(owner){
	owner.Disolve()
}

function PowerupInvis(owner){
	var invis = false
	var disabled = false
	var nextAllowedTime = 0
	this.Use = function() {
		if (core.GetTime() < nextAllowedTime || !owner.IsIdle())
			return
		if (!invis) {
			invis = true
			owner.SetDraw(false)
			nextAllowedTime = core.GetTime() + 300
		} else {
			disabled = true
			owner.SetDraw(true)
		}
	}
}

function Mine(x, y, owner) {
	var other = core.GetOponentOf(owner)
	var bounds = new Bounds(0, 0, 1, 1)
	
	this.Draw = function() {
		//ctx.fillStyle = "rgb(0,0,255)";
		//core.FillRect(x, y, 1, 1)
	}
	
	this.Update = function() {

		var collision = core.DoesCollide(this, owner) ? owner : core.DoesCollide(this, other) ? other : undefined
		if (collision && collision.IsOnGround()){
			collision.Explode()
			core.CreateEffect("explode", x-11, y-20)
			core.RemoveEntity(this)
		}

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
	var used = false
	//HACK!!! fixes "The 'this' problem"
	var self = this
	this.Use = function() {
		if (used || !owner.IsIdle())
			return
		used = true
		owner.InterruptAnimation("crouch", true, function(){self.LayMine();owner.InterruptAnimation("uncrouch", true)})
	}
	
	this.LayMine = function() {
		var xoff = owner.IsFlipped() ? 4 : 20
		core.AddEntity(new Mine(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+23), owner))
	}
}

function Puck(x, y, owner, direction) {
	var img = core.GetSpritesImg()
	var other = core.GetOponentOf(owner)
	var bounds = new Bounds(0, 0, 5, 2)
	var animation = new Animation(0, 310, 200, 2, 12, 12);
	var xVelocity = direction ? -90 : 90
	var yVelocity = 70
	var lastUpdateTime = core.GetTime()
	this.Draw = function() {
		//ctx.fillStyle = "rgb(0,0,255)";
		//core.FillRect(x, y, 1, 1)
		animation.Draw(img, x-4, y-6)
	}
	
	this.Update = function() {
		var currentTime = core.GetTime()
		var deltaT = (currentTime - lastUpdateTime)/1000
		animation.Update()
		x += xVelocity * deltaT
		var ya = y + yVelocity * deltaT
		var platform = core.IsOnGround(y, ya, this)
		if (!platform){
			y = ya
		}
		var collision = core.DoesCollide(this, owner) ? owner : core.DoesCollide(this, other) ? other : undefined
		if (collision){
			collision.Explode()
			core.CreateEffect("explode", x-11, y-20)
			core.RemoveEntity(this)
			return
		}
		//make sure it is fully off the screen before it is removed
		if (x < -5 || x > 320){
			core.RemoveEntity(this)
			console.log("removed")
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
	var used = false
	var ownerAnimations = owner.GetAnimations()
	if (!ownerAnimations["gun"]){
		ownerAnimations["throwpuck"] = new Animation(25, 1050, 100, 2, 24, 24);
		ownerAnimations["throwpuck"].Repeat(false);
	}
	//HACK!!! fixes "The 'this' problem"
	var self = this
	this.Use = function() {
		if (used || !owner.IsIdle())
			return
		used = true
		owner.InterruptAnimation("throwpuck", true, function(){self.ThrowPuck()})
	}
	
	this.ThrowPuck = function() {
		var xoff = owner.IsFlipped() ? 0 : 20
		core.AddEntity(new Puck(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+22), owner, owner.IsFlipped()))
	}
}
