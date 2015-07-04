/*global window*/

var sound = require("./sound");
var canvas = require("./canvas");
var powerupmanager = require("./powerupmanager");
var level = require("./level");
var player = require("./player");
var imagemanager = require("./imagemanager");
var effect = require("./effect");
var emitter = require("./emitter");
var mallow = require("./mallow");
var bubble = require("./bubble");
var log = require("./log");
var platform = require("./platform");
var rope = require("./rope");

/*TODO:
 * bug with interupt animation in player that the player could come out of a death animation
 *
 * */

/**
 * @constructor
 */
function Game(time) {
	var platforms, ropes, players, mallows,
	emitters, effects, bubbles, entities,
	debug,
	gameOver = false,
	/*selector,
	inSelectMode,*/

	gameInterval,
	loadingInterval,

	nextBubbleTime,
	level_,
	scale = 1,
	FPS = 60,
	maxBubbles = 3,
	maxTimeBetweenBubbles = 3000,
	powerups,
	gameEndTime = 0,
	winner,
	lastTime = time.Get(),
	bubbleDisabled = false;

	if (typeof document !== 'undefined') {
		document.onkeyup = function(e){this.OnKeyUp(e, true);}.bind(this);
		document.onkeydown = function(e){this.OnKeyDown(e, true);}.bind(this);
	}

	sound.sound.Preload("buzz");

	this.getTime = function() {
		return time.Get();
	}

	this.CreateEffect = function(name, x, y) {
		effects.push(new name(x, y));
	};

	this.Draw = function() {
		canvas.canvas.Clear();
		/*if (this.InSelectMode()){
			selector.Draw();
		}else{*/
			ArrayDraw(platforms);
			ArrayDraw(ropes);
			ArrayDraw(emitters);
			ArrayDraw(players);
			ArrayDraw(mallows);
			ArrayDraw(bubbles);
			ArrayDraw(effects);

			//might need to place this somewhere else
			ArrayDraw(entities);
		//}
	};

	function ArrayDraw(array) {
		var i;
		for (i = 0; i < array.length; i += 1){
			if (array[i].Draw){
				array[i].Draw();
			}
		}
	}

	this.GetRopes = function() {
		return ropes;
	};

	this.GetPlatforms = function() {
		return platforms;
	};

	this.GetWinner = function() {
		return winner;
	};

	this.Update = function() {
		var currentTime = time.Get();
		var deltaT = (currentTime - lastTime)/1000;
		/*if (this.InSelectMode()){
			selector.Update();
		}else{*/
			ArrayUpdate(players, deltaT);
			ArrayUpdate(mallows, deltaT);
			ArrayUpdate(entities, deltaT);
			this.UpdateBubbles(deltaT);

			for(var i = 0; i < effects.length; i += 1){
				effects[i].Update(deltaT);
				if (!effects[i].IsDraw()){
					effects.splice(i, 1);
					i -= 1;
				}
			}

			if ((players[0].IsDead() || players[1].IsDead()) && !gameOver){
				players[0].SetInteruptInput(true);
				players[1].SetInteruptInput(true);
				players[0].DisableInput();
				players[1].DisableInput();
				if(players[0].IsDead() && players[1].IsDead()){
					log.log.DebugLog("tie");
					gameOver = true;
					winner = 2;
				}else if (players[0].IsDead() && players[1].IsInPositionToWin()){
					log.log.DebugLog("Player 2 wins");
					players[1].Win();
					gameOver = true;
					winner = 1;
				}else if (players[1].IsDead() && players[0].IsInPositionToWin()){
					log.log.DebugLog("Player 1 wins");
					players[0].Win();
					gameOver = true;
					winner = 0;
				}
				if (gameOver){
					gameEndTime = time.Get();
					SetNextBubbleTime();
					for(i = 0; i < bubbles.length; i += 1){
						bubbles[i].SetDone(true);
					}
				}

			}

		//}
		this.GetCollitionsOf(players[0]);
		lastTime = currentTime;
	};

	this.GetGameEndTime = function() {
		return gameEndTime;
	};

	//this collisions system kind of sucks... but it works for mduel
	this.GetCollitionsOf = function(entity) {
		var other = this.GetOponentOf(entity);

		if (this.DoesCollide(entity,other)){
			entity.Collide(other);
			other.Collide(entity);
		} else {
			entity.DoCollide();
			other.DoCollide();
		}
	};

	this.DoesCollide = function(entity, other) {
		var entitybounds = entity.GetCurrentBounds(),
		otherbounds = other.GetCurrentBounds();
		return  entity.GetX()+entitybounds.GetX() + entitybounds.GetWidth() > other.GetX()+otherbounds.GetX() &&
				entity.GetX()+entitybounds.GetX() < other.GetX()+otherbounds.GetX()+otherbounds.GetWidth() &&
				entity.GetY()+entitybounds.GetY() + entitybounds.GetHeight() > other.GetY()+otherbounds.GetY() &&
				entity.GetY()+entitybounds.GetY() < other.GetY()+otherbounds.GetY()+otherbounds.GetHeight();
	};

	this.UpdateBubbles = function(deltaT) {

		for(var i = 0; i < bubbles.length; i += 1){
			bubbles[i].Update(deltaT);

			if(this.DoesCollide(bubbles[i], players[0])){
				bubbles[i].CollidePlayer(players[0]);
			}else if(this.DoesCollide(bubbles[i], players[1])){
				bubbles[i].CollidePlayer(players[1]);
			}
			if (bubbles[i].IsDone()){
				this.CreateEffect(effect.BubbleDisolve, bubbles[i].GetX(), bubbles[i].GetY());
				bubbles.splice(i, 1);
				i -= 1;
				if (bubbles.length < maxBubbles){
					SetNextBubbleTime();
				}
			}
		}

		if (!gameOver && bubbles.length < maxBubbles && time.Get() > nextBubbleTime && !bubbleDisabled) {
			var emittor = Math.floor(Math.random()*3+1);
			var x, y, ey, ex, xVelocity, yVelocity, newBubble;
			if (emittor === 1) {
				x = 14;
				y = 92;
				ex = 8;
				ey = 88;
			} else if (emittor === 2) {
				x = 295;
				y = 95;
				ex = 290;
				ey = 91;
			} else if (emittor === 3) {
				x = 156;
				y = 12;
				ex = 150;
				ey = 7;
			}
			xVelocity = Math.random()*20+20;
			if (Math.random()<0.5){
				xVelocity *= -1;
			}
			yVelocity = Math.random()*20+20;
			if (Math.random()>0.5){
				yVelocity *= -1;
			}
			newBubble = new bubble.Bubble(x, y, xVelocity, yVelocity, this);
			newBubble.SetCurrentPowerup(powerups.GetRandomPowerup(newBubble));
			bubbles.push(newBubble);
			this.CreateEffect(effect.PurpleSmoke, ex, ey);
			SetNextBubbleTime();

		}
	};

	function SetNextBubbleTime() {
		nextBubbleTime = time.Get() + Math.random() * maxTimeBetweenBubbles;
	}

	/*this.InSelectMode = function() {
		return inSelectMode;
	};*/

	function ArrayUpdate(array, deltaT) {
		for (var i = 0; i < array.length; i += 1){
			array[i].Update(deltaT);
		}
	}

	/*this.ColourSelect = function() {
		inSelectMode = true;
		selector = new Selector(0, 0, scale);
	};

	this.GetSelector = function() {
		return selector;
	};*/


	this.Restart = function() {
		window.clearInterval(gameInterval);

		this.init();
	};

	this.init = function() {
		canvas.canvas.Clear();


		var params, frame, i;

		stoppedTime = 0;
		platforms = [];
		ropes = [];
		players = [];
		mallows = [];
		emitters = [];
		effects = [];
		bubbles = [];
		entities = [];
		debug = false;
		gameOver = false;
		//inSelectMode = false;
		timeStarted = false;

		powerups = new powerupmanager.PowerupManager(this);
		powerups.ReigisterPowerups();

		SetNextBubbleTime();

		if (typeof location != 'undefined') {
			params = location.href.split("?");
			if (params[1] === "debug"){
				debug = true;
			}
		}

		level_ = new level.Level(this);
		level_.SetupPlatforms();
		level_.SetupRopes(platforms, ropes);


		players[0] = new player.Player(28, 144, imagemanager.image.GetPlayer1Img(), this);
		players[1] = new player.Player(268, 144, imagemanager.image.GetPlayer2Img(), this);
		players[1].SetKeys(38, 40, 37, 39, 13);
		players[1].SetFlipped(true);


		this.CreateEffect(effect.GreenSmoke, 28, 144);
		this.CreateEffect(effect.GreenSmoke, 268, 144);

		frame = 0;
		for (i = 0; i < 20; i += 1){
			mallows.push(new mallow.Mallow(i*16, 176, frame));
			frame += 1;
			if (frame === 4){
				frame = 0;
			}
		}

		emitters.push(new emitter.Emitter(0, 92, 0));
		emitters.push(new emitter.Emitter(152, 0, 1));
		emitters.push(new emitter.Emitter(320-16, 92, 2));

		loadingInterval = setInterval(CheckLoadedInterval.bind(this), 25);
	};

	this.End = function() {
		//Clean stuff up
		clearInterval(gameInterval);
	};

	function CheckLoadedInterval() {
		if (this.IsLoaded()){
			clearInterval(loadingInterval);
			this.FinishLoading();
		}
	}



	this.FinishLoading = function() {
		sound.sound.Play("buzz");
		gameInterval = setInterval(function(){this.Update();this.Draw();}.bind(this), 1000 / FPS);
	};

	this.IsLoaded = function() {
		return imagemanager.image.IsLoaded();
	};

	this.MakeFloor = function(x1,x2,y) {
		level_.MakeFloor(x1, x2, y);
	};

	this.IsOnGround = function(yb, ya, entity) {
		if (ya < yb){
			return;
		}
		var entityBounds = entity.GetCurrentBounds(), other,
		platformsPassedThrough = [],
		platform, min = 240, i;
		for (i = 0; i < platforms.length; i += 1){
			other = platforms[i];
			if (((yb+entityBounds.GetY()+entityBounds.GetHeight() === other.GetY()) || (yb < other.GetY()-(entityBounds.GetY()+entityBounds.GetHeight()) && ya > other.GetY()-(entityBounds.GetY()+entityBounds.GetHeight()))) &&
				(entity.GetX() + entityBounds.GetX() < other.GetEnd() && entity.GetX() + entityBounds.GetX() + entityBounds.GetWidth() > other.GetX())){
				platformsPassedThrough.push(other);
			}
		}
		if (platformsPassedThrough.length){
			for (i = 0; i < platformsPassedThrough.length; i += 1){
				other = platformsPassedThrough[i];
				if (other.GetY() <= min){
					min = other.GetY();
					platform = other;
				}
			}
			return platform;
		}
	};

	this.AddPlatform = function(ent) {
		platforms.push(ent);
	};

	this.AddRope = function(ent) {
		ropes.push(ent);
	};

	this.AddEntity = function(entity) {
		entities.push(entity);
	};

	this.RemoveEntity = function(entity) {
		var i;
		for (i = 0; i < entities.length; i += 1){
			if (entities[i] === entity){
				entities.splice(i, 1);
				return;
			}
		}
	};

	this.GetEntityCollisionsOf = function(entity) {
		var collisions = [], i;
		for (i = 0; i < entities.length; i += 1){
			if (this.DoesCollide(entities[i], entity)){
				collisions.push(entities[i]);
			}
		}
		return collisions;
	};

	this.RemovePlatform = function(entity) {
		var i;
		for (i = 0; i < platforms.length; i += 1){
			if (platforms[i] === entity){
				platforms.splice(i, 1);
				return;
			}
		}
	};


	this.GetOponentOf = function(entity) {
		if (entity === players[0]){
			return players[1];
		}else if (entity === players[1]){
			return players[0];
		}
		//javascript will return undefined here
	};

	this.IsOnAppEngine = function() {
		var loc = document.location.href;
		if (loc.search("appspot.com") === -1 || loc.search("127.0.0.1:8080") === -1){
			return true;
		}
		return false;
	};


	this.OnKeyDown = function(event, emit) {
		if (typeof socket != "undefined" && emit)
		socket.emit("keydown", event.keyCode);
		//log.Log(event.keyCode);
		if (players){
			players[0].KeyDown(event.keyCode);
			players[1].KeyDown(event.keyCode);
		}
	};

	this.OnKeyUp = function(event, emit) {
		if (typeof socket != "undefined" && emit)
		socket.emit("keyup", event.keyCode);
		if (event.keyCode == 109){
			Scale.SetScale(Scale.GetScale()-1);
		}else if (event.keyCode == 107){
			Scale.SetScale(Scale.GetScale()+1);
		}
		//log.Log(event.keyCode);
		if (players){
			players[0].KeyUp(event.keyCode);
			players[1].KeyUp(event.keyCode);
		}
	};

	this.SetScale = function(newScale) {
		scale = newScale;

		//container.line-height = 200*scale

	};

	this.GetScale = function() {
		return scale;
	};

	this.SetBubbleDisabled = function(val) {
		bubbleDisabled = val;
	};

	this.Serialize = function() {
		var output = {};

		output.platforms = [];
		for (var i = 0; i < platforms.length; ++i) {
			output.platforms.push(platforms[i].Serialize());
		}

		output.ropes = [];
		for (var i = 0; i < ropes.length; ++i) {
			output.ropes.push(ropes[i].Serialize());
		}

		output.bubbles = [];
		for (var i = 0; i < bubbles.length; ++i) {
			output.bubbles.push(bubbles[i].Serialize());
		}

		output.players = [];
		for (var i = 0; i < players.length; ++i) {
			output.players.push(players[i].Serialize());
		}

		return output;
	};

	this.Deserialize = function(data) {

		platforms = [];
		for (var i = 0; i < data.platforms.length; ++i) {
			var newplat = new platform.Platform(0,0,0, this);
			newplat.Deserialize(data.platforms[i]);
			platforms.push(newplat);
			//platforms[i].Deserialize(data.platforms[i]);
		}

		bubbles = [];
		for (var i = 0; i < data.bubbles.length; ++i) {
			var newBubble = new bubble.Bubble(0, 0, 0, 0, this);
			newBubble.Deserialize(data.bubbles[i]);
			newBubble.SetCurrentPowerup(powerups.CreatePowerupByName(newBubble.GetPowerupName(), newBubble));
			bubbles.push(newBubble);
		}

		ropes = [];
		for (var i = 0; i < data.ropes.length; ++i) {
			var newBubble = new rope.Rope(0, 0, 0, this);
			newBubble.Deserialize(data.ropes[i]);
			ropes.push(newBubble);
		}
/*
		output.ropes = [];
		for (var i = 0; i < ropes.length; ++i) {
			output.ropes.push(ropes[i].Serialize());
		}

		output.bubbles = [];
		for (var i = 0; i < bubbles.length; ++i) {
			output.bubbles.push(bubbles[i].Serialize());
		}

		output.players = [];
		for (var i = 0; i < players.length; ++i) {
			output.players.push(players[i].Serialize());
		}*/

		for (var i = 0; i < data.players.length; ++i) {
			players[i].Deserialize(data.players[i]);
		}
	};
}


module.exports = {
  Game: Game
};
