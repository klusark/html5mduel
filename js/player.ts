/*var log = require("./log");
var effect = require("./effect");
var sound = require("./sound");*/

import { Animation } from "./animation";
import { Bounds } from "./bounds";
import { Game } from "./game";

export class Player {
	animations = Animation[];
	keyCodes = [];
	keys = [];
	keysLastFrame = [];

	currentAnimation;

	flipped = false;

	yVelocity = 0;
	yMaxVelocity = 180;
	xVelocity = 0;
	yAcceleration = 500;
	gravityEnabled = true;
	onGround = false;
	isCrouched = false;
	isRolling = false;
	isOnRope = false;
	wasOnGround = false;
	falling = false;
	runningRight = false;
	runningLeft = false;
	wasRunningLeft = false;
	wasRunningRight = false;
	isCrouchingUp = false;
	pushed = false;
	wasCrouched = false;
	justUncrouched = false;
	dead = false;
	isWinning = false;
	isJumpingUp = false;
	isJumping = false;
	interuptInput = false;
	wasRolling = false;
	wasOnRope = false;
	dontCollide = false;
	interruptAnimationInput = false;
	interruptAnimation = false;
	interruptAnimationCallback;
	isIdle = false;
	isDisolving = false;
	draw = true;
	isExploding = false;

	standingBounds = new Bounds(6, 1, 10, 23);
	crouchingBounds = new Bounds(6, 10, 10, 14);
	fallingBounds = new Bounds(6, 1, 10, 23);
	currentBounds = this.standingBounds;

	currentRope;

	currentPowerup;

	RUNSPEED = 60;
	PUSHEDSPEED = 60;
	ROLLSPEED = 60;
	CLIMBSPEED = 60;
	JUMPYVELOCITY = -170;
	JUMPXVELOCITY = 60;
	EXPLODEVELOCITY = -1000;

	/*this.animations.run = new animation.Animation(25, 0, 100, 4, 24, 24);

	animations.idle = new animation.Animation(25, 100, 100, 1, 24, 24);

	animations.crouch = new animation.Animation(25, 125, 50, 2, 24, 24);
	animations.crouch.Repeat(false);

	animations.uncrouch = new animation.Animation(25, 125, 50, 1, 24, 24);
	animations.uncrouch.Repeat(false);

	animations.roll = new animation.Animation(25, 175, 75, 5, 24, 24);
	animations.roll.Repeat(false);

	animations.roll2 = new animation.Animation(25, 200, 50, 4, 24, 24);
	animations.roll2.Repeat(false);

	animations.climbup = new animation.Animation(25, 600, 150, 3, 24, 24);
	animations.climbup.Reverse(false);

	animations.climbdown = new animation.Animation(25, 600, 150, 3, 24, 24);
	animations.climbdown.Reverse(true);

	animations.climbidle = new animation.Animation(25, 625, 100, 1, 24, 24);

	animations.fall = new animation.Animation(25, 675, 100, 1, 24, 24);

	animations.standingwin = new animation.Animation(25, 700, 100, 2, 24, 24);
	animations.standingwin.Repeat(false);

	animations.ropewin = new animation.Animation(25, 750, 100, 2, 24, 24);
	animations.ropewin.Repeat(false);

	animations.jumpup = new animation.Animation(25, 300, 75, 6, 24, 24);
	animations.jumpup.Repeat(false);

	animations.jump = new animation.Animation(25, 800, 100, 4, 24, 24);
	animations.jump.Repeat(false);

	animations.land = new animation.Animation(25, 300, 50, 1, 24, 24);

	animations.pushedforward = new animation.Animation(25, 900, 100, 2, 24, 24);

	animations.pushedbackward = new animation.Animation(25, 950, 100, 2, 24, 24);

	animations.disolve = new animation.Animation(25, 525, 100, 3, 24, 24);
	animations.disolve.Repeat(false);

	animations.disolve2 = new animation.Animation(25, 1125, 100, 3, 24, 24);
	animations.disolve2.Repeat(false);

	animations.explode = new animation.Animation(25, 500, 100, 2, 24, 24);


	keyCodes.right = 68;
	keyCodes.left = 65;
	keyCodes.up = 87;
	keyCodes.down = 83;
	keyCodes.use = 81;

	keys.right = false;
	keys.left = false;
	keys.up = false;
	keys.down = false;
	keys.use = false;*/

	constructor (x: number, y: number, img: HTMLImageElement, game: Game) {

		this.SetAnimation(this.animations.idle);
	}

	Draw() {
		if (draw && currentAnimation){
			currentAnimation.Draw(img, x, y);
		}
	};

	Update = function(deltaT) {

		if (currentPowerup && currentPowerup.Update){
			currentPowerup.Update(deltaT);
		}

		if (!isDisolving){
			this.SimulateGravity(deltaT);
		}

		if (y > 160 && !dead){
			dead = true;
			game.CreateEffect(effect.BigSplash, x, 200-40);
		}
		if (x < 0-currentBounds.GetX() || x > 300){
			x = x < 0-currentBounds.GetX() ? 0 : 300;
			this.Bounce(false);
		}
		if (y < -50 && !dead){
			dead = true;
			draw = false;
		}

		isIdle = false;
		if (interruptAnimation) {
			if (currentAnimation.IsAnimationDone()){
				if (interruptAnimationInput){
					interuptInput = false;
				}
				interruptAnimationInput = false;
				interruptAnimation = false;
				if (interruptAnimationCallback){
					interruptAnimationCallback();
				}
			}

		} else if (isDisolving){
			if (currentAnimation.IsAnimationDone()){
				dead = true;
				draw = false;
			}
		} else if (isExploding || isWinning) {

		} else if (isOnRope){
			if (!(keys.left || keys.right)) {

				yVelocity = (keys.down - keys.up) * CLIMBSPEED;
				if (keys.up && !keysLastFrame.up){
					this.SetAnimation(animations.climbup);
				}else if (keys.down && !keysLastFrame.down){
					this.SetAnimation(animations.climbdown);
				}else if (!keys.down && !keys.up){
					this.SetAnimation(animations.climbidle);
				}
			} else if (!(keys.up || keys.down)) {
				isOnRope = false;
				xVelocity = RUNSPEED * (keys.right-keys.left);
				yVelocity = 0;
				this.StartFall(true);
			}
		} else if (isJumpingUp) {
			if (currentAnimation.IsAnimationDone()){
				isJumpingUp = false;
				this.StartFall(true);
			}

		} else if (isJumping) {
			if (currentAnimation.IsAnimationDone()){
				isJumping = false;
				this.StartFall(false);
				onGround = false;
				//wasOnGround = false

			}
		} else if (onGround) {
			pushed = false;
			if (runningRight && !keys.right && !isRolling){
				runningRight = false;
			}

			if (runningLeft && !keys.left && !isRolling) {
				runningLeft = false;
			}

			if(!isRolling) {
				xVelocity = RUNSPEED * (runningRight-runningLeft);
			}

			/*if(!isCrouched && !isRolling){
				if (keys.right)
					flipped = false
				else if (keys.left)
					flipped = true
			}*/
			if (this.IsTouchingRope() && (keys.up || keys.down) && !(keys.left || keys.right) && !isCrouched && !isRolling){
				isOnRope = true;
				onGround = false;
				wasOnGround = false;
				x = currentRope.GetX()-11;
				if (keys.down){
					this.SetAnimation(animations.climbdown);
				}else if (keys.up){
					this.SetAnimation(animations.climbup);
				}
			}else if (isCrouched){
				if (isCrouchingUp){
					if (currentAnimation.IsAnimationDone()){
						//this.SetAnimation(animations.run")
						isCrouchingUp = false;
						isCrouched = false;
						justUncrouched = true;
						currentBounds = standingBounds;
					}
				}else if (!keys.down && !isCrouchingUp && currentAnimation.IsAnimationDone()){
					isCrouchingUp = true;
					this.SetAnimation(animations.uncrouch);
				}
			} else if (isRolling) {
				if (currentAnimation.IsAnimationDone()){
					runningRight = false;
					runningLeft = false;
					isRolling = false;
					xVelocity = 0;
					this.SetAnimation(animations.crouch);
					currentAnimation.SetFrame(1);
					isCrouched = true;
					currentBounds = crouchingBounds;
				}
			} else if (keys.down && (runningLeft || runningRight)){
				isRolling = true;
				this.SetAnimation(animations.roll);
			}else if (keys.down){
				isCrouched = true;
				currentBounds = crouchingBounds;
				xVelocity = 0;
				this.SetAnimation(animations.crouch);
			} else if (keys.up && (keys.right || keys.left)) {
				this.StartJump();
			} else if (keys.up) {
				this.StartJumpUp();
			} else if (keys.right && (!keysLastFrame.right || wasRunningLeft || wasCrouched || !wasOnGround) && !runningLeft) {
				runningRight = true;
				flipped = false;
				this.SetAnimation(animations.run);
			} else if (keys.left && (!keysLastFrame.left || wasRunningRight || wasCrouched || !wasOnGround) && !runningRight) {
				runningLeft = true;
				flipped = true;
				this.SetAnimation(animations.run);
			} else if (!keys.left && !keys.right) {
				this.SetAnimation(animations.idle);
				isIdle = true;
			}

		}

		if (keys.use && currentPowerup && currentPowerup.Use){
			currentPowerup.Use();
		}

		x += deltaT*xVelocity;

		//game.GetCollitionsOf(this)

		currentAnimation.Update(deltaT);
		this.UpdateKeysLastFrame();

		wasOnGround = onGround;
		if (!justUncrouched) {
			wasCrouched = isCrouched;
		}
		justUncrouched = false;
		wasRunningLeft = runningLeft;
		wasRunningRight = runningRight;
		wasRolling = isRolling;
		wasOnRope = isOnRope;

	};

	Collide(other, ignore) {
		if (pushed || dontCollide){
			return;
		}
		var thiscollide = false,
		othercollide = false,
		dontMove;
		if (currentPowerup && currentPowerup.CollidePlayer){
			thiscollide = currentPowerup.CollidePlayer(other);
		}
		if (other.GetCurrentPowerup() && other.GetCurrentPowerup().CollidePlayer){
			othercollide = other.GetCurrentPowerup().CollidePlayer(this);
		}
		if (thiscollide || othercollide){
			return;
		}

		if (isOnRope || wasOnRope || other.IsOnRope() || other.WasOnRope()) {
			if ((isOnRope || wasOnRope) && (other.IsOnRope() || other.WasOnRope())) {
				log.log.Log("type 11");
				isOnRope = false;
				if (y < other.GetY()) {
					flipped = false;
					this.Bounce(true);
				} else {
					flipped = true;
					this.Bounce(true);
				}
				this.StartFall(false);
				this.DontCollide();
			} else if (isOnRope || wasOnRope) {
				log.log.Log("type 12");
				flipped = !other.IsFlipped();
				isOnRope = false;
				this.Bounce(false);
				this.StartFall(false);
			}
		} else if ((other.IsRolling()) && wasOnGround && !isCrouched && !isRolling) {
			log.log.Log("type 1");
			dontMove = xVelocity === 0 && other.IsRolling();
			this.Bounce(true);
			this.StartFall(false);
			if (dontMove){
				xVelocity = 0;
			}
			yVelocity = JUMPYVELOCITY;
		} else if (xVelocity === 0 && other.GetXVelocity() === 0 && (y > other.GetY())) {
			log.log.Log("type 13");
		} else if (xVelocity === 0 && other.GetXVelocity() === 0 && (yVelocity !== 0 || other.GetYVelocity() !== 0)) {
			log.log.Log("type 2");
		} else if ((other.IsCrouched() && isRolling) || ((other.IsRolling() || other.WasRolling()) && isCrouched)) {
			log.log.Log("type 10");
			x < other.GetX() ? this.Bounce(flipped) : this.Bounce(!flipped);
			this.StartFall(false);
			yVelocity = JUMPYVELOCITY*2/3;
		} else if (other.IsCrouched() ) {
			log.log.Log("type 8");
			this.Bounce(true);
			this.StartFall(false);
			yVelocity = JUMPYVELOCITY*2/3;
		} else if (isCrouched && other.GetXVelocity !== 0) {
			log.log.Log("type 9");

		} else if (!isRolling && other.IsRolling()) {
			log.log.Log("type 3");
			this.Bounce(true);
			this.StartFall(false);
			yVelocity = JUMPYVELOCITY*2/3;
		} else if (isRolling && !(other.IsRolling() || other.WasRolling())) {
			log.log.Log("type 4");
		} else if (xVelocity !== 0 && other.GetXVelocity() !== 0) {
			log.log.Log("type 5");
			isOnRope = false;

			x < other.GetX() ? this.Bounce(flipped) : this.Bounce(!flipped);
			this.StartFall(false);
			yVelocity = JUMPYVELOCITY*2/3;
		} else if (xVelocity === 0 && other.GetXVelocity() !== 0) {
			log.log.Log("type 6");
			other.IsFlipped() ? this.Bounce(flipped) : this.Bounce(!flipped);
			this.StartFall(false);
			other.DontCollide();
			yVelocity = JUMPYVELOCITY*2/3;
		} else {
			log.log.Log("type 7");
		}
	};

	StartJumpUp() {
		yVelocity = JUMPYVELOCITY;
		onGround = false;
		isJumpingUp = true;
		this.SetAnimation(animations.jumpup);
	};

	StartJump() {
		onGround = false;
		yVelocity = JUMPYVELOCITY;
		isJumping = true;
		xVelocity = flipped ? -JUMPXVELOCITY : JUMPXVELOCITY;
		this.SetAnimation(animations.jump);
	};

	Bounce(forward) {
		pushed = true;
		if (forward) {
			xVelocity = (flipped ? -PUSHEDSPEED : PUSHEDSPEED);
			this.SetAnimation(animations.pushedforward);
		} else {
			xVelocity = (flipped ? PUSHEDSPEED : -PUSHEDSPEED);
			this.SetAnimation(animations.pushedbackward);
		}
	};

	CollectPowerup(powerup) {
		if (isWinning || dead){
			return;
		}
		if (currentPowerup && currentPowerup.ChangeFrom){
			currentPowerup.ChangeFrom();
		}

		currentPowerup = powerup;


	};

	Disolve() {
		isDisolving = true;
		xVelocity = 0;
		yVelocity = 0;
		this.SetAnimation(animations.disolve);
	};

	Disolve2() {
		isDisolving = true;
		xVelocity = 0;
		yVelocity = 0;
		this.SetAnimation(animations.disolve2);
	};

	Explode() {
		isExploding = true;
		xVelocity = 0;
		yVelocity = EXPLODEVELOCITY;
		this.SetAnimation(animations.explode);
		sound.sound.Play("buzz");
	};

	InterruptAnimation(name, controls, callback) {
		interruptAnimationInput = controls;
		interuptInput = controls;
		interruptAnimation = true;
		this.SetAnimation(name);
		interruptAnimationCallback = callback;
	};

	DisableAnimationInterrupt() {
		interruptAnimationInput = false;
		interuptInput = false;
		interruptAnimation = false;
		interruptAnimationCallback = false;
	};

	SetImage(image) {
		img = image;
	};

	GetImage() {
		return img;
	};

	IsInPositionToWin() {
		return (onGround || isOnRope) && !(isJumpingUp || isJumping || falling || isRolling || pushed);
	};

	Win() {

		if (isOnRope){
			this.SetAnimation(animations.ropewin);
		}else{
			this.SetAnimation(animations.standingwin);
		}
		isWinning = true;
		xVelocity = 0;
		yVelocity = 0;
		currentAnimation.Update(x, y);
	};

	IsWinning() {
		return isWinning;
	};

	SetDraw(ndraw) {
		draw = ndraw;
	};

	GetAnimations() {
		return animations;
	};

	DontCollide() {
		dontCollide = true;
	};

	DoCollide() {
		dontCollide = false;
	};

	IsPushed() {
		return pushed;
	};

	WasOnGround() {
		return wasOnGround;
	};

	IsOnGround() {
		return onGround;
	};

	IsOnRope(){
		return isOnRope;
	};


	WasOnRope() {
		return wasOnRope;
	};

	IsRunning() {
		return (runningLeft || runningRight) && (!isRolling);
	};

	IsRolling() {
		return isRolling;
	};

	IsIdle() {
		return isIdle;
	};

	WasRolling() {
		return wasRolling;
	};

	GetCurrentPowerup() {
		return currentPowerup;
	};

	GetY(){
		return y;
	};

	GetX(){
		return x;
	};

	GetXVelocity() {
		return xVelocity;
	};

	GetYVelocity() {
		return yVelocity;
	};

	SetXVelocity(v) {
		xVelocity = v;
	};

	SetYVelocity(v) {
		yVelocity = v;
	};

	SetY(ny) {
		y = ny;
	};

	SetX(nx) {
		x = nx;
	};

	DisableGravity() {
		gravityEnabled = false;
	};

	EnableGravity() {
		gravityEnabled = true;
	};

	SetFlipped(nf) {
		flipped = nf;
		currentAnimation.SetFlipped(flipped);
	};

	IsFlipped() {
		return flipped;
	};

	IsDead(){
		return dead;
	};

	IsCrouched() {
		return isCrouched;
	};

	IsJumpingUp() {
		return isJumpingUp;
	};

	IsJumping() {
		return isJumping;
	};

	SetInteruptInput(interupt){
		interuptInput = interupt;
	};

	SetAnimation(name){
		if(isWinning || !name){
			return;
		}
		/*if (name !== 'idle'){
			log.log.DebugLog("Animation Changed to " + name);
		}
		if (!animations[name]){
			log.log.Log("Could not find animation " + name);
			return;
		}*/
		currentAnimation = name;
		currentAnimation.ChangeTo(flipped);
	};

	GetKeys() {
		return keys;
	};

	KeyDown(keyCode) {
		if (interuptInput){
			return;
		}
		if (keyCode === keyCodes.right ){
			log.log.DebugLog("KeyDown Right");
			keys.right = true;
		}else if (keyCode === keyCodes.left ){
			log.log.DebugLog("KeyDown Left");
			keys.left = true;
		}else if (keyCode === keyCodes.down ){
			log.log.DebugLog("KeyDown Down");
			keys.down = true;
		}else if (keyCode === keyCodes.up ){
			log.log.DebugLog("KeyDown Up");
			keys.up = true;
		}else if (keyCode === keyCodes.use ){
			log.log.DebugLog("KeyDown Up");
			keys.use = true;
		}
	};

	KeyUp(keyCode) {
		if (keyCode === keyCodes.right ){
			log.log.DebugLog("KeyUp Right");
			keys.right = false;
		}else if (keyCode === keyCodes.left ){
			log.log.DebugLog("KeyUp Left");
			keys.left = false;
		}else if (keyCode === keyCodes.down ){
			log.log.DebugLog("KeyUp Down");
			keys.down = false;
		}else if (keyCode === keyCodes.up ){
			log.log.DebugLog("KeyUp Up");
			keys.up = false;
		}else if (keyCode === keyCodes.use ){
			log.log.DebugLog("KeyUp Up");
			keys.use = false;
		}

	};

	DisableInput() {
		keys.right = false;
		keys.left = false;
		keys.up = false;
		keys.down = false;
		keys.use = false;
	};

	UpdateKeysLastFrame() {
		keysLastFrame.right = keys.right;
		keysLastFrame.left = keys.left;
		keysLastFrame.up = keys.up;
		keysLastFrame.down = keys.down;
		keysLastFrame.use = keys.use;
	};

	SetKeys(up, down, left, right, use) {
		keyCodes.up = up;
		keyCodes.down = down;
		keyCodes.left = left;
		keyCodes.right = right;
		keyCodes.use = use;
	};

	SimulateGravity(deltaT) {

		if (!isOnRope && gravityEnabled){
			yVelocity += yAcceleration * deltaT;
		}
		if (yMaxVelocity < yVelocity){
			yVelocity = yMaxVelocity;
		}
		var yb = y,
		ny = y + deltaT * yVelocity,
		platform;

		if (!isOnRope && yVelocity > 0){
			onGround = false;
			platform = game.IsOnGround(yb, ny, this);
			if (platform){
				if (currentPowerup && currentPowerup.CollidePlatform){
					currentPowerup.CollidePlatform(platform);
				}
				ny = platform.GetY()-24;
				yVelocity = 0;

				onGround = true;
				if (!wasOnGround){
					this.Land();
				}
			}
			if(!onGround && wasOnGround){
				this.StartFall(true);
			}
		}else if (isOnRope){
			if (ny+4 < currentRope.GetY()){
				ny = currentRope.GetY()-4;
			}else if (ny > currentRope.GetY() + currentRope.GetLength() - 25){
				ny = currentRope.GetY() + currentRope.GetLength()-25;
			}
		}

		y = ny;
	};

	IsTouchingRope() {

		var ropes = game.GetRopes(),
		i,
		rope;
		for (i = 0; i < ropes.length; i += 1){
			rope = ropes[i];
			if (x + 6 < rope.GetX() && x + 16  > rope.GetX() && y > rope.GetY() - 24 && y < rope.GetY() + rope.GetLength() ){
				currentRope = rope;
				return true;
			}
		}
		currentRope = null;
	};

	StartFall(animate) {
		isOnRope = false;
		falling = true;
		onGround = false;
		isRolling = false;
		flipped = (keys.right - keys.left === 0 ? flipped : keys.right - keys.left < 0);
		if (animate){
			this.SetAnimation(animations.fall);
		}
		currentBounds = fallingBounds;

	};

	Land() {
		onGround = true;
		isJumping = false;
		isJumpingUp = false;
		if (pushed){
			this.SetAnimation(animations.roll2);
			isRolling = true;
			pushed = false;
		}else{
			this.SetAnimation(animations.land);
			xVelocity = 0;
			currentBounds = standingBounds;
		}

		falling = false;

	};

	GetCurrentBounds() {
		return currentBounds;
	};

	Serialize() {
		return  {x: x, y: y, xVelocity: xVelocity, yVelocity: yVelocity};
	};
	
	Deserialize = function(data) {
		x = data.x;
		y = data.y;
		xVelocity = data.xVelocity;
		yVelocity = data.yVelocity;
	};
}
