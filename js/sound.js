/**
 * @constructor
 */
function Sound() {
	var sounds = [];

	this.Preload = function(name) {
		if (typeof Audio !== 'undefined') {
			var sound = new Audio();
			sound.src = "sound/" + name + ".ogg";
			sounds[name] = sound;
		}
	};

	this.Play = function(name) {
		if (!sounds[name]){
			//log.Log("Sound "+name+" was not preloaded.");
			return;
		}
		sounds[name].play();
	};
}

module.exports = {
  Sound: Sound,
  sound: new Sound()
};