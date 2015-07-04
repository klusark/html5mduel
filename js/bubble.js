/*global game, image, Animation, Bounds*/

var imagemanager = require("./imagemanager");
var animation = require("./animation");
var bounds = require("./bounds");

/**
 * @constructor
 */
function Bubble(x, y, xVelocity, yVelocity, game) {
	var img = imagemanager.image.GetSpritesImg(),

	animation_ = new animation.Animation(25, 336, 200, 3, 16, 16),


	powerup,

	done = false,

	currentBounds = new bounds.Bounds(0, 0, 16, 16),
	name;

	this.SetCurrentPowerup = function(npowerup) {
		powerup = npowerup.powerup;
		name = npowerup.name;
	};

	this.Draw = function() {
		animation_.Draw(img, x, y);
		powerup.image.Draw(x+2, y+2);
	};

	this.Update = function(deltaT) {
		var ya = y+ deltaT*yVelocity;

		x += deltaT*xVelocity;
		if (powerup && powerup.CollidePlatform){
			var platform = game.IsOnGround(y, ya, this);
			if (platform){
				powerup.CollidePlatform(platform);
			}
		}
		y = ya;
		if (powerup && powerup.Update){
			powerup.Update(deltaT);
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

		animation_.Update(deltaT);
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

	this.Serialize = function() {
		return  {x: x, y: y, xVelocity: xVelocity, yVelocity: yVelocity, name: name};
	};

	this.Deserialize = function(data) {
		x = data.x;
		y = data.y;
		xVelocity = data.xVelocity;
		yVelocity = data.yVelocity;
		name = data.name;
	};

	this.GetPowerupName = function() {
		return name;
	}
}

module.exports = {
  Bubble: Bubble
};
