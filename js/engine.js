var Engine = function(){
	this.status = "";
	this.score = 0;

	this.area = document.querySelector(".area");

	this.colorCount = {
		"#F1A40D": 0,
		"#B1CA24": 0,
		"#27AAEE": 0,
		"#B14CE0": 0,
		"#F04949": 0
	};

	this.cell = {};//"1,2":cell

	this.curCell = null;

	this.removingCell = null;

	this._interval = null;

	this.desXY = null;
};


/*
	构建游戏区域
*/
Engine.prototype.buildArea = function(){
	for(var i = 0; i < 10; i++){
		var lastColor = null;//用于权重
		for(var j = 9; j >= 0; j--){
			lastColor = this.generateCell(i, j, lastColor);
		}
	}
};


/*
	随机生成不同颜色色块
*/
Engine.prototype.generateCell = function(i, j, lastColor){

	var width = [1,1,1,1,1];

	if(lastColor !== undefined && lastColor !== null){
		for(var z = 0; z < Cell.color.length; z++){
			if(Cell.color[z] === lastColor){
				width[z] = 10;//在这里调整权重
				break;
			}
		}
	}

	var cellColor = rand(Cell.color, width);
	
	//最多35个		
	if(this.colorCount[cellColor] > 35){
		this.generateCell(i, j);
	}
	else{
		this.colorCount[cellColor] += 1;
		this.cell[i + "," + j] = new Cell(cellColor, new XY(i,j), this, true);
		return cellColor;
	}
}

/*
	更新分数
*/
Engine.prototype._score = function(){
	this.score += this.removingCell.length * this.removingCell.length;
	document.querySelector("#myScore").innerHTML = this.score;
};

/*
	删除色块群
*/
Engine.prototype.remove = function(cell){

	this.removingCell = new Array();
	this.removingCell.push(cell);

	cell.around();

	if(this.removingCell.length > 1){
		this.removingCell.forEach(function(cell){
			cell.remove();
			delete this.cell[cell.XY];
		},this);

		this.move();

		this._score();		
	}
};

/*
	删除后，色块移动
*/
Engine.prototype.move = function(){
	var dropCellCoor = this.getDropCell();
	var dropCellx = Object.keys(dropCellCoor);
	var emptyCol = new Array();

	for(var i = 0; i < dropCellx.length; i++){
		var x = dropCellx[i];
		var minY = -1;
		var emptyNum = 0;

		for(var j = 0; j < 10; j++){
			var stillCell = this.cell[x + "," + j];

			//剩余色块
			if(stillCell !== undefined){
				//第一个
				if(j === 0){
					minY = j;
					continue;
				}
				//如果比上一个的坐标只高1，则说明没有空余，什么都不做
				else if(j === (minY + 1)){
					minY = j;
					continue
				}
				else{
					var tmpXY = stillCell.XY;
					this.desXY = new XY(x, (minY+1));
					
					// tmpXY.minus(gravity);
					this.down(x, j);
					// this.cell[x + "," + j].XY = tmpXY;//改变了属性值，还要改变属性名
					this.cell[tmpXY.x + "," + tmpXY.y] = this.cell[x + "," + j];
				
					delete this.cell[x + "," + j];

					//重置minY
					minY = tmpXY.y;
				}
			}
			//如果本列没有剩余色块，则其右侧色块要全部左移
			else{
				emptyNum++;
			}

			//整列都被删除	
			if(emptyNum === 10){
				emptyCol.push(x);
			}
		}
	}

	this.left(emptyCol);
};

Engine.prototype.down = function(x, j){

	var oriXY = this.cell[x + "," + j].XY;

	if(this.desXY.y === oriXY.y){
		clearTimeout(this._interval);
		return;
	}
	var gravity = new XY(0,1);
	oriXY.minus(gravity); 
	this.cell[x + "," + j].XY = oriXY;

	this._interval = setTimeout(this.down.bind(this), 500);//没有立即执行


	// this.cell[x + "," + j].XY = tmpXY;
};

// function loop(e){
//    setTimeout(function(e2){
//    		console.log(this);
//       // loop();

//   }.bind(e), 1000);
// }

/*
	使空列右侧的列整体左移
	num: 空列数量，即左移数量
	max: 最大空列横坐标，大于横坐标的都是要左移的列
*/
Engine.prototype.left = function(emptyCol){
	var num = (emptyCol !== undefined ? emptyCol.length : 0);
	var max = (emptyCol !== undefined ? parseInt(emptyCol[0]) : 0);

	if(emptyCol.length > 0){
		for(var i = 0; i < emptyCol.length; i++){
			if(max < parseInt(emptyCol[i])){
				max = parseInt(emptyCol[i]);
			}
		}
		
		var left = new XY(num,0);
		for(var x = (max+1); x < 10; x++){
			for(var y = 0; y < 10; y++){
				var originCell = this.cell[x + "," + y];
				if(originCell !== undefined){
					var newCellXY = new XY(originCell.XY.x, originCell.XY.y);
					newCellXY.minus(left);
					originCell.XY = newCellXY;
					this.cell[newCellXY.x + "," + newCellXY.y] = originCell;
					delete this.cell[x + "," + y];
				}
			}
		}
	}
};


/*
	返回应该下降的色块
*/
Engine.prototype.getDropCell = function(){
	var dropCellCoor = new Object();

	for(var i = 0; i < this.removingCell.length; i++){
		var x = this.removingCell[i].XY.x;
		var y = this.removingCell[i].XY.y;

		//不在数组中，则保留
		if(dropCellCoor[x] === undefined){
			dropCellCoor[x] = y;
		}
		//在数组中，则判断y是否最大
		else{
			dropCellCoor[x] = (dropCellCoor[x] < y ? y : dropCellCoor[x]);
		}
	}

	return dropCellCoor;
};


Array.prototype.random = function() {
	//Math.random()返回(0,1)之间的某个小数
	//Math.floor()返回小数的整数部分
	return this[Math.floor(Math.random() * this.length)];
}


/*
	根据权重随机返回数组元素
	ele: ["red", "green", "blue", "yellow"]
	width: [0.1,0.2,0.5,0.2]
*/
function rand(ele,width){
	var result = new Array();

	for(var i = 0; i < ele.length; i++){
		var num = width[i] * 10;
	
		for(var j = 0; j < num; j++){
			result.push(ele[i]);
		}
	}

	return result.random();
}



