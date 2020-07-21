var bgColor = '#713784';
var blue = '#6dcff6';
var yellow = '#fff799';
var orange = '#f5989d';
var purple = '#662e78';
var railColor = orange;

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

function colorRect(leftX,topY, width,height, drawColor, rotation) {
	canvasContext.save();
	canvasContext.translate(leftX + (width /2), topY + (height/2));
	canvasContext.rotate(rotation); 
	canvasContext.translate(-(leftX + (width /2)), -(topY + (height/2)));
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
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