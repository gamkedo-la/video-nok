var sample = 12;
var bgColor = '#713784';
var railColor = '#f5989d';
var railThickness = 30;
const RAIL_COLLIDER = 15;
const GOAL_POST_SIZE = 160; //it's 115 in the mock, making it larger to test for collision
const GOALIE_SIZE = 55;

var paddle1Y = 250;
var paddle2Y = 0;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function Stick(){
	this.position = {x:0, y: 400};
}

function drawPaddles(){
	// this is right computer paddle
	colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

	//draws left goalie
	colorRect(railThickness*3, canvas.height/2-(GOALIE_SIZE/2), GOALIE_SIZE, GOALIE_SIZE, railColor, 45);

	//draws right goalie
	colorRect(canvas.width-(railThickness*5), canvas.height/2-(GOALIE_SIZE/2), GOALIE_SIZE, GOALIE_SIZE, railColor, 45);	
	
	// this is left player paddle
	//colorRect(paddle1X,paddle1Y,PADDLE_HEIGHT,PADDLE_THICKNESS,'white');
}

/*
function drawStick(position, origin){
	this.canvasContext.save();
	this.canvasContext.translate(position.x, position.y);
	//attempt to use ColorRect
	colorRect(paddle1X,paddle1Y,PADDLE_HEIGHT,PADDLE_THICKNESS,'white');
}
*/