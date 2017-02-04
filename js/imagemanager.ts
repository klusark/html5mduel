import { Scale } from "./scale";

/*if (typeof Image === 'undefined') {
    Image = function() {
        ImageManager.complete = true;
    }
}*/

export class ImageManager {
    private player1Img = new Image();
    private player2Img = new Image();
    private spritesImg = new Image();

    // make ImageManager not needed.
    private lightningImg = new Image();
    // private url: string = "http://mduel.teichroeb.net:5000/";
    private url: string = "http://10.0.0.3:5001/";

    constructor(private scale: Scale) {
        this.scale.ScaleCallback((scale: number) => {this.ScaleChange(scale); } );
        this.ScaleChange(scale.GetScale());
    }

    /*if (ImageManager.IsOnAppEngine()){
        ImageManager.SetScale(scale)
    }else{
        player1Img.src = "/images/player.png"
        player2Img.src = "/images/player.png"
        spritesImg.src = "/images/sprites.png"
    }*/
    ScaleChange(scale: number): void {

        let base = this.url + "generate?m=" + scale + "&c=",
        // TODO: Fix local storage
        colour0 = /*window.localStorage.colour0 ||*/ 0,
        colour1 = /*window.localStorage.colour1 ||*/ 1;
        this.player1Img.src = base + colour0;
        this.player2Img.src = base + colour1;
        this.lightningImg.src = base + "4";
        this.spritesImg.src = this.url + "generate?s&m=" + scale;
    }

    GetSpritesImg(): HTMLImageElement {
        return this.spritesImg;
    }

    GetPlayer1Img(): HTMLImageElement {
        return this.player1Img;
    }

    GetPlayer2Img(): HTMLImageElement  {
        return this.player2Img;
    }

    Get1000vImg(): HTMLImageElement  {
        return this.lightningImg;
    }

    IsLoaded(): boolean {
        return this.player1Img.complete && this.player2Img.complete && this.spritesImg.complete;
    }
}

