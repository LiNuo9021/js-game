var Cell = function(color, XY, engine, flag){
	this.color = color;

	this._engine = engine;
	
	

	if(flag !== undefined && flag === true){
		this.node = this.build();

		//TOFIX:每次点击一个色块，所有色块都开始执行handleEvent
		//this.node.add，传入的this就是this.node；window.add，就会调用所有handleEvent
		this.cellRemove = function(e){
			if(e.target.id === this.node.id){
				this._engine.curCell = this;
				this._engine.remove(this);
			}
		};
		this.node.addEventListener("click", this.cellRemove.bind(this));//用bind()把this传进去
	}

	this.XY = XY;

};

Object.defineProperty(Cell.prototype, "XY", {
	get: function() {//调用this.XY时，会调用此处的get方法
		return this._XY;
	},

	set: function(xy) {//this.XY=xxx时，会调用此处的set方法；因此，若写成this.XY=xy，则循环调用set方法了
		this._XY = xy;
		this._position();
	}
});

Cell.prototype._position = function(){
	this.node.style.left = 40 * this.XY.x + "px";
	this.node.style.bottom = 40 * this.XY.y + "px";
	
	return this;
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

	// this._position();
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
		// var tmpCell = this.clone();//必须clone，否则this会被改变

		// tmpCell.XY.add(coordinate[i]);
		
		// var sibling = this._engine.cell[tmpCell.XY];

		var x = this.XY.x;
		var y = this.XY.y;
		var tmpXY = new XY(this.XY.x, this.XY.y);//新建，防止this的x和y被改变
		tmpXY.add(coordinate[i]);
		var sibling = this._engine.cell[tmpXY];

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
			// console.log("找到了：" + sibling.XY);
		}
		else if(i < 3){//保证4个方向都找到
			// console.log("未找到，但循环没结束");
			continue;
		}
		else{
			// console.log("未找到，此次循环已结束");
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


Cell.color = ["#F1A40D", "#B1CA24", "#27AAEE", "#B14CE0", "#F04949"];

function isRemoving(sibling, cell){
	for(var j = 0; j < cell._engine.removingCell.length; j++){
	// for(var j in this._engine.removingCell){//Attention：会有random
		if(sibling === cell._engine.removingCell[j]){
			return false;
		}
	}
	return true;
}