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
		'images/BGradient.png','images/floor-space.png', 'images/spire.png'
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
