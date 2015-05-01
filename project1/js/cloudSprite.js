"use strict";
app.CloudSprite = function(){
	
	//cloud sprite function constructor
	function CloudSprite(image,width,height,frameWidth,frameHeight,frameDelay) {
		this.x = 0;
		this.y = 0;
		this.width = width;
		this.height = height;
		this.xVelocity = 0
		this.yVelocity = 0;
		this.image = image;
		this.active = true;

		this.frameWidth = frameWidth;
		this.frameHeight = frameHeight;
		this.frameDelay = frameDelay;
		this.numCols = Math.floor(this.image.width/this.frameWidth);
		this.numRows = Math.floor(this.image.height/this.frameHeight);
		this.totalFrames = this.numCols * this.numRows;
		this.frameIndex = 0;
		this.lastTime = 0;
	
	};

	var p = CloudSprite.prototype;
	
	//draw the cloud sprite based on frame
  	p.draw = function(ctx) {
		var halfW = this.width/2;
		var halfH = this.height/2;
		//if there is no image, draw rectangles
		if(!this.image){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
		} 
		//otherwise, use the image
		else{
			var col = this.frameIndex % this.numCols; 
			var row = Math.floor(this.frameIndex / this.numCols);
			var imageX = col * this.frameWidth;
			var imageY = row * this.frameHeight;
			
			ctx.drawImage(this.image, imageX, imageY, this.frameWidth, this.frameHeight,
							this.x - halfW, this.y - halfH, this.width - halfW, this.height - halfH); 
		}
			
	  };
	
	  //run through the drawing frames
	  p.update = function(dt) {
		this.x += this.xVelocity * dt;
		this.y += this.yVelocity * dt;
		this.lastTime += dt;
		if(this.lastTime >= this.frameDelay){
			this.lastTime = 0;
			this.frameIndex ++;
		}
		if(this.frameIndex >= this.totalFrames){
			this.active = false;
		}
	  };
	  
	
	return CloudSprite;
	
}();