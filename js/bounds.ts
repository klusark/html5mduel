export class Bounds {
    constructor(private x: number, private y: number, private w: number, private h: number) {
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
