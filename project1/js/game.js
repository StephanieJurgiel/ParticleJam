"use strict"

var app = app || {};

app.game = {

	//constants
	WIDTH: 800, 
	HEIGHT: 600, 
	
	//variables
	canvas: undefined,
	ctx: undefined, 
	drawLib: undefined,
	app: undefined, 
	particles: [],
	cloud: undefined,
	clouds: [],
	dt: 1/60.0,
	numSamples: undefined, 
	audioElement: undefined, 
	audioCtx: undefined,
	analyserNode: undefined,
	spawnTimer: 0, 
	score: 200,
	gameState: 0,
	playColor: "white",
	mouse: {}, 
	bubbleEffect: undefined,
	redCloudSprite: [],
	blueCloudSprite: [],
	redCloudSpriteImage: undefined, 
	blueCloudSpriteImage: undefined,
	songPlaying: "media/run_amok.mp3",
	highestScore: 0,
	cloudsInARow: 0,
	bonusMultiplier: 1,
	spawnSpeed: undefined,
	musicLevel: undefined,
	deltaTime: 1, 
	
	init : function(){
		
		//access the canvas variables
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		//set up the background
		var background = new Image();
		background.src = this.app.IMAGES['background'];
		this.drawLib.background = background;
		
		//create the particles
		this.particles.push(new app.particle("blue", 100, 400, 0, 0, 255));
		this.particles.push(new app.particle("red", 100, 200, 255, 0, 0));
		this.particles[1].active = false;
	
		//setup the audio
		this.setupAudio();
		
		//the sound for cloud collisions
		this.bubbleEffect = new Audio("media/bubble.mp3");
		
		//check mouse moves and clicks
		this.canvas.addEventListener("mousemove", this.doMouseMove);
		this.canvas.onclick = this.changePage;
		
		//fill the cloud sprite images
		var image = new Image();
		image.src = this.app.IMAGES['redCloudSprite'];
		this.redCloudSpriteImage = image;
		var image = new Image();
		image.src = "images/blueCloudSprite.png";
		this.blueCloudSpriteImage = image;
		
		//check for changes in song
		document.querySelector("#trackSelect").onchange = function(e){
		this.audioElement = document.querySelector('#audio');
			//setup the new audio
			app.game.songPlaying = e.target.value;
			app.game.audioElement.src = app.game.songPlaying;
			app.game.audioElement.play();
			app.game.audioElement.volume = 0.2;
				
		};

		//check to see if the player clicks to add/remove the second particle system
		document.getElementById('redParticleBox').onchange = function(e){
				//change the status of the red particle
				app.game.particles[1].active = !app.game.particles[1].active;
				
				//if the red particle is now disabled, destroy all of the red clouds. 
				if(!app.game.particles[1].active)
				{
					for(var i = 0; i < app.game.clouds.length; i++)
					{
						if(app.game.clouds[i].color == "red")
						{
							app.game.clouds[i].active = false;
						}
					}
				}
		}

		this.update();
	},
	
	//set up the audio nodes for cloud spawning
	setupAudio : function(){
		this.numSamples = 256;
		this.audioElement = document.querySelector('#audio');
		this.audioElement.src = this.songPlaying;
		
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext);
		
		this.analyserNode = this.audioCtx.createAnalyser();
		this.analyserNode.fftSize = this.numSamples;
		
		var sourceNode = this.audioCtx.createMediaElementSource(this.audioElement); 
		sourceNode.connect(this.analyserNode);
		
		this.analyserNode.connect(this.audioCtx.destination);
	},
	
	//call the mouseHoversFuction to change the game to the game state
	changePage : function(){
		app.game.checkMouseHovers(true);
	},
	
	//the update loop
	update: function(){
		//loop
		requestAnimationFrame(this.update.bind(this));
		//set the speed of the cloud spawning
		this.spawnSpeed = 40 - document.getElementById("speedSlider").value;
		
		//menu state
		if(this.gameState == 0)
		{
			//draw the background
			this.drawLib.drawBackground(this.ctx, this.WIDTH, this.HEIGHT, this);
			
			//check for mouse hovers
			this.checkMouseHovers(false);
			
			//tell the drawLib to draw the text for the menu screen
			this.drawLib.displayMainMenu(this.ctx, this.playColor, this);
		}
		//game state
		else if(this.gameState == 1)
		{
			//play the audio
			this.audioElement.play();
			this.audioElement.volume = 0.2;
			
			//update the time passed
			this.deltaTime += 1;
			
			//draw the background
			this.drawLib.drawBackground(this.ctx, this.WIDTH, this.HEIGHT, this);
			
			//move the sprites
			this.moveParticles();
			
			//create the clouds
			this.createClouds();
			
			//get the active clouds
			//array.filter() returns a new array with only active bullets
			this.clouds = this.clouds.filter(function(clouds){
				return clouds.active;
			});
		
			//delete clouds that have gone off the screen
			//move and draw the clouds
			for(var i = 0; i < this.clouds.length; i++)
			{
				this.deleteClouds(this.clouds[i]);
				this.clouds[i].move();
				this.clouds[i].draw(this.ctx);
			}
			
			//draw the particle systems
			for(var i = 0; i < this.particles.length; i++)
			{
				if(this.particles[i].active)
				{
					this.particles[i].draw(this.ctx);
				}
			}

			//check for collisions
			this.checkForCollisions();
				
			//check the score multiplier
			this.checkMultiplier();
			
			//check the highest score so far -- see if score is below zero
			this.checkScore();
				
			//display the score
			this.ctx.font = 'bold ' + 20 + 'px Unkempt';
			this.drawLib.showScore(this.ctx, "Score: " + this.score, 10, 25, 25, "black");/////////////////////////////////////////////
			
			//display the multiplier
			this.drawLib.displayMultiplier(this.ctx, this, this.bonusMultiplier);
			
			//draw the cloud effects
			this.redCloudSprite.forEach(function(exp){
				exp.draw(this.ctx);
			}, this);
			this.blueCloudSprite.forEach(function(exp){
				exp.draw(this.ctx);
			}, this);
			//check if the game should end/song is over
			this.checkEndGame();
		}
		//the end screen
		else if(this.gameState == 2)
		{
			//draw the background and end screen
			this.drawLib.drawBackground(this.ctx, this.WIDTH, this.HEIGHT, this);
			this.drawLib.displayEndScreen(this.ctx, this, this.highestScore);	
		}
	},
	
	//move the particle systems that you control
	moveParticles: function(){
		//red particle movement
		if(this.app.keydown[this.app.KEYBOARD.UP_ARROW]){
			this.particles[0].moveUp(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.DOWN_ARROW]){
			this.particles[0].moveDown(this.dt);
		}
		
		//blue particle movement
		if(this.app.keydown[this.app.KEYBOARD.W]){
			this.particles[1].moveUp(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.S]){
			this.particles[1].moveDown(this.dt);
		}
		
		//clamp the values so the particles dont move off the screen
		var padding = this.particles[0].radius;
		
		//clamp (Val, min, max)
		for(var i = 0; i < this.particles.length; i++)
		{
			this.particles[i].y = this.particles[i].clamp(this.particles[i].y, padding, this.HEIGHT - padding);
		}
		
		//move the cloud bubble effects
		this.redCloudSprite.forEach(function(exp){
			exp.update(this.dt);
		}, this);
		
		this.redCloudSprite.filter(function(exp) {
			return exp.active;
		});
		this.blueCloudSprite.forEach(function(exp){
			exp.update(this.dt);
		}, this);
		
		this.blueCloudSprite.filter(function(exp) {
			return exp.active;
		});
	},
	
	//create clouds based on the music
	createClouds : function(){
		
		//get the data array
		var data = new Uint8Array(this.numSamples/2);
		this.analyserNode.getByteFrequencyData(data);
		var number = Math.floor((Math.random() * 2) + 1);
		
		//determine which random color cloud to create
		var color;
		if(number == 1 && this.particles[1].active)
		{
			color = "red";
		}
		else
		{
			color = "blue";
		}

		//get the sum of the data
		var dataSum = 0;
		for(var i = 0; i < data.length; i++)
		{
			dataSum+=  data[i];
		}
		this.musicLevel = dataSum;
		//map the data sum to a height on the screen
		var height = this.map(dataSum, 0, 12000, 0, 600);
		
		//determine if enough time has passed in order to create a cloud
		if(this.spawnTimer == 0)
		{
			this.clouds.push(new this.app.cloud(color, this.WIDTH, 600 - height));
			this.spawnTimer = 1;
		}
		if(this.spawnTimer >=1)
		{
			this.spawnTimer++;
		}
		if(this.spawnTimer >= this.spawnSpeed)
		{
			this.spawnTimer = 0;
		}
	},
	
	//check to see if the mouse is hovering over the "Play" word on the main menu
	checkMouseHovers: function(clicked){
	
		var image = new Image();
		image.src = this.app.BLUECLOUDS["cloud1"];
		
		//if you are hovering over the play button -- add a cloud next to it, set text color to blue
		if(this.mouse.x >= 367 && this.mouse.x <= 441 && this.mouse.y >= 126 && this.mouse.y <= 150)
		{
			this.ctx.drawImage(image, 320, 125, 40, 30);
			this.playColor = "blue";
			if(clicked)
			{
				//change the game state to the play
				this.gameState = 1;
			}
		}
		//otherwise keep the play text color as white
		else
		{
			this.playColor = "white";
		}
		
	},
	
	//check if particles collide with the correctly colored clouds
	checkForCollisions : function(){
		//make sure we keep "this" at what we would think it would be here
		var self = this;
	
		//for the particles
		for(var i = 0; i < this.particles.length; i++)
		{
			//for the clouds
			for(var j = 0; j < this.clouds.length; j++)
			{
				//if they collide
				if(self.collides(this.particles[i], this.clouds[j]))
				{
					//and the colors match
					if(this.particles[i].color == this.clouds[j].color)
					{
						//increment the in-a-row score
						this.cloudsInARow++;
						
						//determine the score based on color and bonus in-a-row multiplier
						if(this.clouds[i].color == "red" )
						{
							this.score += 30 * this.bonusMultiplier;
						}
						else
						{
							this.score += 10 * this.bonusMultiplier;
						}
						//play the bubble sound
						this.bubbleEffect.volume = 0.4;
						this.bubbleEffect.play();
						//create the bubble effect
						self.createCloudEffect(this.clouds[j].x, this.clouds[j].y, 0, -10, this.particles[i].color);
						this.clouds[j].active = false;
					}
					
				}
			}
		}
	},
	
	//the math for collision detection. 
	collides : function(particle, cloud)
	{
		//if a particle is active, check for collisions
		if(particle.active)
		{
			// will return true if all of the following are true
			var particlex = particle.x;
			var particley = particle.y;
			var cloudx = cloud.x - cloud.width/2;
			var cloudy = cloud.y - cloud.height/2;
			
			return particlex < cloudx + cloud.width &&
				particlex + particle.radius >  cloudx &&
				particley < cloudy + cloud.height &&
				particley + particle.radius > cloudy;
		}
		//otherwise, return that no collision has occured. 
		else
		{
			return false;
		}
	},
	
	//delete clouds if they move off the screen 
	deleteClouds : function(cloud)
	{
		if(cloud.x < 10 && cloud.active)
		{
			this.cloudsInARow = 0;
			cloud.active = false;
			this.score -= 10;
		}
	},
	
	//handle mouse moves
	doMouseMove : function(e){
		app.game.mouse = app.game.getMouse(e);
	},
	
	//get the mouse position
	getMouse : function(e){
		this.mouse.x = e.pageX - e.target.offsetLeft;
		this.mouse.y = e.pageY - e.target.offsetTop;
		
		return this.mouse;
	},
	
	//create the bubble sprite effect for cloud collisions
	createCloudEffect : function(x, y, xVelocity, yVelocity,color){

		if(color == 'red')
		{
			var exp = new app.CloudSprite(this.redCloudSpriteImage, 128, 128, 64, 64, 1/8);
		}
		else
		{
			var exp = new app.CloudSprite(this.blueCloudSpriteImage, 128, 128, 64, 64, 1/8);
		}
		
		exp.x = x;
		exp.y = y;
		exp.xVelocity = xVelocity;
		exp.yVelocity = yVelocity;
		if(color == 'red')
		{
			this.redCloudSprite.push(exp);
		}
		else
		{
			this.blueCloudSprite.push(exp)
		}
	},
	
	//check if the score is below zero && determine the highest score
	checkScore : function()
	{
		//check if the score has fallen below zero
		if(this.score <= 0)
		{
			this.gameState = 2;
		}
		
		//determine the highest score so far
		if(this.score > this.highestScore)
		{
			this.highestScore = this.score;
		}
	},
	
	//determine the bonus multiplier
	checkMultiplier : function()
	{
		if(this.cloudsInARow >= 10)
		{
			this.bonusMultiplier = 5;
		}
		else if(this.cloudsInARow >= 8)
		{
			this.bonusMultipier = 4;
		}
		else if(this.cloudsInARow >= 6)
		{
			this.bonusMultiplier = 3;
		}
		else if(this.cloudsInARow >= 4)
		{
			this.bonusMultiplier = 2;
		}
		else
		{
			this.bonusMultiplier = 1;
		}
	},
	
	//a map function
	map : function(value, low1, high1, low2, high2) {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}, 
	
	//check to see if the song has ended
	checkEndGame : function()
	{
		if(this.deltaTime > 60 && this.musicLevel == 0)
		{
			this.gameState = 2;
		}
	}
};//end app.game