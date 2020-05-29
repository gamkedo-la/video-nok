const GOAL_POST_SIZE = 160; //it's 115 in the mock, making it larger to test for collision
const GOALIE_SIZE = 55;

function drawGoalies(){
	
	//draws left goalie
	colorRect(railThickness*3, canvas.height/2-(GOALIE_SIZE/2), GOALIE_SIZE, GOALIE_SIZE, railColor, 45);

	//draws right goalie
	colorRect(canvas.width-(railThickness*5), canvas.height/2-(GOALIE_SIZE/2), GOALIE_SIZE, GOALIE_SIZE, railColor, 45);	

}