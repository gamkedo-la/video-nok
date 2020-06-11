var canvas;
var canvasContext;
var debugMode = false;

var shooting = false;
let scoreManager = new ScoreManager();

var puckOne = new Puck();
var activePlayer = 1;

var faceOff = false;

const state = {
	game: 0,
	gameover: 1
};

let gameState = state.game;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	initInput();
	initBoard();

	var framesPerSecond = 30;
	setInterval(main, 1000/framesPerSecond);
}

function main() {
	input.update();
	moveEverything();
	drawEverything();
	if (debugMode) debug();
}

function toggleDebugMode(){
	debugMode = !debugMode;
	console.log('Debug mode '+debugMode);
}

function debug() {
    if (input.mouse.mouseClicked(2) || input.touch.currentTouches.length + input.touch.endedTouches.length > 1) {
        puckOne.x = input.pointer.x;
        puckOne.y = input.pointer.y;
        puckOne.velX = puckOne.velY = 0;
        return;
	}
	
	if (puckOne.shotVector) {
		puckOne.shotPrediction(false, false);
	}

	//some guidelines for AI testing, will remove
	colorRect(0, 200, canvas.width, 1, 'white');
	colorRect(200, 0, 1, canvas.width, 'white');
	colorRect(canvas.width - 200, 0, 1, canvas.width, 'white');
	colorRect(canvas.width/2, 0, 1, canvas.width, 'white');
}

function resetGame() {
	scoreManager.reset();
	puckOne.reset();
}

function moveEverything() {
	if ( scoreManager.winner ) {
		gameState = state.gameover;
	}

	if (puckOne.inPlay);
	else if (activePlayer === 1) {
		//console.log('player control conditional is being called');
		playerControl();
	}
	else if (activePlayer === 2) {
		aiControl(); 
	}
	
	updateAnimations();
	puckOne.move();
	//console.log(puckOne.velocity);
}

function drawEverything() {
	
	if ( gameState == state.gameover ) {
		drawGameOver();
	}
	if ( gameState == state.game ) {
		
		drawBackground();
		puckOne.draw();
		drawUI();
		input.touch.draw();
		//horizontal lines
		/*
		colorRect(0, 200, canvas.width, 1, 'white');
		colorRect(0, 100, canvas.width, 1, 'white');
		colorRect(0, canvas.height-100, canvas.width, 1, 'white');
		
		colorRect(0, canvas.height - 200, canvas.width, 1, 'white');
		colorRect(300, 0, 1, canvas.width, 'white');
		colorRect(canvas.width/2, 0, 1, canvas.width, 'white');
		colorRect(canvas.width - 200, 0, 1, canvas.width, 'white');
		*/
		if(faceOff){
			canvasContext.fillStyle = 'white';
			canvasContext.font = '160px Arial';
			canvasContext.textAlign = 'center';
			canvasContext.fillText("FACE OFF", canvas.width/2, canvas.height/2 + 200);
		}
	}
}

function drawBackground() {
	//canvasContext.globalAlpha = 0.10;
	colorRect(0,0,canvas.width,canvas.height,bgColor);
	canvasContext.globalAlpha = 1.0;

	drawNet();
	
	drawBoard();
}

function drawGameOver() {
	colorRect(0,0, canvas.width, canvas.height, 'Black');
	canvasContext.fillStyle = 'white';
	const winName = scoreManager.winner === 1 ? 'Left Player' : 'Right Player';
	canvasContext.fillText(winName + ' Won', 350, 200);

	canvasContext.fillText("click to continue", 350, 500);
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
	canvasContext.save()
	canvasContext.font = '160px Arial';
	canvasContext.textAlign = 'center';
	canvasContext.fillStyle = activePlayer === 1 ? 'white' : blue;
	canvasContext.fillText(scoreManager.scores[0], 120, 200, 300);
	canvasContext.fillStyle = activePlayer === 2 ? 'white' : blue;
	canvasContext.fillText(scoreManager.scores[1], canvas.width-120, 200);
	canvasContext.restore();
}