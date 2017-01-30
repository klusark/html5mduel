//make it so that browsers that do not have console are still supported
/*global console*/
/*if (!console) {
	console = {};
	console.log = function(i){};
}*/
/**
 * @constructor
 */
function Log() {
	var debug = false;

	DebugLog(message) {
		//if (debug) {
			console.log(message);
		//}
	};

	Log(message) {
		console.log(message);
	};
}

module.exports = {
  Log: Log,
  log: new Log()
};
