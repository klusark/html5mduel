
const FPS = 30;

//var objects = new Array();
var platforms = new Array();
var ropes = new Array();
var players = new Array();
var mallows = new Array();
var emitters = new Array();
var effects = new Array();

function Draw() {
	ctx.fillStyle = "rgb(0,0,0)";
	window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);
	
	ArrayDraw(platforms)
	ArrayDraw(ropes)
	ArrayDraw(players)
	ArrayDraw(mallows)
	ArrayDraw(emitters)
	ArrayDraw(effects)
}

function ArrayDraw(array) {
	for(var i = 0; i < array.length; ++i){
		array[i].Draw()
	}
}

function Update() {
	ArrayUpdate(players)
	ArrayUpdate(mallows)
	ArrayUpdate(effects)
	if (players[0].IsDead() || players[1].IsDead()){
		if(players[0].IsDead() && players[1].IsDead()){
			console.log("tie");
		}
		else if (players[0].IsDead() && players[1].IsInPositionToWin() && !players[1].IsWinning()){
			console.log("Player 2 wins");
			players[1].Win()
		}
		else if (players[1].IsDead() && players[0].IsInPositionToWin() && !players[0].IsWinning()){
			console.log("Player 1 wins");
			players[0].Win()
		}
	}
}

function ArrayUpdate(array) {
	for(var i = 0; i < array.length; ++i){
		array[i].Update()
	}
}

function init() {
	window.canvas = document.getElementById('canvas')
	window.ctx = window.canvas.getContext('2d');
	
	SetupPlatforms()
	SetupRopes()
	
	
	players[0] = new Player(28, 144);
	players[1] = new Player(268, 144);
	players[1].SetKeys(73, 75, 74, 76);
	players[1].SetFlipped(true);
	players[1].SetImage("images/player2.png")
	
	
	
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

	Update();
	setInterval(Update, 1000 / FPS);
	setInterval(Draw, 1000 / FPS);
	

}

function OnKeyDown(event) {
	players[0].KeyDown(event.keyCode);
	players[1].KeyDown(event.keyCode);
}

function OnKeyUp(event) {
	players[0].KeyUp(event.keyCode);
	players[1].KeyUp(event.keyCode);
}

document.onkeyup = OnKeyUp;
document.onkeydown = OnKeyDown;
window.onload = init;


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

function Make_Floor(x1,x2,y)
{
	platforms.push(new Platform(x1,y, (x2-x1)/BLOCK_SIZE));
}

function rand()
{
  return Math.random() * 2147483648
}

function SetupPlatforms()
{
	var cur_x1
	var	cur_x2
	var cur_y
	var	length;
	var done = false;

	Make_Floor (LOW_FLOOR_X, LOW_FLOOR_X+(LOW_FLOOR_LENGTH*BLOCK_SIZE), LOW_FLOOR_Y);
	Make_Floor (SCREEN_WIDTH - LOW_FLOOR_X - (LOW_FLOOR_LENGTH*BLOCK_SIZE), SCREEN_WIDTH - LOW_FLOOR_X, LOW_FLOOR_Y);
	Make_Floor (HIGH_FLOOR_X, HIGH_FLOOR_X + (HIGH_FLOOR_LENGTH*BLOCK_SIZE), HIGH_FLOOR_Y);
	Make_Floor (SCREEN_WIDTH - HIGH_FLOOR_X - (HIGH_FLOOR_LENGTH*BLOCK_SIZE), SCREEN_WIDTH - HIGH_FLOOR_X, HIGH_FLOOR_Y);

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
			Make_Floor (Math.floor(cur_x1), Math.floor(cur_x2), Math.floor(cur_y));
		}
	}
}

const MIN_DIST_FROM_EDGE = 7;
const ROPE_X_INT = 32

function Make_Rope(x, y1, y2){
	ropes.push(new Rope(x, y1, y2-y1))
}

function SetupRopes()
{

	var cur_floor, cur_rope, cur_x, i, j, y1, y2, rope_here;
	var done;
	var num_floors = platforms.length
	//console.log(platforms[0].GetEnd());
	Make_Rope ((platforms[0].GetEnd() - MIN_DIST_FROM_EDGE), platforms[2].GetY() - 24, platforms[0].GetY());
	Make_Rope ((platforms[1].GetX() + MIN_DIST_FROM_EDGE)-1, platforms[3].GetY() - 24, platforms[1].GetY());

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
						Make_Rope (cur_x-1, y1-24, y2);
						cur_rope++;
						done = true;
					}
				}
			}
			cur_x += ROPE_X_INT;
		}
	}
}