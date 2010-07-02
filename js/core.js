


//var objects = new Array();


function Core() {
	var platforms
	var ropes
	var players
	var mallows
	var emitters
	var effects
	var debug
	var gameOver = false;
	var player1Img 
	var player2Img 
	var spritesImg
	var selector
	var inSelectMode
	
	const timescale = 1
	const scale = 4
	const FPS = 30;
	
	this.GetTime = function() {
		return new Date().getTime() * timescale 
	}
	
	this.CreateEffect = function(name, x, y) {
		effects.push(new Effect(x, y, name))
	}
	this.DebugLog = function(message) {
		if (debug)
			console.log(message)
	}
	
	this.Draw = function() {
		ctx.fillStyle = "rgb(0,0,0)";
		window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
		if (this.InSelectMode())
			selector.Draw()
		else{
			this.ArrayDraw(platforms)
			this.ArrayDraw(ropes)
			this.ArrayDraw(players)
			this.ArrayDraw(mallows)
			this.ArrayDraw(emitters)
			this.ArrayDraw(effects)
		}
	}
	
	this.ArrayDraw = function(array) {
		for(var i = 0; i < array.length; ++i){
			array[i].Draw()
		}
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
			}
		}
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

	this.init = function() {
		window.canvas = document.getElementById('canvas')
		window.canvas.width = 320*scale
		window.canvas.height = 200*scale
		window.ctx = window.canvas.getContext('2d');
		
		//only works on firefox 3.6 and up
		//hopefuly chrome gets a similar setting soon
		window.ctx.mozImageSmoothingEnabled = false
		
		player1Img = new Image()
		player2Img = new Image()
		spritesImg = new Image()
		if (this.IsOnAppEngine()){
			var base = "generate?m="+scale+"&c="
			var colour0 = window.localStorage['colour0'] || 0
			var colour1 = window.localStorage['colour1'] || 1
			player1Img.src = base + colour0
			player2Img.src = base + colour1
			spritesImg.src = "generate?s&m="+scale
		}else{
			player1Img.src = "/images/player.png"
			player2Img.src = "/images/player.png"
			spritesImg.src = "/images/sprites.png"
		}
		
		
		platforms = new Array()
		ropes = new Array()
		players = new Array()
		mallows = new Array()
		emitters = new Array()
		effects = new Array()
		debug = false
		gameOver = false
		inSelectMode = false
		
		var params = location.href.split("?")
		if (params[1] == "debug")
			debug = true
		
		this.SetupPlatforms()
		this.SetupRopes()
		
		
		players[0] = new Player(28, 144, player1Img);
		players[1] = new Player(268, 144, player2Img);
		players[1].SetKeys(73, 75, 74, 76);
		players[1].SetFlipped(true);
		
		
		
		effects.push(new Effect(28, 144, "GreenSmoke"))
		effects.push(new Effect(268, 144, "GreenSmoke"))

		var frame = 0;
		for (i = 0; i < 20; ++i){
			mallows.push(new Mallow(i*16, 176, frame));
			++frame;
			if (frame == 4)
				frame = 0
			
		}
		
		emitters.push(new Emitter(0, 92, 0));
		emitters.push(new Emitter(152, 0, 1));
		emitters.push(new Emitter(320-16, 92, 2));

		this.Update();
		setInterval(function(){core.Update()}, 1000 / FPS);
		setInterval(function(){core.Draw()}, 1000 / FPS);
		

	}
	
	this.IsOnAppEngine = function() {
		var loc = document.location.href
		if (loc.search("appspot.com")==-1 || loc.search("127.0.0.1:8080") == -1)
			return true
		return false
	}
	

	this.OnKeyDown = function(event) {
		if (players.length == 2){
			players[0].KeyDown(event.keyCode);
			players[1].KeyDown(event.keyCode);
		}
	}

	this.OnKeyUp = function(event) {
		if (players.length == 2){
			players[0].KeyUp(event.keyCode);
			players[1].KeyUp(event.keyCode);
		}
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

	this.Make_Floor = function(x1,x2,y)
	{
		platforms.push(new Platform(x1,y, (x2-x1)/BLOCK_SIZE));
	}

	this.Make_Rope = function(x, y1, y2){
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

		this.Make_Floor(LOW_FLOOR_X, LOW_FLOOR_X+(LOW_FLOOR_LENGTH*BLOCK_SIZE), LOW_FLOOR_Y);
		this.Make_Floor(SCREEN_WIDTH - LOW_FLOOR_X - (LOW_FLOOR_LENGTH*BLOCK_SIZE), SCREEN_WIDTH - LOW_FLOOR_X, LOW_FLOOR_Y);
		this.Make_Floor(HIGH_FLOOR_X, HIGH_FLOOR_X + (HIGH_FLOOR_LENGTH*BLOCK_SIZE), HIGH_FLOOR_Y);
		this.Make_Floor(SCREEN_WIDTH - HIGH_FLOOR_X - (HIGH_FLOOR_LENGTH*BLOCK_SIZE), SCREEN_WIDTH - HIGH_FLOOR_X, HIGH_FLOOR_Y);

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
				this.Make_Floor(Math.floor(cur_x1), Math.floor(cur_x2), Math.floor(cur_y));
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


