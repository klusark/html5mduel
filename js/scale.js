function Scale(){

	var scale = 1
	var callbacks = new Array()
	
	this.ScaleCallback = function(callback) {
		//if (window[callback])
		callbacks.push(callback)
	}
	
	this.SetScale = function(scale) {
		for (var i = 0; i < callbacks.length; ++i){
			callbacks[i](scale)
		}
	}
	
	this.GetScale = function() {
		return scale
	}
}

var Scale = new Scale()
