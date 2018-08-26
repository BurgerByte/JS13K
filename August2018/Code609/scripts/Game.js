function startGame() {
	Map.drawMap()
}

var Map = (function(){
	const SIZE = 15;
	const MAX_ROOM_SIZE = 2;
	const MAX_ROOMS = 12;
	var gridCount = MAX_ROOMS;
	let layout = [];
	while(layout.length < SIZE) { layout.push([])}
	//populate layout full of empty rooms
	layout.forEach(function(col){
		while(col.length < 15) 
			col.push({isRoom: 0, links:[]});
	});
	startPos = { col: Math.floor(Math.random() * (SIZE - 0.1)), row : Math.floor( Math.random() * (SIZE-0.1)) }
	//generate rooms from start positions
	function buildRoom(pos, linkedPos = null ) {
		console.log(Date.now());
		let room = layout[pos.col][pos.row];
		room.isRoom = 1;
		//if starting rooom, room size is always one else varies between one or two
		let rs = gridCount == MAX_ROOMS ?  1 : Math.floor(((MAX_ROOM_SIZE - 0.01) * Math.random())) + 1;
		rs = gridCount - rs >= 0 ? rs : 0;
		//getting grid values in cardinal directions
		let top = pos.row - 1 > 0 ? pos.row - 1 : 0;
		let btm = pos.row + 1 < SIZE - 1 ? pos.row + 1 : SIZE - 1;
		let lft = pos.col - 1 > 0 ? pos.col - 1 : 0;
		let rgt = pos.col + 1 < SIZE - 1 ? pos.row + 1 : SIZE - 1; 
		let cardinals = {};
		cardinals.top = layout[top][pos.row];
		cardinals.lft = layout[pos.col][lft];
		cardinals.rgt = layout[pos.col][rgt];
		cardinals.btm = layout[btm][pos.row];
		//creating an linking to other rooms
		function nextRoom(){

			let selection =-1;
			while( selection =-1 ) {
				let choice = Math.floor(Math.random() * 3.99);
				//try to go upwards
				if(choice == 0 && cardinals.top.isRoom == 0) {
					return { row : top, col : pos.col };
				} 
				//try to go leftward
				if( choice == 1 && cardinals.lft.isRoom == 0 ) {
					return { row : pos.row, col: lft }
				}
				//try to go rightward 
				if( choice == 2 && cardinals.rgt.isRoom == 0) {
					return { row : pos.row, col: rgt }
				}
				if( choice == 3 && cardinals.btm.isRoom == 0 ) {
					return { row : btm, col: pos.col }
				}
			}
		}
		for(var i = 0; i < rs; i++ ) {
			gridCount--;
			let node = nextRoom();
			room.links.push(node);
			buildRoom(node);

		}

	}

	buildRoom(startPos);

	function drawMap() {
		let cnv = document.getElementById('game');
		cnv.width = cnv.height = 500;
		let ctx = cnv.getContext('2d');
		for(var i = 0, row; row = layout[i]; i++ ) {
			for( var j = 0, col; col = row[j]; j++ ) {
				ctx.strokeStyle = 'white';
				ctx.strokeRect( j * 16, i * 16, 16, 16);
				if(layout[i][j].isRoom == 1 ) {
					ctx.fillStyle = 'rgba(255,255,255,0.5)';
					ctx.fillRect( j * 16, i * 16, 16, 16);
				}
			}
		}
	}

	return { 
		layout : layout,
		drawMap : drawMap
	}

})();

