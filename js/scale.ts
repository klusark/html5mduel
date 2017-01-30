
interface ScaleCallbackT { (size: number): void }

class ScaleT {

	scale: number;
    callbacks: ScaleCallbackT[];

	ScaleCallback(callback: ScaleCallbackT) {
		this.callbacks.push(callback);
	}

	SetScale(_scale: number) {
		if (_scale < 1 || _scale > 10){
			return;
		}
		this.scale = _scale;
		for (var i = 0; i < this.callbacks.length; i += 1){
			this.callbacks[i](this.scale);
		}
	}

	GetScale() {
		return scale;
	}
}

let scale = new ScaleT();

export = scale


