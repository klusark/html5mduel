function Bounds(x, y, w, h){
	var x = x;
	var y = y;
	var w = w;
	var h = h;
	this.GetX = function() {
		return x;
	}
	this.GetY = function() {
		return y;
	}
	this.GetWidth = function() {
		return w;
	}
	this.GetHeight = function() {
		return h;
	}
}

function Player(x, y){
	var img = new Image();
	img.src = 'images/player.png';
	var frame = 0;
	var lastUpdateTime = GetTime()
	var animations = new Array();
	
	animations["run"] = new Animation(img, 25, 0, 100, 4, 24, 24);
	
	animations["idle"] = new Animation(img, 25, 100, 100, 1, 24, 24);
	
	animations["crouch"] = new Animation(img, 25, 125, 100, 2, 24, 24);
	animations["crouch"].Repeat(false);
	
	animations["crouch"] = new Animation(img, 25, 125, 100, 2, 24, 24);
	animations["crouch"].Repeat(false);
	
	animations["uncrouch"] = new Animation(img, 25, 125, 100, 1, 24, 24);
	animations["uncrouch"].Repeat(false);
	
	animations["roll"] = new Animation(img, 25, 175, 75, 5, 24, 24);
	animations["roll"].Repeat(false);
	
	animations["climbup"] = new Animation(img, 25, 575, 150, 3, 24, 24);
	animations["climbup"].Reverse(false);
	
	animations["climbdown"] = new Animation(img, 25, 575, 150, 3, 24, 24);
	animations["climbdown"].Reverse(true);
	
	animations["climbidle"] = new Animation(img, 25, 600, 100, 1, 24, 24);
	
	animations["fall"] = new Animation(img, 25, 650, 100, 1, 24, 24);
	
	animations["standingwin"] = new Animation(img, 25, 675, 100, 2, 24, 24);
	animations["standingwin"].Repeat(false);
	
	animations["ropewin"] = new Animation(img, 25, 725, 100, 2, 24, 24);
	animations["ropewin"].Repeat(false);
	
	animations["jumpup"] = new Animation(img, 25, 725, 100, 2, 24, 24);
	animations["jumpup"].Repeat(false);

	animations["land"] = new Animation(img, 25, 300, 50, 1, 24, 24);
	
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
	var runningRight = false
	var runningLeft = false
	var wasRunningLeft = false
	var wasRunningRight = false
	var isCrouchingUp = false
	var wasCrouched = false
	var justUncrouched = false
	var dead = false
	var isWinning = false
	
	var standingBounds = new Bounds(6, 1, 10, 23)
	var crouchingBounds = new Bounds(6, 10, 10, 14)
	var fallingBounds = new Bounds(6, 1, 10, 23)
	var currentBounds = standingBounds
	
	var currentRope
	
	const RUNSPEED = 60
	const CLIMBSPEED = 60

	this.Draw = function(){
		currentAnimation.Draw()
		//ctx.fillStyle = "rgb(255,0,255)"
		//window.ctx.fillRect(x+currentBounds.GetX(), y+currentBounds.GetY(), currentBounds.GetWidth(), currentBounds.GetHeight())
	}
	
	this.Update = function(){
		currentTime = GetTime()
		var deltaT = (currentTime - lastUpdateTime)/1000
		this.SimulateGravity(deltaT)
		
		if (y > 200-40 && !dead){
			dead = true
			CreateEffect("BigSplash", x, 200-40);
		}
		
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
			}else{
				isOnRope = false;
				xVelocity = RUNSPEED * (keys["right"]-keys["left"]);
				yVelocity = 0;
				this.StartFall();
			}
			
			
		}else if (onGround){
			
			if (runningRight && !keys["right"] && !isRolling)
				runningRight = false
				
			if (runningLeft && !keys["left"] && !isRolling)
				runningLeft = false
				
			xVelocity = RUNSPEED * (runningRight-runningLeft);
			
			if(!isCrouched){
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
				if (currentAnimation.IsAnimationDone()){
					runningRight = false
					runningLeft = false
					isRolling = false
					xVelocity = 0
					this.SetAnimation("crouch")
					currentAnimation.SetFrame(1);
					isCrouched = true
					currentBounds = crouchingBounds
				}
			
			}else if (keys["down"] && (runningLeft || runningRight)){
				isRolling = true
				this.SetAnimation("roll")
			}else if (keys["down"]){
				isCrouched = true
				currentBounds = crouchingBounds
				xVelocity = 0
				this.SetAnimation("crouch")
			}else if (keys["up"] && (runningLeft || runningRight)){
				console.log("jump")
				//isRolling = true
				//this.SetAnimation("roll")
			}else if (keys["up"]){
				/*isCrouched = true
				currentBounds = crouchingBounds
				xVelocity = 0
				this.SetAnimation("crouch")*/
				console.log("jumpup")
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
		currentAnimation.Update(x, y)
		this.UpdateKeysLastFrame()
		
		wasOnGround = onGround
		if (!justUncrouched)
			wasCrouched = isCrouched
		justUncrouched = false
		wasRunningLeft = runningLeft
		wasRunningRight = runningRight
		lastUpdateTime = currentTime
		
	}
	
	this.SetImage = function(name){
		img.src = name
	}
	
	this.Win = function(){
		isWinning = true
		if (isOnRope)
			this.SetAnimation("ropewin")
		else
			this.SetAnimation("standingwin")
		xVelocity = 0
		yVelocity = 0
		currentAnimation.Update(x, y)
	}
	
	this.IsWinning = function(){
		return isWinning
	}
	
	this.IsOnRope = function(){
		return isOnRope;
	}
	
	this.GetY = function(){
		return y;
	}
	
	this.GetX = function(){
		return x;
	}
	
	this.SetY = function(ny) {
		y = ny
	}
	
	this.SetX = function(nx) {
		x = nx
	}
	
	this.SetFlipped = function(nf) {
		flipped = nf;
	}
	
	this.IsDead = function(){
		return dead
	}
	
	this.IsInPositionToWin = function(){
		return (onGround || isOnRope)
	}
	
	this.SetAnimation = function(name){
		//DebugLog("Animation Changed to " + name)
		currentAnimation = animations[name];
		currentAnimation.ChangeTo(flipped);
	}
	
	this.KeyDown = function(keyCode) {
		if(falling)
			return;
		else if (keyCode == keyCodes["right"] ){
			DebugLog("KeyDown Right")
			keys["right"] = true;
		}else if (keyCode == keyCodes["left"] ){
			DebugLog("KeyDown Left")
			keys["left"] = true;
		}else if (keyCode == keyCodes["down"] ){
			DebugLog("KeyDown Down")
			keys["down"] = true;
		}else if (keyCode == keyCodes["up"] ){
			DebugLog("KeyDown Up")
			keys["up"] = true;
		}
	}
	
	this.KeyUp = function(keyCode) {
		if (keyCode == keyCodes["right"] ){
			DebugLog("KeyUp Right")
			keys["right"] = false;
		}else if (keyCode == keyCodes["left"] ){
			DebugLog("KeyUp Left")
			keys["left"] = false;
		}else if (keyCode == keyCodes["down"] ){
			DebugLog("KeyUp Down")
			keys["down"] = false;
		}else if (keyCode == keyCodes["up"] ){
			DebugLog("KeyUp Up")
			keys["up"] = false;
		}
		
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
		if (!isOnRope){
			onGround = false;
			for (var i = 0; i < window.platforms.length; ++i){
				var other = window.platforms[i];
				if (((yb+24 == other.GetY()) || (yb < other.GetY()-23 && ny > other.GetY()-23)) && (x + currentBounds.GetX() <= other.GetEnd() && x + currentBounds.GetX() + currentBounds.GetWidth() > other.GetX())){
					ny = other.GetY()-24;
					yVelocity = 0;
					
					onGround = true;
					if (!wasOnGround)
						this.Land();
					break;
				}
			}
			if(!onGround && wasOnGround)
				this.StartFall();
		}else{
			if (ny+4 < currentRope.GetY()){
				ny = currentRope.GetY()-4;
				
			}else if (ny > currentRope.GetY() + currentRope.GetLength() - 25){
				ny = currentRope.GetY() + currentRope.GetLength()-25;
			}
		}

		y = ny;
	}
	
	this.IsTouchingRope = function() {
	
		for (var i = 0; i < window.ropes.length; ++i){
			var rope = window.ropes[i];
			if (x + 6  < rope.GetX() && x + 16  > rope.GetX() && y > rope.GetY() - 24 && y < rope.GetY() + rope.GetLength() ){
				currentRope = rope;
				return true;
			}
		}
		currentRope = null;
	}
	
	this.StartFall = function() {
		falling = true;
		flipped = (keys["right"] - keys["left"]==0 ? flipped : keys["right"] - keys["left"] < 0);
		this.SetAnimation("fall");
		currentBounds = fallingBounds;
		
	}
	
	this.Land = function() {
		falling = false;
		this.SetAnimation("land");
		xVelocity = 0;
		currentBounds = standingBounds;
	}
	
	this.SetAnimation("idle");
}