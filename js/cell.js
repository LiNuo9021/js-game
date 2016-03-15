var Cell = function(color, XY){
	this.color = color;
	this.XY = XY;
	this.node = null;
};

Cell.prototype.build = function(){
	this.node = document.createElement("div");

	this.node.classList.add("cell");

	this.node.style.background = this.color;
	this.node.style.width = "40px";
	this.node.style.height = "40px";

	this.node.style.left = 40 * this.XY.y + "px";
	this.node.style.bottom = 40 * this.XY.x + "px";

	document.querySelector(".area").appendChild(this.node);
};