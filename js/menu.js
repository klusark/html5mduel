function Menu() {
	var scale
	var avail
	var inGame
	var buttonDir = false
	this.Setup = function() {
		var windowwidth = window.innerWidth
		var windowheight = window.innerHeight
		scale = 1
		while (320*(scale+1) < windowwidth && 200*(scale+1) < windowheight)
			++scale
		var canvas = document.getElementById('canvas')
		canvas.width = 320*scale
		canvas.height = 200*scale
		var container = document.getElementById("container").style
		container.width = 320*scale
		container.height = 200*scale
		
		var menuid = document.getElementById("menu").style
		menuid.width = 320*scale
		menuid.height = 200*scale
	}
	
	this.StartGame = function() {
		document.getElementById("menu").style.display = "none"
		document.getElementById("canvas").style.display = "block"
		core.init()
	}
	
	this.StartGameMenu = function() {
		avail = []
		inGame = []
		var result = ""
		var playersjson = window.localStorage["players"]
		if (playersjson) {
			var players = JSON.parse(playersjson)
			for (var i in players){
				avail.push(i)
				result += "<option>" + i + "</option>"
			}
		}
		
		document.getElementById("playersavail").innerHTML = result
	
		document.getElementById("main").style.display = "none"
		document.getElementById("gamesettings").style.display = "block"
	}
	
	this.GetScale = function() {
		return scale
	}
	
	this.Players = function() {
		var result = "<tr id='pth'><td>Name</td><td>Wins</td><td>Losses</td><td>FIDS</td></tr>"
		var table = document.getElementById("playerstable")
		
		var playersjson = window.localStorage["players"]
		if (playersjson) {
			var players = JSON.parse(playersjson)
			for (var i in players){
				var player = players[i]
				result += "<tr><td>"
				result += i
				result += "</td><td>"
				result += player.wins
				result += "</td><td>"
				result += player.losses
				result += "</td><td>"
				result += player.fids
				result += "</td></tr>"
			}
		}
		
		table.innerHTML = result
		document.getElementById("main").style.display = "none"
		document.getElementById("players").style.display = "block"
	}
	
	this.CreatePlayer = function() {
		document.getElementById("players").style.display = "none"
		document.getElementById("createPlayer").style.display = "block"
	}
	
	this.CreateNewPlayer = function() {
		var playersjson = window.localStorage["players"]
		var players
		if (playersjson) {
			players = JSON.parse(playersjson)
		} else {
			players = {}
		}
		var player = new StoredPlayer()
		var name = document.getElementById("playername")
		if (name && name.value) {
			players[name.value] = player
			window.localStorage["players"] = JSON.stringify(players)
		}
		this.CancelCreateNewPlayer()
	}
	
	this.CancelCreateNewPlayer = function() {
		this.Players()
		document.getElementById("createPlayer").style.display = "none"
	}
	
	this.ClickPlayersAvail = function() {
		var button = document.getElementById("playersbutton")
		var playersgame = document.getElementById("playersgame")
		playersgame.selectedIndex = -1
		button.innerHTML = "->"
		buttonDir = true
	}
	
	this.ClickPlayersGame = function() {
		var button = document.getElementById("playersbutton")
		var playersavail = document.getElementById("playersavail")
		playersavail.selectedIndex = -1
		button.innerHTML = "<-"
		buttonDir = false
	}
	
	this.MoveSelectedPlayer = function() {
		var playersgame = document.getElementById("playersgame")
		var playersavail = document.getElementById("playersavail")
		if (playersgame.selectedIndex == -1 && playersavail.selectedIndex == -1)
			return
		if (buttonDir) {
			var selected = playersavail.selectedIndex
			inGame.push(avail.splice(selected, 1)[0])
		} else {
			var selected = playersgame.selectedIndex
			avail.push(inGame.splice(selected, 1)[0])
		}
		var result = ""
		for (var i in avail){
			result += "<option>" + avail[i] + "</option>"
		}
		playersavail.innerHTML = result
		result = ""
		for (var i in inGame){
			result += "<option>" + inGame[i] + "</option>"
		}
		playersgame.innerHTML = result
		var gamesettingstartgame = document.getElementById("gamesettingstartgame")
		if (inGame.length < 2)
			gamesettingstartgame.disabled = "yes"
		else
			gamesettingstartgame.disabled = null
	}
}
var menu = new Menu()


window.onload = function(){menu.Setup()}