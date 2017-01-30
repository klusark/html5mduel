import { Game } from "./core";
import { Rope } from "./rope";
import { Platform } from "./platform";

export class Level {
    //TODO: redo all of this code to make a more fair level generator
    HIGH_FLOOR_Y = 40;
    HIGH_FLOOR_X = 48;
    HIGH_FLOOR_LENGTH = 4;
    LOW_FLOOR_LENGTH = 4;
    LOW_FLOOR_X = 24;
    LOW_FLOOR_Y = 168;
    FLOOR_Y_INT = 32;
    MAX_GAP = 3;
    BLOCK_SIZE = 16;
    SCREEN_WIDTH = 320;
    MIN_FLOOR_LENGTH = 2;
    MAX_FLOOR_LENGTH = 6;
    MIN_DIST_FROM_EDGE = 7;
    ROPE_X_INT = 32;

    constructor(private game: Game) {
    }

    MakeFloor(x1: number, x2: number, y: number) {
        this.game.AddPlatform(new Platform(x1,y, (x2-x1)/this.BLOCK_SIZE, this.game));
    };

    private MakeRope(x: number, y1: number, y2: number) {
        this.game.AddRope(new Rope(x, y1, y2-y1));
    };

    private rand() {
        return Math.random() * 2147483648;
    }

    SetupPlatforms() {
        var cur_x1,
        cur_x2,
        cur_y,
        done = false;

        this.MakeFloor(this.LOW_FLOOR_X, this.LOW_FLOOR_X+(this.LOW_FLOOR_LENGTH*this.BLOCK_SIZE), this.LOW_FLOOR_Y);
        this.MakeFloor(this.SCREEN_WIDTH - this.LOW_FLOOR_X - (this.LOW_FLOOR_LENGTH*this.BLOCK_SIZE), this.SCREEN_WIDTH - this.LOW_FLOOR_X, this.LOW_FLOOR_Y);
        this.MakeFloor(this.HIGH_FLOOR_X, this.HIGH_FLOOR_X + (this.HIGH_FLOOR_LENGTH*this.BLOCK_SIZE), this.HIGH_FLOOR_Y);
        this.MakeFloor(this.SCREEN_WIDTH - this.HIGH_FLOOR_X - (this.HIGH_FLOOR_LENGTH*this.BLOCK_SIZE), this.SCREEN_WIDTH - this.HIGH_FLOOR_X, this.HIGH_FLOOR_Y);

        cur_y = this.HIGH_FLOOR_Y + this.FLOOR_Y_INT;
        cur_x2 = 0;

        while (!done) {
            cur_x1 = cur_x2 + (Math.floor((this.rand() % (this.MAX_GAP - 1)) + 1) * this.BLOCK_SIZE);
            if (cur_x1 > (this.SCREEN_WIDTH - (this.BLOCK_SIZE * 5))) {
                cur_y += this.FLOOR_Y_INT;
                cur_x2 = 0;
                if (cur_y > this.LOW_FLOOR_Y - this.FLOOR_Y_INT) {
                    done = true;
                }
            }
            else {
                cur_x2 = cur_x1 + ((Math.floor(this.rand() % (this.MAX_FLOOR_LENGTH - this.MIN_FLOOR_LENGTH + 1)) + this.MIN_FLOOR_LENGTH) * this.BLOCK_SIZE);
                if (cur_x2 > this.SCREEN_WIDTH - (2 * this.BLOCK_SIZE)){
                    cur_x2 = this.SCREEN_WIDTH - (2 * this.BLOCK_SIZE);
                }
                this.MakeFloor(Math.floor(cur_x1), Math.floor(cur_x2), Math.floor(cur_y));
            }
        }
    };

    SetupRopes(platforms: Platform[], ropes: Rope[]) {

        var cur_floor, cur_rope, cur_x, i, j, y1, y2, rope_here,
        done,
        num_floors = platforms.length;

        this.MakeRope((platforms[0].GetEnd() - this.MIN_DIST_FROM_EDGE), platforms[2].GetY() - 24, platforms[0].GetY());
        this.MakeRope((platforms[1].GetX() + this.MIN_DIST_FROM_EDGE)-1, platforms[3].GetY() - 24, platforms[1].GetY());

        cur_rope = 2;
        for (cur_floor = num_floors - 1; cur_floor >= 4; cur_floor--) {
            cur_x = platforms[cur_floor].GetX() + this.MIN_DIST_FROM_EDGE;
            done = false;
            while (cur_x < (platforms[cur_floor].GetEnd() - this.MIN_DIST_FROM_EDGE) && !done) {
                for(i=3; i < num_floors && !done; ++i) {
                    if (!done && i !== cur_floor && cur_x > (platforms[i].GetX() + this.MIN_DIST_FROM_EDGE) && cur_x < (platforms[i].GetEnd() - this.MIN_DIST_FROM_EDGE)) {
                        /* Put rope here. */
                        rope_here = false;
                        for (j = 0; j < ropes.length; j++) {
                            if (Math.abs((ropes[j].GetX() - cur_x)) <= this.ROPE_X_INT){
                                rope_here = true;
                            }
                        }
                        if (!rope_here) {
                            y1 = (platforms[i].GetY() > platforms[cur_floor].GetY() ? platforms[cur_floor].GetY() : platforms[i].GetY());
                            y2 = (platforms[i].GetY() > platforms[cur_floor].GetY() ? platforms[i].GetY() : platforms[cur_floor].GetY());
                            this.MakeRope(cur_x-1, y1-24, y2);
                            cur_rope++;
                            done = true;
                        }
                    }
                }
                cur_x += this.ROPE_X_INT;
            }
        }
    };
}
