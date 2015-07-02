/*global game, image, Animation, Bounds*/

var time = require("./time");
var imagemanager = require("./imagemanager");
var animation = require("./animation");
var bounds = require("./bounds");

/**
 * @constructor
 */
function Bubble(x, y, xVelocity, yVelocity) {
	var img = imagemanager.image.GetSpritesImg(),
	lastUpdateTime = time.time.Get(),

	animation_ = new animation.Animation(25, 336, 200, 3, 16, 16),


	powerup,

	done = false,

	currentBounds = new bounds.Bounds(0, 0, 16, 16);

	this.SetCurrentPowerup = function(npowerup) {
		powerup = npowerup;
	};

	this.Draw = function() {
		animation_.Draw(img, x, y);
		powerup.image.Draw(x+2, y+2);
	};

	this.Update = function() {
		var currentTime = time.time.Get(),
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

		animation_.Update();

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

module.exports = {
  Bubble: Bubble
};
