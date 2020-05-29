var bgColor = '#713784';
var blue = '#6dcff6';
var railColor = '#f5989d';

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
	canvasContext.fill();
}

function strokeCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
	canvasContext.lineWidth = 5;
	canvasContext.strokeStyle = 'white';
	canvasContext.stroke();
}

function colorRect(leftX,topY, width,height, drawColor, rotation=0) {
	canvasContext.save();
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
	canvasContext.rotate(45);
	canvasContext.restore();
}

function colorLine(startX, startY, endX, endY, width, color) {
	canvasContext.strokeStyle = color;
	canvasContext.lineWidth = width;
	canvasContext.beginPath();
	canvasContext.moveTo(startX, startY);
	canvasContext.lineTo(endX, endY);
	canvasContext.stroke();
}