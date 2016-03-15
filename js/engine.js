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
};


//随机构建100个滑块，填充游戏区域
/*
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


Engine.prototype.randomCell = function(i , j){
	var cellColor = Cell.color.random();
			
	if(this.colorCount[cellColor] < 34){
		this.colorCount[cellColor] += 1;

		new Cell(cellColor, new XY(i,j)).build();

		return;
	}
	else{
		randomCell(i, j);
	}
}


Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
}