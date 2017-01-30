import { Scale } from "./scale";

/*if (typeof Image === 'undefined') {
    Image = function() {
        ImageManager.complete = true;
    };
}*/

export class ImageManager {
    static player1Img = new Image();
    static player2Img = new Image();
    static spritesImg = new Image();

    //make ImageManager not needed.
    static lightningImg = new Image();
    static scale: Scale;
    static initialized: boolean = false;
    //url: string = "http://mduel.teichroeb.net:5000/";
    url: string = "http://10.0.0.3:5001/";

    constructor() {
        if (!ImageManager.initialized) {
            ImageManager.initialized = true;
            ImageManager.scale = new Scale();
            ImageManager.scale.ScaleCallback((scale: number) => {this.ScaleChange(scale);} );
            this.ScaleChange(1);
        }
    }

    /*if (ImageManager.IsOnAppEngine()){
        ImageManager.SetScale(scale)
    }else{
        player1Img.src = "/images/player.png"
        player2Img.src = "/images/player.png"
        spritesImg.src = "/images/sprites.png"
    }*/
    ScaleChange(scale: number): void {

        var base = this.url + "generate?m="+scale+"&c=",
        // TODO: Fix local storage
        colour0 = /*window.localStorage.colour0 ||*/ 0,
        colour1 = /*window.localStorage.colour1 ||*/ 1;
        ImageManager.player1Img.src = base + colour0;
        ImageManager.player2Img.src = base + colour1;
        ImageManager.lightningImg.src = base + "4";
        ImageManager.spritesImg.src = this.url + "generate?s&m="+scale;
    };

    GetSpritesImg(): HTMLImageElement {
        return ImageManager.spritesImg;
    };

    GetPlayer1Img(): HTMLImageElement {
        return ImageManager.player1Img;
    };

    GetPlayer2Img(): HTMLImageElement  {
        return ImageManager.player2Img;
    };

    Get1000vImg(): HTMLImageElement  {
        return ImageManager.lightningImg;
    };

    IsLoaded(): boolean {
        return ImageManager.player1Img.complete && ImageManager.player2Img.complete && ImageManager.spritesImg.complete;
    };
}

