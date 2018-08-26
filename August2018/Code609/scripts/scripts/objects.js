var GameObject = function(width = 0, height = 0) {
	this.width = width;
	this.height = height;
	this.pos = { x: 0, y: 0};
	this.spd = { x: 0 ,y: 0};
	this.image = null;
	this.currentFrame = 0;
	this.fIndex = 0;
	this.animations = {}
	this.interval = 0;
}

GameObject.prototype.setImage = function( url ) {
	this.image = GameAssets[url];
}

GameObject.prototype.show = function(index) {
	return { x : index * this.width, y: 0 }
}

GameObject.prototype.storeAnimation = function( obj ) {
	this.animations[obj.name] = obj.frames;
}

GameObject.prototype.play = function(setname, dt) {
	this.interval += dt;
	if( this.interval > this.animations[setname][this.fIndex][1]){
		this.interval = 0;
		this.fIndex ++;
		if(this.fIndex > this.animations[setname].length - 1 ) {
			this.fIndex = 0;
		}
		this.currentFrame = this.animations[setname][this.fIndex][0]
		 console.log(this.fIndex);
	}
}

GameObject.prototype.update = function(dt){}

var Anthony = function() {
	GameObject.call(this,20,20);
	this.setImage('images/Anthony.png');
	//setting animations
	this.storeAnimation({
		name : 'run',
		frames : [[1,0.1],[2,0.1],[3,0.1],[2,0.1]]
	});
}
Anthony.prototype = Object.create(GameObject.prototype);
Anthony.prototype.constructor = Anthony;
Anthony.prototype.update = function(dt) {
	if( this.pos.y < cnv.height / scale - this.height ) {
		this.spd.y = this.spd.y + 1;
		this.currentFrame = 1;
	} else {
		this.spd.y = 0;
		this.pos.y = cnv.height / scale - this.height
		if(Math.abs(this.spd.x) < 0.3) {
			this.currentFrame = 0;
		} else {
			this.play('run', dt);
		}
	}

	this.pos.y += this.spd.y * dt;
	this.pos.x += this.spd.x * dt;
}


var Door = function() {
	GameObject.call(this,32,50);
	this.setImage('images/Doors.png');
	this.pos.y = cnv.height - this.height * scale;	
	this.pos.y = cnv.height / scale - this.height
	this.unlocked = true; this.closed = true;
}

Door.prototype = Object.create(GameObject.prototype);
Door.prototype.constructor = Door;