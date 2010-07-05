function Player(x, y, img){
	var lastUpdateTime = core.GetTime()
	var animations = new Array();
	
	animations["run"] = new Animation(25, 0, 100, 4, 24, 24);
	
	animations["idle"] = new Animation(25, 100, 100, 1, 24, 24);
	
	animations["crouch"] = new Animation(25, 125, 50, 2, 24, 24);
	animations["crouch"].Repeat(false);
	
	
	animations["uncrouch"] = new Animation(25, 125, 50, 1, 24, 24);
	animations["uncrouch"].Repeat(false);
	
	animations["roll"] = new Animation(25, 175, 75, 5, 24, 24);
	animations["roll"].Repeat(false);
	
	animations["roll2"] = new Animation(25, 200, 50, 4, 24, 24);
	animations["roll2"].Repeat(false);
	
	animations["climbup"] = new Animation(25, 575, 150, 3, 24, 24);
	animations["climbup"].Reverse(false);
	
	animations["climbdown"] = new Animation(25, 575, 150, 3, 24, 24);
	animations["climbdown"].Reverse(true);
	
	animations["climbidle"] = new Animation(25, 600, 100, 1, 24, 24);
	
	animations["fall"] = new Animation(25, 650, 100, 1, 24, 24);
	
	animations["standingwin"] = new Animation(25, 675, 100, 2, 24, 24);
	animations["standingwin"].Repeat(false);
	
	animations["ropewin"] = new Animation(25, 725, 100, 2, 24, 24);
	animations["ropewin"].Repeat(false);
	
	animations["jumpup"] = new Animation(25, 300, 75, 6, 24, 24);
	animations["jumpup"].Repeat(false);
	
	animations["jump"] = new Animation(25, 775, 100, 4, 24, 24);
	animations["jump"].Repeat(false);

	animations["land"] = new Animation(25, 300, 50, 1, 24, 24);
	
	animations["pushedforward"] = new Animation(25, 875, 100, 2, 24, 24);
	
	animations["pushedbackward"] = new Animation(25, 925, 100, 2, 24, 24);
	
	var keyCodes = new Array();
	keyCodes["right"] = 68;
	keyCodes["left"] = 65;
	keyCodes["up"] = 87;
	keyCodes["down"] = 83;
	var keys = new Array();
	keys["right"] = false;
	keys["left"] = false;
	keys["up"] = false;
	keys["down"] = false;
	var keysLastFrame = new Array();
	
	var currentAnimation;

	var flipped = false;
	
	var x = x;
	var y = y;
	var yVelocity = 0;
	var yMaxVelocity = 180
	var xVelocity = 0
	var yAcceleration = 500
	var onGround = false
	var isCrouched = false
	var isRolling = false
	var isOnRope = false
	var wasOnGround = false
	var falling = false
	var reversedRoll = false
	var runningRight = false
	var runningLeft = false
	var wasRunningLeft = false
	var wasRunningRight = false
	var isCrouchingUp = false
	var pushed = false
	var wasCrouched = false
	var justUncrouched = false
	var dead = false
	var isWinning = false
	var isJumpingUp = false
	var isJumping = false
	var interuptInput = false
	var wasRolling = false
	var dontCollide = false
	
	var standingBounds = new Bounds(6, 1, 10, 23)
	var crouchingBounds = new Bounds(6, 10, 10, 14)
	var fallingBounds = new Bounds(6, 1, 10, 23)
	var currentBounds = standingBounds
	
	var currentRope
	
	const RUNSPEED = 60
	const PUSHEDSPEED = 80
	const ROLLSPEED = 60
	const CLIMBSPEED = 60
	const JUMPYVELOCITY = -170
	const JUMPXVELOCITY = 60

	this.Draw = function(){
		currentAnimation.Draw(img, x, y)
		//ctx.fillStyle = "rgb(255,0,255)"
		//window.ctx.fillRect(x+currentBounds.GetX(), y+currentBounds.GetY(), currentBounds.GetWidth(), currentBounds.GetHeight())
	}
	
	this.Update = function(){
		currentTime = core.GetTime()
		var deltaT = (currentTime - lastUpdateTime)/1000
		this.SimulateGravity(deltaT)
		
		if (y > 200-40 && !dead){
			dead = true
			core.CreateEffect("BigSplash", x, 200-40)
		}
		if (x < 0 || x > 300)
			this.Bounce(false)
			
		if (isWinning){
		
		
		} else if (isOnRope){
			if (!(keys["left"] || keys["right"])){
				
				yVelocity = (keys["down"] - keys["up"]) * CLIMBSPEED
				if (keys["up"] && !keysLastFrame["up"])
					this.SetAnimation("climbup")
				else if (keys["down"] && !keysLastFrame["down"])
					this.SetAnimation("climbdown")
				else if (!keys["down"] && !keys["up"])
					this.SetAnimation("climbidle")
			}else if (!(keys["up"] || keys["down"])){
				isOnRope = false;
				xVelocity = RUNSPEED * (keys["right"]-keys["left"]);
				yVelocity = 0
				this.StartFall(true);
			}
			
			
		} else if (isJumpingUp) {
			if (currentAnimation.IsAnimationDone()){
				isJumpingUp = false
			}
			
		} else if (isJumping) {
			if (currentAnimation.IsAnimationDone()){
				isJumping = false
				this.StartFall(false);
				onGround = false
				//wasOnGround = false
				
			}
		} else if (onGround) {
			pushed = false
			if (runningRight && !keys["right"] && !isRolling)
				runningRight = false
				
			if (runningLeft && !keys["left"] && !isRolling)
				runningLeft = false
			
			if(!isRolling)
				xVelocity = RUNSPEED * (runningRight-runningLeft)
			
			if(!isCrouched && !isRolling){
				if (keys["right"])
					flipped = false
				else if (keys["left"])
					flipped = true
			}
			if (this.IsTouchingRope() && (keys["up"] || keys["down"]) && !(keys["left"] || keys["right"]) && !isCrouched && !isRolling){
				isOnRope = true;
				onGround = false;
				wasOnGround = false;
				x = currentRope.GetX()-11;
				if (keys["down"])
					this.SetAnimation("climbdown");
				else if (keys["up"])
					this.SetAnimation("climbup");
			}else if (isCrouched){
				if (isCrouchingUp){
					if (currentAnimation.IsAnimationDone()){
						//this.SetAnimation("run")
						isCrouchingUp = false
						isCrouched = false
						justUncrouched = true
						currentBounds = standingBounds
					}
				}else if (!keys["down"] && !isCrouchingUp && currentAnimation.IsAnimationDone()){
					isCrouchingUp = true
					this.SetAnimation("uncrouch")
				}
			} else if (isRolling) {
				//console.log("rolling")
				//xVelocity = flipped ? -ROLLSPEED : ROLLSPEED
				//if (reversedRoll)
				//	xVelocity *= -1
				if (currentAnimation.IsAnimationDone()){
					//console.log("rolling end")
					runningRight = false
					runningLeft = false
					isRolling = false
					reversedRoll = false
					xVelocity = 0
					this.SetAnimation("crouch")
					currentAnimation.SetFrame(1);
					isCrouched = true
					currentBounds = crouchingBounds
				}
			
			} else if (keys["down"] && (runningLeft || runningRight)){
				isRolling = true
				this.SetAnimation("roll")
			}else if (keys["down"]){
				isCrouched = true
				currentBounds = crouchingBounds
				xVelocity = 0
				this.SetAnimation("crouch")
			}else if (keys["up"] && (keys["right"] || keys["left"])){
				core.DebugLog("jump")
				yVelocity = JUMPYVELOCITY
				isJumping = true
				xVelocity = JUMPXVELOCITY * (keys["right"]-keys["left"]);
				--y
				this.SetAnimation("jump")
				onGround = false
			}else if (keys["up"]){
				yVelocity = JUMPYVELOCITY
				--y
				onGround = false
				isJumpingUp = true
				this.SetAnimation("jumpup")
				core.DebugLog("jumpup")
			}else if (keys["right"] && (!keysLastFrame["right"] || wasRunningLeft || wasCrouched || !wasOnGround) && !runningLeft){
				runningRight = true
				this.SetAnimation("run")
				
			}else if (keys["left"] && (!keysLastFrame["left"] || wasRunningRight || wasCrouched || !wasOnGround) && !runningRight){
				runningLeft = true
				this.SetAnimation("run")
				
			}else if (!keys["left"] && !keys["right"]){
				this.SetAnimation("idle")
			}
			
		}
		
		x += deltaT*xVelocity
		
		//core.GetCollitionsOf(this)
		
		currentAnimation.Update()
		this.UpdateKeysLastFrame()
		
		wasOnGround = onGround
		if (!justUncrouched)
			wasCrouched = isCrouched
		justUncrouched = false
		wasRunningLeft = runningLeft
		wasRunningRight = runningRight
		wasRolling = isRolling
		lastUpdateTime = currentTime
		
	}
	
	this.Collide = function(other, ignore) {
		if (pushed || dontCollide)
			return
		if ((other.IsRolling()) && wasOnGround && !isCrouched && !isRolling){
			//console.log("type 1")
			var dontMove = xVelocity == 0 && other.IsRolling();
			this.Bounce(true);
			this.StartFall(false);
			if (dontMove)
				xVelocity = 0;
			yVelocity = JUMPYVELOCITY
		} else if (xVelocity == 0 && other.GetXVelocity() == 0 && (yVelocity != 0 || other.GetYVelocity() != 0)) {
			//console.log("type 2")
		} else if ((other.IsCrouched() && isRolling) || ((other.IsRolling() || other.WasRolling()) && isCrouched)) {
			//console.log("type 10")
			x < other.GetX() ? this.Bounce(flipped) : this.Bounce(!flipped);
			this.StartFall(false);
			yVelocity = JUMPYVELOCITY*2/3;
		} else if (other.IsCrouched() ) {
			//console.log("type 8")
			this.Bounce(true)
			this.StartFall(false)
			yVelocity = JUMPYVELOCITY*2/3
		} else if (isCrouched && other.GetXVelocity != 0) {
			//console.log("type 9")

		} else if (!isRolling && other.IsRolling()) {
			//console.log("type 3")
			this.Bounce(true)
			this.StartFall(false)
			yVelocity = JUMPYVELOCITY*2/3
		} else if (isRolling && !(other.IsRolling() || other.WasRolling())) {
			//console.log("type 4")
		} else if (xVelocity != 0 && other.GetXVelocity() != 0) {
			//console.log("type 5")
			isOnRope = false;

			x < other.GetX() ? this.Bounce(flipped) : this.Bounce(!flipped);
			this.StartFall(false);
			yVelocity = JUMPYVELOCITY*2/3;
		} else if (xVelocity == 0 && other.GetXVelocity() != 0) {
			//console.log("type 6")
			other.IsFlipped() ? this.Bounce(flipped) : this.Bounce(!flipped);
			this.StartFall(false);
			other.DontCollide()
			yVelocity = JUMPYVELOCITY*2/3;
		} else {
			//console.log("type 7")
		}
	}
	
	
	this.Bounce = function(forward) {
		pushed = true
		if (forward) {
			xVelocity = (flipped ? -PUSHEDSPEED : PUSHEDSPEED)
			this.SetAnimation("pushedforward")
		} else {
			xVelocity = (flipped ? PUSHEDSPEED : -PUSHEDSPEED)
			this.SetAnimation("pushedbackward")
		}
	}
	
	this.CollectPowerup = function(bubble) {
		console.log(bubble.GetPowerupName())
		bubble.SetDone(true)
	}
	
	this.SetImage = function(image){
		img = image
	}
	
	this.IsInPositionToWin = function(){
		return (onGround || isOnRope) && !(isJumpingUp || isJumping || falling || isRolling || pushed)
	}
	
	this.Win = function(){
		
		if (isOnRope)
			this.SetAnimation("ropewin")
		else
			this.SetAnimation("standingwin")
		isWinning = true
		xVelocity = 0
		yVelocity = 0
		currentAnimation.Update(x, y)
	}
	
	this.IsWinning = function(){
		return isWinning
	}
	
	this.DontCollide = function() {
		dontCollide = true
	}
	
	this.DoCollide = function() {
		dontCollide = false
	}
	
	this.IsPushed = function() {
		return pushed
	}
	
	this.WasOnGround = function() {
		return wasOnGround
	}
	
	this.IsOnGround = function() {
		return onGround
	}
	
	this.IsOnRope = function(){
		return isOnRope
	}
	
	this.IsRolling = function() {
		return isRolling
	}
	
	this.WasRolling = function() {
		return wasRolling
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
	
	this.SetFlipped = function(nf) {
		flipped = nf
	}
	
	this.IsFlipped = function() {
		return flipped
	}
	
	this.IsDead = function(){
		return dead
	}
	
	this.IsCrouched = function() {
		return isCrouched
	}
	
	this.SetInteruptInput = function(interupt){
		interuptInput = interupt
	}
	
	this.SetAnimation = function(name){
		if(isWinning)
			return
		if (name != 'idle')
			core.DebugLog("Animation Changed to " + name)
		currentAnimation = animations[name];
		currentAnimation.ChangeTo(flipped);
	}
	
	this.KeyDown = function(keyCode) {
		if (interuptInput){
			return
		}
		if (keyCode == keyCodes["right"] ){
			core.DebugLog("KeyDown Right")
			keys["right"] = true;
		}else if (keyCode == keyCodes["left"] ){
			core.DebugLog("KeyDown Left")
			keys["left"] = true;
		}else if (keyCode == keyCodes["down"] ){
			core.DebugLog("KeyDown Down")
			keys["down"] = true;
		}else if (keyCode == keyCodes["up"] ){
			core.DebugLog("KeyDown Up")
			keys["up"] = true;
		}
	}
	
	this.KeyUp = function(keyCode) {
		if (keyCode == keyCodes["right"] ){
			core.DebugLog("KeyUp Right")
			keys["right"] = false;
		}else if (keyCode == keyCodes["left"] ){
			core.DebugLog("KeyUp Left")
			keys["left"] = false;
		}else if (keyCode == keyCodes["down"] ){
			core.DebugLog("KeyUp Down")
			keys["down"] = false;
		}else if (keyCode == keyCodes["up"] ){
			core.DebugLog("KeyUp Up")
			keys["up"] = false;
		}
		
	}
	
	this.DisableInput = function() {
		keys["right"] = false
		keys["left"] = false
		keys["up"] = false
		keys["down"] = false
	}
	
	this.UpdateKeysLastFrame = function() {
		keysLastFrame["right"] = keys["right"];
		keysLastFrame["left"] = keys["left"];
		keysLastFrame["up"] = keys["up"];
		keysLastFrame["down"] = keys["down"];
	}
	
	this.SetKeys = function(up, down, left, right) {
		keyCodes["up"] = up;
		keyCodes["down"] = down;
		keyCodes["left"] = left;
		keyCodes["right"] = right;
	}
	
	this.SimulateGravity = function(deltaT) {
		var yb = y;

		if (!isOnRope)
			yVelocity += yAcceleration * deltaT
		if (yMaxVelocity < yVelocity)
			yVelocity = yMaxVelocity

		var ny = y + deltaT * yVelocity;
		if (!isOnRope && yVelocity > 0){
			onGround = false;
			var platforms = core.GetPlatforms()
			for (var i = 0; i < platforms.length; ++i){
				var other = platforms[i];
				if (((yb+24 == other.GetY()) || (yb < other.GetY()-23 && ny > other.GetY()-23)) && (x + currentBounds.GetX() < other.GetEnd() && x + currentBounds.GetX() + currentBounds.GetWidth() > other.GetX())){
					ny = other.GetY()-24;
					yVelocity = 0;
					
					onGround = true;
					if (!wasOnGround)
						this.Land();
					break;
				}
			}
			if(!onGround && wasOnGround)
				this.StartFall(true);
		}else if (isOnRope){
			if (ny+4 < currentRope.GetY()){
				ny = currentRope.GetY()-4;
				
			}else if (ny > currentRope.GetY() + currentRope.GetLength() - 25){
				ny = currentRope.GetY() + currentRope.GetLength()-25;
			}
		}

		y = ny;
	}
	
	this.IsTouchingRope = function() {
	
		var ropes = core.GetRopes()
		for (var i = 0; i < ropes.length; ++i){
			var rope = ropes[i];
			if (x + 6  < rope.GetX() && x + 16  > rope.GetX() && y > rope.GetY() - 24 && y < rope.GetY() + rope.GetLength() ){
				currentRope = rope;
				return true;
			}
		}
		currentRope = null;
	}
	
	this.StartFall = function(animate) {
		falling = true;
		onGround = false;
		isRolling = false
		flipped = (keys["right"] - keys["left"]==0 ? flipped : keys["right"] - keys["left"] < 0);
		if (animate)
			this.SetAnimation("fall");
		currentBounds = fallingBounds;
		
	}
	
	this.Land = function() {
		//console.log("land")
		onGround = true
		isJumping = false
		if (pushed){
			//xVelocity = (!flipped ? -RUNSPEED : RUNSPEED)
			this.SetAnimation("roll2");
			isRolling = true
			reversedRoll = true
			pushed = false
			//currentBounds = rollingBounds;
		}else{
			this.SetAnimation("land");
			xVelocity = 0;
			reversedRoll = false
			currentBounds = standingBounds;
		}
	
		falling = false;

		
		
	}
	
	this.GetCurrentBounds = function() {
		return currentBounds
	}
	
	
	this.SetAnimation("idle");
}