var Engine = function(){
	this.status = "";
	this.score = 0;

	this.area = document.querySelector(".area");

	this.colorCount = {
		"#F3C36A": 0,
		"#26CA26": 0,
		"#4D73EB": 0,
		"#D886D8": 0,
		"red": 0
	};

	this.cell = {};//"1,2":cell
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
		for(var j = 0; j < 10; j++){
			this.randomCell(i , j);
		}
	}
};


//随机生成不同颜色滑块，最多34个
//TODO:最少8个
Engine.prototype.randomCell = function(i , j){
	var cellColor = Cell.color.random();
			
	if(this.colorCount[cellColor] < 34){
		this.colorCount[cellColor] += 1;
		this.cell[i + "," + j] = new Cell(cellColor, new XY(i,j), this);
		return;
	}
	else{
		randomCell(i, j);
	}
}

/*
	删除色块群
	规则：
		点击一个色块，本色块被删除，与之上下左右相邻的同色色块被删除；与被删除色块的上下左右相邻的同色色块也被删除
		当某一行的色块全被消除后，其右侧所有色块左移
		当某一列的色块被消除后，其上方所有色块下移
		当没有相邻的同色色块时，游戏结束
*/
Engine.prototype.remove = function(cell){

	//点击色块的相邻色块，是否有同色的，如果有，记录，再继续查找被记录的色块的相邻同色色块；直到没有了，开始删除所有被记录色块
	var removingCell = new Array();
	removingCell.push(cell);

	/*
		找到相邻色块
			通过left/bottom
			二维数组/对象，存储所有色块
				(2,3)-->(1,3),(3,3),(2,1),(2,4)
	*/
	// console.log(this.cell[cell.XY.x+","+cell.XY.y])

	cell.around();
	console.log(cell.cellAround);

	// console.log(this.cell[(cell.XY.x+1)+","+(cell.XY.y)].XY);
	// console.log(this.cell[(cell.XY.x-1)+","+(cell.XY.y)].XY);
	// console.log(this.cell[(cell.XY.x)+","+(cell.XY.y+1)].XY);
	// console.log(this.cell[(cell.XY.x)+","+(cell.XY.y-1)].XY);


	removingCell.forEach(function(cell){
		cell.remove();
	},this);
};




Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
}