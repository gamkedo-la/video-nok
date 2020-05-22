var canvas;
var canvasContext;

var shooting = false;
let scoreManager = new ScoreManager();

var ballOne = new Ball();
var activePlayer = 1;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	initInput();

	var framesPerSecond = 30;
	setInterval(function() {
			moveEverything();
			checkForCollisions();
			drawEverything();	
		}, 1000/framesPerSecond);
}

function resetGame() {
	scoreManager.reset();
	ballOne.ballReset();
}

function moveEverything() {
	if(scoreManager.winner) {
		//return;
	}

	ballOne.move();
	
}

function checkForCollisions(){
	paddle1X = railThickness*3;
	paddle2X = canvas.width-PADDLE_THICKNESS
	ballOne.checkForCollisions(paddle1X, paddle1Y, PADDLE_HEIGHT, PADDLE_THICKNESS);
	ballOne.checkForCollisions(paddle2X, paddle2Y, PADDLE_HEIGHT, PADDLE_THICKNESS);
	// check for right goalie collision
	//ballOne.checkForCollisions(canvas.width-(railThickness*5), canvas.height/2-(GOALIE_SIZE/2), GOAL_POST_SIZE, GOAL_POST_SIZE);
}


function drawEverything() {
	drawBackground();
	drawPaddles();
	ballOne.draw();
	drawUI();
	touch.draw();
}

function drawBackground() {
	canvasContext.globalAlpha = 0.10;
	colorRect(0,0,canvas.width,canvas.height,bgColor);
	canvasContext.globalAlpha = 1.0;

	drawNet();
	
	//top rail
	colorRect(0, 0, canvas.width, railThickness, railColor);
	//bottom rail
	colorRect(0, canvas.height - railThickness, canvas.width, railThickness, railColor);
	//left rail
	colorRect(0, 0, railThickness, canvas.height, railColor);
	//right rail
	colorRect(canvas.width-railThickness, 0, railThickness, canvas.height, railColor);

	//goal posts
	//left
	colorRect(0, canvas.height/2-(GOAL_POST_SIZE/2), railThickness, GOAL_POST_SIZE, bgColor);
	//right
	colorRect(canvas.width-railThickness, canvas.height/2-(GOAL_POST_SIZE/2), railThickness, GOAL_POST_SIZE, bgColor);
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

		let winName = scoreManager.winner === 0 ? 'Left Player' : 'Right Player';
		canvasContext.fillText(winName + ' Won', 350, 200);

		canvasContext.fillText("click to continue", 350, 500);
		return;
	}

	canvasContext.fillText(scoreManager.scores[0], 100, 100, 300);
	canvasContext.fillText(scoreManager.scores[1], canvas.width-100, 100);

	canvasContext.fillText('active player is: ' + activePlayer, 350, 450);
	canvasContext.fillText("first attempt at moving the ball(puck) based on striking", 350, 480);
	canvasContext.fillText("try holding the left mouse button down, dragging the mouse then releasing!", 350, 500);
	canvasContext.fillText("does not account for collision with ball, works literally anywhere on screen", 350, 520);	
}