function Selector(x, y, scale){
	img = new Image()
	
	var lastUpdateTime = core.GetTime()
	var animations = new Array();
	
	animations["run"] = new Animation(0, 0, 100, 4, 24, 24);
	
	animations["idle"] = new Animation(0, 100, 101, 1, 24, 24);

	var currentAnimation = animations["idle"];

	document.getElementById("1").style.display = "none"
	document.getElementById("2").style.display = "block"
	
	var x = x;
	var y = y;
	var scale = scale*8
	var colour = 0
	var colours = 4
	var url = "generate?sample&m="+scale+"&c="
	img.src = url + colour
	this.Draw = function(){
		
		currentAnimation.Draw(img, x, y, scale)

	}
	
	this.Update = function(){
		currentTime = core.GetTime()
		var deltaT = (currentTime - lastUpdateTime)/1000

		
		currentAnimation.Update()
	
		lastUpdateTime = currentTime
		
	}
	
	this.StartRun = function() {
		this.SetAnimation("run")
	}
	
	this.StartIdle = function() {
		this.SetAnimation("idle")
	}
	
	this.Next = function() {
		++colour
		if (colour == colours)
			colour = 0
			
		img.src = url+colour
		core.DebugLog(img.src)
	}
	
	this.Previous = function() {
		--colour
		if (colour == -1)
			colour = colours-1
			
		img.src = url+colour
		core.DebugLog(img.src)
	}
	
	this.Save = function(player) {
		window.localStorage['colour'+player] = colour
		//this.End()
	}
	
	this.End = function() {
		document.getElementById("1").style.display = "block"
		document.getElementById("2").style.display = "none"
	}
	
	this.SetImage = function(image){
		img = image
	}

	
	this.GetY = function(){
		return y;
	}
	
	this.GetX = function(){
		return x;
	}
	
	this.SetY = function(ny) {
		y = ny
	}
	
	this.SetX = function(nx) {
		x = nx
	}
	

	
	this.SetAnimation = function(name){
		core.DebugLog("Animation Changed to " + name)
		currentAnimation = animations[name];
		currentAnimation.ChangeTo(false);
	}

}