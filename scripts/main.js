var canvas;
var canvasContext;
var debugMode = false;
var gameRunning;
var debugRunning;

//not a great place for railThickness + Collider, we just don't have a file for them yet. 
var railThickness = 30;
const RAIL_COLLIDER = 15;


var shotPredictionCheat = true;

var shooting = false;
let scoreManager = new ScoreManager();

var puckOne = new Puck();
var activePlayer = 1;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	initInput();
	initBoard();

	var framesPerSecond = 30;
	gameRunning = setInterval(function() {
		moveEverything();
		drawEverything();	
	}, 1000/framesPerSecond);
}

function toggleDebugMode(){
  var framesPerSecond = 30;

	if (!debugMode) {
		debugMode = true;
		console.log("Entering Debug Mode! Press D again to resume.");
	    gameRunning = clearInterval(gameRunning); 
		debugRunning = setInterval(function () {
			puckOne.reset();
			drawBackground();
			puckOne.x = input.mouse.x;
			puckOne.y = input.mouse.y;
			puckOne.draw();
	    }, 1000 / framesPerSecond);
	} else if (debugMode) {
		debugMode = false;
		console.log("Turning off Debug mode!");
	    debugRunning = clearInterval(debugRunning); 
	    gameRunning = setInterval(function () {
			moveEverything();
			drawEverything();	
	    }, 1000 / framesPerSecond);
	}
}

function resetGame() {
	scoreManager.reset();
	puckOne.puckReset();
}

function moveEverything() {
	input.update()

	if (activePlayer === 1) playerControl();
	else if (activePlayer === 2){
		//playerControl();
		aiControl();
	} 

	puckOne.move();
}

function drawEverything() {
	drawBackground();
	puckOne.draw();
	drawUI();
	input.touch.draw();
}

function drawBackground() {
	canvasContext.globalAlpha = 0.10;
	colorRect(0,0,canvas.width,canvas.height,bgColor);
	canvasContext.globalAlpha = 1.0;

	drawNet();
	
	drawBoard();
}

function drawNet() {
	const stripeWidth = canvas.width/100;
	const spacing = canvas.height/10;
	const stripeHeight = spacing/2;

	for(var i=stripeHeight/2; i<canvas.height; i+=spacing) {
		colorRect(canvas.width/2-stripeWidth/2, i, stripeWidth, stripeHeight,'white');
	}
	strokeCircle(canvas.width/2, canvas.height/2, 140, 'white');
}

function drawUI() {
	if(scoreManager.winner) {
		canvasContext.fillStyle = 'white';

		let winName = scoreManager.winner === 1 ? 'Left Player' : 'Right Player';
		canvasContext.fillText(winName + ' Won', 350, 200);

		canvasContext.fillText("click to continue", 350, 500);
		return;
	}

	canvasContext.save()
	canvasContext.font = '160px Arial';
	canvasContext.textAlign = 'center';
	canvasContext.fillStyle = activePlayer === 1 ? 'white' : blue;
	canvasContext.fillText(scoreManager.scores[0], 120, 200, 300);
	canvasContext.fillStyle = activePlayer === 2 ? 'white' : blue;
	canvasContext.fillText(scoreManager.scores[1], canvas.width-120, 200);
	canvasContext.restore();

	canvasContext.fillText("first attempt at moving the puck(puck) based on striking", 350, 480);
	canvasContext.fillText("try holding the left mouse button down, dragging the mouse then releasing!", 350, 500);
	canvasContext.fillText("does not account for collision with puck, works literally anywhere on screen", 350, 520);	
}