function startGame() {
	Map.drawMap()
}

var Map = (function(){
	const GRID_SIZE = 8;
	const MAX_ROOMS = 12;
	const MAX_LINKS = 3;
	var roomCount = 0;
	var layout = [];
	while(layout.length < GRID_SIZE) { layout.push([]) }
	layout.forEach(function(row){
		while( row.length < GRID_SIZE ){
			row.push( { isRoom: 0, links :[]})
		}
	});

	//recurssive function
	function buildRooms( startPoint ) {
		let stack = [];
		stack.push( { pos:startPoint, prev:null });
		function buildRoom(pos, prevLink = null) {
			if( roomCount >= MAX_ROOMS ) return;
			stack.shift();
			let room = layout[pos.row][pos.col];
			//room is now real
			room.isRoom = 1; 
			let linkCount = roomCount == 1 ? 1 : 0; //if inital room set to one
			//if not initial room set random number of links up to MAX_LINKS
			let itm = 0
			while(linkCount == 0 && roomCount < MAX_ROOMS) {
				linkCount = Math.round(Math.random() * MAX_LINKS);
				linkCount = roomCount + linkCount > MAX_ROOMS ? 0 : linkCount;
			}
			roomCount += linkCount; //rooms created during this iteration
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
		buildRoom(stack[0].pos, stack[0].prev);
		roomCount++;
	}

	startPos = {
		row : Math.round(Math.random() * (GRID_SIZE - 1)), 
		col: Math.round(Math.random() * (GRID_SIZE - 1))
	}
	buildRooms(startPos);
	console.log(layout)

	function drawMap() {
		let cnv = document.getElementById('game');
		cnv.width = cnv.height = 500;
		let ctx = cnv.getContext('2d');
		for(var i = 0, row; row = layout[i]; i++ ) {
			for( var j = 0, col; col = row[j]; j++ ) {
				ctx.strokeStyle = 'black';
				ctx.strokeRect( j * 16, i * 16, 16, 16);
				if(layout[i][j].isRoom == 1 ) {
					ctx.fillStyle = 'rgba(0,0,0,0.5)';
					ctx.fillRect( j * 16, i * 16, 16, 16);
				}
			}
		}
	}

	return {
		drawMap: drawMap
	}

})();

