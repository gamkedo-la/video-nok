var canvas, canvasContext;
var debugMode = false;

var shooting = false;
let scoreManager = new ScoreManager();

var puckOne = new Puck();
var activePlayer = 1;

var preFaceOff = true
var faceOffActive = false; //defaults to true because that's how the game would normally start. 
var AIFaceOffCountDown = 50;

var outOfBoundsTimer = 0;
var outOfBoundsPuckXPos;
var outOfBoundsPuckYPos;

//debug vars
var crtlReachedP1Ctrl = false;
var ctrlAtUIControl = false;
var ctrlAtplayerControl = false;
var ctrlAIControl = false;

const credits = new Credits(350, 500, text.credits);

const state = {
	menu: 0,
	game: 1,
	gameover: 2,
	credits: 3
};

let gameState = state.menu;
let playerControllers = [aiControl, aiControl];

var logoImg = document.createElement('img');
var logoImgLoaded = false;
var p1winsImg = document.createElement('img');
var p1winsImgLoaded = false;
var p2winsImg = document.createElement('img');
var p2winsImgLoaded = false;

logoImg.onload = function(){
	logoImgLoaded = true; 
}

p1winsImg.onload = function(){
	p1winsImgLoaded = true; 
}

p2winsImg.onload = function(){
	p2winsImgLoaded = true; 
}


window.onload = function() {
	logoImg.src = 'assets/logo.png';
	p1winsImg.src = 'assets/p1-wins.png';
	p2winsImg.src = 'assets/p2-wins.png';
	initGame();

	const framesPerSecond = 30;
	setInterval(main, 1000/framesPerSecond);
}

function initCanvas() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
}

function initGame() {
	initCanvas();
	initAudio();
	initInput();
	initBoard();
	scaleScreen();
	window.addEventListener('resize', scaleScreen);
	window.addEventListener('orientationchange', scaleScreen);
}

function scaleScreen() {
	let availH = window.innerHeight;
	let availW = window.innerWidth;

	let screenScale = availW / canvas.width;
	if (screenScale * canvas.height > availH) {
		screenScale = availH / canvas.height;
	}

	gameWindow.scale = screenScale;
	canvas.style.width = canvas.width * screenScale + 'px';
	canvas.style.height = canvas.height * screenScale + 'px';

	canvas.style.marginLeft = (availW - parseInt(canvas.style.width)) / 2;
	canvas.style.marginTop = (availH - parseInt(canvas.style.height)) / 2;
}

function faceOff() {
	puckOne.reset();
	if (playerControllers[1] == aiControl) { //This is currently true in all modes with a computer player
		if (AIFaceOffCountDown > 0)  {
			if (playerControllers[0] != aiControl) { //Determine if 0 or 1 player mode
				activePlayer = 1;
				playerControl();
				var threatVector = new Vector2(133.49, 148.93); //a viable vect to score from center court 
				puckOne.faceOffThreat(threatVector);
				//threatVector.length = clamp(threatVector.length, 0, MAX_SHOT_VELOCITY);
				//puckWindupJustAni(threatVector);
			}
			AIFaceOffCountDown--;
		} else {
			activePlayer = 2; //TO DO: randomly select active player in 0 Player mode
			faceOffActive = false;
			shooting = false;
			aiControl(); //AI still assumes it is player 2
		}
	} else { //2 Player mode
		playerControl();
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

	if (input.keyboard.keyPressed(KEY_Replicate_game_scenario)) {
		replicateGameScenario();
	}
	
	if (puckOne.shotVector) {
		puckOne.shotPrediction(false, false);
	}

	//some guidelines for AI testing, will remove
	colorRect(0, 200, canvas.width, 1, 'white');
	colorRect(200, 0, 1, canvas.width, 'white');
	colorRect(canvas.width - 200, 0, 1, canvas.width, 'white');
	colorRect(canvas.width/2, 0, 1, canvas.width, 'white');

	drawDebugText();
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
	if (input.keyboard.keyPressed(KEY_Debug)) {
		toggleDebugMode();
	}

	if (gameState === state.menu) {
		ui.control();
	} else if (gameState === state.game) {
		//if (puckOne.inPlay);
		if(faceOffActive){
			faceOff();				
		} else if (preFaceOff) {
			if(input.keyboard.keyPressed(KEY_pre_face_off)){
				preFaceOff = false;
				faceOffActive = true;
			}	
		}
		else {
			playerControllers[activePlayer - 1](); //notes 4 Ash =^-_-^= : this array contains calls to aiControl
		}
		updateAnimations();
		puckOne.move();
		if (scoreManager.winner) {
			gameState = state.gameover;
		}
	} else if (gameState === state.gameover && input.clicked()) {
		gameState = state.menu;
	} else if (gameState === state.credits && input.clicked()) {
		gameState = state.menu;
	} else if (gameState === state.credits) {
		credits.update();
	}
}

function drawOutOfBoundsIndicator(){
	colorRect(outOfBoundsPuckXPos, outOfBoundsPuckYPos, 75, 75, blue, 20);
	colorRect(outOfBoundsPuckXPos, outOfBoundsPuckYPos, 75, 75, yellow, 60);
	canvasContext.font = '30px Arial';
	canvasContext.textAlign = 'left';
	canvasContext.fillStyle = orange;
	canvasContext.fillText("OB!", outOfBoundsPuckXPos + 15, outOfBoundsPuckYPos + 50);
}

function drawDebugText(){
	var debugX = 200;
	var debugY = 100;
	var debugSkipY = 15;
	canvasContext.fillStyle = 'white';
	canvasContext.font = '10px Arial';
	canvasContext.textAlign = 'left';
	debugY += debugSkipY;
	canvasContext.fillText("AIFaceOffCountDown: " + AIFaceOffCountDown, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("preFaceOff: " + preFaceOff, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("faceOffActive: " + faceOffActive, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("activePlayer: " + activePlayer, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("player 1 score: " + scoreManager.scores[0], debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("player 2 score: " + scoreManager.scores[1], debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("scoreManager.scores " + scoreManager.scores, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("scoreManager.winner " + scoreManager.winner, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("ctrlAtUIControl " + ctrlAtUIControl, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("ctrlAtplayerControl " + ctrlAtplayerControl, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("ctrlAIControl " + ctrlAIControl, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("faceOffThreatTimer " + faceOffThreatTimer, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("faceOffThreatCooldown " + faceOffThreatCooldown, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("puckOne.x " + puckOne.x, debugX, debugY);
}

function drawEverything() {
	drawBackground();
	
	if(outOfBoundsTimer > 0){
		outOfBoundsTimer--
		drawOutOfBoundsIndicator();
	}
	if (gameState === state.menu) {
		canvasContext.drawImage(logoImg, 212, 230);
		ui.draw();
	} else if (gameState === state.game) {
		puckOne.draw();
		drawUI();
		if(preFaceOff){
			canvasContext.fillStyle = 'white';
			canvasContext.font = '100px Arial';
			canvasContext.textAlign = 'center';
			canvasContext.fillText("TAKE YOUR SHOT", canvas.width/2, canvas.height/2 + 200);	
			canvasContext.font = '30px Arial';
			canvasContext.textAlign = 'center';
			canvasContext.fillText("press SPACE to continue", canvas.width/2, canvas.height/2 + 230);	
		}

		if(faceOffActive){
			canvasContext.fillStyle = 'white';
			canvasContext.font = '160px Arial';
			canvasContext.textAlign = 'center';
			canvasContext.fillText("FACE OFF", canvas.width/2, canvas.height/2 + 200);
		}
	}else if ( gameState == state.gameover ) {
		drawGameOver();
	} else if ( gameState == state.credits ) {
		credits.draw();
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
	colorRect(0,0, canvas.width, canvas.height, 'white');
	/*
	const winName = scoreManager.winner === 1 ? 'Left Player' : 'Right Player';
	canvasContext.fillText(winName + ' Won', 350, 200);
	*/
	if(scoreManager.winner === 1) {
		canvasContext.drawImage(p1winsImg, 212, 230);
	} else {
		canvasContext.drawImage(p2winsImg, 212, 230);
	}

	canvasContext.fillStyle = purple;
	canvasContext.font = '30px Arial';
	canvasContext.fillText("CLICK TO CONTINUE", 230, 460);
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

function replicateGameScenario(){
	activePlayer = 1; //is this more complicated that just changing a flag, i.e a function
	scoreManager.scores[0] = 2;
	puckOne.x = 748.01171875;
	puckOne.y = 511.01171875;
	faceOffActive = false;
}