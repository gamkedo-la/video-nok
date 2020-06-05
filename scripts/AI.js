function atPositionX(puckX) {
	if(puckX < 500) { // only known for 300-500, under 300 is extrapolating
		return proportion(300,500, puckX, 90, 110);
	} else { // only known for 500-800, over 800 is extrapolating
		return proportion(500,800, puckX, 110, 130);
	}
}
function proportion(leftX,rightX,actual,bottomTarget,topTarget) {
	var rangeX = (rightX-leftX); // span of these numbers
	var perc = (actual-leftX) / rangeX; // 25%? 80%?
	var targetRange = topTarget - bottomTarget;
	return bottomTarget+perc*targetRange; // from % into coordinate
}

function aiControl() {
    
    console.log(atPositionX(puckOne.x));
    
    var closeToGoal = false;

    if(puckOne.x < canvas.width/4 &&
        (puckOne.y > 0 && puckOne.y < (canvas.height / 2) - (GOAL_POST_SIZE / 2))||
        puckOne.x < canvas.width/4 &&
        (puckOne.y > (canvas.height / 2) + (GOAL_POST_SIZE / 2))){
            console.log('im on the left and away from the goalie');
            closeToGoal = true;
    } //is puck in a position to score by directly shooting at the goal
    
    //atPositionX(puckOne.x)
    var aimAtX = 0;
    var aimAtY = (-canvas.height/2) + 70;  //aim at upper mirror, past numbers: 145, 80 (actually half of the goal)
    // for testing, aiming at a fixed, constant based point below center, and increasing the goal size
    if(Math.random() < 0.5){
        //aimAtY = (1.5 * canvas.height); - 145 ; //aim at lower mirror world. 
    }
    if(closeToGoal){
        aimAtY = canvas.height/2;
        console.log(aimAtY);
    }

    //var randomAngle = Math.random() * Math.PI * 2.0; //in radians //a full circle of range 
    var randomSpeed = Math.random() * 40.0 + 500.0; //min and randomized range, at least 4, up to 12 

    var aimAngle = Math.atan2(puckOne.y - aimAtY, puckOne.x - aimAtX); 

    // check if I can get straight to goal from here (is goalie block in the way) SKIP FOR RN
    // if yes, then shoot at aimAngle
    // if no, then calc new aimAtX, aimAtY, for where to bounce off wall.  

    let launchX = Math.cos(aimAngle) * randomSpeed;
    let launchY = Math.sin(aimAngle) * randomSpeed;
    
    puckOne.hold(new Vector2(launchX, launchY));
 
    //maybe try tweaking these numbers first, from various court positions
    if (input.clicked() && !shooting) {
        shooting = true;
        let launchVector = new Vector2(launchX, launchY);
        launchVector.length = clamp(launchVector.length, 0, MAX_SHOT_VELOCITY);
        puckWindup(launchVector);
        
        console.log('vector: x:' + launchVector.x + ' y:' + launchVector.y);	
    }
}