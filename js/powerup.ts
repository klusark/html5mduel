import { StaticImage } from "./staticimage";
import { Animation } from "./animation";
import { Player } from "./player";
import { Bubble } from "./bubble";
import { Game } from "./core";
import { Sound } from "./sound";
import { Platform } from "./platform";
import { Canvas} from "./canvas";
import { Bounds } from "./bounds";
import { Explode, GreenSmoke, SmallSplash, Lightning } from "./effect";

export function getPowerups() {
    return [ PowerupGun, PowerupSkull, PowerupInvis, PowerupMine, PowerupHook, PowerupTeleport, PowerupNade, PowerupDestroy, PowerupNukepuck, PowerupChute, Powerup1000v, PowerupBoots ];
}

export abstract class Powerup {
    protected image: StaticImage;
    protected player: Player;
    Draw(x: number, y: number, canvas: Canvas) {
        if (this.image) {
            this.image.Draw(x, y, canvas);
        }
    }
    CollidePlayer(player: Player): void {
    }
    CollidePlatform(platform: Platform) {
    }
    Update(deltaT: number): void {
    }
    ChangeFrom(): void {
    }
    Use(): void {
    }

}

class GunCollisionCheck {
    constructor(private owner: Player) {
    }
    GetX() {
        return this.owner.IsFlipped() ? this.owner.GetX() + 23 - 320 : this.owner.GetX() + 23;
    }
    GetY() {
        return this.owner.GetY() + 8;
    }
    GetCurrentBounds() {
        return new Bounds(0, 0, 320, 1);
    }
}

class PowerupGun extends Powerup {
    private ammo = 5;
    private firing = false;
    private inPlayer = false;
    private gundown = new Animation(25, 450, 100, 2, 24, 24);
    private gunup = new Animation(25, 450, 100, 2, 24, 24);
    private other: Player;


    constructor(private bubble: Bubble, private game: Game) {
        super();
        this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 284, 0, 12, 12);
        this.gundown.Repeat(false);
        this.gunup.Repeat(false);
        this.gunup.Reverse(true);
    }

    Use() {
        if (this.inPlayer && this.ammo && !this.firing && this.player.IsIdle()) {
            this.player.InterruptAnimation(this.gundown, true, () => {
                this.CheckForKill();
                this.player.InterruptAnimation(this.gunup, true, () => {
                    this.firing = false;
                });
            });
            this.ammo -= 1;
            this.firing = true;
        }
    }

    CollidePlayer(player: Player) {
        if (!this.inPlayer) {
            this.bubble.SetDone(true);
            this.bubble = null;
            this.player = player;
            this.other = this.game.GetOponentOf(this.player);
            player.CollectPowerup(this);
            this.inPlayer = true;
        }
    }

    CheckForKill() {
        new Sound().Play("shot");
        // need to make this work with turning
        let entity = new GunCollisionCheck(this.player);
        if (this.game.DoesCollide(entity, this.other)) {
            this.other.Disolve();
        }
    }

}

class PowerupSkull extends Powerup {
    constructor(private bubble: Bubble, game: Game) {
        super();
        this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 258, 0, 12, 12);
    }
    CollidePlayer(player: Player) {
        player.DropPowerup();
        player.Disolve2();
        this.bubble.SetDone(true);
        new Sound().Play("buzz2");
    }
}

class PowerupInvis extends Powerup {
    private invis = false;
    private disabled = false;
    private nextAllowedTime = 0;
    private inPlayer = false;

    constructor(private bubble: Bubble, private game: Game) {
        super();
        this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 271, 0, 12, 12);
    }

    CollidePlayer(player: Player) {
        if (!this.inPlayer) {
            this.bubble.SetDone(true);
            this.player = player;
            player.CollectPowerup(this);
            this.inPlayer = true;
        }
    }

    ChangeFrom() {
        this.player.SetDraw(true);
    }

    Use() {
        if (this.game.getTime() < this.nextAllowedTime || !this.player.IsIdle()) {
            return;
        }
        if (!this.invis) {
            new Sound().Play("beep3");
            this.invis = true;
            this.player.SetDraw(false);
            this.nextAllowedTime = this.game.getTime() + 300;
        } else {
            new Sound().Play("beep2");
            this.disabled = true;
            this.player.SetDraw(true);
            this.player.DropPowerup();
        }
    }
}

class Mine {
    private bounds = new Bounds(0, 0, 1, 1);
    // private isMine = true;
    private other: Player;


    constructor(private x: number, private y: number, private owner: Player, private game: Game) {
        new Sound().Play("beep");
        this.other = game.GetOponentOf(owner);
    }

    Draw(canvas: Canvas) {
    }

    Update() {
        // TODO: WTF was I thinking
        let collision = this.game.DoesCollide(this, this.owner) ? this.owner : this.game.DoesCollide(this, this.other) ? this.other : undefined;
        if (collision && collision.IsOnGround()) {
            collision.Explode();
            this.Explode();
        }
    }

    Explode() {
        this.game.AddEffect(new Explode(this.x - 11, this.y - 20, this.game));
        this.game.RemoveEntity(this);
    }

    GetX() {
        return this.x;
    }

    GetY() {
        return this.y;
    }

    GetCurrentBounds() {
        return this.bounds;
    }
}

class PowerupMine extends Powerup {
    private used = false;
    private inPlayer = false;

    constructor(private bubble: Bubble, private game: Game) {
        super();
        this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 271, 13, 12, 12);
    }

    Use() {
        if (!this.inPlayer || this.used || !this.player.IsIdle()) {
            return;
        }
        this.used = true;
        this.player.InterruptAnimation(this.player.GetAnimations().crouch, true, () => {
            this.LayMine();
            this.player.InterruptAnimation(this.player.GetAnimations().uncrouch, true, () => {});
        });
    }

    CollidePlayer(player: Player) {
        if (!this.inPlayer) {
            this.bubble.SetDone(true);
            this.player = player;
            this.player.CollectPowerup(this);
            this.inPlayer = true;
        }
    }

    LayMine() {
        new Sound().Play("beep1");
        let xoff = this.player.IsFlipped() ? 4 : 20;
        this.game.AddEntity(new Mine(Math.floor(this.player.GetX() + xoff), Math.floor(this.player.GetY() + 23), this.player, this.game));
    }
}

class Puck {
    private img: HTMLImageElement;
    private other: Player;
    private bounds = new Bounds(0, 0, 5, 2);
    private animation = new Animation(0, 310, 200, 2, 12, 12);
    private xVelocity: number;
    private yVelocity = 70;

    constructor(private x: number, private y: number, private owner: Player, direction: Boolean, private game: Game) {
        this.img = game.GetImageManager().GetSpritesImg();
        this.other =  game.GetOponentOf(owner);
        this.xVelocity = direction ? -90 : 90;
    }

    Draw(canvas: Canvas) {
        this.animation.Draw(this.img, this.x - 4, this.y - 6, canvas);
    }

    Update(deltaT: number) {
        this.animation.Update(deltaT);
        this.x += this.xVelocity * deltaT;
        let ya = this.y + this.yVelocity * deltaT;
        let platform = this.game.IsOnGround(this.y, ya, this);
        if (!platform) {
            this.y = ya;
        } else {
            this.y = platform.GetY() - 2;
        }
        let collision = this.game.DoesCollide(this, this.owner) ? this.owner : this.game.DoesCollide(this, this.other) ? this.other : undefined;
        if (collision) {
            collision.Explode();
            this.game.AddEffect(new Explode(this.x - 11, this.y - 20, this.game));
            this.game.RemoveEntity(this);
            return;
        }

        let entities: any[] = []; // TODO this.game.GetEntityCollisionsOf(this);

        for (let i = 0; i < entities.length; i += 1) {
            if (entities[i].isMine) {
                entities[i].Explode();
            }
        }

        // make sure it is fully off the screen before it is removed
        if (this.x < -5 || this.x > 320) {
            this.game.RemoveEntity(this);
            return;
        }
        if (this.y > 180) {
            this.game.RemoveEntity(this);
            this.game.AddEffect(new SmallSplash(this.x - 11, this.y - 20, this.game));
            return;
        }
    }

    GetX() {
        return this.x;
    }

    GetY() {
        return this.y;
    }

    GetCurrentBounds() {
        return this.bounds;
    }
}

class PowerupNukepuck extends Powerup {
    private used = false;
    private inPlayer = false;
    private throwpuck = new Animation(25, 1050, 100, 2, 24, 24);

    constructor(private bubble: Bubble, private game: Game) {
        super();
        this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 310, 0, 12, 12);
        this.throwpuck.Repeat(false);
    }
    Use() {
        if (!this.inPlayer || this.used || !this.player.IsIdle()) {
            return;
        }
        this.used = true;
        this.player.InterruptAnimation(this.throwpuck, true, () => {
            this.ThrowPuck();
        });
    }

    CollidePlayer(player: Player) {
        if (!this.inPlayer) {
            this.bubble.SetDone(true);
            this.player = player;
            this.player.CollectPowerup(this);
            this.inPlayer = true;
        }
    }

    ThrowPuck() {
        let xoff = this.player.IsFlipped() ? 0 : 20;
        this.game.AddEntity(new Puck(Math.floor(this.player.GetX() + xoff), Math.floor(this.player.GetY() + 22), this.player, this.player.IsFlipped(), this.game));
    }
}

class PowerupDestroy extends Powerup {
    constructor(private owner: Bubble, private game: Game) {
        super();
        this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 284, 13, 12, 12);
    }
    Update() {
        let platforms = this.game.GetPlatforms(), i;
        for (i = 0; i < platforms.length; i += 1) {
            if (this.game.DoesCollide(this.owner, platforms[i])) {
                platforms[i].Destroy(this.owner.GetX());
                this.owner.SetDone(true);
                return;
            }
        }
    }
}

class Nade {
    private bounds = new Bounds(0, 0, 5, 4);
    private animation: StaticImage;
    private xVelocity: number;
    private yVelocity = -150;
    private yAcceleration = 350;

    constructor(private x: number, private y: number, owner: Player, direction: boolean, private game: Game) {
        let img = game.GetImageManager().GetSpritesImg();
        this.animation = new StaticImage(img, 300, 18, 5, 4),
        this.xVelocity = direction ? -70 : 70;
    }

    Draw(canvas: Canvas) {
        this.animation.Draw(this.x, this.y, canvas);
    }

    Update(deltaT: number) {
        this.x += this.xVelocity * deltaT;
        this.yVelocity += this.yAcceleration * deltaT;
        let ya = this.y + this.yVelocity * deltaT;
        let platform = this.game.IsOnGround(this.y, ya, this);

        if (platform) {
            platform.Destroy(this.x);
            this.game.RemoveEntity(this);
        }
        this.y = ya;
        // make sure it is fully off the screen before it is removed
        if (this.x < -5 || this.x > 320) {
            this.game.RemoveEntity(this);
        } else if (this.y > 180) {
            this.game.RemoveEntity(this);
            this.game.AddEffect(new SmallSplash(this.x - 11, this.y - 20, this.game));
        }
    }

    GetX() {
        return this.x;
    }

    GetY() {
        return this.y;
    }

    GetCurrentBounds() {
        return this.bounds;
    }
}

class PowerupNade extends Powerup {
    private used = false;
    private inPlayer = false;
    private thrownade = new Animation(25, 1000, 100, 2, 24, 24);

    constructor(private bubble: Bubble, private game: Game) {
        super();
        this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 297, 13, 12, 12);
        this.thrownade.Repeat(false);
    }

    Use() {
        if (!this.inPlayer || this.used || !this.player.IsIdle()) {
            return;
        }
        this.used = true;
        this.player.InterruptAnimation(this.thrownade, true, () => {
            this.ThrowNade();
        });
    }

    CollidePlayer(player: Player) {
        if (!this.inPlayer) {
            this.bubble.SetDone(true);
            this.player = player;
            this.player.CollectPowerup(this);
            this.inPlayer = true;
        }
    }

    ThrowNade() {
        let xoff = this.player.IsFlipped() ? 0 : 20;
        this.game.AddEntity(new Nade(Math.floor(this.player.GetX() + xoff), Math.floor(this.player.GetY()), this.player, this.player.IsFlipped(), this.game));
    }
}

/*class EmptyImage {
    Draw(dx: number, dy: number, canvas: Canvas) {
    }
}*/
class PowerupTeleport extends Powerup {
    // TODO: this probably needs some work
    // image = new EmptyImage();

    constructor(private bubble: Bubble, private game: Game) {
        super();
    }

    CollidePlayer(player: Player) {
        this.game.AddEffect(new GreenSmoke(player.GetX(), player.GetY(), this.game));
        player.SetX(Math.floor(Math.random() * 320));
        player.SetY(Math.floor(Math.random() * 120));
        player.StartFall(true);
        this.bubble.SetDone(true);
        player.DropPowerup();
        new Sound().Play("buzz");

    }
}

class PowerupChute extends Powerup {
    private inPlayer = false;
    private active = false;
    private v = 40;
    private chute = new Animation(25, 1100, 1, 1, 24, 24);

    constructor(private bubble: Bubble, game: Game) {
        super();
        this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 310, 13, 12, 12);
        this.chute.Repeat(false);
    }

    Use() {
        if (!this.inPlayer || this.player.IsOnGround() || this.player.IsOnRope() || this.player.GetYVelocity() < 0) {
            return;
        }
        this.Animate();
        this.active = true;
        this.player.DisableGravity();
        this.v = this.player.IsFlipped() ? -40 : 40;
        if (this.player.GetXVelocity() === 0) {
            this.v = 0;
        }
    }

    Update() {
        if (this.active) {
            let keys = this.player.GetKeys();
            this.player.SetYVelocity(40);
            this.player.SetXVelocity(this.v);

            this.v = keys.right ? 40 : keys.left ? -40 : this.v;
            this.player.SetFlipped(this.v < 0);
        }
    }

    ChangeFrom() {
        this.Disable();
    }

    CollidePlayer(player: Player) {
        if (!this.inPlayer) {
            this.bubble.SetDone(true);
            this.player = player;
            player.CollectPowerup(this);
            this.inPlayer = true;
        }
    }

    Disable() {
        this.player.DisableAnimationInterrupt();
        this.player.EnableGravity();
        if (this.active) {
            this.player.StartFall(true);
        }
        this.active = false;

    }

    CollidePlatform(platform: Platform) {
        if (!this.inPlayer || !this.active) {
            return;
        }

        this.Disable();
    }

    Animate() {
        this.player.InterruptAnimation(this.chute, true, () => {});
    }
}

class Powerup1000v extends Powerup {
    private inPlayer = false;
    private img: HTMLImageElement;

    private orrigImg: HTMLImageElement;
    // private Is1000V: boolean = true;

    constructor(private bubble: Bubble, private game: Game) {
        super();
        this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 258, 13, 12, 12);
        this.img = game.GetImageManager().Get1000vImg();
    }

    CollidePlayer(player: Player) {
        if (!this.inPlayer) {
            this.bubble.SetDone(true);
            this.player = player;
            this.player.CollectPowerup(this);
            this.orrigImg = this.player.GetImage();
            this.inPlayer = true;
        } else {
            let otherPowerup = player.GetCurrentPowerup();
            if (otherPowerup /* TODO && otherPowerup.Is1000V*/) {
                this.player.DropPowerup();
                player.DropPowerup();
                return false;
            }
            player.SetYVelocity(-1000);
            player.SetXVelocity(100);
            // TODO: player.InterruptAnimation(this.player.InterruptAnimation(this.player.GetAnimations().explode, true, () => {}), () => {});
            player.StartFall(true);
            this.player.DontCollide();
            this.game.AddEffect(new Lightning(player.GetX(), player.GetY(), this.game));
            return true;
        }
        return false;
    }

    Update() {
        if (!this.inPlayer) {
            return;
        }
        if (this.player.GetImage() !== this.img) {
            this.player.SetImage(this.img);
        } else {
            this.player.SetImage(this.orrigImg);
        }
    }

    ChangeFrom() {
        this.player.SetImage(this.orrigImg);
    }
}

class PowerupBoots extends Powerup {
    /* TODO: Are these needed?
    private inAir = false;
    private wasInAir = false; */
    private inPlayer = false;

    constructor(private bubble: Bubble, game: Game) {
        super();
        this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 297, 0, 12, 12);
    }

    CollidePlayer(player: Player) {
        if (!this.inPlayer) {
            this.bubble.SetDone(true);
            this.player = player;
            player.CollectPowerup(this);
            this.inPlayer = true;
        }
    }

    Use() {
        if (!this.inPlayer || !this.player.IsOnGround()) {
            return;
        }
        if (this.player.IsRunning() || this.player.IsIdle()) {
            let keys = this.player.GetKeys();
            if (keys.right || keys.left) {
                this.player.StartJump();
            } else  {
                this.player.StartJumpUp();
            }
            this.player.SetYVelocity(-230);
        }
    }

}

class HookColide {
    constructor(private owner: Player) {
    }
    GetX() {
        return this.owner.IsFlipped() ? this.owner.GetX() + 5 : this.owner.GetX() + 19;
    }
    GetY() {
        return this.owner.GetY() + 8;
    }
    GetCurrentBounds() {
        return new Bounds(0, 0, 1, 1);
    }
}

class PowerupHook extends Powerup {
    private inPlayer = false;
    private active = false;
    private hook = new Animation(25, 1200, 100, 2, 24, 24);

    constructor(private bubble: Bubble, private game: Game) {
        super();
        this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 323, 13, 12, 12);
    }

    CollidePlayer(player: Player) {
        if (!this.inPlayer) {
            this.bubble.SetDone(true);
            this.player = player;
            player.CollectPowerup(this);
            this.inPlayer = true;
        }
    }

    Use() {
        if (!this.inPlayer || this.player.IsOnGround() || this.player.IsOnRope()) {
            return;
        }
        if (!this.active) {
            this.active = true;
            this.player.InterruptAnimation(this.hook, true, () => {});
        }
        let platforms = this.game.GetPlatforms();
        for (let i = 0; i < platforms.length; i += 1) {
            let other = platforms[i];
            let test = this.game.DoesCollide(new HookColide(this.player), other);
            if (test) {
                this.player.SetYVelocity(-150);
                if (this.player.IsJumping()) {
                    this.player.Bounce(true);
                }
                return;
            }
        }

    }

    CollidePlatform(platform: Platform) {
        if (!this.inPlayer || !this.active) {
            return;
        }

        this.Disable();
    }

    Disable() {
        this.active = false;
        this.player.DisableAnimationInterrupt();
    }

    ChangeFrom() {
        this.Disable();
    }
}

