var canvas, canvasContext;
var debugMode = false;

var shooting = false;
let scoreManager = new ScoreManager();


var puckOne = new Puck();
var activePlayer = 0;

var outofBoundsActive = false;
var preFaceOff = false;
var faceOffActive = false; //defaults to true because that's how the game would normally start. 
var AIFaceOffCountDown = 50;
var aiWonFaceOff = false;

var outOfBoundsStarburstTimer = 0;
var outOfBoundsTimer = 0;
var outOfBoundsPuckXPos;
var outOfBoundsPuckYPos;

//debug vars
var crtlReachedP1Ctrl = false;
var ctrlAtUIControl = false;
var ctrlAtplayerControl = false;
var ctrlAIControl = false;

creditsText = [
"Ashleigh M.: Project lead, core gameplay, visual design, AI aim, debugging features,",
"       sounds, font selection, logo, credits screen improvements, assorted bug fixes",
"",
"Andrew Mushel: Shot vector animation, score manager, menu system, 2-player mode,",
"        audio event system, draw refactor, input decoupling from main logic, touch and",
"        gamepad controls, board collision improvements, debugging improvements, face off",
"        improvements, canvas scale, AI fix",
"",
"Vince McKeown: Code organization, scoring, paddle/puck collision improvements, puck class",
"",
"Allan Regush: Wall collisions, game over state, credits screen",
"",
"Catherine San Luis: Puck placement debugging / cheat feature",
"",
"Andy King: Detailed playtesting and pre-release prioritization feedback",
];
const credits = new Credits(212, 500, creditsText);


const state = {
	menu: 0,
	game: 1,
	gameover: 2,
	credits: 3
};

let gameState = state.menu;
let playerControllers = [aiControl, aiControl];

window.onload = loadImages;

function initGame() {
	initCanvas();
	initAudio();
	initInput();
	initBoard();
	scaleScreen();
	window.addEventListener('resize', scaleScreen);
	window.addEventListener('orientationchange', scaleScreen);
}

function initCanvas() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
}

function scaleScreen() {
	let availH = window.innerHeight;
	let availW = window.innerWidth;

	let screenScale = availW / canvas.width;
	if (screenScale * canvas.height > availH) {
		screenScale = availH / canvas.height;
	}

	gameWindow.scale = screenScale;
	let sWidth = canvas.width * screenScale;
	let sHeight = canvas.height * screenScale;
	let leftMargin = (availW - sWidth) / 2;
	let topMargin = (availH - sHeight) / 2;


	canvas.style.width = sWidth + 'px';
	canvas.style.height = sHeight + 'px';
	canvas.style.marginLeft = leftMargin;
	canvas.style.marginTop = topMargin;

	let zone1 = document.getElementById('controlzoneleft');
	let zone2 = document.getElementById('controlzoneright');

	zone1.style.width = sWidth/2;
	zone1.style.height = sHeight;
	zone1.style.left = leftMargin;
	zone1.style.top = topMargin;

	zone2.style.width = sWidth/2;
	zone2.style.height = sHeight;
	zone2.style.left = leftMargin + sWidth/2;
	zone2.style.top = topMargin;
}

function forgetInputToRemoveTail(){
	puckOne.shotVectors.length = 0;
}

function startFaceoff() {
	forgetInputToRemoveTail();
	if (playerControllers[1] == aiControl || playerControllers[0] == aiControl) {
		AIFaceOffCountDown = 60;
	}
	
	if (playerControllers[0] == playerControllers[1] && playerControllers[0] == aiControl) {
		preFaceOff = false;
		faceOffActive = true;
	} else {
		preFaceOff = true;
		faceOffActive = false;
	}
}

function faceOff() {
	if (playerControllers[1] == aiControl) { //This is currently true in all modes with a computer player		
		aiThreat(1);
		if (AIFaceOffCountDown > 0)  {
			if (playerControllers[0] != aiControl) { //Determine if 0 or 1 player mode
				activePlayer = 0;
				playerControl();
			} else {
				aiThreat(0);
			}
			AIFaceOffCountDown--;
		} else {
			activePlayer = (playerControllers[0] == aiControl) ? Math.round(Math.random()) : 1;
			faceOffActive = false;
			shooting = false;
			aiWonFaceOff = true;
			aiControl(); //AI still assumes it is player 2
			aiWonFaceOff = false;

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
		puckOne.shotPrediction(false);
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
		if (i + 1 <= playerCount) {
			controlZones[i].style.display = 'initial';
			playerControllers[i] = playerControl;
		} else playerControllers[i] = aiControl;
	}
	resetGame();
}

function resetGame() {
	scoreManager.scores[0] = 0;
	scoreManager.scores[1] = 0; 
	gameState = state.game;
	puckOne.reset();
	startFaceoff();
}

function moveEverything() {

	if(outOfBoundsTimer >= 0){
		outOfBoundsTimer--
		if (outOfBoundsTimer <= 0) {
			outofBoundsActive = false;
			startFaceoff();
		}
	}
	
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
			if(input.anyPressed()) {
				preFaceOff = false;
				faceOffActive = true;
			}	
		} else if (!outofBoundsActive){
		//} else if (!outOfBoundsTimer > -2){
			//console.log(outOfBoundsTimer > -1);
			playerControllers[activePlayer](); 
		}
		updateAnimations();
		puckOne.move();
		if (scoreManager.winner) {
			controlZones[0].style.display = controlZones[1].style.display = 'none';
			console.log('i think the scores arent being reset');
			gameState = state.gameover;
		}

	} else if (gameState === state.gameover && input.anyPressed()) {
		gameState = state.menu;
	} else if (gameState === state.credits && input.anyPressed()) {
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
	canvasContext.fillText("outOfBoundsTimer: " + outOfBoundsTimer, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("AIFaceOffCountDown: " + AIFaceOffCountDown, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("preFaceOff: " + preFaceOff, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("faceOffActive: " + faceOffActive, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("activePlayer: " + (activePlayer + 1), debugX, debugY);
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
	debugY += debugSkipY;
	canvasContext.fillText("AIWonFaceOff " + aiWonFaceOff, debugX, debugY);
	debugY += debugSkipY;
	canvasContext.fillText("gameState " + gameState, debugX, debugY);
}

function drawEverything() {
	drawBackground();


	
	if(outOfBoundsStarburstTimer > 0){
		outOfBoundsStarburstTimer--
		drawOutOfBoundsIndicator();
	}
	if (gameState === state.menu) {
		canvasContext.drawImage(logoImg, 212, 230);
		ui.draw();
		
	} else if (gameState === state.game) {
		drawUI();
		puckOne.draw();
		if(outOfBoundsTimer > 0){
			/*
			canvasContext.fillStyle = 'red';
			canvasContext.font = '100px Arial';
			canvasContext.textAlign = 'left';
			canvasContext.fillText("Out of Bounds!", canvas.width/2 -200, canvas.height/2);
			*/
			canvasContext.drawImage(outOfBoundsTxt, canvas.width/2 - 450, canvas.height/2 + 100);
		}
		if(preFaceOff){
			canvasContext.drawImage(faceOffImg, canvas.width/2 - 250, canvas.height/2 + 100);
			canvasContext.font = '30px Nunito';
			canvasContext.textAlign = 'center';
			canvasContext.fillStyle = 'white';
			canvasContext.fillText("Fight over the puck! Drag and release to aim and shoot!", canvas.width/2, canvas.height/2 + 230);
			canvasContext.font = '16px Nunito';
			canvasContext.fillText("press ANYTHING to continue", canvas.width/2, canvas.height/2 + 270);	
		}

		if(faceOffActive){
			canvasContext.drawImage(takeYourShotImg, canvas.width/2 - 456, canvas.height/2 + 100);
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
	//note: whatever reason, debug mode will skew the alignment of these two items.
	colorRect(0,0, canvas.width, canvas.height, 'white');
	let winImg = scoreManager.winner === 1 ? p1winsImg : p2winsImg;
	canvasContext.drawImage(winImg, (canvas.width/2)-250, 230);

	canvasContext.fillStyle = purple;
	canvasContext.font = '30px Nunito';
	canvasContext.fillText("INTERACT TO CONTINUE", (canvas.width/2) - 70 , 460);
}

function drawNet() {
	const stripeWidth = canvas.width/100;
	const spacing = canvas.height/10;
	const stripeHeight = spacing/2;

	for(var i=stripeHeight/2; i<canvas.height; i+=spacing) {
		colorRect(canvas.width/2-stripeWidth/2, i, stripeWidth, stripeHeight, yellow);
	}
	strokeCircle(canvas.width/2, canvas.height/2, 140, yellow);
}

function drawUI() {
	let p1Type = playerControllers[0] == playerControl ? 'PLAYER' : 'COMPUTER';
	let p2Type = playerControllers[1] == playerControl ? 'PLAYER' : 'COMPUTER';
	
	/*
	canvasContext.save()
	canvasContext.textAlign = 'center';
	// Player 1
	canvasContext.fillStyle = (activePlayer === 0 && !faceOffActive && !preFaceOff) ? yellow : purpleLighter;
	//next 4 lines to be cut out. 

	canvasContext.font = '20px Arial';
	canvasContext.fillText(p1Type + ' 1', 120, 65);
	canvasContext.font = 'bold 180px Arial';
	canvasContext.fillText(scoreManager.scores[0], 120, 220);
	*/
	//PLAYER ONE SCORE NUMBER
	if(scoreManager.scores[0] === 0){
		if(activePlayer === 0 && !faceOffActive && !preFaceOff){
			canvasContext.drawImage(score0Active, railThickness * 2, railThickness * 2);
		}
		else {
			canvasContext.drawImage(score0Inactive, railThickness * 2, railThickness * 2);
		}
	}
	else if(scoreManager.scores[0] === 1){
		if(activePlayer === 0 && !faceOffActive && !preFaceOff){
			canvasContext.drawImage(score1Active, railThickness * 2, railThickness * 2);
		}
		else {
			canvasContext.drawImage(score1Inactive, railThickness * 2, railThickness * 2);
		}
	}
	else if(scoreManager.scores[0] === 2){
		if(activePlayer === 0 && !faceOffActive && !preFaceOff){
			canvasContext.drawImage(score2Active, railThickness * 2, railThickness * 2);
		}
		else {
			canvasContext.drawImage(score2Inactive, railThickness * 2, railThickness * 2);
		}
	}
	
	// PLAYER 2 SCORE NUMBER
	//PLAYER ONE SCORE NUMBER
	if(scoreManager.scores[1] === 0){
		if(activePlayer === 1 && !faceOffActive && !preFaceOff){
			canvasContext.drawImage(score0Active, canvas.width - 110 - railThickness * 2, railThickness * 2);
		}
		else {
			canvasContext.drawImage(score0Inactive, canvas.width - 110 - railThickness * 2, railThickness * 2);
		}
	}
	else if(scoreManager.scores[1] === 1){
		if(activePlayer === 1 && !faceOffActive && !preFaceOff){
			canvasContext.drawImage(score1Active, canvas.width - 110 - railThickness * 2, railThickness * 2);
		}
		else {
			canvasContext.drawImage(score1Inactive, canvas.width - 110 - railThickness * 2, railThickness * 2);
		}
	}
	else if(scoreManager.scores[1] === 2){
		if(activePlayer === 1 && !faceOffActive && !preFaceOff){
			canvasContext.drawImage(score2Active, canvas.width - 110 - railThickness * 2, railThickness * 2);
		}
		else {
			canvasContext.drawImage(score2Inactive, canvas.width - 110 - railThickness * 2, railThickness * 2);
		}
	}
	
	/*
	canvasContext.fillStyle = (activePlayer === 1 && !faceOffActive && !preFaceOff) ? yellow : purpleLighter;
	canvasContext.font = '20px Arial';
	canvasContext.fillText(p2Type + ' 2', canvas.width-120, 65);
	canvasContext.font = 'bold 180px Arial';
	canvasContext.fillText(scoreManager.scores[1], canvas.width-120, 220);
	canvasContext.restore();
	*/
}

function replicateGameScenario(){
	activePlayer = 0; //is this more complicated that just changing a flag, i.e a function
	scoreManager.scores[1] = 2;
	puckOne.x = 748.01171875;
	puckOne.y = 511.01171875;
	faceOffActive = false;
}