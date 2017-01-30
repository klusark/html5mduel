export class Selector {

	img = new Image()

	var lastUpdateTime = core.GetTime()
	var animations = new Array();

	animations["run"] = new Animation(0, 0, 100, 4, 24, 24);

	animations["idle"] = new Animation(0, 100, 101, 1, 24, 24);

	var currentAnimation = animations["idle"];

	document.getElementById("1").style.display = "none"
	document.getElementById("2").style.display = "block"

	var scale = scale*8
	var colour = 0
	var colours = 5
	var url = "http://html5mduel.appspot.com/generate?sample&m="+scale+"&c="
	img.src = url + colour

	constructor (x, y, scale) {
	}

	Draw(){

		currentAnimation.Draw(img, x, y, scale)

	}

	Update(){
		currentTime = core.GetTime()
		var deltaT = (currentTime - lastUpdateTime)/1000


		currentAnimation.Update()

		lastUpdateTime = currentTime

	}

	StartRun() {
		this.SetAnimation("run")
	}

	StartIdle() {
		this.SetAnimation("idle")
	}

	Next() {
		++colour
		if (colour == colours)
			colour = 0

		img.src = url+colour
		core.DebugLog(img.src)
	}

	Previous() {
		--colour
		if (colour == -1)
			colour = colours-1

		img.src = url+colour
		core.DebugLog(img.src)
	}

	Save(player) {
		window.localStorage['colour'+player] = colour
		//this.End()
	}

	End() {
		document.getElementById("1").style.display = "block"
		document.getElementById("2").style.display = "none"
	}

	SetImage(image){
		img = image
	}


	GetY(){
		return y;
	}

	GetX(){
		return x;
	}

	SetY(ny) {
		y = ny
	}

	SetX(nx) {
		x = nx
	}



	SetAnimation(name){
		core.DebugLog("Animation Changed to " + name)
		currentAnimation = animations[name];
		currentAnimation.ChangeTo(false);
	}

}
