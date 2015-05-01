"use strict"
app.cloud = function() {
	
	//cloud function constructor
	function Cloud(color, x, y){
		this.color = color;
		this.x = x;
		this.y = y;
		this.active = true;
		this.width = 80;
		this.height = 60;
		this.image = new Image();
		var cloudNumber= Math.floor((Math.random() * 4)) + 1;

		//create a cloud based on the random number
		if(color == "red")
		{
			this.image.src = app.REDCLOUDS["cloud" + cloudNumber];
		}
		else
		{
			this.image.src = app.BLUECLOUDS["cloud" + cloudNumber];
		}
	};
	
	var c = Cloud.prototype;
	
	//draw function for cloud
	c.draw = function(ctx){

		//if active
		if(this.active)
		{
			//draw circle clouds if there is no image
			if(!this.image)
			{
				ctx.save();
				ctx.fillStyle = this.color;
				ctx.beginPath();

				ctx.arc(this.x - 30, this.y, 20, Math.PI * 2, false);
				ctx.arc(this.x - 10, this.y - 20, 20, Math.PI * 2, false);
				ctx.arc(this.x - 8, this.y + 15, 20, Math.PI * 2, false);
				ctx.arc(this.x, this.y, 20, Math.PI * 2, false);
				ctx.arc(this.x + 30, this.y - 20, 20, Math.PI * 2, false);
				ctx.arc(this.x + 60, this.y, 20, Math.PI * 2, false);
				ctx.arc(this.x + 30, this.y + 15, 20, Math.PI * 2, false);
			
				ctx.fill();
				ctx.restore();
			}
			//otherwise, draw with the image
			else
			{
				ctx.drawImage(this.image, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
			}
		}
	};

	//move clouds across the screen
	c.move = function(){
		this.x -= 5;
	};
	
	return Cloud;
}(); //end of app.particle