var canvas;
var canvasContext;

var shooting = false;
var shootStart;
var shotVector = {};

let scoreManager = new ScoreManager();

var ballOne = new ballClass();
var activePlayer = 1;

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

		if(activePlayer == 1){
			ballOne.velX = Math.max(Math.min((shootStart.x-shootEnd.x), 30), -30);
			ballOne.velY = Math.max(Math.min((shootStart.y-shootEnd.y), 30), -30);
		}
		//pretend this is an AI for right now. 

		var randomFloat = Math.random() * 30;
		console.log(randomFloat);

		if(activePlayer == 2){
			ballOne.velX = Math.max(Math.min(randomFloat, 30), -30);
			ballOne.velY = Math.max(Math.min(randomFloat, 30), -30);
		}

		// for debugging: outputs vector to be applied to the puck
		//console.log('vector applied to puck: x:' + Math.max(Math.min((shootStart.x-shootEnd.x)/5, 10), -10) + ', y:' + Math.max(Math.min((shootStart.y-shootEnd.y)/5, 10), -10))
		
	} // end check if shooting
	if (scoreManager.winner) resetGame();

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
			//display mouse coords
			//canvasContext.fillText("x: " + mousePos.x + ", y:" + mousePos.y, mousePos.x, mousePos.y);
			
		});
}

function resetGame() {
	scoreManager.reset();
	ballOne.ballReset();
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