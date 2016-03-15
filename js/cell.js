var Cell = function(color, XY, engine){
	this.color = color;
	this.XY = XY;
	this.node = this.build();

	window.addEventListener("click", this);

	this._engine = engine;
};

Cell.prototype.build = function(){
	var node = document.createElement("div");

	node.id = Math.random();

	node.classList.add("cell");

	node.style.background = this.color;
	node.style.width = "40px";
	node.style.height = "40px";

	node.style.left = 40 * this.XY.y + "px";
	node.style.bottom = 40 * this.XY.x + "px";

	document.querySelector(".area").appendChild(node);

	return node;
};

Cell.prototype.handleEvent = function(){
	
	this._engine.remove(this.node.id);

	// console.log("click cell");
	// document.querySelector(".area").removeChild(this.node);	
};

Cell.color = ["#F3C36A", "#26CA26", "#4D73EB", "#D886D8", "red"];