/**
 * @constructor
 */
function ScaleT(){

	var scale = 1,
	callbacks = [];

	this.ScaleCallback = function(callback) {
		//if (window[callback])
		callbacks.push(callback);
	};

	this.SetScale = function(_scale) {
		if (typeof(_scale) !== "number" || _scale < 1 || _scale > 10){
			return;
		}
		scale = _scale;
		var i;
		for (i = 0; i < callbacks.length; i += 1){
			callbacks[i](scale);
		}
	};

	this.GetScale = function() {
		return scale;
	};
}

module.exports = {
  ScaleT: ScaleT,
  scale: new ScaleT()
};

