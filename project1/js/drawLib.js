"use strict";

var app = app || {};

app.drawLib = {

	multiplierImage: undefined,
	background: undefined,
	velocity: 0, 
	
	//clear the background each frame
	clear : function(ctx, x, y, w, h){
		ctx.clearRect(x, y, w, h);
	},
	
	//draw the background
	drawBackground : function(ctx, width, height){
		ctx.save();
		//draw and move and wrap the background
		ctx.drawImage(this.background, this.velocity, 0);
		ctx.drawImage(this.background, width - Math.abs(this.velocity), 0);
			
		if(Math.abs(this.velocity) > width)
		{
			this.velocity = 0;
		}
		this.velocity -=2;
			
		ctx.restore();
	},
	
	//draw the score onto the screen
	showScore : function(ctx, string, x, y, size, color)
	{
		ctx.save();
		ctx.font = 'bold ' + size + 'px Unkempt';
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
	
	//draw the menu
	displayMainMenu : function(ctx, playColor, that)
	{
		ctx.font = 'bold ' + 55 + 'px Unkempt';
		ctx.fillStyle = 'blue';
		ctx.fillText("Particle Jam", that.WIDTH/2 - 135, that.HEIGHT/8);
		
		ctx.font = 'bold ' + 35 + 'px Unkempt';
		ctx.fillStyle = playColor;
		ctx.fillText("Play", that.WIDTH/2 - 35, 150);
		
		ctx.fillStyle = 'blue';
		ctx.fillText("How To Play", that.WIDTH/2 -95, 250);
		ctx.font = 'bold ' + 20 + 'px Unkempt';
		ctx.fillStyle = 'white';
		ctx.fillText("Move colored particle systems to collide with clouds of the same color to get points.", 50, 280);
		ctx.fillText("If clouds slip past you, you lose points. If your points fall below 0, you lose.", 80, 310);

		ctx.fillText("Blue clouds give 10 Points.", 290, 350);
		ctx.fillText("Red clouds give 30 Points.", 290, 380);
		
		ctx.fillText("Activate the second particle system with the checkbox below.", 140, 430);
		ctx.fillText("Adjust the spawn speed of clouds with the slider below.", 170, 460);
		
		ctx.fillText("Hit clouds in a row to gain a bonus points multipler displayed under your points!", 60, 500);
		
		ctx.fillStyle = 'blue';
		ctx.fillText("Blue Particle System: W and S to move ", 235, 550);
		ctx.fillStyle = 'red';
		ctx.fillText("Red Particle System: Up Arrow and Down Arrow to move ", 150, 580);
	},
	
	//draw the end screen
	displayEndScreen : function(ctx, that, score)
	{
		ctx.fillStyle = 'blue';
		ctx.font = 'bold ' + 55 + 'px Unkempt';
		ctx.fillText("Game Over", that.WIDTH/2 - 135, that.HEIGHT/8);
		
		ctx.fillStyle = 'white';
		ctx.font = 'bold ' + 35 + 'px Unkempt';
		
		ctx.fillText("Your highest score was:", 230, 200);
		ctx.fillText(score, that.WIDTH/2 - 30, 240);
		
		ctx.fillText("Project by: Stephanie Jurgiel", that.WIDTH/2 - 210, 550);
	}, 
	
	//draw the multiplier image
	displayMultiplier : function(ctx, that, multiplier)
	{
		this.multiplierImage = new Image();
		this.multiplierImage.src = app.MULTIPLIER["multiplier" + multiplier];
		ctx.drawImage(this.multiplierImage, 10, 35, 90, 55);
	}, 
	
};