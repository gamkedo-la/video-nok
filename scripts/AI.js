function aiControl() {
    // AI failure rates
    var correctShotSpeed = 0;
    AIAimFail  = false;
    AIPowerFail = false;
    
    AIFailPerc = Math.random();
    
    if(scoreManager.scores[1] > scoreManager.scores[0] && AIFailPerc > 0.2){
        AIPowerFail = true;
    } // if AI is doing better than player, there's a good chance it'll miss
    if(scoreManager.scores[1] < scoreManager.scores[0] && AIFailPerc > 0.8){
        AIAimFail = true;
    } //if AI is behind player, it starts doing well, bc it hates losing, fail rate 20 
    //commenting this line out for rn to test over powered shots, need AI to play flawlessly. 
    if(scoreManager.scores[1] < scoreManager.scores[0] && AIFailPerc > 0.6){
        AIAimFail = true;
    } //if AI is even with player, it performs adequately. fail rate 40
    
    
 
    var shotSpeedRange = 540; 

    var testVect = new Vector2(0,0);
    var aiShotFoundToScore = false;
    for(var aim = 0; aim < Math.PI*2; aim += 0.04){ //aim+/ .04
        for(var shotSpeed = 0; shotSpeed < shotSpeedRange; shotSpeed += 50){ //shotSpeed +=
            testVect.x = Math.cos(aim) * shotSpeed;
            testVect.y = Math.sin(aim) * shotSpeed; 
            puckOne.hold(testVect);        
            if(puckOne.shotPrediction(true, true)){ //notes for ash! I guess this conditional statement calls and runs that entire function, with its side effects, it's not just checking against the return value
                //aimAngle = aim; //I don't think aimAngle is actually used
                aiShotFoundToScore = true;
                correctShotSpeed = shotSpeed;
                break;
            } //if shotPrediction() has found a working shot, break, and pass in testVect to .hold()
        }
        if(aiShotFoundToScore){
            break;
        }
    }

    if(faceOff && aiShotFoundToScore){
        puckOne.faceOffThreat(testVect);
    }
 
    //maybe try tweaking these numbers first, from various court positions
    if (input.clicked() && !shooting) {
        shooting = true;

        if(AIPowerFail){
            console.log(AIPowerFail);
            var testVectXTemp = testVect.x/correctShotSpeed;
            var testVectYTemp = testVect.y/correctShotSpeed;
            var failureShotSpeed = correctShotSpeed - 30; //AI will underpower shot
            testVect.x = testVectXTemp * failureShotSpeed;
            testVect.y = testVectYTemp * failureShotSpeed;
        }
        if(AIAimFail){
            //testVect.x += 50; //AI will skew shot. 
        }
        let launchVector = new Vector2(testVect.x, testVect.y);  
        launchVector.length = clamp(launchVector.length, 0, MAX_SHOT_VELOCITY);
        //launces puck
        puckWindup(launchVector);
    }
    
}