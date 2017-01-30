export class Sound {
	sounds: { [key:string]: HTMLAudioElement};

	Preload(name: string) {
		if (typeof Audio !== 'undefined') {
			var sound = new Audio();
			sound.src = "sound/" + name + ".ogg";
			this.sounds[name] = sound;
		}
	};

	Play(name: string) {
		if (!this.sounds[name]){
			//log.Log("Sound "+name+" was not preloaded.");
			return;
		}
		this.sounds[name].play();
	};
}
