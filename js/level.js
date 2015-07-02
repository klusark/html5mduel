var platform = require("./platform");
var rope = require("./rope");

/**
 * @constructor
 */
function Level() {
	//TODO: redo all of this code to make a more fair level generator
	var HIGH_FLOOR_Y = 40,
	HIGH_FLOOR_X = 48,
	HIGH_FLOOR_LENGTH = 4,
	LOW_FLOOR_LENGTH = 4,
	LOW_FLOOR_X = 24,
	LOW_FLOOR_Y = 168,
	FLOOR_Y_INT = 32,
	MAX_GAP = 3,
	BLOCK_SIZE = 16,
	SCREEN_WIDTH = 320,
	MIN_FLOOR_LENGTH = 2,
	MAX_FLOOR_LENGTH = 6,
	MIN_DIST_FROM_EDGE = 7,
	ROPE_X_INT = 32;

	this.MakeFloor = function(x1,x2,y) {
		game.AddPlatform(new platform.Platform(x1,y, (x2-x1)/BLOCK_SIZE));
	};

	this.Make_Rope = function(x, y1, y2) {
		game.AddRope(new rope.Rope(x, y1, y2-y1));
	};

	function rand() {
		return Math.random() * 2147483648;
	}

	this.SetupPlatforms = function()
	{
		var cur_x1,
		cur_x2,
		cur_y,
		done = false;

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
				if (cur_y > (LOW_FLOOR_Y - FLOOR_Y_INT)){
					done = true;
				}
			}
			else {
				cur_x2 = cur_x1 + ((Math.floor(rand() % (MAX_FLOOR_LENGTH - MIN_FLOOR_LENGTH + 1)) + MIN_FLOOR_LENGTH) * BLOCK_SIZE);
				if (cur_x2 > SCREEN_WIDTH - (2 * BLOCK_SIZE)){
					cur_x2 = SCREEN_WIDTH - (2 * BLOCK_SIZE);
				}
				this.MakeFloor(Math.floor(cur_x1), Math.floor(cur_x2), Math.floor(cur_y));
			}
		}
	};

	this.SetupRopes = function(platforms, ropes)
	{

		var cur_floor, cur_rope, cur_x, i, j, y1, y2, rope_here,
		done,
		num_floors = platforms.length;

		this.Make_Rope((platforms[0].GetEnd() - MIN_DIST_FROM_EDGE), platforms[2].GetY() - 24, platforms[0].GetY());
		this.Make_Rope((platforms[1].GetX() + MIN_DIST_FROM_EDGE)-1, platforms[3].GetY() - 24, platforms[1].GetY());

		cur_rope = 2;
		for (cur_floor = num_floors - 1; cur_floor >= 4; cur_floor--) {
			cur_x = platforms[cur_floor].GetX() + MIN_DIST_FROM_EDGE;
			done = false;
			while (cur_x < (platforms[cur_floor].GetEnd() - MIN_DIST_FROM_EDGE) && !done) {
				for(i=3; i < num_floors && !done; ++i) {
					if (!done && i != cur_floor && cur_x > (platforms[i].GetX() + MIN_DIST_FROM_EDGE) && cur_x < (platforms[i].GetEnd() - MIN_DIST_FROM_EDGE)) {
						/* Put rope here. */
						rope_here = false;
						for (j = 0; j < ropes.length; j++) {
							if (Math.abs((ropes[j].GetX() - cur_x)) <= ROPE_X_INT){
								rope_here = true;
							}
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
	};
}

module.exports = {
  Level: Level
};
