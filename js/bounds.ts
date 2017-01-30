export class Bounds {
    x: number;
    y: number;
    w: number;
    h: number;
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    GetX() {
        return this.x;
    }
    GetY() {
        return this.y;
    }
    GetWidth() {
        return this.w;
    }
    GetHeight() {
        return this.h;
    }
}
