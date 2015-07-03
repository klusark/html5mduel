/*global StaticImage, image, game, Animation, sound, Bounds, powerups*/

var staticimage = require("./staticimage");
var imagemanager = require("./imagemanager");
var animation = require("./animation");
var effect = require("./effect");
var sound = require("./sound");
var bounds = require("./bounds");
var time = require("./time");

/**
 * @constructor
 */
function PowerupGun(owner, game){

	this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 284, 0, 12, 12);

	var ammo = 5,
	firing = false,
	inPlayer = false,
	gundown = new animation.Animation(25, 450, 100, 2, 24, 24),
	gunup = new animation.Animation(25, 450, 100, 2, 24, 24),
	other;

	gundown.Repeat(false);
	gunup.Repeat(false);
	gunup.Reverse(true);
	this.Use = function() {
		if (inPlayer && ammo && !firing && owner.IsIdle()){
			owner.InterruptAnimation(gundown, true, function(){this.CheckForKill();owner.InterruptAnimation(gunup, true, function(){firing=false;});}.bind(this));
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
			return new bounds.Bounds(0,0,320,1);
		};
	}

	this.CheckForKill = function() {
		sound.sound.Play("shot");
		//need to make this work with turning
		if (game.DoesCollide(new GunCollisionCheck(), other)) {
			other.Disolve();
		}
	};

}

/**
 * @constructor
 */
function PowerupSkull(owner){
	this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 258, 0, 12, 12);
	this.CollidePlayer = function(player) {
		player.CollectPowerup(false);
		player.Disolve2();
		owner.SetDone(true);
		sound.sound.Play("buzz2");
	};

}

/**
 * @constructor
 */
function PowerupInvis(owner){
	this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 271, 0, 12, 12);
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
		if (time.time.Get() < nextAllowedTime || !owner.IsIdle()){
			return;
		}
		if (!invis) {
			sound.sound.Play("beep3");
			invis = true;
			owner.SetDraw(false);
			nextAllowedTime = time.time.Get() + 300;
		} else {
			sound.sound.Play("beep2");
			disabled = true;
			owner.SetDraw(true);
			owner.CollectPowerup(false);
		}
	};
}

/**
 * @constructor
 */
function Mine(x, y, owner, game) {
	var other = game.GetOponentOf(owner),
	bounds_ = new bounds.Bounds(0, 0, 1, 1);

	sound.sound.Play("beep");
	this.isMine = true;

	this.Update = function() {

		var collision = game.DoesCollide(this, owner) ? owner : game.DoesCollide(this, other) ? other : undefined;
		if (collision && collision.IsOnGround()){
			collision.Explode();
			this.Explode();
		}

	};

	this.Explode = function() {
		game.CreateEffect(effect.Explode, x - 11, y - 20);
		game.RemoveEntity(this);
	};


	this.GetX = function() {
		return x;
	};

	this.GetY = function() {
		return y;
	};

	this.GetCurrentBounds = function() {
		return bounds_;
	};
}

/**
 * @constructor
 */
function PowerupMine(owner, game) {
	this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 271, 13, 12, 12);
	var used = false,
	inPlayer = false;

	this.Use = function() {
		if (!inPlayer || used || !owner.IsIdle()){
			return;
		}
		used = true;
		owner.InterruptAnimation(owner.GetAnimations().crouch, true, function(){this.LayMine();owner.InterruptAnimation(owner.GetAnimations().uncrouch, true);}.bind(this));
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
		sound.sound.Play("beep1");
		var xoff = owner.IsFlipped() ? 4 : 20;
		game.AddEntity(new Mine(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+23), owner, game));
	};
}

/**
 * @constructor
 */
function Puck(x, y, owner, direction, game) {
	var img = imagemanager.image.GetSpritesImg(),
	other = game.GetOponentOf(owner),
	bounds_ = new bounds.Bounds(0, 0, 5, 2),
	animation_ = new animation.Animation(0, 310, 200, 2, 12, 12),
	xVelocity = direction ? -90 : 90,
	yVelocity = 70,
	lastUpdateTime = time.time.Get();

	this.Draw = function() {
		animation_.Draw(img, x-4, y-6);
	};

	this.Update = function() {
		var currentTime = time.time.Get(),
		deltaT = (currentTime - lastUpdateTime)/1000,
		ya, platform, collision, entities, i;
		animation_.Update();
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
			game.CreateEffect(effect.Explode, x-11, y-20);
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
			game.CreateEffect(effect.SmallSplash, x-11, y-20);
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
		return bounds_;
	};
}

/**
 * @constructor
 */
function PowerupNukepuck(owner, game) {
	this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 310, 0, 12, 12);
	var used = false,
	inPlayer = false,
	throwpuck = new animation.Animation(25, 1050, 100, 2, 24, 24);
	throwpuck.Repeat(false);
	this.Use = function() {
		if (!inPlayer || used || !owner.IsIdle()){
			return;
		}
		used = true;
		owner.InterruptAnimation(throwpuck, true, function(){this.ThrowPuck();}.bind(this));
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
		game.AddEntity(new Puck(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+22), owner, owner.IsFlipped(), game));
	};
}

/**
 * @constructor
 */
function PowerupDestroy(owner, game) {
	this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 284, 13, 12, 12);

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

/**
 * @constructor
 */
function Nade(x, y, owner, direction, game) {
	var img = image.GetSpritesImg(),
	bounds_ = new bounds.Bounds(0, 0, 5, 4),
	animation_ = new staticimage.StaticImage(img, 300, 18, 5, 4),
	xVelocity = direction ? -70 : 70,
	yVelocity = -150,
	yAcceleration = 350,
	lastUpdateTime = time.time.Get();

	this.Draw = function() {
		animation_.Draw(x, y);
	};

	this.Update = function() {
		var currentTime = time.time.Get(),
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
			game.CreateEffect(effect.SmallSplash, x - 11, y - 20);
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
function PowerupNade(owner, game) {
	this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 297, 13, 12, 12);
	var used = false,
	inPlayer = false,
	thrownade = new animation.Animation(25, 1000, 100, 2, 24, 24);
	thrownade.Repeat(false);
	this.Use = function() {
		if (!inPlayer || used || !owner.IsIdle()){
			return;
		}
		used = true;
		owner.InterruptAnimation(thrownade, true, function(){this.ThrowNade();}.bind(this));
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
		game.AddEntity(new Nade(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()), owner, owner.IsFlipped(), game));
	};
}

/**
 * @constructor
 */
function PowerupTeleport(owner, game) {
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
		game.CreateEffect(effect.GreenSmoke, player.GetX(), player.GetY());
		player.SetX(Math.floor(Math.random()*320));
		player.SetY(Math.floor(Math.random()*120));
		player.StartFall(true);
		owner.SetDone(true);
		player.CollectPowerup(false);
		sound.sound.Play("buzz");

	};
}

/**
 * @constructor
 */
function PowerupChute(owner) {
	this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 310, 13, 12, 12);
	var inPlayer = false,
	active = false,
	v = 40,
	chute = new animation.Animation(25, 1100, 1, 1, 24, 24);
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

/**
 * @constructor
 */
function Powerup1000v(owner, game) {
	this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 258, 13, 12, 12);
	var inPlayer = false,
	img = imagemanager.image.Get1000vImg(),

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
			game.CreateEffect(effect.Lightning, player.GetX(), player.GetY());
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

/**
 * @constructor
 */
function PowerupBoots(owner) {
	this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 297, 0, 12, 12);
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

/**
 * @constructor
 */
function PowerupHook(owner, game) {
	this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 323, 13, 12, 12);
	var inPlayer = false,
	active = false,
	hook = new animation.Animation(25, 1200, 100, 2, 24, 24);
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
			return new bounds.Bounds(0,0,1,1);
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


module.exports = {
	PowerupGun: PowerupGun,
	PowerupSkull: PowerupSkull,
	PowerupInvis: PowerupInvis,
	PowerupMine: PowerupMine,
	PowerupNukepuck: PowerupNukepuck,
	PowerupDestroy: PowerupDestroy,
	PowerupNade: PowerupNade,
	PowerupTeleport: PowerupTeleport,
	PowerupChute: PowerupChute,
	Powerup1000v: Powerup1000v,
	PowerupBoots: PowerupBoots,
	PowerupHook: PowerupHook
};
