
interface ScaleCallbackT {
    (size: number): void;
}

export class Scale {

    static scale: number;
    static callbacks: ScaleCallbackT[];

    public ScaleCallback(callback: ScaleCallbackT): void {
        if (Scale.callbacks === undefined) {
            Scale.callbacks = [];
        }
        Scale.callbacks.push(callback);
    }

    SetScale(_scale: number) {
        if (_scale < 1 || _scale > 10) {
            return;
        }
        Scale.scale = _scale;
        for (let i = 0; i < Scale.callbacks.length; i += 1) {
            Scale.callbacks[i](Scale.scale);
        }
    }

    GetScale(): number {
        return Scale.scale;
    }
}


