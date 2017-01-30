import { Animation } from "./animation";
import { Bounds } from "./bounds";
import { Game } from "./core";
import { Log } from "./log";
import { Sound } from "./sound";
import { Rope } from "./rope";
import { Powerup } from "./powerup";
import { BigSplash } from "./effect";

export class Player {
    animations: any = {};
    keyCodes: any = {};
    keys: any = {};
    keysLastFrame: any = {};

    currentAnimation: Animation;

    flipped = false;

    yVelocity = 0;
    yMaxVelocity = 180;
    xVelocity = 0;
    yAcceleration = 500;
    gravityEnabled = true;
    onGround = false;
    isCrouched = false;
    isRolling = false;
    isOnRope = false;
    wasOnGround = false;
    falling = false;
    runningRight = false;
    runningLeft = false;
    wasRunningLeft = false;
    wasRunningRight = false;
    isCrouchingUp = false;
    pushed = false;
    wasCrouched = false;
    justUncrouched = false;
    dead = false;
    isWinning = false;
    isJumpingUp = false;
    isJumping = false;
    interuptInput = false;
    wasRolling = false;
    wasOnRope = false;
    dontCollide = false;
    interruptAnimationInput = false;
    interruptAnimation = false;
    interruptAnimationCallback: any /*TODO*/;
    isIdle = false;
    isDisolving = false;
    draw = true;
    isExploding = false;

    standingBounds = new Bounds(6, 1, 10, 23);
    crouchingBounds = new Bounds(6, 10, 10, 14);
    fallingBounds = new Bounds(6, 1, 10, 23);
    currentBounds = this.standingBounds;

    currentRope: Rope;

    currentPowerup: Powerup;

    RUNSPEED = 60;
    PUSHEDSPEED = 60;
    ROLLSPEED = 60;
    CLIMBSPEED = 60;
    JUMPYVELOCITY = -170;
    JUMPXVELOCITY = 60;
    EXPLODEVELOCITY = -1000;

    log = new Log();



    constructor (private x: number, private y: number, private img: HTMLImageElement, private game: Game) {
        this.animations.run = new Animation(25, 0, 100, 4, 24, 24);

        this.animations.idle = new Animation(25, 100, 100, 1, 24, 24);

        this.animations.crouch = new Animation(25, 125, 50, 2, 24, 24);
        this.animations.crouch.Repeat(false);

        this.animations.uncrouch = new Animation(25, 125, 50, 1, 24, 24);
        this.animations.uncrouch.Repeat(false);

        this.animations.roll = new Animation(25, 175, 75, 5, 24, 24);
        this.animations.roll.Repeat(false);

        this.animations.roll2 = new Animation(25, 200, 50, 4, 24, 24);
        this.animations.roll2.Repeat(false);

        this.animations.climbup = new Animation(25, 600, 150, 3, 24, 24);
        this.animations.climbup.Reverse(false);

        this.animations.climbdown = new Animation(25, 600, 150, 3, 24, 24);
        this.animations.climbdown.Reverse(true);

        this.animations.climbidle = new Animation(25, 625, 100, 1, 24, 24);

        this.animations.fall = new Animation(25, 675, 100, 1, 24, 24);

        this.animations.standingwin = new Animation(25, 700, 100, 2, 24, 24);
        this.animations.standingwin.Repeat(false);

        this.animations.ropewin = new Animation(25, 750, 100, 2, 24, 24);
        this.animations.ropewin.Repeat(false);

        this.animations.jumpup = new Animation(25, 300, 75, 6, 24, 24);
        this.animations.jumpup.Repeat(false);

        this.animations.jump = new Animation(25, 800, 100, 4, 24, 24);
        this.animations.jump.Repeat(false);

        this.animations.land = new Animation(25, 300, 50, 1, 24, 24);

        this.animations.pushedforward = new Animation(25, 900, 100, 2, 24, 24);

        this.animations.pushedbackward = new Animation(25, 950, 100, 2, 24, 24);

        this.animations.disolve = new Animation(25, 525, 100, 3, 24, 24);
        this.animations.disolve.Repeat(false);

        this.animations.disolve2 = new Animation(25, 1125, 100, 3, 24, 24);
        this.animations.disolve2.Repeat(false);

        this.animations.explode = new Animation(25, 500, 100, 2, 24, 24);

        this.keyCodes.right = 68;
        this.keyCodes.left = 65;
        this.keyCodes.up = 87;
        this.keyCodes.down = 83;
        this.keyCodes.use = 81;

        this.keys.right = false;
        this.keys.left = false;
        this.keys.up = false;
        this.keys.down = false;
        this.keys.use = false;

        this.SetAnimation(this.animations.idle);
    }

    Draw() {
        if (this.draw && this.currentAnimation) {
            this.currentAnimation.Draw(this.img, this.x, this.y);
        }
    }

    Update(deltaT: number) {

        if (this.currentPowerup && this.currentPowerup.Update) {
            this.currentPowerup.Update(deltaT);
        }

        if (!this.isDisolving) {
            this.SimulateGravity(deltaT);
        }

        if (this.y > 160 && !this.dead) {
            this.dead = true;
            this.game.CreateEffect(BigSplash, this.x, 200 - 40);
        }
        if (this.x < 0 - this.currentBounds.GetX() || this.x > 300) {
            this.x = this.x < 0 - this.currentBounds.GetX() ? 0 : 300;
            this.Bounce(false);
        }
        if (this.y < -50 && !this.dead) {
            this.dead = true;
            this.draw = false;
        }

        this.isIdle = false;
        if (this.interruptAnimation) {
            if (this.currentAnimation.IsAnimationDone()) {
                if (this.interruptAnimationInput) {
                    this.interuptInput = false;
                }
                this.interruptAnimationInput = false;
                this.interruptAnimation = false;
                if (this.interruptAnimationCallback) {
                    this.interruptAnimationCallback();
                }
            }

        } else if (this.isDisolving) {
            if (this.currentAnimation.IsAnimationDone()) {
                this.dead = true;
                this.draw = false;
            }
        } else if (this.isExploding || this.isWinning) {

        } else if (this.isOnRope) {
            if (!(this.keys.left || this.keys.right)) {

                this.yVelocity = (this.keys.down - this.keys.up) * this.CLIMBSPEED;
                if (this.keys.up && !this.keysLastFrame.up) {
                    this.SetAnimation(this.animations.climbup);
                }else if (this.keys.down && !this.keysLastFrame.down) {
                    this.SetAnimation(this.animations.climbdown);
                }else if (!this.keys.down && !this.keys.up) {
                    this.SetAnimation(this.animations.climbidle);
                }
            } else if (!(this.keys.up || this.keys.down)) {
                this.isOnRope = false;
                this.xVelocity = this.RUNSPEED * (this.keys.right - this.keys.left);
                this.yVelocity = 0;
                this.StartFall(true);
            }
        } else if (this.isJumpingUp) {
            if (this.currentAnimation.IsAnimationDone()) {
                this.isJumpingUp = false;
                this.StartFall(true);
            }

        } else if (this.isJumping) {
            if (this.currentAnimation.IsAnimationDone()) {
                this.isJumping = false;
                this.StartFall(false);
                this.onGround = false;
                // wasOnGround = false

            }
        } else if (this.onGround) {
            this.pushed = false;
            if (this.runningRight && !this.keys.right && !this.isRolling) {
                this.runningRight = false;
            }

            if (this.runningLeft && !this.keys.left && !this.isRolling) {
                this.runningLeft = false;
            }

            if (!this.isRolling) {
                /* TODO: This isn't grea */
                let r = this.runningRight ? 1 : 0;
                let l = this.runningLeft ? 1 : 0;
                this.xVelocity = this.RUNSPEED * (r - l);
            }

            /*if(!isCrouched && !isRolling){
                if (keys.right)
                    flipped = false
                else if (keys.left)
                    flipped = true
            }*/
            if (this.IsTouchingRope() && (this.keys.up || this.keys.down) && !(this.keys.left || this.keys.right) && !this.isCrouched && !this.isRolling) {
                this.isOnRope = true;
                this.onGround = false;
                this.wasOnGround = false;
                this.x = this.currentRope.GetX() - 11;
                if (this.keys.down) {
                    this.SetAnimation(this.animations.climbdown);
                }else if (this.keys.up) {
                    this.SetAnimation(this.animations.climbup);
                }
            }else if (this.isCrouched) {
                if (this.isCrouchingUp) {
                    if (this.currentAnimation.IsAnimationDone()) {
                        // this.SetAnimation(animations.run")
                        this.isCrouchingUp = false;
                        this.isCrouched = false;
                        this.justUncrouched = true;
                        this.currentBounds = this.standingBounds;
                    }
                }else if (!this.keys.down && !this.isCrouchingUp && this.currentAnimation.IsAnimationDone()) {
                    this.isCrouchingUp = true;
                    this.SetAnimation(this.animations.uncrouch);
                }
            } else if (this.isRolling) {
                if (this.currentAnimation.IsAnimationDone()) {
                    this.runningRight = false;
                    this.runningLeft = false;
                    this.isRolling = false;
                    this.xVelocity = 0;
                    this.SetAnimation(this.animations.crouch);
                    this.currentAnimation.SetFrame(1);
                    this.isCrouched = true;
                    this.currentBounds = this.crouchingBounds;
                }
            } else if (this.keys.down && (this.runningLeft || this.runningRight)) {
                this.isRolling = true;
                this.SetAnimation(this.animations.roll);
            }else if (this.keys.down) {
                this.isCrouched = true;
                this.currentBounds = this.crouchingBounds;
                this.xVelocity = 0;
                this.SetAnimation(this.animations.crouch);
            } else if (this.keys.up && (this.keys.right || this.keys.left)) {
                this.StartJump();
            } else if (this.keys.up) {
                this.StartJumpUp();
            } else if (this.keys.right && (!this.keysLastFrame.right || this.wasRunningLeft || this.wasCrouched || !this.wasOnGround) && !this.runningLeft) {
                this.runningRight = true;
                this.flipped = false;
                this.SetAnimation(this.animations.run);
            } else if (this.keys.left && (!this.keysLastFrame.left || this.wasRunningRight || this.wasCrouched || !this.wasOnGround) && !this.runningRight) {
                this.runningLeft = true;
                this.flipped = true;
                this.SetAnimation(this.animations.run);
            } else if (!this.keys.left && !this.keys.right) {
                this.SetAnimation(this.animations.idle);
                this.isIdle = true;
            }

        }

        if (this.keys.use && this.currentPowerup && this.currentPowerup.Use) {
            this.currentPowerup.Use();
        }

        this.x += deltaT * this.xVelocity;

        // game.GetCollitionsOf(this)

        this.currentAnimation.Update(deltaT);
        this.UpdateKeysLastFrame();

        this.wasOnGround = this.onGround;
        if (!this.justUncrouched) {
            this.wasCrouched = this.isCrouched;
        }
        this.justUncrouched = false;
        this.wasRunningLeft = this.runningLeft;
        this.wasRunningRight = this.runningRight;
        this.wasRolling = this.isRolling;
        this.wasOnRope = this.isOnRope;

    };

    Collide(other: Player) {
        if (this.pushed || this.dontCollide) {
            return;
        }
        let thiscollide = false,
        othercollide = false,
        dontMove;
        if (this.currentPowerup && this.currentPowerup.CollidePlayer) {
            thiscollide = this.currentPowerup.CollidePlayer(other);
        }
        if (other.GetCurrentPowerup() && other.GetCurrentPowerup().CollidePlayer) {
            othercollide = other.GetCurrentPowerup().CollidePlayer(this);
        }
        if (thiscollide || othercollide) {
            return;
        }

        if (this.isOnRope || this.wasOnRope || other.IsOnRope() || other.WasOnRope()) {
            if ((this.isOnRope || this.wasOnRope) && (other.IsOnRope() || other.WasOnRope())) {
                this.log.Log("type 11");
                this.isOnRope = false;
                if (this.y < other.GetY()) {
                    this.flipped = false;
                    this.Bounce(true);
                } else {
                    this.flipped = true;
                    this.Bounce(true);
                }
                this.StartFall(false);
                this.DontCollide();
            } else if (this.isOnRope || this.wasOnRope) {
                this.log.Log("type 12");
                this.flipped = !other.IsFlipped();
                this.isOnRope = false;
                this.Bounce(false);
                this.StartFall(false);
            }
        } else if ((other.IsRolling()) && this.wasOnGround && !this.isCrouched && !this.isRolling) {
            this.log.Log("type 1");
            dontMove = this.xVelocity === 0 && other.IsRolling();
            this.Bounce(true);
            this.StartFall(false);
            if (dontMove) {
                this.xVelocity = 0;
            }
            this.yVelocity = this.JUMPYVELOCITY;
        } else if (this.xVelocity === 0 && other.GetXVelocity() === 0 && (this.y > other.GetY())) {
            this.log.Log("type 13");
        } else if (this.xVelocity === 0 && other.GetXVelocity() === 0 && (this.yVelocity !== 0 || other.GetYVelocity() !== 0)) {
            this.log.Log("type 2");
        } else if ((other.IsCrouched() && this.isRolling) || ((other.IsRolling() || other.WasRolling()) && this.isCrouched)) {
            this.log.Log("type 10");
            this.x < other.GetX() ? this.Bounce(this.flipped) : this.Bounce(!this.flipped);
            this.StartFall(false);
            this.yVelocity = this.JUMPYVELOCITY * 2 / 3;
        } else if (other.IsCrouched() ) {
            this.log.Log("type 8");
            this.Bounce(true);
            this.StartFall(false);
            this.yVelocity = this.JUMPYVELOCITY * 2 / 3;
        } else if (this.isCrouched && other.GetXVelocity() !== 0) {
            this.log.Log("type 9");

        } else if (!this.isRolling && other.IsRolling()) {
            this.log.Log("type 3");
            this.Bounce(true);
            this.StartFall(false);
            this.yVelocity = this.JUMPYVELOCITY * 2 / 3;
        } else if (this.isRolling && !(other.IsRolling() || other.WasRolling())) {
            this.log.Log("type 4");
        } else if (this.xVelocity !== 0 && other.GetXVelocity() !== 0) {
            this.log.Log("type 5");
            this.isOnRope = false;

            this.x < other.GetX() ? this.Bounce(this.flipped) : this.Bounce(!this.flipped);
            this.StartFall(false);
            this.yVelocity = this.JUMPYVELOCITY * 2 / 3;
        } else if (this.xVelocity === 0 && other.GetXVelocity() !== 0) {
            this.log.Log("type 6");
            other.IsFlipped() ? this.Bounce(this.flipped) : this.Bounce(!this.flipped);
            this.StartFall(false);
            other.DontCollide();
            this.yVelocity = this.JUMPYVELOCITY * 2 / 3;
        } else {
            this.log.Log("type 7");
        }
    };

    StartJumpUp() {
        this.yVelocity = this.JUMPYVELOCITY;
        this.onGround = false;
        this.isJumpingUp = true;
        this.SetAnimation(this.animations.jumpup);
    };

    StartJump() {
        this.onGround = false;
        this.yVelocity = this.JUMPYVELOCITY;
        this.isJumping = true;
        this.xVelocity = this.flipped ? -this.JUMPXVELOCITY : this.JUMPXVELOCITY;
        this.SetAnimation(this.animations.jump);
    };

    Bounce(forward: boolean) {
        this.pushed = true;
        if (forward) {
            this.xVelocity = (this.flipped ? -this.PUSHEDSPEED : this.PUSHEDSPEED);
            this.SetAnimation(this.animations.pushedforward);
        } else {
            this.xVelocity = (this.flipped ? this.PUSHEDSPEED : -this.PUSHEDSPEED);
            this.SetAnimation(this.animations.pushedbackward);
        }
    };

    CollectPowerup(powerup: Powerup) {
        if (this.isWinning || this.dead) {
            return;
        }
        if (this.currentPowerup && this.currentPowerup.ChangeFrom) {
            this.currentPowerup.ChangeFrom();
        }

        this.currentPowerup = powerup;


    };

    Disolve() {
        this.isDisolving = true;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.SetAnimation(this.animations.disolve);
    };

    Disolve2() {
        this.isDisolving = true;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.SetAnimation(this.animations.disolve2);
    };

    Explode() {
        this.isExploding = true;
        this.xVelocity = 0;
        this.yVelocity = this.EXPLODEVELOCITY;
        this.SetAnimation(this.animations.explode);
        new Sound().Play("buzz");
    };

    InterruptAnimation(animation: Animation, controls: boolean, callback: any /*TODO*/) {
        this.interruptAnimationInput = controls;
        this.interuptInput = controls;
        this.interruptAnimation = true;
        this.SetAnimation(animation);
        this.interruptAnimationCallback = callback;
    };

    DisableAnimationInterrupt() {
        this.interruptAnimationInput = false;
        this.interuptInput = false;
        this.interruptAnimation = false;
        this.interruptAnimationCallback = false;
    };

    SetImage(image: HTMLImageElement) {
        this.img = image;
    };

    GetImage() {
        return this.img;
    };

    IsInPositionToWin() {
        return (this.onGround || this.isOnRope) && !(this.isJumpingUp || this.isJumping || this.falling || this.isRolling || this.pushed);
    };

    Win() {

        if (this.isOnRope) {
            this.SetAnimation(this.animations.ropewin);
        } else {
            this.SetAnimation(this.animations.standingwin);
        }
        this.isWinning = true;
        this.xVelocity = 0;
        this.yVelocity = 0;
        /*this.currentAnimation.Update(this.x, this.y); TODO*/
    };

    IsWinning() {
        return this.isWinning;
    };

    SetDraw(ndraw: boolean) {
        this.draw = ndraw;
    };

    GetAnimations() {
        return this.animations;
    };

    DontCollide() {
        this.dontCollide = true;
    };

    DoCollide() {
        this.dontCollide = false;
    };

    IsPushed() {
        return this.pushed;
    };

    WasOnGround() {
        return this.wasOnGround;
    };

    IsOnGround() {
        return this.onGround;
    };

    IsOnRope() {
        return this.isOnRope;
    };


    WasOnRope() {
        return this.wasOnRope;
    };

    IsRunning() {
        return (this.runningLeft || this.runningRight) && (!this.isRolling);
    };

    IsRolling() {
        return this.isRolling;
    };

    IsIdle() {
        return this.isIdle;
    };

    WasRolling() {
        return this.wasRolling;
    };

    GetCurrentPowerup() {
        return this.currentPowerup;
    };

    GetY() {
        return this.y;
    };

    GetX() {
        return this.x;
    };

    GetXVelocity() {
        return this.xVelocity;
    };

    GetYVelocity() {
        return this.yVelocity;
    };

    SetXVelocity(v: number) {
        this.xVelocity = v;
    };

    SetYVelocity(v: number) {
        this.yVelocity = v;
    };

    SetY(ny: number) {
        this.y = ny;
    };

    SetX(nx: number) {
        this.x = nx;
    }

    DisableGravity() {
        this.gravityEnabled = false;
    }

    EnableGravity() {
        this.gravityEnabled = true;
    }

    SetFlipped(nf: boolean) {
        this.flipped = nf;
        this.currentAnimation.SetFlipped(this.flipped);
    }

    IsFlipped() {
        return this.flipped;
    }

    IsDead() {
        return this.dead;
    }

    IsCrouched() {
        return this.isCrouched;
    }

    IsJumpingUp() {
        return this.isJumpingUp;
    }

    IsJumping() {
        return this.isJumping;
    }

    SetInteruptInput(interupt: boolean) {
        this.interuptInput = interupt;
    }

    SetAnimation(animation: Animation) {
        if (this.isWinning || !animation) {
            return;
        }
        /*if (name !== 'idle'){
            this.log.DebugLog("Animation Changed to " + name);
        }
        if (!animations[name]){
            this.log.Log("Could not find animation " + name);
            return;
        }*/
        this.currentAnimation = animation;
        this.currentAnimation.ChangeTo(this.flipped);
    }

    GetKeys() {
        return this.keys;
    };

    KeyDown(keyCode: number) {
        if (this.interuptInput) {
            return;
        }
        if (keyCode === this.keyCodes.right ) {
            this.log.DebugLog("KeyDown Right");
            this.keys.right = true;
        } else if (keyCode === this.keyCodes.left ) {
            this.log.DebugLog("KeyDown Left");
            this.keys.left = true;
        } else if (keyCode === this.keyCodes.down ) {
            this.log.DebugLog("KeyDown Down");
            this.keys.down = true;
        } else if (keyCode === this.keyCodes.up ) {
            this.log.DebugLog("KeyDown Up");
            this.keys.up = true;
        } else if (keyCode === this.keyCodes.use ) {
            this.log.DebugLog("KeyDown Up");
            this.keys.use = true;
        }
    };

    KeyUp(keyCode: number) {
        if (keyCode === this.keyCodes.right ) {
            this.log.DebugLog("KeyUp Right");
            this.keys.right = false;
        } else if (keyCode === this.keyCodes.left) {
            this.log.DebugLog("KeyUp Left");
            this.keys.left = false;
        } else if (keyCode === this.keyCodes.down) {
            this.log.DebugLog("KeyUp Down");
            this.keys.down = false;
        } else if (keyCode === this.keyCodes.up) {
            this.log.DebugLog("KeyUp Up");
            this.keys.up = false;
        } else if (keyCode === this.keyCodes.use) {
            this.log.DebugLog("KeyUp Up");
            this.keys.use = false;
        }

    };

    DisableInput() {
        this.keys.right = false;
        this.keys.left = false;
        this.keys.up = false;
        this.keys.down = false;
        this.keys.use = false;
    };

    UpdateKeysLastFrame() {
        this.keysLastFrame.right = this.keys.right;
        this.keysLastFrame.left = this.keys.left;
        this.keysLastFrame.up = this.keys.up;
        this.keysLastFrame.down = this.keys.down;
        this.keysLastFrame.use = this.keys.use;
    };

    SetKeys(up: number, down: number, left: number, right: number, use: number) {
        this.keyCodes.up = up;
        this.keyCodes.down = down;
        this.keyCodes.left = left;
        this.keyCodes.right = right;
        this.keyCodes.use = use;
    };

    SimulateGravity(deltaT: number) {

        if (!this.isOnRope && this.gravityEnabled) {
            this.yVelocity += this.yAcceleration * deltaT;
        }
        if (this.yMaxVelocity < this.yVelocity) {
            this.yVelocity = this.yMaxVelocity;
        }
        let yb = this.y,
        ny = this.y + deltaT * this.yVelocity,
        platform;

        if (!this.isOnRope && this.yVelocity > 0) {
            this.onGround = false;
            platform = this.game.IsOnGround(yb, ny, this);
            if (platform) {
                if (this.currentPowerup && this.currentPowerup.CollidePlatform) {
                    this.currentPowerup.CollidePlatform(platform);
                }
                ny = platform.GetY() - 24;
                this.yVelocity = 0;

                this.onGround = true;
                if (!this.wasOnGround) {
                    this.Land();
                }
            }
            if (!this.onGround && this.wasOnGround) {
                this.StartFall(true);
            }
        }else if (this.isOnRope) {
            if (ny + 4 < this.currentRope.GetY()) {
                ny = this.currentRope.GetY() - 4;
            }else if (ny > this.currentRope.GetY() + this.currentRope.GetLength() - 25) {
                ny = this.currentRope.GetY() + this.currentRope.GetLength() - 25;
            }
        }

        this.y = ny;
    };

    IsTouchingRope() {

        let ropes = this.game.GetRopes(),
        i,
        rope;
        for (i = 0; i < ropes.length; i += 1) {
            rope = ropes[i];
            if (this.x + 6 < rope.GetX() && this.x + 16  > rope.GetX() && this.y > rope.GetY() - 24 && this.y < rope.GetY() + rope.GetLength()) {
                this.currentRope = rope;
                return true;
            }
        }
        this.currentRope = null;
        return false;
    };

    StartFall(animate: boolean) {
        this.isOnRope = false;
        this.falling = true;
        this.onGround = false;
        this.isRolling = false;
        this.flipped = (this.keys.right - this.keys.left === 0 ? this.flipped : this.keys.right - this.keys.left < 0);
        if (animate) {
            this.SetAnimation(this.animations.fall);
        }
        this.currentBounds = this.fallingBounds;

    };

    Land() {
        this.onGround = true;
        this.isJumping = false;
        this.isJumpingUp = false;
        if (this.pushed) {
            this.SetAnimation(this.animations.roll2);
            this.isRolling = true;
            this.pushed = false;
        } else {
            this.SetAnimation(this.animations.land);
            this.xVelocity = 0;
            this.currentBounds = this.standingBounds;
        }

        this.falling = false;

    };

    GetCurrentBounds() {
        return this.currentBounds;
    };

    Serialize() {
        return  {x: this.x, y: this.y, xVelocity: this.xVelocity, yVelocity: this.yVelocity};
    };

    Deserialize(data: any) {
        this.x = data.x;
        this.y = data.y;
        this.xVelocity = data.xVelocity;
        this.yVelocity = data.yVelocity;
    };
}
