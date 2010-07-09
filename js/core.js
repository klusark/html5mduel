//make it so that browsers that do not have console are still supported
if (!window.console) {
	window.console = new Object()
	window.console.log = function(){}
}
function Core() {
	var platforms
	var ropes
	var players
	var mallows
	var emitters
	var effects
	var bubbles
	var entities
	
	var debug
	var gameOver = false
	var player1Img 
	var player2Img 
	var spritesImg
	var selector
	var inSelectMode
	
	var nextBubbleTime
	var startTime
	var timeStarted
	var stoppedTime
	const timescale = 1
	var scale = 1
	const FPS = 30
	var maxBubbles = 3
	const maxTimeBetweenBubbles = 3000
	
	this.GetTime = function() {
		return timeStarted ? new Date().getTime() * timescale - startTime : stoppedTime
	}
	
	this.CreateEffect = function(name, x, y) {
		effects.push(new Effect(x, y, name))
	}
	
	this.DebugLog = function(message) {
		if (debug)
			console.log(message)
	}
	
	this.Draw = function() {
		this.ClearScreen()
		if (this.InSelectMode())
			selector.Draw()
		else{
			this.ArrayDraw(platforms)
			this.ArrayDraw(ropes)
			this.ArrayDraw(emitters)
			this.ArrayDraw(players)
			this.ArrayDraw(mallows)
			this.ArrayDraw(bubbles)
			this.ArrayDraw(effects)
			
			//might need to place this somewhere else
			this.ArrayDraw(entities)
			
			
		}
	}
	
	this.ArrayDraw = function(array) {
		for(var i = 0; i < array.length; ++i)
			if (array[i].Draw)
				array[i].Draw()
	}
	
	this.GetRopes = function() {
		return ropes
	}
	
	this.GetPlatforms = function() {
		return platforms
	}


	this.DrawImage = function(image, sx, sy, sw, sh, dx, dy, dw, dh, iscale) {
		iscale = iscale || scale
		if (iscale == -1)
			iscale = scale
		if (image.complete)
			window.ctx.drawImage(image, sx*iscale, sy*iscale, sw*iscale, sh*iscale, dx*iscale, dy*iscale, dw*iscale, dh*iscale)
	}


	this.FillRect = function(x, y, w, h) {
		window.ctx.fillRect(x*scale, y*scale, w*scale, h*scale)
	}

	this.Update = function() {
		if (this.InSelectMode())
			selector.Update()
		else{
			this.ArrayUpdate(players)
			this.ArrayUpdate(mallows)
			this.ArrayUpdate(entities)
			this.UpdateBubbles()
			
			for(var i = 0; i < effects.length; ++i){
				effects[i].Update()
				if (!effects[i].IsDraw())
					effects.splice(i--, 1)
			}
			
			if ((players[0].IsDead() || players[1].IsDead()) && !gameOver){
				players[0].SetInteruptInput(true)
				players[1].SetInteruptInput(true)
				players[0].DisableInput()
				players[1].DisableInput()
				if(players[0].IsDead() && players[1].IsDead()){
					this.DebugLog("tie");
					gameOver = true
				}
				else if (players[0].IsDead() && players[1].IsInPositionToWin()){
					this.DebugLog("Player 2 wins");
					players[1].Win()
					gameOver = true
				}
				else if (players[1].IsDead() && players[0].IsInPositionToWin()){
					this.DebugLog("Player 1 wins");
					players[0].Win()
					gameOver = true
				}
				if (gameOver)
					core.StopTime()
			}
			
		}
		this.GetCollitionsOf(players[0])
	}
	
	//this collisions system kind of sucks... but it works for mduel
	this.GetCollitionsOf = function(entity) {
		var other = this.GetOponentOf(entity)
		
		if (this.DoesCollide(entity,other)){
			
			entity.Collide(other)
			other.Collide(entity)
		} else {
			entity.DoCollide()
			other.DoCollide()
		
		}
	}
	
	this.DoesCollide = function(entity, other) {
		var entitybounds = entity.GetCurrentBounds()
		var otherbounds  = other.GetCurrentBounds()
		return  entity.GetX()+entitybounds.GetX() + entitybounds.GetWidth() > other.GetX()+otherbounds.GetX() && 
				entity.GetX()+entitybounds.GetX() < other.GetX()+otherbounds.GetX()+otherbounds.GetWidth() &&
				entity.GetY()+entitybounds.GetY() + entitybounds.GetHeight() > other.GetY()+otherbounds.GetY() && 
				entity.GetY()+entitybounds.GetY() < other.GetY()+otherbounds.GetY()+otherbounds.GetHeight()
	}
	
	this.UpdateBubbles = function() {
		for(var i = 0; i < bubbles.length; ++i){
			bubbles[i].Update()
			
			if(this.DoesCollide(bubbles[i], players[0]))
				bubbles[i].CollidePlayer(players[0])
			else if(this.DoesCollide(bubbles[i], players[1]))
				bubbles[i].CollidePlayer(players[1])
			
			if (bubbles[i].IsDone()){
				this.CreateEffect("BubbleDisolve", bubbles[i].GetX(), bubbles[i].GetY())
				bubbles.splice(i--, 1)
				if (bubbles.length < maxBubbles)
					this.SetNextBubbleTime()
			}
		}

		if (bubbles.length < maxBubbles && this.GetTime() > nextBubbleTime) {
			var emittor = Math.floor(Math.random()*3+1)
			var x, y, ey, ex
			if (emittor == 1) {
				x = 14
				y = 92
				ex = 8
				ey = 88
			} else if (emittor == 2) {
				x = 295
				y = 95
				ex = 290
				ey = 91
			} else if (emittor == 3) {
				x = 156
				y = 12
				ex = 150
				ey = 7
			}
			var xVelocity = Math.random()*20+20
			if (Math.random()<0.5)
				xVelocity *= -1
			var yVelocity = Math.random()*20+20
			if (Math.random()>0.5)
				yVelocity *= -1
			bubbles.push(new Bubble(x, y, xVelocity, yVelocity))
			this.CreateEffect("PurpleSmoke", ex, ey)
			this.SetNextBubbleTime()

		}
	}
	
	this.SetNextBubbleTime = function() {
		nextBubbleTime = this.GetTime() + Math.random()*maxTimeBetweenBubbles
	}
	
	this.InSelectMode = function() {
		return inSelectMode
	}

	this.ArrayUpdate = function(array) {
		for(var i = 0; i < array.length; ++i){
			array[i].Update()
		}
	}
	
	this.GetPlayer1Img = function() {
		return player1Img
	}
	
	this.GetPlayer2Img = function() {
		return player2Img
	}
	
	this.GetSpritesImg = function() {
		return spritesImg
	}
	
	this.ColourSelect = function() {
		inSelectMode = true
		selector = new Selector(0, 0, scale)
	}
	
	this.GetSelector = function() {
		return selector
	}
	
	this.PlaySound = function(name) {
		var sound = new Audio()
		sound.src = "sound/" + name + ".ogg"
		sound.play()
	}
	
	this.ClearScreen = function() {
		ctx.fillStyle = "rgb(0,0,0)";
		window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height)
	}

	this.init = function() {
		window.canvas = document.getElementById('canvas')
		window.ctx = window.canvas.getContext('2d')
		this.ClearScreen()
		//only works on firefox 3.6 and up
		//hopefuly chrome gets a similar setting soon
		//this really has no use because of my appengine scaling
		window.ctx.mozImageSmoothingEnabled = false
		
		
		var windowwidth = window.innerWidth
		var windowheight = window.innerHeight
		scale = 1
		while (320*(scale+1) < windowwidth && 200*(scale+1) < windowheight)
			++scale
		
		player1Img = new Image()
		player2Img = new Image()
		spritesImg = new Image()
		if (this.IsOnAppEngine()){
			this.SetScale(scale)
		}else{
			player1Img.src = "/images/player.png"
			player2Img.src = "/images/player.png"
			spritesImg.src = "/images/sprites.png"
		}
		

		stoppedTime = 0
		platforms = new Array()
		ropes = new Array()
		players = new Array()
		mallows = new Array()
		emitters = new Array()
		effects = new Array()
		bubbles = new Array()
		entities = new Array()
		debug = false
		gameOver = false
		inSelectMode = false
		timeStarted = false
		
		this.SetNextBubbleTime()
		
		var params = location.href.split("?")
		if (params[1] == "debug")
			debug = true
		
		this.SetupPlatforms()
		this.SetupRopes()
		
		
		players[0] = new Player(28, 144, player1Img)
		players[1] = new Player(268, 144, player2Img)
		players[1].SetKeys(38, 40, 37, 39, 13)
		players[1].SetFlipped(true)
		
		
		this.CreateEffect("GreenSmoke", 28, 144)
		this.CreateEffect("GreenSmoke", 268, 144)

		var frame = 0;
		for (i = 0; i < 20; ++i){
			mallows.push(new Mallow(i*16, 176, frame))
			++frame
			if (frame == 4)
				frame = 0
			
		}
		
		emitters.push(new Emitter(0, 92, 0))
		emitters.push(new Emitter(152, 0, 1))
		emitters.push(new Emitter(320-16, 92, 2))
		
		var loadingInterval = setInterval(function(){
			if (core.IsLoaded()){
				window.clearInterval(loadingInterval)
				core.FinishLoading()
			}
		}, 25)
		

	}
	this.StartTime = function() {
		startTime = new Date().getTime() * timescale
		timeStarted = true
	}
	
	this.StopTime = function() {
		stoppedTime = new Date().getTime() * timescale
		timeStarted = false
	}
	
	this.FinishLoading = function() {
		core.PlaySound("buzz")
		core.StartTime()
		setInterval(function(){core.Update();core.Draw()}, 1000 / FPS)
	}
	
	this.IsLoaded = function() {
		return (player1Img.complete && player2Img.complete && spritesImg.complete)
	}
	
	this.IsOnGround = function(yb, ya, entity) {
		if (ya < yb)
			return
		var entityBounds = entity.GetCurrentBounds()
		var platformsPassedThrough = new Array()
		for (var i = 0; i < platforms.length; ++i){
			var other = platforms[i];
			if (((yb+entityBounds.GetY()+entityBounds.GetHeight() == other.GetY()) || (yb < other.GetY()-(entityBounds.GetY()+entityBounds.GetHeight()) && ya > other.GetY()-(entityBounds.GetY()+entityBounds.GetHeight()))) && 
				(entity.GetX() + entityBounds.GetX() < other.GetEnd() 
				&& entity.GetX() + entityBounds.GetX() + entityBounds.GetWidth() > other.GetX())){
				platformsPassedThrough.push(other)
				//break;
			}
		}
		if (platformsPassedThrough.length){
			var platform
			var min = 240
			for (var i = 0; i < platformsPassedThrough.length; ++i){
				var other = platformsPassedThrough[i]
				if (other.GetY() <= min){
					min = other.GetY()
					platform = other
				}
			}
			return platform
		}
	}
	
	this.AddEntity = function(entity) {
		entities.push(entity)
	}
	
	this.RemoveEntity = function(entity) {
		for (var i = 0; i < entities.length; ++i){
			if (entities[i] == entity){
				entities.splice(i, 1)
				return
			}
		}
	}
	this.RemovePlatform = function(entity) {
		for (var i = 0; i < platforms.length; ++i){
			if (platforms[i] == entity){
				platforms.splice(i, 1)
				return
			}
		}
	}
	
	
	this.GetOponentOf = function(entity) {
		if (entity == players[0])
			return players[1]
		else if (entity == players[1])
			return players[0]
		//javascript will return undefined here
	}
	
	this.IsOnAppEngine = function() {
		var loc = document.location.href
		if (loc.search("appspot.com") == -1 || loc.search("127.0.0.1:8080") == -1)
			return true
		return false
	}
	

	this.OnKeyDown = function(event) {
		if (players){
			players[0].KeyDown(event.keyCode);
			players[1].KeyDown(event.keyCode);
		}
	}

	this.OnKeyUp = function(event) {
		if (players){
			players[0].KeyUp(event.keyCode);
			players[1].KeyUp(event.keyCode);
		}
	}
	
	this.SetScale = function(newScale) {
		scale = newScale
		window.canvas.width = 320*scale
		window.canvas.height = 200*scale
		var base = "generate?m="+scale+"&c="
		var colour0 = window.localStorage['colour0'] || 0
		var colour1 = window.localStorage['colour1'] || 1
		player1Img.src = base + colour0
		player2Img.src = base + colour1
		spritesImg.src = "generate?s&m="+scale
	}
	
	this.GetScale = function() {
		return scale
	}
	
	//TODO: redo all of this code to make a more fair level generator
	const HIGH_FLOOR_Y = 40
	const HIGH_FLOOR_X = 48
	const HIGH_FLOOR_LENGTH = 4;
	const LOW_FLOOR_LENGTH = 4;
	const LOW_FLOOR_X = 24
	const LOW_FLOOR_Y = 168
	const FLOOR_Y_INT = 32
	const MAX_GAP = 3
	const BLOCK_SIZE = 16
	const SCREEN_WIDTH = 320
	const MIN_FLOOR_LENGTH = 2
	const MAX_FLOOR_LENGTH = 6
	const MIN_DIST_FROM_EDGE = 7;
	const ROPE_X_INT = 32

	this.MakeFloor = function(x1,x2,y) {
		platforms.push(new Platform(x1,y, (x2-x1)/BLOCK_SIZE));
	}

	this.Make_Rope = function(x, y1, y2) {
		ropes.push(new Rope(x, y1, y2-y1))
	}

	function rand()
	{
	  return Math.random() * 2147483648
	}

	this.SetupPlatforms = function()
	{
		var cur_x1
		var	cur_x2
		var cur_y
		var	length;
		var done = false;

		this.MakeFloor(LOW_FLOOR_X, LOW_FLOOR_X+(LOW_FLOOR_LENGTH*BLOCK_SIZE), LOW_FLOOR_Y);
		this.MakeFloor(SCREEN_WIDTH - LOW_FLOOR_X - (LOW_FLOOR_LENGTH*BLOCK_SIZE), SCREEN_WIDTH - LOW_FLOOR_X, LOW_FLOOR_Y);
		this.MakeFloor(HIGH_FLOOR_X, HIGH_FLOOR_X + (HIGH_FLOOR_LENGTH*BLOCK_SIZE), HIGH_FLOOR_Y);
		this.MakeFloor(SCREEN_WIDTH - HIGH_FLOOR_X - (HIGH_FLOOR_LENGTH*BLOCK_SIZE), SCREEN_WIDTH - HIGH_FLOOR_X, HIGH_FLOOR_Y);

		cur_y = HIGH_FLOOR_Y + FLOOR_Y_INT;
		cur_x2 = 0;

		while (!done) {
			cur_x1 = cur_x2 + (Math.floor((rand() % (MAX_GAP - 1)) + 1) * BLOCK_SIZE);
			if (cur_x1 > (SCREEN_WIDTH - (BLOCK_SIZE * 5))) {
				cur_y += FLOOR_Y_INT;
				cur_x2 = 0;
				if (cur_y > (LOW_FLOOR_Y - FLOOR_Y_INT))
					done = true;
			}
			else {
				cur_x2 = cur_x1 + ((Math.floor(rand() % (MAX_FLOOR_LENGTH - MIN_FLOOR_LENGTH + 1)) + MIN_FLOOR_LENGTH) * BLOCK_SIZE);
				if (cur_x2 > SCREEN_WIDTH - (2 * BLOCK_SIZE))
					cur_x2 = SCREEN_WIDTH - (2 * BLOCK_SIZE);
				this.MakeFloor(Math.floor(cur_x1), Math.floor(cur_x2), Math.floor(cur_y));
			}
		}
	}

	this.SetupRopes = function()
	{

		var cur_floor, cur_rope, cur_x, i, j, y1, y2, rope_here;
		var done;
		var num_floors = platforms.length

		this.Make_Rope((platforms[0].GetEnd() - MIN_DIST_FROM_EDGE), platforms[2].GetY() - 24, platforms[0].GetY());
		this.Make_Rope((platforms[1].GetX() + MIN_DIST_FROM_EDGE)-1, platforms[3].GetY() - 24, platforms[1].GetY());

		cur_rope = 2;
		for (cur_floor = num_floors - 1; cur_floor >= 4; cur_floor--) {
			cur_x = platforms[cur_floor].GetX() + MIN_DIST_FROM_EDGE;
			done = false;
			while (cur_x < (platforms[cur_floor].GetEnd() - MIN_DIST_FROM_EDGE) && done == false) {
				for(i=3; i < num_floors && done == false; ++i) {
					if (done != true && i != cur_floor && cur_x > (platforms[i].GetX() + MIN_DIST_FROM_EDGE) && cur_x < (platforms[i].GetEnd() - MIN_DIST_FROM_EDGE)) {
						/* Put rope here. */
						rope_here = false;
						for (j = 0; j < ropes.length; j++) {
							if (Math.abs ((ropes[j].GetX() - cur_x)) <= ROPE_X_INT)
								rope_here = true;
						}
						if (!rope_here) {
							y1 = (platforms[i].GetY() > platforms[cur_floor].GetY() ? platforms[cur_floor].GetY() : platforms[i].GetY());
							y2 = (platforms[i].GetY() > platforms[cur_floor].GetY() ? platforms[i].GetY() : platforms[cur_floor].GetY());
							this.Make_Rope(cur_x-1, y1-24, y2);
							cur_rope++;
							done = true;
						}
					}
				}
				cur_x += ROPE_X_INT;
			}
		}
	}
}

var core = new Core()




document.onkeyup = function(e){core.OnKeyUp(e)}
document.onkeydown = function(e){core.OnKeyDown(e)}
window.onload = function(){core.init()}


