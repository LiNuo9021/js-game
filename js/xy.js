var XY = function(x, y){
	this.x = x;
	this.y = y;
};

XY.prototype.add = function(x, y){
	this.x += x;
	this.y += y;
};
