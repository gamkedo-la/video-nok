function aiControl() {
    var possibleShots = [];

    if (puckOne.inPlay || shooting) return;
    // AI failure rates
    var correctShotSpeed = 0;
    AIAimFail  = false;
    AIPowerFail = false;
    
    AIFailPerc = Math.random();
    
    if(scoreManager.scores[1] > scoreManager.scores[0] && AIFailPerc > 0.2){
        AIPowerFail = true;
    } // if AI is doing better than player, there's an 80% chance it'll underpower the shot
    if(scoreManager.scores[1] < scoreManager.scores[0] && AIFailPerc > 0.8){
        AIAimFail = true;
    } //if AI is behind player, it starts doing well, bc it hates losing, fail rate 20 
    if(scoreManager.scores[1] < scoreManager.scores[0] && AIFailPerc > 0.6){
        AIAimFail = true;
    } //if AI is even with player, it performs adequately. fail rate 40
    

 
    var shotSpeedRange = 540; 

    var testVect = new Vector2(0,0);
    possibleShots[0] = testVect;
    var aiShotFoundToScore = false;
    for(var aim = 0; aim < Math.PI*2; aim += 0.04){ //aim+/ .04
        for(var shotSpeed = 0; shotSpeed < shotSpeedRange; shotSpeed += 50){ //shotSpeed +=
            testVect.x = Math.cos(aim) * shotSpeed;
            testVect.y = Math.sin(aim) * shotSpeed;

            puckOne.hold(testVect);        
            if(puckOne.shotPrediction(true, true)){ //notes for ash! I guess this conditional statement calls and runs that entire function, with its side effects, it's not just checking against the return value
                //capture some new props, and attach them to the testVect object before we push em onto possible shots
                //shotpred figures these things out, puts them on puckOne
                //console.log('adding possible shot', aim, shotSpeed);
                correctShotSpeed = shotSpeed;
                //console.log(puckOne.lastPredictedBounce, puckOne.lastPredictedLength);
                testVect.humanScore = puckOne.lastPredictedBounce * 100 + puckOne.lastPredictedLength * 0.5;
                //console.log(testVect.humanScore); 
                //aim += 0.2; //avoid detecting shots that are too sim ilar to each other
                //shotSpeed = 0;
                possibleShots.push(testVect);
                testVect = new Vector2(); //resets the memory
            } //if shotPrediction() has found a working shot, break, and pass in testVect to .hold()
        }
    }

    if(possibleShots.length>0){
        var bestShot = possibleShots[0];
        for(var i=0;i<possibleShots.length;i++){ //starting assuming 0 is best, so skipping zero
            if(possibleShots[i].humanScore < bestShot.humanScore){
                bestShot = possibleShots[i];
            }
        }
        testVect = bestShot;
        puckOne.hold(testVect);
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
            testVect.x += 50; //AI will skew shot. 
        }
        let launchVector = new Vector2(testVect.x, testVect.y);  
        launchVector.length = clamp(launchVector.length, 0, MAX_SHOT_VELOCITY);
        //launces puck
        puckWindup(launchVector);
        faceOffActive = false;
    } else { 
        //console.log('control has made it to the last else statement in ai.js');
        if(!faceOffActive){
            puckOne.shotVector = null;
        } //prevents error from being thrown if Ai takes a shot during Face Off
        
    } 
}

/*
    } else { 
        //console.log('control has made it to the last else statement in ai.js');
        if(!faceOffActive){
            puckOne.shotVector = null;
        } //prevents error from being thrown if Ai takes a shot during Face Off
        
    } 
    */