var blue = '#6dcff6';
var yellow = '#fff799';
var orange = '#f5989d';
var purple = '#713784';
var purpleLighter = '#954699';
var bgColor = purple;
var railColor = orange;

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
	canvasContext.fill();
}

function strokeCircle(centerX, centerY, radius, drawColor) {
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
	canvasContext.lineWidth = 5;
	canvasContext.strokeStyle = drawColor;
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

function colorDiamond(centerX,centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.moveTo(centerX - radius, centerY);
	canvasContext.lineTo(centerX, centerY - radius);
	canvasContext.lineTo(centerX + radius, centerY);
	canvasContext.lineTo(centerX, centerY + radius);
	canvasContext.fill();
}

//to be moved into math or goalie.js, write a function to get the lines of the diamon, use the guts of colorDiamond bc that info is basically there
//call it diamondVertices it returns an array, 0 is a, 1, b, 2 is c, 3 is d, 
//var dVerts[...]
/*for(do 4 times){
	//segmentO(dVerts[0].x, dVerts[0].y, dVerts[1].x, dVerts[1].y)
}
*/


function colorLine(startX, startY, endX, endY, width, color) {
	canvasContext.strokeStyle = color;
	canvasContext.lineWidth = width;
	canvasContext.beginPath();
	canvasContext.moveTo(startX, startY);
	canvasContext.lineTo(endX, endY);
	canvasContext.stroke();
}