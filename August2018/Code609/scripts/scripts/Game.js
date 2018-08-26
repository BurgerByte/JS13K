function startGame() {
	Map.drawMap()
	onstart = function(){
		var g = new Game()
	};
}

var Map = (function(){
	const GRID_SIZE = 8;
	const MAX_ROOMS = 12;
	const MAX_LINKS = 3;
	var startPos = { row : 0, col: 0}
	var npc = {
		friendlies : {
			min : 1, max: 3, count:0
		},
		enemies : {
			count : 7, units : 3, groups : []
		}
	}
	var artifacts = {
		max : 4, count : 0, inRoom : 2
	}

	var BossRoom = null
	var roomCount = 0;
	var layout = [];
	while(layout.length < GRID_SIZE) { layout.push([]) }
	layout.forEach(function(row){
		while( row.length < GRID_SIZE ){
			row.push( { isRoom: 0, links:[], artifacts:[], npc:null, isSpawn:0})
		}
	});

	//recurssive function
	function buildRooms( startPoint ) {
		let stack = [];
		stack.push( { pos:startPoint, prev:null });
		function buildRoom(pos, prevLink = null) {
			if( roomCount >= MAX_ROOMS ) return;
			roomCount++;
			stack.shift();
			let room = layout[pos.row][pos.col];
			//room is now real
			room.isRoom = 1; 
			let linkCount = roomCount == 1 ? 1 : 0; //if inital room set to one
			if( roomCount == 1 ) {
				room.isSpawn = 1;
			}

			if(roomCount > 5 && !BossRoom ) {
				let chance = Math.round(Math.random());
				if(chance) {
					BossRoom = room;
				}
				if( roomCount == MAX_ROOMS ) {
					BossRoom = room;
				}  
			}

			//if not initial room set random number of links up to MAX_LINKS
			while(linkCount == 0 && roomCount < MAX_ROOMS) {
				linkCount = Math.round(Math.random() * MAX_LINKS);
				linkCount = roomCount + linkCount > MAX_ROOMS ? 0 : linkCount;
			}
			//roomCount += linkCount; //rooms created during this iteration
			//phase one getting tiles in available cardinal positions
			let cardinal = [];
			for(var row = pos.row-1; row < pos.row + 2; row++ ) {
				if(typeof layout[row] == 'undefined' || layout[row][pos.col].isRoom)
					continue;
				cardinal.push({row:row, col:pos.col});
			}
			for(var col = pos.col-1; col < pos.col+2; col++){
				if(typeof layout[col] == 'undefined' || layout[pos.row][col].isRoom)
					continue;
				cardinal.push({row:pos.row, col:col})
			}
			while(cardinal.length > linkCount) {
				let index = Math.round(Math.random() * cardinal.length)
				cardinal.splice(index,1);
			}
			//phase 4 link rooms
			if( prevLink ) room.links.push(prevLink);

			for(var i = 0; i < cardinal.length; i++ ) {
				stack.push({ pos:cardinal[i], prev:pos});
			}

			if(stack.length > 0 || roomCount < MAX_ROOMS) {
				buildRoom(stack[0].pos, stack[0].prev);
			}
		}

		//populate room
		function populate(pos){
			let room = layout[pos.row][pos.col];
			//populate with a possible artificat
			let snum = Math.round( Math.random() * artifacts.inRoom );
			if( snum > 0 && snum + artifacts.count <= artifacts.max ) {
				for(var i = 0; i < snum; i++ ) {
					let art = ( Math.random() * 6 ) + 1
					if(art > 0 ) {
						room.artifacts.push(art);
						artifacts.count++;
					} 
				}
			}
			//and potential NPC
			let spawnFriendly = Math.round(Math.random());
			if(spawnFriendly) {
				friendlies.count++;
				room.npc = {
					friendly: 1, type : Math.round(Math.random() * 3)
				}
			}
		}

		buildRoom(stack[0].pos, stack[0].prev);
	}

	startPos.row = Math.round(Math.random() * (GRID_SIZE - 1));
	startPos.col = Math.round(Math.random() * (GRID_SIZE - 1));

	buildRooms(startPos);

	function drawMap() {
		/*
		let cnv = document.getElementById('game');
		cnv.width = cnv.height = 500;
		let ctx = cnv.getContext('2d');
		for(var i = 0, row; row = layout[i]; i++ ) {
			for( var j = 0, col; col = row[j]; j++ ) {
				ctx.strokeStyle = 'black';
				ctx.strokeRect( j * 16, i * 16, 16, 16);
				if(layout[i][j].isRoom == 1 ) {
					ctx.fillStyle = 'rgba(0,0,0,0.5)';
					if(layout[i][j].isSpawn) {
						ctx.fillStyle = 'rgba(0,255,0,0.5)';
					}else if ( BossRoom == layout[i][j]){
						ctx.fillStyle = 'rgba(255,0,0,0.5)';
					}
					ctx.fillRect( j * 16, i * 16, 16, 16);
				}
			}
		}
		*/
	}

	return {
		drawMap: drawMap,
		get startPosition() { return startPos;}
	}

})();

var scale = 5;

var Game = (function(){
	var player = {
		map_pos : Map.startPosition,
	}

	var gObjects = {
		doors : [],
		arts : [],
		actors: [],
		vfx : []
	}


	var a = new Anthony();
	var d = new Door();
	gObjects.doors.push(d);
	gObjects.actors.push(a);


	let runID = 0;
	let then = Date.now();


	//adding mouse controls
	cnv.addEventListener('mousedown', function(e){
		let mpos = { 
			x : e.clientX - e.target.getBoundingClientRect().x,
			y : e.clientY - e.target.getBoundingClientRect().y
		}


		if(mpos.x > a.pos.x) {
			a.spd.x = 40;
		} 

	})

	function update(){
		now = Date.now();
		let dt = (now - then) * 0.001; 
		var bg = "#E4E4E4";
		cnv.fill(bg); // clear backgruond
		for(var i in gObjects) {
			gObjects[i].forEach(function(obj) {
				obj.update(dt);
				//drawing each object
				cnv.scale(scale);
				let crop = obj.show(obj.currentFrame);
				cnv.ctx.drawImage(obj.image,crop.x, crop.y, obj.width, obj.height,
				obj.pos.x, obj.pos.y, obj.width, obj.height);
				cnv.reset();
			})
		}
		then = now;
		runID = requestAnimationFrame(update);
	}

	update();
});