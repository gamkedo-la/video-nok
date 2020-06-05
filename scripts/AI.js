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