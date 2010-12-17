//make it so that browsers that do not have console are still supported
/*global console*/
if (!console) {
	console = {};
	console.log = function(i){};
}
/**
 * @constructor
 */
function Log() {
	var debug = false;

	this.DebugLog = function(message) {
		if (debug) {
			console.log(message);
		}
	};

	this.Log = function(message) {
		console.log(message);
	};
}
var log = new Log();
