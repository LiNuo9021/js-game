var Cell = function(color, XY, engine, flag){
	this.color = color;
	this.XY = XY;

	this._engine = engine;
	
	if(flag !== undefined && flag === true){
		this.node = this.build();

		//TOFIX:每次点击一个色块，所有色块都开始执行handleEvent
		//this.node.add，传入的this就是this.node；window.add，就会调用所有handleEvent
		this.cellRemove = function(e){
			console.log(this.node.id);
			if(e.target.id === this.node.id){
				this._engine.curCell = this;
				this._engine.remove(this);
			}
		};
		this.node.addEventListener("click", this.cellRemove.bind(this));//用bind()把this传进去
	}
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
	var tmpXY = new XY(this.XY.x, this.XY.y);//必须克隆，否则改变的都是同一个XY对象
	// var tmpEngine = new Engine();
	return new Cell(this.color, tmpXY, this._engine);
};

/*
	搜索当前色块相邻的所有同色色块
*/
Cell.prototype.around = function(removingCell){
	

	var coordinate = [new XY(1,0),new XY(-1,0),new XY(0,-1),new XY(0,1)];

	for(var i = 0; i < coordinate.length; i++){
		var tmpCell = this.clone();//必须clone，否则this会被改变

		tmpCell.XY.add(coordinate[i]);
		
		var sibling = this._engine.cell[tmpCell.XY];

		/*
			不能为空（边缘）
			不能是点击的色块
			不能是已加入数组的
			不能是颜色不同的
		*/
		if(sibling !== undefined && sibling !== this._engine.curCell 
								 && sibling.color === this.color 
								 && isRemoving(sibling, this)){
			this._engine.removingCell.push(sibling);
			sibling.around();
			console.log("找到了：" + sibling.XY);
		}
		else if(i < 3){//保证4个方向都找到
			console.log("未找到，但循环没结束");
			continue;
		}
		else{
			console.log("未找到，此次循环已结束");
			return;
		}
	}
};

/*
	点击色块事件
*/
Cell.prototype.handleEvent = function(e){
	
	if(e.target.id === this.node.id){
		this._engine.curCell = this;
		this._engine.remove(this);
	}
};


Cell.color = ["#F3C36A", "#26CA26", "#4D73EB", "#D886D8", "red"];

function isRemoving(sibling, cell){
	for(var j = 0; j < cell._engine.removingCell.length; j++){
	// for(var j in this._engine.removingCell){//Attention：会有random
		if(sibling === cell._engine.removingCell[j]){
			return false;
		}
	}
	return true;
}