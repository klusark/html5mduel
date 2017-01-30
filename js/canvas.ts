import { Scale } from "./scale";

export class Canvas {
    static ctx: any;
    static _canvas: HTMLCanvasElement;
    static scale: number;
    static s: Scale;

    constructor() {
        Canvas.s = new Scale();

        Canvas.s.ScaleCallback((_scale: number) => {this.ScaleChange(_scale); });
    }

    DocumentLoaded(): void {
        Canvas._canvas = <HTMLCanvasElement> document.getElementById("canvas");
        Canvas.ctx = Canvas._canvas.getContext("2d");

        // only works on firefox 3.6 and up
        // hopefuly chrome gets a similar setting soon
        // this really has no use because of my appengine scaling
        Canvas.ctx.mozImageSmoothingEnabled = false;

        this.Clear();
    };

    DrawImage(image: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void {
        if (!Canvas.ctx || !image || !image.complete) {
            return;
        }

        Canvas.ctx.drawImage(image, sx * Canvas.scale, sy * Canvas.scale, sw * Canvas.scale, sh * Canvas.scale, Math.round(dx * Canvas.scale), Math.round(dy * Canvas.scale), dw * Canvas.scale, dh * Canvas.scale);
    };

    FillRect(x: number, y: number, w: number, h: number) {
        if (!Canvas.ctx) {
            return;
        }
        Canvas.ctx.fillRect(x * Canvas.scale, y * Canvas.scale, w * Canvas.scale, h * Canvas.scale);
    };

    FillText(text: string, x: number, y: number) {
        if (!Canvas.ctx) {
            return;
        }
        Canvas.ctx.fillText(text, x * Canvas.scale, y * Canvas.scale);
    };

    FillStyle(style: string) {
        if (Canvas.ctx) {
            Canvas.ctx.fillStyle = style;
        }
    };

    setFont(font: string) {
        if (Canvas.ctx) {
            Canvas.ctx.font = font;
        }
    };

    setTextAlign(align: string) {
        if (Canvas.ctx) {
            Canvas.ctx.textAlign = align;
        }
    };

    Clear() {
        if (!Canvas.ctx) {
            return;
        }
        Canvas.ctx.fillStyle = "rgb(0,0,0)";
        Canvas.ctx.fillRect(0, 0, Canvas._canvas.width, Canvas._canvas.height);
    };

    ScaleChange(_scale: number) {
        Canvas.scale = _scale;
        Canvas._canvas.width = 320 * Canvas.scale;
        Canvas._canvas.height = 200 * Canvas.scale;
        // log.Log("ScaleChange "+scale);
        this.Clear();
        // var container = document.getElementById("container").style;
        // container.width = 320*scale;
        // container.height = 200*scale;
        /*var windowwidth = window.innerWidth
        var windowheight = window.innerHeight
        scale = 1
        while (320*(scale+1) < windowwidth && 200*(scale+1) < windowheight)
            ++scale
        var canvas = document.getElementById('canvas')
        */
    };

    GetContext() {
        return Canvas.ctx;
    };
}

