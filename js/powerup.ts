import { StaticImage } from "./staticimage";
import { Animation } from "./animation";
import { Player } from "./player";
import { Bubble } from "./bubble";
import { Game } from "./core";
import { Sound } from "./sound";
import { Platform } from "./platform";
import { Canvas} from "./canvas";
import { Bounds } from "./bounds";
import { Explode } from "./effect";

export function getPowerups() {
    return [ PowerupGun, PowerupSkull, PowerupInvis, PowerupMine, PowerupHook ];
}

export abstract class Powerup {
    protected image: StaticImage;
    Draw(x: number, y: number, canvas: Canvas) {
        this.image.Draw(x, y, canvas);
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
    };
    GetY() {
        return this.owner.GetY() + 8;
    };
    GetCurrentBounds() {
        return new Bounds(0, 0, 320, 1);
    };
}

class PowerupGun extends Powerup {
    ammo = 5;
    firing = false;
    inPlayer = false;
    gundown = new Animation(25, 450, 100, 2, 24, 24);
    gunup = new Animation(25, 450, 100, 2, 24, 24);
    other: Player;
    player: Player;

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
    };

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
    };

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
    invis = false;
    disabled = false;
    nextAllowedTime = 0;
    inPlayer = false;
    player: Player;

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
    bounds = new Bounds(0, 0, 1, 1);
    isMine = true;
    other: Player;


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
    private player: Player;

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

/*
function Puck(x, y, owner, direction, game) {
    var img = game.GetImageManager().GetSpritesImg(),
    other = game.GetOponentOf(owner),
    bounds_ = new Bounds(0, 0, 5, 2),
    animation_ = new Animation(0, 310, 200, 2, 12, 12),
    xVelocity = direction ? -90 : 90,
    yVelocity = 70;

    Draw() {
        animation_.Draw(img, x-4, y-6);
    }

    Update(deltaT) {
        var ya, platform, collision, entities, i;
        animation_.Update();
        x += xVelocity * deltaT;
        ya = y + yVelocity * deltaT;
        platform = game.IsOnGround(y, ya, this);
        if (!platform) {
            y = ya;
        } else {
            y = platform.GetY()-2;
        }
        collision = game.DoesCollide(this, owner) ? owner : game.DoesCollide(this, other) ? other : undefined;
        if (collision){
            collision.Explode();
            game.CreateEffect(effect.Explode, x-11, y-20);
            game.RemoveEntity(this);
            return;
        }

        entities = game.GetEntityCollisionsOf(this);

        for (i = 0; i < entities.length; i += 1) {
            if (entities[i].isMine) {
                entities[i].Explode();
            }
        }

        //make sure it is fully off the screen before it is removed
        if (x < -5 || x > 320){
            game.RemoveEntity(this);
            return;
        }
        if (y > 180){
            game.RemoveEntity(this);
            game.CreateEffect(effect.SmallSplash, x-11, y-20);
            return;
        }
    }

    GetX() {
        return x;
    }

    GetY() {
        return y;
    }

    GetCurrentBounds() {
        return bounds_;
    }
}

function PowerupNukepuck(owner, game) {
    this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 310, 0, 12, 12);
    var used = false,
    inPlayer = false,
    throwpuck = new Animation(25, 1050, 100, 2, 24, 24);
    throwpuck.Repeat(false);
    Use() {
        if (!inPlayer || used || !owner.IsIdle()){
            return;
        }
        used = true;
        owner.InterruptAnimation(throwpuck, true, function(){this.ThrowPuck();}.bind(this));
    }

    CollidePlayer(player) {
        if (!inPlayer) {
            owner.SetDone(true);
            owner = player;
            player.CollectPowerup(this);
            inPlayer = true;
        }
    }

    ThrowPuck() {
        var xoff = owner.IsFlipped() ? 0 : 20;
        game.AddEntity(new Puck(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+22), owner, owner.IsFlipped(), game));
    }
}

function PowerupDestroy(owner, game) {
    this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 284, 13, 12, 12);

    Update() {
        var platforms = game.GetPlatforms(), i;
        for (i = 0; i < platforms.length; i += 1){
            if (game.DoesCollide(owner, platforms[i])){
                platforms[i].Destroy(owner.GetX());
                owner.SetDone(true);
                return;
            }
        }
    }
}

function Nade(x, y, owner, direction, game) {
    var img = game.GetImageManager().GetSpritesImg(),
    bounds_ = new Bounds(0, 0, 5, 4),
    animation_ = new StaticImage(img, 300, 18, 5, 4),
    xVelocity = direction ? -70 : 70,
    yVelocity = -150,
    yAcceleration = 350;

    Draw() {
        animation_.Draw(x, y);
    }

    Update(deltaT) {
        var ya, platform;

        x += xVelocity * deltaT;
        yVelocity += yAcceleration * deltaT;
        ya = y + yVelocity * deltaT;
        platform = game.IsOnGround(y, ya, this);

        if (platform){
            platform.Destroy(x);
            game.RemoveEntity(this);
        }
        y = ya;
        //make sure it is fully off the screen before it is removed
        if (x < -5 || x > 320){
            game.RemoveEntity(this);
            return;
        }
        if (y > 180){
            game.RemoveEntity(this);
            game.CreateEffect(effect.SmallSplash, x - 11, y - 20);
            return;
        }
    }

    GetX() {
        return x;
    }

    GetY() {
        return y;
    }

    GetCurrentBounds() {
        return bounds;
    }
}

function PowerupNade(owner, game) {
    this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 297, 13, 12, 12);
    var used = false,
    inPlayer = false,
    thrownade = new Animation(25, 1000, 100, 2, 24, 24);
    thrownade.Repeat(false);
    Use() {
        if (!inPlayer || used || !owner.IsIdle()){
            return;
        }
        used = true;
        owner.InterruptAnimation(thrownade, true, function(){this.ThrowNade();}.bind(this));
    }

    CollidePlayer(player) {
        if (!inPlayer) {
            owner.SetDone(true);
            owner = player;
            player.CollectPowerup(this);
            inPlayer = true;
        }
    }

    ThrowNade() {
        var xoff = owner.IsFlipped() ? 0 : 20;
        game.AddEntity(new Nade(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()), owner, owner.IsFlipped(), game));
    }
}

function PowerupTeleport(owner, game) {
    function EmptyImage(){
        this.Draw=function(dx, dy){
        };
    }
    this.image = new EmptyImage();
    //this probably needs some work

    CollidePlayer(player) {
        game.CreateEffect(effect.GreenSmoke, player.GetX(), player.GetY());
        player.SetX(Math.floor(Math.random()*320));
        player.SetY(Math.floor(Math.random()*120));
        player.StartFall(true);
        owner.SetDone(true);
        player.CollectPowerup(false);
        new Sound().Play("buzz");

    }
}

function PowerupChute(owner) {
    this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 310, 13, 12, 12);
    var inPlayer = false,
    active = false,
    v = 40,
    chute = new Animation(25, 1100, 1, 1, 24, 24);
    chute.Repeat(false);
    Use() {
        if (!inPlayer || owner.IsOnGround() || owner.IsOnRope() || owner.GetYVelocity() < 0){
            return;
        }
        this.Animate();
        active = true;
        owner.DisableGravity();
        v = owner.IsFlipped() ? -40 : 40;
        if (owner.GetXVelocity() === 0){
            v = 0;
        }
    };

    Update() {
        if (active) {
            var keys = owner.GetKeys();
            owner.SetYVelocity(40);
            owner.SetXVelocity(v);

            v = keys.right ? 40 : keys.left ? -40 : v;
            owner.SetFlipped(v < 0);
        }
    };

    ChangeFrom() {
        this.Disable();
        owner = false;
    };

    CollidePlayer(player) {
        if (!inPlayer) {
            owner.SetDone(true);
            owner = player;
            player.CollectPowerup(this);
            inPlayer = true;
        }
    };

    Disable() {
        owner.DisableAnimationInterrupt();
        owner.EnableGravity();
        if (active){
            owner.StartFall(true);
        }
        active = false;

    };

    CollidePlatform(platform) {
        if (!inPlayer || !active){
            return;
        }

        this.Disable();
    };

    Animate() {
        owner.InterruptAnimation(chute, true);
    };
}

function Powerup1000v(owner, game) {
    this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 258, 13, 12, 12);
    var inPlayer = false,
    img = game.GetImageManager().Get1000vImg(),

    orrigImg;

    this.Is1000V = true;
    CollidePlayer(player) {
        if (!inPlayer) {
            owner.SetDone(true);
            owner = player;
            player.CollectPowerup(this);
            orrigImg = owner.GetImage();
            inPlayer = true;
        } else {
            var otherPowerup = player.GetCurrentPowerup();
            if (otherPowerup && otherPowerup.Is1000V){
                owner.CollectPowerup(false);
                player.CollectPowerup(false);
                return false;
            }
            player.SetYVelocity(-1000);
            player.SetXVelocity(100);
            player.InterruptAnimation(owner.InterruptAnimation(owner.GetAnimations().explode, true));
            player.StartFall(true);
            owner.DontCollide();
            game.CreateEffect(effect.Lightning, player.GetX(), player.GetY());
            return true;
        }
    };

    Update() {
        if (!inPlayer){
            return;
        }
        if (owner.GetImage() !== img){
            owner.SetImage(img);
        }else{
            owner.SetImage(orrigImg);
        }
    };

    ChangeFrom() {
        owner.SetImage(orrigImg);
    };
}

function PowerupBoots(owner) {
    this.image = new StaticImage(game.GetImageManager().GetSpritesImg(), 297, 0, 12, 12);
    var inPlayer = false,
    inAir = false,
    wasInAir = false;

    CollidePlayer(player) {
        if (!inPlayer) {
            owner.SetDone(true);
            owner = player;
            player.CollectPowerup(this);
            inPlayer = true;
        }
    };

    Use() {
        if (!inPlayer || !owner.IsOnGround()){
            return;
        }
        if (owner.IsRunning() || owner.IsIdle()){
            var keys = owner.GetKeys();
            if (keys.right || keys.left) {
                owner.StartJump();
            } else  {
                owner.StartJumpUp();
            }
            owner.SetYVelocity(-230);
        }
    };

}
*/
class HookColide {
    constructor(private owner: Player) {
    }
    GetX() {
        return this.owner.IsFlipped() ? this.owner.GetX() + 5 : this.owner.GetX() + 19;
    };
    GetY() {
        return this.owner.GetY() + 8;
    };
    GetCurrentBounds() {
        return new Bounds(0, 0, 1, 1);
    };
}

class PowerupHook extends Powerup {
    inPlayer = false;
    active = false;
    hook = new Animation(25, 1200, 100, 2, 24, 24);
    player: Player;

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

    };

    CollidePlatform(platform: Platform) {
        if (!this.inPlayer || !this.active) {
            return;
        }

        this.Disable();
    };

    Disable() {
        this.active = false;
        this.player.DisableAnimationInterrupt();
    };

    ChangeFrom() {
        this.Disable();
    };
}

