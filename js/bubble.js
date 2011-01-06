/*global game, image, Animation, Bounds*/
/**
 * @constructor
 */
function Bubble(xI, yI, xVelocityI, yVelocityI) {
	var img = image.GetSpritesImg(),
	lastUpdateTime = time.Get(),

	animation = new Animation(25, 336, 200, 3, 16, 16),


	powerup,
	x = xI,
	y = yI,
	yVelocity = yVelocityI,
	xVelocity = xVelocityI,

	done = false,

	currentBounds = new Bounds(0, 0, 16, 16);

	this.SetCurrentPowerup = function(npowerup) {
		powerup = npowerup;
	};

	this.Draw = function() {
		animation.Draw(img, x, y);
		powerup.image.Draw(x+2, y+2);
	};

	this.Update = function() {
		var currentTime = time.Get(),
		deltaT = (currentTime - lastUpdateTime)/1000,

		ya = y+ deltaT*yVelocity,
		platform;


		x += deltaT*xVelocity;
		if (powerup && powerup.CollidePlatform){
			platform = game.IsOnGround(y, ya, this);
			if (platform){
				powerup.CollidePlatform(platform);
			}
		}
		y = ya;
		if (powerup && powerup.Update){
			powerup.Update();
		}

		if (y > 163){
			y = 163;
			yVelocity *= -1;
		} else if (y < -2) {
			y = -2;
			yVelocity *= -1;
		}
		if (x > 306) {
			x = 306;
			xVelocity *= -1;
		} else if (x < -2) {
			x = -2;
			xVelocity *= -1;
		}

		animation.Update();

		lastUpdateTime = currentTime;

	};

	this.CollidePlayer = function(player) {
		if (powerup && powerup.CollidePlayer){
			powerup.CollidePlayer(player);
		}
	};

	this.SetImage = function(image){
		img = image;
	};

	this.GetY = function(){
		return y;
	};

	this.GetX = function(){
		return x;
	};

	this.GetXVelocity = function() {
		return xVelocity;
	};

	this.GetYVelocity = function() {
		return yVelocity;
	};

	this.SetY = function(ny) {
		y = ny;
	};

	this.SetX = function(nx) {
		x = nx;
	};

	this.IsDone = function() {
		return done;
	};

	this.SetDone = function(nDone) {
		done = nDone;
	};


	this.GetCurrentBounds = function() {
		return currentBounds;
	};

}
