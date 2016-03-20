var XY = function(x, y){
	this.x = x;
	this.y = y;
};

XY.prototype.add = function(XY){
	this.x += XY.x;
	this.y += XY.y;
};

XY.prototype.minus = function(XY){
	this.x -= XY.x;
	this.y -= XY.y;
};

XY.prototype.toString = function(){
	return this.x + "," + this.y;
};

XY.prototype.clone = function() {
	return new XY(this.x, this.y);
}