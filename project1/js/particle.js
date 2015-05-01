"use strict"
app.particle = function() {
	
	//particle function constructor
	function Particle(color, x, y, r, g, b){
		this.color = color;
		this.x = x;
		this.y = y;
		this.radius = 5;
		this.speed = 1000;
		
		this.exhaust = new app.Emitter();
		this.exhaust.numParticles = 100;
		this.exhaust.red = r;
		this.exhaust.green = g;
		this.exhaust.blue = b;
		this.active = true;
		
		//create the particle effect
		this.exhaust.createParticles(this.emitterPoint());
		
	};
	
	var p = Particle.prototype;
	
	//draw function for that particle system
	p.draw = function(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2* Math.PI, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.restore();
		//draw the exhaust
		this.exhaust.updateAndDraw(ctx, this.emitterPoint());
	};
	
	//determine the emitter point
	p.emitterPoint = function(){
		return{
			x:this.x, 
			y:this.y
		};
	};
	
	//move particle system up
	p.moveUp = function(dt){
		this.y -= this.speed * dt;
	};
	
	//move particle system down
	p.moveDown = function(dt){
		this.y += this.speed * dt;
	};
	
	//clamp y value to stay on the screen
	p.clamp = function(val, min, max){
		return Math.max(min, Math.min(max, val));
	};
	
	return Particle;
}(); //end of app.particle