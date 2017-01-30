
import { StaticImage } from "./staticimage";
import { ImageManager } from "./imagemanager";
import { Animation } from "./animation";
import { Player } from "./player";
import { Bubble } from "./bubble";
import { Game } from "./core";
import { Sound } from "./sound";
import { Platform } from "./platform";

export abstract class Powerup {
    image: StaticImage;
    Draw(x: number, y: number) {
        this.image.Draw(x, y);
    }
    CollidePlayer(player: Player): boolean {
        return true;
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

class PowerupGun extends Powerup {
    imagemanager = new ImageManager();
    image = new StaticImage(this.imagemanager.GetSpritesImg(), 284, 0, 12, 12);

    ammo = 5;
    firing = false;
    inPlayer = false;
    gundown = new Animation(25, 450, 100, 2, 24, 24);
    gunup = new Animation(25, 450, 100, 2, 24, 24);
    other: Player;
    player: Player;
    bubble: Bubble;
    game: Game;

    constructor (bubble: Bubble, game: Game) {
        super();
        this.bubble = bubble;
        this.game = game;
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
        return true;
    }

    /*class GunCollisionCheck {
        GetX() {
            return owner.IsFlipped() ? owner.GetX()+23 - 320 : owner.GetX()+23;
        };
        GetY() {
            return owner.GetY()+8;
        };
        GetCurrentBounds() {
            return new bounds.Bounds(0,0,320,1);
        };
    }*/

    CheckForKill() {
        new Sound().Play("shot");
        // need to make this work with turning
        if (/*TODO this.game.DoesCollide(new GunCollisionCheck(), this.other)*/ true) {
            this.other.Disolve();
        }
    };

}
/*
function PowerupSkull(owner){
    this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 258, 0, 12, 12);
    CollidePlayer(player) {
        player.CollectPowerup(false);
        player.Disolve2();
        owner.SetDone(true);
        sound.sound.Play("buzz2");
    };

}

function PowerupInvis(owner, game){
    this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 271, 0, 12, 12);
    var invis = false,
    disabled = false,
    nextAllowedTime = 0,
    inPlayer = false;

    CollidePlayer(player) {
        if (!inPlayer) {
            owner.SetDone(true);
            owner = player;
            player.CollectPowerup(this);
            inPlayer = true;
        }
    };

    ChangeFrom() {
        owner.SetDraw(true);
    };

    Use() {
        if (game.getTime() < nextAllowedTime || !owner.IsIdle()){
            return;
        }
        if (!invis) {
            sound.sound.Play("beep3");
            invis = true;
            owner.SetDraw(false);
            nextAllowedTime = game.getTime() + 300;
        } else {
            sound.sound.Play("beep2");
            disabled = true;
            owner.SetDraw(true);
            owner.CollectPowerup(false);
        }
    };
}

function Mine(x, y, owner, game) {
    var other = game.GetOponentOf(owner),
    bounds_ = new bounds.Bounds(0, 0, 1, 1);

    sound.sound.Play("beep");
    this.isMine = true;

    Update() {

        var collision = game.DoesCollide(this, owner) ? owner : game.DoesCollide(this, other) ? other : undefined;
        if (collision && collision.IsOnGround()){
            collision.Explode();
            this.Explode();
        }

    };

    Explode() {
        game.CreateEffect(effect.Explode, x - 11, y - 20);
        game.RemoveEntity(this);
    };


    GetX() {
        return x;
    };

    GetY() {
        return y;
    };

    GetCurrentBounds() {
        return bounds_;
    };
}

function PowerupMine(owner, game) {
    this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 271, 13, 12, 12);
    var used = false,
    inPlayer = false;

    Use() {
        if (!inPlayer || used || !owner.IsIdle()){
            return;
        }
        used = true;
        owner.InterruptAnimation(owner.GetAnimations().crouch, true, function(){this.LayMine();owner.InterruptAnimation(owner.GetAnimations().uncrouch, true);}.bind(this));
    };

    CollidePlayer(player) {
        if (!inPlayer) {
            owner.SetDone(true);
            owner = player;
            player.CollectPowerup(this);
            inPlayer = true;
        }
    };

    LayMine() {
        sound.sound.Play("beep1");
        var xoff = owner.IsFlipped() ? 4 : 20;
        game.AddEntity(new Mine(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+23), owner, game));
    };
}

function Puck(x, y, owner, direction, game) {
    var img = imagemanager.image.GetSpritesImg(),
    other = game.GetOponentOf(owner),
    bounds_ = new bounds.Bounds(0, 0, 5, 2),
    animation_ = new animation.Animation(0, 310, 200, 2, 12, 12),
    xVelocity = direction ? -90 : 90,
    yVelocity = 70;

    Draw() {
        animation_.Draw(img, x-4, y-6);
    };

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
    };

    GetX() {
        return x;
    };

    GetY() {
        return y;
    };

    GetCurrentBounds() {
        return bounds_;
    };
}

function PowerupNukepuck(owner, game) {
    this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 310, 0, 12, 12);
    var used = false,
    inPlayer = false,
    throwpuck = new animation.Animation(25, 1050, 100, 2, 24, 24);
    throwpuck.Repeat(false);
    Use() {
        if (!inPlayer || used || !owner.IsIdle()){
            return;
        }
        used = true;
        owner.InterruptAnimation(throwpuck, true, function(){this.ThrowPuck();}.bind(this));
    };

    CollidePlayer(player) {
        if (!inPlayer) {
            owner.SetDone(true);
            owner = player;
            player.CollectPowerup(this);
            inPlayer = true;
        }
    };

    ThrowPuck() {
        var xoff = owner.IsFlipped() ? 0 : 20;
        game.AddEntity(new Puck(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()+22), owner, owner.IsFlipped(), game));
    };
}

function PowerupDestroy(owner, game) {
    this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 284, 13, 12, 12);

    Update() {
        var platforms = game.GetPlatforms(), i;
        for (i = 0; i < platforms.length; i += 1){
            if (game.DoesCollide(owner, platforms[i])){
                platforms[i].Destroy(owner.GetX());
                owner.SetDone(true);
                return;
            }
        }
    };
}

function Nade(x, y, owner, direction, game) {
    var img = imagemanager.image.GetSpritesImg(),
    bounds_ = new bounds.Bounds(0, 0, 5, 4),
    animation_ = new staticimage.StaticImage(img, 300, 18, 5, 4),
    xVelocity = direction ? -70 : 70,
    yVelocity = -150,
    yAcceleration = 350;

    Draw() {
        animation_.Draw(x, y);
    };

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
    };

    GetX() {
        return x;
    };

    GetY() {
        return y;
    };

    GetCurrentBounds() {
        return bounds;
    };
}

function PowerupNade(owner, game) {
    this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 297, 13, 12, 12);
    var used = false,
    inPlayer = false,
    thrownade = new animation.Animation(25, 1000, 100, 2, 24, 24);
    thrownade.Repeat(false);
    Use() {
        if (!inPlayer || used || !owner.IsIdle()){
            return;
        }
        used = true;
        owner.InterruptAnimation(thrownade, true, function(){this.ThrowNade();}.bind(this));
    };

    CollidePlayer(player) {
        if (!inPlayer) {
            owner.SetDone(true);
            owner = player;
            player.CollectPowerup(this);
            inPlayer = true;
        }
    };


    ThrowNade() {
        var xoff = owner.IsFlipped() ? 0 : 20;
        game.AddEntity(new Nade(Math.floor(owner.GetX()+xoff), Math.floor(owner.GetY()), owner, owner.IsFlipped(), game));
    };
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
        sound.sound.Play("buzz");

    };
}

function PowerupChute(owner) {
    this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 310, 13, 12, 12);
    var inPlayer = false,
    active = false,
    v = 40,
    chute = new animation.Animation(25, 1100, 1, 1, 24, 24);
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
    this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 258, 13, 12, 12);
    var inPlayer = false,
    img = imagemanager.image.Get1000vImg(),

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
    this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 297, 0, 12, 12);
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

function PowerupHook(owner, game) {
    this.image = new staticimage.StaticImage(imagemanager.image.GetSpritesImg(), 323, 13, 12, 12);
    var inPlayer = false,
    active = false,
    hook = new animation.Animation(25, 1200, 100, 2, 24, 24);
    CollidePlayer(player) {
        if (!inPlayer) {
            owner.SetDone(true);
            owner = player;
            player.CollectPowerup(this);
            inPlayer = true;
        }
    };

    function HookColide() {
        GetX() {
            return owner.IsFlipped() ? owner.GetX()+5 : owner.GetX()+19;
        };
        GetY() {
            return owner.GetY()+8;
        };
        GetCurrentBounds() {
            return new bounds.Bounds(0,0,1,1);
        };
    }

    Use() {
        if (!inPlayer || owner.IsOnGround() || owner.IsOnRope()){
            return;
        }
        var i, other, test, platforms;
        if (!active) {
            active = true;
            owner.InterruptAnimation(hook, true);
        }
        platforms = game.GetPlatforms();
        for (i = 0; i < platforms.length; i += 1){
            other = platforms[i];
            test = game.DoesCollide(new HookColide(), other);
            if (test){
                owner.SetYVelocity(-150);
                if (owner.IsJumping()){
                    owner.Bounce(true);
                }
                return;
            }
        }

    };

    CollidePlatform(platform) {
        if (!inPlayer || !active){
            return;
        }

        this.Disable();
    };

    Disable() {
        active = false;
        owner.DisableAnimationInterrupt();
    };

    ChangeFrom() {
        this.Disable();
    };
}
*/

