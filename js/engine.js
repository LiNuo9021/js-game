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
};


/*
	构建游戏区域
	规则：
		5种颜色都要有
		数量最少为8个，最多为32个
		总共100个
		坐标在[(0,0),(9,9)]
		有滑块占用一个坐标了，则其他滑块不能再占用此坐标

*/
Engine.prototype.buildArea = function(){

	for(var i = 0; i < 10; i++){
		var lastColor = null;
		for(var j = 9; j >= 0; j--){
			lastColor = this.generateCell(i, j, lastColor);
		}
	}
};


/*
	随机生成不同颜色滑块
	规则：最多35个；
*/
Engine.prototype.generateCell = function(i, j, lastColor){

	var width = [1,1,1,1,1];

	if(lastColor !== null){
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
	删除色块群
	规则：
		点击一个色块，本色块被删除，与之上下左右相邻的同色色块被删除；与被删除色块的上下左右相邻的同色色块也被删除
		当某一列的色块被消除后，其上方所有色块下移
		当某一列的色块全被消除后，其右侧所有色块左移
		当没有相邻的同色色块时，游戏结束
*/
Engine.prototype.remove = function(cell){

	//点击色块的相邻色块，是否有同色的，如果有，记录，再继续查找被记录的色块的相邻同色色块；直到没有了，开始删除所有被记录色块
	this.removingCell = new Array();
	this.removingCell.push(cell);

	/*
		找到相邻色块
			通过left/bottom
			二维数组/对象，存储所有色块
				(2,3)-->(1,3),(3,3),(2,1),(2,4)
	*/
	cell.around();

	//循环删除所有色块
	if(this.removingCell.length > 1){
		this.removingCell.forEach(function(cell){
			cell.remove();
			delete this.cell[cell.XY];
		},this);
	
		// console.log("removingCell: ");
		// console.log(this.removingCell);

		//显示分数
		this.score += this.removingCell.length * this.removingCell.length;
		document.querySelector("#myScore").innerHTML = this.score;

		/*
			TOFIX：这里可以再抽象，代码太乱

			被删除色块的上方色块下移
			规则：被删除色块的列中，所有悬空的色块，都下降，直至没有悬空的色块为止
		*/
		var dropCellObj = this.getDropCell(this.removingCell);
		var dropCellCoor = dropCellObj["dropCellCoor"];
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
						var gravity = new XY(0, (j - minY - 1));
						tmpXY.minus(gravity);
						
						this.cell[x + "," + j].XY = tmpXY;//改变了属性值，还要改变属性名
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
	}

};

/*
	使空列右侧的列整体左移
	步骤
		num: 空列数量，即左移数量
		max: 最大空列横坐标，大于横坐标的都是要左移的列
		左移的列的横坐标－空列数量
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
Engine.prototype.getDropCell = function(removingCell){
	var dropCellCoor = new Object();
	var dropCellCount = new Object();

	for(var i = 0; i < removingCell.length; i++){
		var x = removingCell[i].XY.x;
		var y = removingCell[i].XY.y;

		//不在数组中，则保留
		if(dropCellCoor[x] === undefined){
			dropCellCoor[x] = y;
			dropCellCount[x] = 0;
		}
		//在数组中，则判断y是否最大
		else{
			dropCellCoor[x] = (dropCellCoor[x] < y ? y : dropCellCoor[x]);
		}
		//无论是否在，该列的个数都加1
		dropCellCount[x] += 1;
	}

	var result = {
		"dropCellCoor": dropCellCoor,
		"dropCellCount": dropCellCount
	};

	return result;
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



