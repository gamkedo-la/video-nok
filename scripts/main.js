var canvas;
var canvasContext;



var shooting = false;
var shootStart;
var shotVector = {};

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var ballOne = new ballClass();

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function subtractAbsValPoints(point1, point2){
	point1XAbs = Math.abs(point1.x);
	point2XAbs = Math.abs(point2.x);
	largerXVal = Math.max(point1XAbs, point2XAbs);
	smallerXVal = Math.min(point1XAbs, point2XAbs);

	point1YAbs = Math.abs(point1.y);
	point2YAbs = Math.abs(point2.y);
	largerYVal = Math.max(point1YAbs, point2YAbs);
	smallerYVal = Math.min(point1YAbs, point2YAbs);


	xDiff = largerXVal - smallerXVal;
	yDiff = largerYVal - smallerYVal;

	return {
		x: xDiff,
		y: yDiff
	}
}

function handleMouseDown(evt) {
	shooting = true;
	shootStart = calculateMousePos(evt);
	//console.log('shoot start is' + shootStart.x + ',' + shootStart.y);

}

function handleMouseUp(evt){
	if(shooting){
		var shootEnd = calculateMousePos(evt);

		ballOne.velX = Math.max(Math.min((shootStart.x-shootEnd.x)/5, 10), -10);
		ballOne.velY = Math.max(Math.min((shootStart.y-shootEnd.y)/5, 10), -10);

		// for debugging: outputs vector to be applied to the puck
		console.log('vector applied to puck: x:' + Math.max(Math.min((shootStart.x-shootEnd.x)/5, 10), -10) + ', y:' + Math.max(Math.min((shootStart.y-shootEnd.y)/5, 10), -10))
		
	} // end check if shooting
} // end handleMouseUp()

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function() {
			moveEverything();
			checkForCollisions();
			drawEverything();	
		}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseDown);
	canvas.addEventListener('mouseup', handleMouseUp);

	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			/*
			paddle1X = mousePos.x;
			paddle1Y = mousePos.y;
			*/
		});
}

function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballOne.x - 35) {
		paddle2Y = paddle2Y + 6;
	} else if(paddle2YCenter > ballOne.y + 35) {
		paddle2Y = paddle2Y - 6;
	}
}

function moveEverything() {
	if(showingWinScreen) {
		//return;
	}

	//computerMovement();

	// disabling bc the mouse is going to hit the ball 
	//Chris: bring back, and it'll work on the walls too. 
	ballOne.move();

	
}

function checkForCollisions(){
	paddle1X = railThickness*3;
	paddle2X = canvas.width-PADDLE_THICKNESS
	ballOne.checkForCollisions(paddle1X, paddle1Y, PADDLE_HEIGHT, PADDLE_THICKNESS);
	ballOne.checkForCollisions(paddle2X, paddle2Y, PADDLE_HEIGHT, PADDLE_THICKNESS);
}


function drawEverything() {
	drawBackground();
	drawPaddles();
	ballOne.draw();
	drawUI();
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
	if(showingWinScreen) {
		canvasContext.fillStyle = 'white';

		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText("Left Player Won", 350, 200);
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillText("Right Player Won", 350, 200);
		}

		canvasContext.fillText("click to continue", 350, 500);
		return;
	}

	canvasContext.fillText(player1Score, 100, 100, 300);
	canvasContext.fillText(player2Score, canvas.width-100, 100);

	canvasContext.fillText("first attempt at moving the ball(puck) based on striking", 350, 480);
	canvasContext.fillText("try holding the left mouse button down, dragging the mouse then releasing!", 350, 500);
	canvasContext.fillText("does not account for collision with ball, works literally anywhere on screen", 350, 520);	
}



