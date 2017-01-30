import { Time } from "./time";
import { Canvas } from "./canvas";
import { Scale } from "./scale";
import { Sound } from "./sound";
import { Player } from "./player";
import { Rope } from "./rope";
import { Bubble } from "./bubble";
import { Platform } from "./platform";
import { Emitter } from "./emitter";
import { Log } from "./log";
import { Level } from "./level";
import { PowerupManager } from "./powerupmanager";
import { ImageManager } from "./imagemanager";
import { Effect, GreenSmoke, BubbleDisolve, PurpleSmoke } from "./effect";
import { Mallow } from "./mallow";
import { Powerup } from "./powerup";


/*TODO:
 * bug with interupt animation in player that the player could come out of a death animation
 *
 * */

export class Game {
	platforms: Platform[];
	ropes: Rope[];
	players: Player[] = [];
	mallows: Mallow[];
	emitters: Emitter[];
	effects: Effect[];
	bubbles: Bubble[];
	entities: any[] /*TODO*/;
	debug: boolean;
	gameOver = false;
	/*selector,
	inSelectMode,*/

	gameInterval: number;
	loadingInterval: number;

	nextBubbleTime: number;
	level_: Level;
	FPS = 60;
	maxBubbles = 3;
	maxTimeBetweenBubbles = 3000;
	powerups: PowerupManager;
	gameEndTime = 0;
	winner: number;
	lastTime = this.time.Get();
	bubbleDisabled = false;
	canvas = new Canvas();
	log = new Log();
	imagemanager: ImageManager = new ImageManager();
	scale = new Scale();


	constructor(private time: Time) {
		if (typeof document !== 'undefined') {
			document.onkeyup = (e: KeyboardEvent) => this.OnKeyUp(e);
			document.onkeydown = (e: KeyboardEvent) => this.OnKeyDown(e);
		}

		new Sound().Preload("buzz");
	}

	getTime() {
		return this.time.Get();
	}

	CreateEffect(name: any /*TODO*/, x: number, y: number) {
		this.effects.push(new name(x, y));
	};

	Draw() {
		this.canvas.Clear();
		/*if (this.InSelectMode()){
			selector.Draw();
		}else{*/
			this.ArrayDraw(this.platforms);
			this.ArrayDraw(this.ropes);
			this.ArrayDraw(this.emitters);
			this.ArrayDraw(this.players);
			this.ArrayDraw(this.mallows);
			this.ArrayDraw(this.bubbles);
			this.ArrayDraw(this.effects);

			//might need to place this somewhere else
			this.ArrayDraw(this.entities);
		//}
	};

	private ArrayDraw(array: any[]) {
		var i;
		for (i = 0; i < array.length; i += 1){
			if (array[i].Draw){
				array[i].Draw();
			}
		}
	}

	GetRopes() {
		return this.ropes;
	}

	GetPlatforms() {
		return this.platforms;
	}

	GetWinner() {
		return this.winner;
	}

	Update() {
		var currentTime = this.time.Get();
		var deltaT = (currentTime - this.lastTime)/1000;
		/*if (this.InSelectMode()){
			selector.Update();
		}else{*/
			this.ArrayUpdate(this.players, deltaT);
			this.ArrayUpdate(this.mallows, deltaT);
			this.ArrayUpdate(this.entities, deltaT);
			this.UpdateBubbles(deltaT);

			for(var i = 0; i < this.effects.length; i += 1){
				this.effects[i].Update(deltaT);
				if (!this.effects[i].IsDraw()){
					this.effects.splice(i, 1);
					i -= 1;
				}
			}

			if ((this.players[0].IsDead() || this.players[1].IsDead()) && !this.gameOver){
				this.players[0].SetInteruptInput(true);
				this.players[1].SetInteruptInput(true);
				this.players[0].DisableInput();
				this.players[1].DisableInput();
				if(this.players[0].IsDead() && this.players[1].IsDead()){
					this.log.DebugLog("tie");
					this.gameOver = true;
					this.winner = 2;
				}else if (this.players[0].IsDead() && this.players[1].IsInPositionToWin()){
					this.log.DebugLog("Player 2 wins");
					this.players[1].Win();
					this.gameOver = true;
					this.winner = 1;
				}else if (this.players[1].IsDead() && this.players[0].IsInPositionToWin()){
					this.log.DebugLog("Player 1 wins");
					this.players[0].Win();
					this.gameOver = true;
					this.winner = 0;
				}
				if (this.gameOver){
					this.gameEndTime = this.time.Get();
					this.SetNextBubbleTime();
					for(i = 0; i < this.bubbles.length; i += 1){
						this.bubbles[i].SetDone(true);
					}
				}

			}

		//}
		this.GetCollitionsOf(this.players[0]);
		this.lastTime = currentTime;
	};

	GetGameEndTime() {
		return this.gameEndTime;
	};

	//this collisions system kind of sucks... but it works for mduel
	GetCollitionsOf(entity: any /*TODO*/) {
		var other = this.GetOponentOf(entity);

		if (this.DoesCollide(entity,other)){
			entity.Collide(other);
			other.Collide(entity);
		} else {
			entity.DoCollide();
			other.DoCollide();
		}
	};

	DoesCollide(entity: any, other: any /*TODO*/) {
		var entitybounds = entity.GetCurrentBounds(),
		otherbounds = other.GetCurrentBounds();
		return  entity.GetX()+entitybounds.GetX() + entitybounds.GetWidth() > other.GetX()+otherbounds.GetX() &&
				entity.GetX()+entitybounds.GetX() < other.GetX()+otherbounds.GetX()+otherbounds.GetWidth() &&
				entity.GetY()+entitybounds.GetY() + entitybounds.GetHeight() > other.GetY()+otherbounds.GetY() &&
				entity.GetY()+entitybounds.GetY() < other.GetY()+otherbounds.GetY()+otherbounds.GetHeight();
	};

	UpdateBubbles(deltaT: number) {

		for(var i = 0; i < this.bubbles.length; i += 1){
			this.bubbles[i].Update(deltaT);

			if(this.DoesCollide(this.bubbles[i], this.players[0])){
				this.bubbles[i].CollidePlayer(this.players[0]);
			}else if(this.DoesCollide(this.bubbles[i], this.players[1])){
				this.bubbles[i].CollidePlayer(this.players[1]);
			}
			if (this.bubbles[i].IsDone()){
				this.CreateEffect(BubbleDisolve, this.bubbles[i].GetX(), this.bubbles[i].GetY());
				this.bubbles.splice(i, 1);
				i -= 1;
				if (this.bubbles.length < this.maxBubbles){
					this.SetNextBubbleTime();
				}
			}
		}

		if (!this.gameOver && this.bubbles.length < this.maxBubbles && this.time.Get() > this.nextBubbleTime && !this.bubbleDisabled) {
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
			newBubble = new Bubble(x, y, xVelocity, yVelocity, this);
			newBubble.SetCurrentPowerup(this.powerups.GetRandomPowerup(newBubble));
			this.bubbles.push(newBubble);
			this.CreateEffect(PurpleSmoke, ex, ey);
			this.SetNextBubbleTime();

		}
	};

	private SetNextBubbleTime() {
		this.nextBubbleTime = this.time.Get() + Math.random() * this.maxTimeBetweenBubbles;
	}

	/*InSelectMode() {
		return inSelectMode;
	};*/

	private ArrayUpdate(array: any[], deltaT: number) {
		for (var i = 0; i < array.length; i += 1){
			array[i].Update(deltaT);
		}
	}

	/*ColourSelect() {
		inSelectMode = true;
		selector = new Selector(0, 0, scale);
	};

	GetSelector() {
		return selector;
	};*/


	Restart() {
		window.clearInterval(this.gameInterval);

		this.init();
	};

	init() {
		this.canvas.Clear();


		var params, frame, i;

		this.platforms = [];
		this.ropes = [];
		this.players = [];
		this.mallows = [];
		this.emitters = [];
		this.effects = [];
		this.bubbles = [];
		this.entities = [];
		this.debug = false;
		this.gameOver = false;
		//inSelectMode = false;

		this.powerups = new PowerupManager(this);
		this.powerups.ReigisterPowerups();

		this.SetNextBubbleTime();

		if (typeof location != 'undefined') {
			params = location.href.split("?");
			if (params[1] === "debug"){
				this.debug = true;
			}
		}

		this.level_ = new Level(this);
		this.level_.SetupPlatforms();
		this.level_.SetupRopes(this.platforms, this.ropes);


		this.players[0] = new Player(28, 144, this.imagemanager.GetPlayer1Img(), this);
		this.players[1] = new Player(268, 144, this.imagemanager.GetPlayer2Img(), this);
		this.players[1].SetKeys(38, 40, 37, 39, 13);
		this.players[1].SetFlipped(true);


		this.CreateEffect(GreenSmoke, 28, 144);
		this.CreateEffect(GreenSmoke, 268, 144);

		frame = 0;
		for (i = 0; i < 20; i += 1){
			this.mallows.push(new Mallow(i*16, 176, frame));
			frame += 1;
			if (frame === 4){
				frame = 0;
			}
		}

		this.emitters.push(new Emitter(0, 92, 0));
		this.emitters.push(new Emitter(152, 0, 1));
		this.emitters.push(new Emitter(320-16, 92, 2));

		this.loadingInterval = setInterval(() => this.CheckLoadedInterval(), 25);
	};

	End() {
		//Clean stuff up
		clearInterval(this.gameInterval);
	};

	private CheckLoadedInterval() {
		if (this.IsLoaded()){
			clearInterval(this.loadingInterval);
			this.FinishLoading();
		}
	}



	FinishLoading() {
		new Sound().Play("buzz");
		this.gameInterval = setInterval(() => {this.Update();this.Draw();}, 1000 / this.FPS);
	};

	IsLoaded() {
		return this.imagemanager.IsLoaded();
	};

	MakeFloor(x1: number, x2: number, y: number) {
		this.level_.MakeFloor(x1, x2, y);
	};

	IsOnGround(yb: number, ya: number, entity: any/*TODO*/) {
		if (ya < yb){
			return;
		}
		var entityBounds = entity.GetCurrentBounds(), other,
		platformsPassedThrough = [],
		platform, min = 240, i;
		for (i = 0; i < this.platforms.length; i += 1){
			other = this.platforms[i];
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

	AddPlatform(ent: Platform) {
		this.platforms.push(ent);
	};

	AddRope(ent: Rope) {
		this.ropes.push(ent);
	};

	AddEntity(entity: any /* TODO */) {
		this.entities.push(entity);
	};

	RemoveEntity(entity: any /*TODO*/) {
		var i;
		for (i = 0; i < this.entities.length; i += 1){
			if (this.entities[i] === entity){
				this.entities.splice(i, 1);
				return;
			}
		}
	};

	GetEntityCollisionsOf(entity: Player) {
		var collisions = [], i;
		for (i = 0; i < this.entities.length; i += 1){
			if (this.DoesCollide(this.entities[i], entity)){
				collisions.push(this.entities[i]);
			}
		}
		return collisions;
	};

	RemovePlatform(entity: Platform) {
		var i;
		for (i = 0; i < this.platforms.length; i += 1){
			if (this.platforms[i] === entity){
				this.platforms.splice(i, 1);
				return;
			}
		}
	};

	GetOponentOf(entity: Player): Player {
		if (entity === this.players[0]){
			return this.players[1];
		}else if (entity === this.players[1]){
			return this.players[0];
		}
		//javascript will return undefined here
	};

	IsOnAppEngine() {
		var loc = document.location.href;
		if (loc.search("appspot.com") === -1 || loc.search("127.0.0.1:8080") === -1){
			return true;
		}
		return false;
	};


	OnKeyDown(event: KeyboardEvent/*, emit*/) {
		/*TODOif (typeof socket != "undefined" && emit) {
			socket.emit("keydown", event.keyCode);
		}*/
		//log.Log(event.keyCode);
		if (this.players){
			this.players[0].KeyDown(event.keyCode);
			this.players[1].KeyDown(event.keyCode);
		}
	};

	OnKeyUp(event: KeyboardEvent/*, emit*/) {
		/*TODOif (typeof socket != "undefined" && emit) {
			socket.emit("keyup", event.keyCode);
		}*/
		if (event.keyCode === 109){
			this.scale.SetScale(this.scale.GetScale()-1);
		}else if (event.keyCode === 107){
			this.scale.SetScale(this.scale.GetScale()+1);
		}
		//log.Log(event.keyCode);
		if (this.players){
			this.players[0].KeyUp(event.keyCode);
			this.players[1].KeyUp(event.keyCode);
		}
	};

	SetBubbleDisabled(val: boolean) {
		this.bubbleDisabled = val;
	};

	/* TODOSerialize() {
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

	Deserialize(data) {

		platforms = [];
		for (var i = 0; i < data.platforms.length; ++i) {
			var newplat = new Platform(0,0,0, this);
			newplat.Deserialize(data.platforms[i]);
			platforms.push(newplat);
			//platforms[i].Deserialize(data.platforms[i]);
		}

		this.bubbles = [];
		for (var i = 0; i < data.bubbles.length; ++i) {
			var newBubble = new Bubble(0, 0, 0, 0, this);
			newBubble.Deserialize(data.bubbles[i]);
			newBubble.SetCurrentPowerup(this.powerups.CreatePowerupByName(newBubble.GetPowerupName(), newBubble));
			this.bubbles.push(newBubble);
		}

		this.ropes = [];
		for (var i = 0; i < data.ropes.length; ++i) {
			var newBubble = new Rope(0, 0, 0);
			newBubble.Deserialize(data.ropes[i]);
			this.ropes.push(newBubble);
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
	}*//*TODO

		for (var i = 0; i < data.players.length; ++i) {
			this.players[i].Deserialize(data.players[i]);
		}
	};*/
}
