var Cell = function(color, XY, engine){
	this.color = color;
	this.XY = XY;

	this._engine = engine;
	
	this.node = this.build();
	window.addEventListener("click", this);//怀疑所有的对象、所有的动作都会走handleEvent

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

	this._engine.area.appendChild(node);

	return node;
};

Cell.prototype.remove = function(cell){
	this._engine.area.removeChild(cell);
};

Cell.prototype.handleEvent = function(e){
	
	if(e.target.id === this.node.id){
		this._engine.remove(this.node);
	}
};

Cell.color = ["#F3C36A", "#26CA26", "#4D73EB", "#D886D8", "red"];

