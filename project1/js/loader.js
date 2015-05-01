"use strict"
var app = app || {};

//keyboard constants -- find the values by using the keyboard event listeners
app.KEYBOARD = { 
	"UP_ARROW": 38, 
	"DOWN_ARROW": 40,
	"W": 87, 
	"S": 83,
};

//background and sprite sheets
app.IMAGES = {
	background: "images/background.png",
	redCloudSprite: "images/redCloudSprite.png",
	blueCloudSprite: "images/blueCloudSprite.png",
};

//multiplier sprites
app.MULTIPLIER = {
	multiplier1: "images/1xmultiplier.png",
	multiplier2: "images/2xmultiplier.png", 
	multiplier3: "images/3xmultiplier.png",
	multiplier4: "images/4xmultiplier.png",
	multiplier5: "images/5xmultiplier.png",
};

//red cloud sprites
app.REDCLOUDS = {
	cloud1: "images/cloud1red.png",
	cloud2: "images/cloud2red.png",
	cloud3: "images/cloud3red.png", 
	cloud4: "images/cloud4red.png",
};

//blue cloud sprites
app.BLUECLOUDS = {
	cloud1: "images/cloud1blue.png",
	cloud2: "images/cloud2blue.png", 
	cloud3: "images/cloud3blue.png", 
	cloud4: "images/cloud4blue.png",
};

//an array for keycodes
app.keydown = [];

//when the window loads
window.onload = function(){
	app.game.app = app;
	app.game.drawLib = app.drawLib;
	app.game.cloud = app.cloud;
	app.Emitter.utils = app.utils;
	app.game.init();
}

//add event listeners for the keys
//update the array with true or false values for the key inputs
window.addEventListener("keydown", function(e){
	app.keydown[e.keyCode] = true;
});

window.addEventListener("keyup", function(e){
	app.keydown[e.keyCode] = false;
});