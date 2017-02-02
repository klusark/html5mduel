
interface ScaleCallbackT {
    (size: number): void;
}

export class Scale {
    private scale: number;
    private callbacks: ScaleCallbackT[] = [];

    public ScaleCallback(callback: ScaleCallbackT): void {
        this.callbacks.push(callback);
    }

    SetScale(_scale: number) {
        if (_scale < 1 || _scale > 10) {
            return;
        }
        this.scale = _scale;
        for (let i = 0; i < this.callbacks.length; i += 1) {
            this.callbacks[i](this.scale);
        }
    }

    GetScale(): number {
        return this.scale;
    }
}


