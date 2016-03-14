var Cell = function(color, XY){
	this.color = color;
	this.XY = XY;
	this.node = null;
};

Cell.prototype.build = function(){
	this.node = document.createElement("div");

	this.node.classList.add("cell");

	this.node.style.background = this.color;
	this.node.style.width = "10px";
	this.node.style.height = "10px";

	this.node.style.left = 10 * this.XY.y + "px";
	this.node.style.bottom = 10 * this.XY.x + "px";

	document.querySelector("body").appendChild(this.node);
};