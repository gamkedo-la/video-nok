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
 
    var shotSpeed = 540; 
    var aimAngle = 0; 

    var testVect = new Vector2(0,0);
    for(var aim = 0; aim < Math.PI*2; aim += 0.04){
        testVect.x = Math.cos(aim) * shotSpeed;
        testVect.y = Math.sin(aim) * shotSpeed;
        puckOne.hold(testVect);        
        if(puckOne.shotPrediction(true, true)){
            aimAngle = aim;
            break;
        }
    }
 
    //maybe try tweaking these numbers first, from various court positions
    if (input.clicked() && !shooting) {
        shooting = true;
        let launchVector = new Vector2(testVect.x, testVect.y);
        launchVector.length = clamp(launchVector.length, 0, MAX_SHOT_VELOCITY);
        puckWindup(launchVector);
    }
}