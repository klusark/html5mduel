//make it so that browsers that do not have console are still supported
/*global console*/
/*if (!console) {
	console = {};
	console.log = function(i){};
}*/

export class Log {
	debug = false;

	DebugLog(message: string) {
		//if (debug) {
			console.log(message);
		//}
	}

	Log(message: string) {
		console.log(message);
	}
}
