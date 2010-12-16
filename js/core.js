/*global Scale, canvas, sound, Effect, log, powerups, Bubble, Selector, Level, window, Player, image, Mallow, Emitter*/
var game;
function Game() {
	var platforms, ropes, players, mallows,
	emitters, effects, bubbles, entities,
	debug,
	gameOver = false,
	selector,
	inSelectMode,

	gameInterval,

	nextBubbleTime,
	startTime,
	timeStarted,
	stoppedTime,
	timescale = 1,
	scale = 1,
	FPS = 30,
	maxBubbles = 3,
	maxTimeBetweenBubbles = 3000;

	sound.Preload("buzz");

	this.GetTime = function() {
		return timeStarted ? new Date().getTime() * timescale - startTime : stoppedTime;
	};

	this.CreateEffect = function(name, x, y) {
		effects.push(new Effect(x, y, name));
	};

	this.Draw = function() {
		canvas.Clear();
		if (this.InSelectMode()){
			selector.Draw();
		}else{
			this.ArrayDraw(platforms);
			this.ArrayDraw(ropes);
			this.ArrayDraw(emitters);
			this.ArrayDraw(players);
			this.ArrayDraw(mallows);
			this.ArrayDraw(bubbles);
			this.ArrayDraw(effects);

			//might need to place this somewhere else
			this.ArrayDraw(entities);
		}
	};

	this.ArrayDraw = function(array) {
		var i;
		for (i = 0; i < array.length; i += 1){
			if (array[i].Draw){
				array[i].Draw();
			}
		}
	};

	this.GetRopes = function() {
		return ropes;
	};

	this.GetPlatforms = function() {
		return platforms;
	};


	this.Update = function() {
		if (this.InSelectMode()){
			selector.Update();
		}else{
			this.ArrayUpdate(players);
			this.ArrayUpdate(mallows);
			this.ArrayUpdate(entities);
			this.UpdateBubbles();

			var i;
			for(i = 0; i < effects.length; i += 1){
				effects[i].Update();
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
					this.DebugLog("tie");
					gameOver = true;
				}else if (players[0].IsDead() && players[1].IsInPositionToWin()){
					log.DebugLog("Player 2 wins");
					players[1].Win();
					gameOver = true;
				}else if (players[1].IsDead() && players[0].IsInPositionToWin()){
					log.DebugLog("Player 1 wins");
					players[0].Win();
					gameOver = true;
				}
				if (gameOver){
					this.SetNextBubbleTime();
					for(i = 0; i < bubbles.length; i += 1){
						bubbles[i].SetDone(true);
					}
				}

			}

		}
		this.GetCollitionsOf(players[0]);
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

	this.UpdateBubbles = function() {
		var emittor = Math.floor(Math.random()*3+1),
		x, y, ey, ex, xVelocity, yVelocity, newBubble, i;

		for(i = 0; i < bubbles.length; i += 1){
			bubbles[i].Update();

			if(this.DoesCollide(bubbles[i], players[0])){
				bubbles[i].CollidePlayer(players[0]);
			}else if(this.DoesCollide(bubbles[i], players[1])){
				bubbles[i].CollidePlayer(players[1]);
			}
			if (bubbles[i].IsDone()){
				this.CreateEffect("BubbleDisolve", bubbles[i].GetX(), bubbles[i].GetY());
				bubbles.splice(i, 1);
				i -= 1;
				if (bubbles.length < maxBubbles){
					this.SetNextBubbleTime();
				}
			}
		}

		if (!gameOver && bubbles.length < maxBubbles && this.GetTime() > nextBubbleTime) {

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
			newBubble = new Bubble(x, y, xVelocity, yVelocity);
			newBubble.SetCurrentPowerup(powerups.GetRandomPowerup(newBubble));
			bubbles.push(newBubble);
			this.CreateEffect("PurpleSmoke", ex, ey);
			this.SetNextBubbleTime();

		}
	};

	this.SetNextBubbleTime = function() {
		nextBubbleTime = this.GetTime() + Math.random()*maxTimeBetweenBubbles;
	};

	this.InSelectMode = function() {
		return inSelectMode;
	};

	this.ArrayUpdate = function(array) {
		var i;
		for(i = 0; i < array.length; i += 1){
			array[i].Update();
		}
	};

	this.ColourSelect = function() {
		inSelectMode = true;
		selector = new Selector(0, 0, scale);
	};

	this.GetSelector = function() {
		return selector;
	};


	this.Restart = function() {
		window.clearInterval(gameInterval);

		this.init();
	};

	this.init = function() {
		canvas.Clear();


		var params, frame, loadingInterval, level, i;

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
		inSelectMode = false;
		timeStarted = false;

		this.SetNextBubbleTime();

		params = location.href.split("?");
		if (params[1] === "debug"){
			debug = true;
		}

		level = new Level();
		level.SetupPlatforms();
		level.SetupRopes(platforms, ropes);


		players[0] = new Player(28, 144, image.GetPlayer1Img());
		players[1] = new Player(268, 144, image.GetPlayer2Img());
		players[1].SetKeys(38, 40, 37, 39, 13);
		players[1].SetFlipped(true);


		this.CreateEffect("GreenSmoke", 28, 144);
		this.CreateEffect("GreenSmoke", 268, 144);

		frame = 0;
		for (i = 0; i < 20; i += 1){
			mallows.push(new Mallow(i*16, 176, frame));
			frame += 1;
			if (frame === 4){
				frame = 0;
			}
		}

		emitters.push(new Emitter(0, 92, 0));
		emitters.push(new Emitter(152, 0, 1));
		emitters.push(new Emitter(320-16, 92, 2));

		loadingInterval = setInterval(function(){
			if (game.IsLoaded()){
				window.clearInterval(loadingInterval);
				game.FinishLoading();
			}
		}, 25);
	};

	this.StartTime = function() {
		startTime = new Date().getTime() * timescale;
		timeStarted = true;
	};

	this.StopTime = function() {
		stoppedTime = new Date().getTime() * timescale;
		timeStarted = false;
	};

	this.FinishLoading = function() {
		sound.Play("buzz");
		this.StartTime();
		gameInterval = setInterval(function(){game.Update();game.Draw();}, 1000 / FPS);
	};

	this.IsLoaded = function() {
		return image.IsLoaded();
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


	this.OnKeyDown = function(event) {
		if (players){
			players[0].KeyDown(event.keyCode);
			players[1].KeyDown(event.keyCode);
		}
	};

	this.OnKeyUp = function(event) {
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


}

window.onload = function()
{
	canvas.DocumentLoaded();
	Scale.SetScale(3);
	game = new Game();
	document.onkeyup = function(e){game.OnKeyUp(e);};
	document.onkeydown = function(e){game.OnKeyDown(e);};


	game.init();
};
