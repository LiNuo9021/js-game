var Cell = function(color, XY, engine){
	this.color = color;
	this.XY = XY;

	this._engine = engine;
	
	this.node = this.build();
	window.addEventListener("click", this);//怀疑所有的对象、所有的动作都会走handleEvent

	this.cellAround = new Array();
};

/*
	构建一个色块
*/
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

/*
	删除一个色块
*/
Cell.prototype.remove = function(){
	this._engine.area.removeChild(this.node);
};

/*
	用于构建临时对象
*/
Cell.prototype.clone = function(){
	
};

/*
	搜索色块相邻的所有同色色块
*/
Cell.prototype.around = function(){
	
	var coordinate = [new XY(1,0),new XY(-1,0),new XY(0,1),new XY(0,-1)];


	for(var i = 0; i < coordinate.length; i++){
		var tmpCell = this;
		tmpCell.XY.add(coordinate[i]);
		console.log(tmpCell.XY);

		// var sibling = this._engine.cell[(this.XY.x+1)+","+(this.XY.y)];

		// if(sibling !== undefined && sibling.color === this.color){
		// 	this.cellAround.push(sibling);
		// 	sibling.around();
		// }
		// else{
		// 	return;
		// }
	}
};

/*
	点击色块事件
*/
Cell.prototype.handleEvent = function(e){
	
	if(e.target.id === this.node.id){
		this._engine.remove(this);
	}
};

Cell.color = ["#F3C36A", "#26CA26", "#4D73EB", "#D886D8", "red"];

