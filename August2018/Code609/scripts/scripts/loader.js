var cnv = null;
var onstart = null;

window.onload = function(e){
	cnv = document.getElementById('game');
	cnv.ctx = cnv.getContext('2d');
	cnv.fill=function(color){
		cnv.ctx.fillStyle = color; cnv.ctx.fillRect(0,0,cnv.width,cnv.height);
	}
	cnv.scale = function(num) {
		cnv.ctx.save(); cnv.ctx.scale(num,num);
		cnv.ctx.imageSmoothingEnabled = false;
	}
	cnv.reset = function() {
		cnv.ctx.restore();
	}
	cnv.width = 1600; 
	cnv.height = 380;

	var g = new Game()
}

console.log("hello");


(function(){
	this.GameAssets = {};
	function checkLoaded(){
		for(var i in GameAssets) {
			if(GameAssets[i] == null)
				return
		}
		startGame();
	}
	let assets = [
		'images/Anthony.png','images/Doors.png', 'images/sentinel.png'
	]
	//queue assets
	assets.forEach(function(url) {
		this.GameAssets[url] = null;
	})
	//loading assets
	assets.forEach(function(url) {
		if(url.indexOf('image') != -1) {
			let img = new Image();
			img.onload = function(){
				GameAssets[url] = img;
				checkLoaded();
			}
			img.src = url;
		}
	});
})();
