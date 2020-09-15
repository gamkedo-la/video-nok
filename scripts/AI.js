function aiControl() {
    ctrlAtUIControl = false;
	ctrlAtplayerControl = false;
	ctrlAIControl = true;
    var possibleShots = [];

    if (puckOne.inPlay || shooting) return;
    // AI failure rates
    var correctShotSpeed = 0;
    AIAimFail  = false;
    AIPowerFail = false;
    
    AIRandomNum = Math.random();

    let scoreDelta = scoreManager.scores[activePlayer] - scoreManager.scores[Math.abs(activePlayer - 1)];
    // the numbers on the right most side of the conditionals is the SUCCESS rate
    if(aiWonFaceOff && AIRandomNum > 0.1){
            AIAimFail = true; 
    } //ai wins Face Off only 30% of the time
    else{
        if(scoreDelta > 0 && AIRandomNum > 0.2) {
            AIPowerFail = true;
        } // if AI is doing better than player, there's an 80% chance it'll underpower the shot
        else if(scoreDelta < 0 && AIRandomNum > 0.5) {
            AIAimFail = true;
        } //if AI is behind player, it starts doing well, bc it hates losing, fail rate 50 
        else if(AIRandomNum > 0.3) {
            AIAimFail = true;
        } //if AI is even with player, it performs adequately. fail rate 70
    } // if the AI isn't in a face off

    const shotSpeedRange = 540; 
    var testVect = new Vector2(0,0);
    possibleShots[0] = testVect;
    
    for(var aim = 0; aim < Math.PI*2; aim += 0.04) {
        for(var shotSpeed = 0; shotSpeed < shotSpeedRange; shotSpeed += 50) {
            testVect.x = Math.cos(aim) * shotSpeed;
            testVect.y = Math.sin(aim) * shotSpeed;

            puckOne.hold(testVect);        
            if(puckOne.shotPrediction(true)[activePlayer]){ //notes for ash! I guess this conditional statement calls and runs that entire function, with its side effects, it's not just checking against the return value
                //capture some new props, and attach them to the testVect object before we push em onto possible shots
                //shotpred figures these things out, puts them on puckOne
                correctShotSpeed = shotSpeed;
                testVect.humanScore = puckOne.lastPredictedBounce * 100 + puckOne.lastPredictedLength * 0.5;
                possibleShots.push(testVect);
                testVect = new Vector2(); //resets the memory
            } //if shotPrediction() has found a working shot, break, and pass in testVect to .hold()
        }
    }

    if(possibleShots.length){
        var bestShot = possibleShots[0];
        for(var i=0;i<possibleShots.length;i++){ //starting assuming 0 is best, so skipping zero
            if(possibleShots[i].humanScore < bestShot.humanScore){
                bestShot = possibleShots[i];
            }
        }
        testVect = bestShot;
        puckOne.hold(testVect);
    }
 
    //maybe try tweaking these numbers first, from various court positions
    if ((true || input.anyPressed()) && !shooting) {
        shooting = true;

        
        if(AIPowerFail){
            var testVectXTemp = testVect.x/correctShotSpeed;
            var testVectYTemp = testVect.y/correctShotSpeed;
            var failureShotSpeed = correctShotSpeed / (2 * AIRandomNum); //AI will underpower shot
            testVect.x = testVectXTemp * failureShotSpeed;
            testVect.y = testVectYTemp * failureShotSpeed;
        }
        

        /*
        if(AIPowerFail){
            var testVectXTemp = testVect.x/correctShotSpeed;
            var testVectYTemp = testVect.y/correctShotSpeed;
            var failureShotSpeed = correctShotSpeed * 8; //AI will underpower shot
            testVect.x = testVectXTemp * failureShotSpeed;
            testVect.y = testVectYTemp * failureShotSpeed;
        }
        */
        
        if(AIAimFail){
            testVect.x -= 50; //AI will skew shot. 
        }
        let launchVector = new Vector2(testVect.x, testVect.y);  
        launchVector.length = clamp(launchVector.length, 0, MAX_SHOT_VELOCITY);
        puckWindup(launchVector);
        faceOffActive = false;
    } else { 
        if(!faceOffActive){
            puckOne.shotVector = null;
        } //prevents error from being thrown if Ai takes a shot during Face Off
        
    } 
}

let threatTimers = [0, 0];
let threatenTop = [0, 0];
const threatColors = ['orange', 'red'];

function aiThreat(player) {
    const threatVectors = [new Vector2(-133.49, 148.93), new Vector2(-133.49, -148.93)]; //(133.49, -148.93)
    let threat = threatVectors[threatenTop[player]];
    if (player === 1) threat = threat.rotate(Math.PI);
    threatTimers[player]--;
    if(threatTimers[player] <= 0){
        if(threatenTop[player] == 0){
            this.aiFaceOffThreatVector = threatVectors[0]
            }
        else {
            this.aiFaceOffThreatVector = threatVectors[1]
        }
        threatenTop[player] = Math.abs(threatenTop[player] - 1);
        threatTimers[player] = 8 + Math.round(Math.random() * 7);
    }

    threat.color = threatColors[player];
    puckOne.threatVectors.push(threat);
}