/*global StaticImage, image, game, Animation, sound, Bounds, powerups*/
/**
 * @constructor
 */
function PowerupGun(owner){

	this.image = new StaticImage(image.GetSpritesImg(), 284, 0, 12, 12);

	var ammo = 5,
	firing = false,
	inPlayer = false,
	gundown = new Animation(25, 450, 100, 2, 24, 24),
	gunup = new Animation(25, 450, 100, 2, 24, 24),
	//HACK!!! fixes "The 'this' problem"
	self = this,
	other;
	gundown.Repeat(false);
	gunup.Repeat(false);
	gunup.Reverse(true);
	this.Use = function() {
		if (inPlayer && ammo && !firing && owner.IsIdle()){
			owner.InterruptAnimation(gundown, true, function(){self.CheckForKill();owner.InterruptAnimation(gunup, true, function(){firing=false;});});
			ammo -= 1;
			firing = true;
		}
	};

	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true);
			owner = player;
			player.CollectPowerup(this);
			other = game.GetOponentOf(owner);
			inPlayer = true;
		}
	};

	/**
	 * @constructor
	 */
	function GunCollisionCheck(){
		this.GetX = function() {
			return owner.IsFlipped() ? owner.GetX()+23 - 320 : owner.GetX()+23;
		};
		this.GetY = function() {
			return owner.GetY()+8;
		};
		this.GetCurrentBounds = function() {
			return new Bounds(0,0,320,1);
		};
	}

	this.CheckForKill = function() {
		sound.Play("shot");
		//need to make this work with turning
		if (game.DoesCollide(new GunCollisionCheck(), other)) {
			other.Disolve();
		}
	};

}
window["PowerupGun"] = PowerupGun;

/**
 * @constructor
 */
function PowerupSkull(owner){
	this.image = new StaticImage(image.GetSpritesImg(), 258, 0, 12, 12);
	this.CollidePlayer = function(player) {
		player.CollectPowerup(false);
		player.Disolve2();
		owner.SetDone(true);
		sound.Play("buzz2");
	};

}
window["PowerupSkull"] = PowerupSkull;

/**
 * @constructor
 */
function PowerupInvis(owner){
	this.image = new StaticImage(image.GetSpritesImg(), 271, 0, 12, 12);
	var invis = false,
	disabled = false,
	nextAllowedTime = 0,
	inPlayer = false;

	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true);
			owner = player;
			player.CollectPowerup(this);
			inPlayer = true;
		}
	};

	this.ChangeFrom = function() {
		owner.SetDraw(true);
	};

	this.Use = function() {
		if (game.GetTime() < nextAllowedTime || !owner.IsIdle()){
			return;
		}
		if (!invis) {
			sound.Play("beep3");
			invis = true;
			owner.SetDraw(false);
			nextAllowedTime = game.GetTime() + 300;
		} else {
			sound.Play("beep2");
			disabled = true;
			owner.SetDraw(true);
			owner.CollectPowerup(false);
		}
	};
}
window["PowerupInvis"] = PowerupInvis;

/**
 * @constructor
 */
function Mine(x, y, owner) {
	var other = game.GetOponentOf(owner),
	bounds = new Bounds(0, 0, 1, 1);

	sound.Play("beep");
	this.isMine = true;

	this.Update = function() {

		var collision = game.DoesCollide(this, owner) ? owner : game.DoesCollide(this, other) ? other : undefined;
		if (collision && collision.IsOnGround()){
			collision.Explode();
			this.Explode();
		}

	};

	this.Explode = function() {
		game.CreateEffect(Explode, x - 11, y - 20);
		game.RemoveEntity(this);
	};


	this.GetX = function() {
		return x;
	};

	this.GetY = function() {
		return y;
	};

	this.GetCurrentBounds = function() {
		return bounds;
	};
}

/**
 * @constructor
 */
function PowerupMine(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 271, 13, 12, 12);
	var used = false,
	//HACK!!! fixes "The 'this' problem"
	self = this,
	inPlayer = false;
	this.Use = function() {
		if (!inPlayer || used || !owner.IsIdle()){
			return;
		}
		used = true;
		owner.InterruptAnimation(owner.GetAnimations().crouch, true, function(){self.LayMine();owner.InterruptAnimation(owner.GetAnimations().uncrouch, true);});
	};

	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true);
			owner = player;
			player.CollectPowerup(this);
			inPlayer = true;
		}
	};

	this.LayMine = function() {
		sound.Play("beep1");
		var xoff = owner.IsFlipped() ? 4 : 20;
		game.AddEntity(new Mine(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+23), owner));
	};
}
window["PowerupMine"] = PowerupMine;

/**
 * @constructor
 */
function Puck(x, y, owner, direction) {
	var img = image.GetSpritesImg(),
	other = game.GetOponentOf(owner),
	bounds = new Bounds(0, 0, 5, 2),
	animation = new Animation(0, 310, 200, 2, 12, 12),
	xVelocity = direction ? -90 : 90,
	yVelocity = 70,
	lastUpdateTime = game.GetTime();

	this.Draw = function() {
		animation.Draw(img, x-4, y-6);
	};

	this.Update = function() {
		var currentTime = game.GetTime(),
		deltaT = (currentTime - lastUpdateTime)/1000,
		ya, platform, collision, entities, i;
		animation.Update();
		x += xVelocity * deltaT;
		ya = y + yVelocity * deltaT;
		platform = game.IsOnGround(y, ya, this);
		if (!platform) {
			y = ya;
		} else {
			y = platform.GetY()-2;
		}
		collision = game.DoesCollide(this, owner) ? owner : game.DoesCollide(this, other) ? other : undefined;
		if (collision){
			collision.Explode();
			game.CreateEffect(Explode, x-11, y-20);
			game.RemoveEntity(this);
			return;
		}

		entities = game.GetEntityCollisionsOf(this);

		for (i = 0; i < entities.length; i += 1) {
			if (entities[i].isMine) {
				entities[i].Explode();
			}
		}

		//make sure it is fully off the screen before it is removed
		if (x < -5 || x > 320){
			game.RemoveEntity(this);
			return;
		}
		if (y > 180){
			game.RemoveEntity(this);
			game.CreateEffect(SmallSplash, x-11, y-20);
			return;
		}
		lastUpdateTime = currentTime;
	};

	this.GetX = function() {
		return x;
	};

	this.GetY = function() {
		return y;
	};

	this.GetCurrentBounds = function() {
		return bounds;
	};
}

/**
 * @constructor
 */
function PowerupNukepuck(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 310, 0, 12, 12);
	var used = false,
	inPlayer = false,
	//HACK!!! fixes "The 'this' problem"
	self = this,
	throwpuck = new Animation(25, 1050, 100, 2, 24, 24);
	throwpuck.Repeat(false);
	this.Use = function() {
		if (!inPlayer || used || !owner.IsIdle()){
			return;
		}
		used = true;
		owner.InterruptAnimation(throwpuck, true, function(){self.ThrowPuck();});
	};

	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true);
			owner = player;
			player.CollectPowerup(this);
			inPlayer = true;
		}
	};

	this.ThrowPuck = function() {
		var xoff = owner.IsFlipped() ? 0 : 20;
		game.AddEntity(new Puck(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+22), owner, owner.IsFlipped()));
	};
}
window["PowerupNukepuck"] = PowerupNukepuck;

/**
 * @constructor
 */
function PowerupDestroy(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 284, 13, 12, 12);

	this.Update = function() {
		var platforms = game.GetPlatforms(), i;
		for (i = 0; i < platforms.length; i += 1){
			if (game.DoesCollide(owner, platforms[i])){
				platforms[i].Destroy(owner.GetX());
				owner.SetDone(true);
				return;
			}
		}
	};
}
window["PowerupDestroy"] = PowerupDestroy;

/**
 * @constructor
 */
function Nade(x, y, owner, direction) {
	var img = image.GetSpritesImg(),
	bounds = new Bounds(0, 0, 5, 4),
	animation = new StaticImage(img, 300, 18, 5, 4),
	xVelocity = direction ? -70 : 70,
	yVelocity = -150,
	yAcceleration = 350,
	lastUpdateTime = game.GetTime();

	this.Draw = function() {
		animation.Draw(x, y);
	};

	this.Update = function() {
		var currentTime = game.GetTime(),
		deltaT = (currentTime - lastUpdateTime)/1000,
		ya, platform;

		x += xVelocity * deltaT;
		yVelocity += yAcceleration * deltaT;
		ya = y + yVelocity * deltaT;
		platform = game.IsOnGround(y, ya, this);

		if (platform){
			platform.Destroy(x);
			game.RemoveEntity(this);
		}
		y = ya;
		//make sure it is fully off the screen before it is removed
		if (x < -5 || x > 320){
			game.RemoveEntity(this);
			return;
		}
		if (y > 180){
			game.RemoveEntity(this);
			game.CreateEffect(SmallSplash, x - 11, y - 20);
			return;
		}
		lastUpdateTime = currentTime;
	};

	this.GetX = function() {
		return x;
	};

	this.GetY = function() {
		return y;
	};

	this.GetCurrentBounds = function() {
		return bounds;
	};
}

/**
 * @constructor
 */
function PowerupNade(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 297, 13, 12, 12);
	var used = false,
	inPlayer = false,
	thrownade = new Animation(25, 1000, 100, 2, 24, 24),
	//HACK!!! fixes "The 'this' problem"
	self = this;
	thrownade.Repeat(false);
	this.Use = function() {
		if (!inPlayer || used || !owner.IsIdle()){
			return;
		}
		used = true;
		owner.InterruptAnimation(thrownade, true, function(){self.ThrowNade();});
	};

	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true);
			owner = player;
			player.CollectPowerup(this);
			inPlayer = true;
		}
	};


	this.ThrowNade = function() {
		var xoff = owner.IsFlipped() ? 0 : 20;
		game.AddEntity(new Nade(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()), owner, owner.IsFlipped()));
	};
}
window["PowerupNade"] = PowerupNade;

/**
 * @constructor
 */
function PowerupTeleport(owner) {
	/**
	 * @constructor
	 */
	function EmptyImage(){
		this.Draw=function(dx, dy){
		};
	}
	this.image = new EmptyImage();
	//this probably needs some work

	this.CollidePlayer = function(player) {
		game.CreateEffect(GreenSmoke, player.GetX(), player.GetY());
		player.SetX(Math.floor(Math.random()*320));
		player.SetY(Math.floor(Math.random()*120));
		player.StartFall(true);
		owner.SetDone(true);
		player.CollectPowerup(false);
		sound.Play("buzz");

	};
}
window["PowerupTeleport"] = PowerupTeleport;

/**
 * @constructor
 */
function PowerupChute(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 310, 13, 12, 12);
	var inPlayer = false,
	self = this,
	active = false,
	v = 40,
	chute = new Animation(25, 1100, 1, 1, 24, 24);
	chute.Repeat(false);
	this.Use = function() {
		if (!inPlayer || owner.IsOnGround() || owner.IsOnRope() || owner.GetYVelocity() < 0){
			return;
		}
		this.Animate();
		active = true;
		owner.DisableGravity();
		v = owner.IsFlipped() ? -40 : 40;
		if (owner.GetXVelocity() === 0){
			v = 0;
		}
	};

	this.Update = function() {
		if (active) {
			var keys = owner.GetKeys();
			owner.SetYVelocity(40);
			owner.SetXVelocity(v);

			v = keys.right ? 40 : keys.left ? -40 : v;
			owner.SetFlipped(v < 0);
		}
	};

	this.ChangeFrom = function() {
		this.Disable();
		owner = false;
	};

	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true);
			owner = player;
			player.CollectPowerup(this);
			inPlayer = true;
		}
	};

	this.Disable = function() {
		owner.DisableAnimationInterrupt();
		owner.EnableGravity();
		if (active){
			owner.StartFall(true);
		}
		active = false;

	};

	this.CollidePlatform = function(platform) {
		if (!inPlayer || !active){
			return;
		}

		this.Disable();
	};

	this.Animate = function() {
		owner.InterruptAnimation(chute, true);
	};
}
window["PowerupChute"] = PowerupChute;

/**
 * @constructor
 */
function Powerup1000v(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 258, 13, 12, 12);
	var inPlayer = false,
	img = image.Get1000vImg(),

	orrigImg;

	this.Is1000V = true;
	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true);
			owner = player;
			player.CollectPowerup(this);
			orrigImg = owner.GetImage();
			inPlayer = true;
		} else {
			var otherPowerup = player.GetCurrentPowerup();
			if (otherPowerup && otherPowerup.Is1000V){
				owner.CollectPowerup(false);
				player.CollectPowerup(false);
				return false;
			}
			player.SetYVelocity(-1000);
			player.SetXVelocity(100);
			player.InterruptAnimation(owner.InterruptAnimation(owner.GetAnimations().explode, true));
			player.StartFall(true);
			owner.DontCollide();
			game.CreateEffect(Lightning, player.GetX(), player.GetY());
			return true;
		}
	};

	this.Update = function() {
		if (!inPlayer){
			return;
		}
		if (owner.GetImage() !== img){
			owner.SetImage(img);
		}else{
			owner.SetImage(orrigImg);
		}
	};

	this.ChangeFrom = function() {
		owner.SetImage(orrigImg);
	};
}
window["Powerup1000v"] = Powerup1000v;

/**
 * @constructor
 */
function PowerupBoots(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 297, 0, 12, 12);
	var inPlayer = false,
	inAir = false,
	wasInAir = false;

	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true);
			owner = player;
			player.CollectPowerup(this);
			inPlayer = true;
		}
	};

	this.Use = function() {
		if (!inPlayer || !owner.IsOnGround()){
			return;
		}
		if (owner.IsRunning() || owner.IsIdle()){
			var keys = owner.GetKeys();
			if (keys.right || keys.left) {
				owner.StartJump();
			} else  {
				owner.StartJumpUp();
			}
			owner.SetYVelocity(-230);
		}
	};

}
window["PowerupBoots"] = PowerupBoots;

/**
 * @constructor
 */
function PowerupHook(owner) {
	this.image = new StaticImage(image.GetSpritesImg(), 323, 13, 12, 12);
	var inPlayer = false,
	active = false,
	hook = new Animation(25, 1200, 100, 2, 24, 24);
	this.CollidePlayer = function(player) {
		if (!inPlayer) {
			owner.SetDone(true);
			owner = player;
			player.CollectPowerup(this);
			inPlayer = true;
		}
	};

	/**
	 * @constructor
	 */
	function HookColide() {
		this.GetX = function() {
			return owner.IsFlipped() ? owner.GetX()+5 : owner.GetX()+19;
		};
		this.GetY = function() {
			return owner.GetY()+8;
		};
		this.GetCurrentBounds = function() {
			return new Bounds(0,0,1,1);
		};
	}

	this.Use = function() {
		if (!inPlayer || owner.IsOnGround() || owner.IsOnRope()){
			return;
		}
		var i, other, test, platforms;
		if (!active) {
			active = true;
			owner.InterruptAnimation(hook, true);
		}
		platforms = game.GetPlatforms();
		for (i = 0; i < platforms.length; i += 1){
			other = platforms[i];
			test = game.DoesCollide(new HookColide(), other);
			if (test){
				owner.SetYVelocity(-150);
				if (owner.IsJumping()){
					owner.Bounce(true);
				}
				return;
			}
		}

	};

	this.CollidePlatform = function(platform) {
		if (!inPlayer || !active){
			return;
		}

		this.Disable();
	};

	this.Disable = function() {
		active = false;
		owner.DisableAnimationInterrupt();
	};

	this.ChangeFrom = function() {
		this.Disable();
	};
}
window["PowerupHook"] = PowerupHook;
