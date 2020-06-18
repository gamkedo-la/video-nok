var canvas, canvasContext;
var debugMode = false;

var shooting = false;
let scoreManager = new ScoreManager();

var puckOne = new Puck();
var activePlayer = 1;

var faceOffActive = true; //defaults to true because that's how the game would normally start. 
var AIFaceOffCountDown = 100;
var player1lostFaceOff = false;

const state = {
	menu: 0,
	game: 1,
	gameover: 2,
	credits: 3
};

let gameState = state.menu;
let playerControllers = [aiControl, aiControl];

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	initAudio();
	initInput();
	initBoard();

	var framesPerSecond = 30;
	setInterval(main, 1000/framesPerSecond);
}

function faceOff(){
	//start writing the function body here if that's easier
	if(AIFaceOffCountDown > 0) {
		AIFaceOffCountDown-- //fillText it!
		playerControllers[0](); //calls playerControl before AI takes its shot
	} else {
		player1lostFaceOff = true;
		shooting = false; //causes shotVector to be set to null, which throws an error in animation.js
		aiControl();
	}
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

function newGame(playerCount) {
	let controllers = playerControllers.length;
	for (let i = 0; i < controllers; i++) {
		if (i + 1<= playerCount) {
			playerControllers[i] = playerControl;
		} else playerControllers[i] = aiControl;
	}
	resetGame();
}

function resetGame() {
	gameState = state.game;
	scoreManager.reset();
	puckOne.reset();
}

function moveEverything() {
	if (gameState === state.menu) {
		ui.control();
	} else if (gameState === state.game) {
		if (puckOne.inPlay);
		if(faceOffActive){
			faceOff();				
		}
		else playerControllers[activePlayer - 1](); //notes 4 Ash =^-_-^= : this array contains calls to aiControl
		updateAnimations();
		puckOne.move();
		if (scoreManager.winner) {
			gameState = state.gameover;
		}
	} else if (gameState === state.gameover && input.clicked()) {
		gameState = state.menu;
	} else if (gameState === state.credits && input.clicked()) {
		gameState = state.menu;
	}
}

function drawEverything() {
	drawBackground();
	if (gameState === state.menu) {
		ui.draw();
	} else if (gameState === state.game) {
		puckOne.draw();
		drawUI();
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
		if(faceOffActive){
			var debugX = 200;
			var debugY = canvas.height/2 + 200;
			var debugSkipY = 15;
			canvasContext.fillStyle = 'white';
			canvasContext.font = '160px Arial';
			canvasContext.textAlign = 'center';
			canvasContext.fillText("FACE OFF", canvas.width/2, canvas.height/2 + 200);
			canvasContext.font = '10px Arial';
			canvasContext.textAlign = 'left';
			debugY += debugSkipY;
			canvasContext.fillText("AIFaceOffCountDown: " + AIFaceOffCountDown, debugX, debugY);
			//bool flags too ^_^
			//visualize 
		}
	}else if ( gameState == state.gameover ) {
		drawGameOver();
	} else if ( gameState == state.credits ) {
		drawCredits();
	}
	input.touch.draw();
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

function drawCredits() {
	colorRect(0,0, canvas.width, canvas.height, 'Black');
	canvasContext.fillText("Credits", 350, 500);
}