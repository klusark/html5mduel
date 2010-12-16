//make it so that browsers that do not have console are still supported
if (!window.console) {
	window.console = new Object()
	window.console.log = function(){}
}
function Log() {
	var debug = false
	this.DebugLog = function(message) {
		if (debug)
			console.log(message)
	}
	this.Log = function(message) {
		console.log(message)
	}
}
log = new Log()
