const BALL_FRICTION = 0.10;
const MAX_SHOT_VELOCITY = 200;
var badShot = false; 
var faceOffThreatTimer = 5;
var faceOffThreatCooldown = 5;

//I'm a baaaaad programmer

var threatenTop = false;
var threatVectors = [new Vector2(133.49, 148.93), new Vector2(133.49, -148.93)]; //(133.49, -148.93)


class Puck {
    constructor() {
        this.position = new Vector2(500, 333);
        this.velocity = new Vector2(0, 0);
        this.shotVector = null;
        this.aiFaceOffThreatVector = threatVectors[1];
        this.inPlay = false;
        this.radius = 30;
        this.color = blue;
        this.lastPredictedBounce = 0;
        this.lastPredictedLength = 0;
    }


    reset() {
        //outOfBounds = false;
        //console.log('ctrl has reached reset');
        this.inPlay = false;
        this.velX = 0;
        this.velY = 0;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
    }

    switchPlayer(){
        activePlayer = activePlayer === 1 ? 2 : 1;
    }

    move() {
        this.velocity.length -= BALL_FRICTION;

        this.x += this.velX;
        this.y += this.velY;

        if (this.inPlay && this.velocity.length <= 0) {
            this.switchPlayer();
            this.inPlay = false;
        }

        this.checkForCollisions();
        
        if (this.isInRightGoal()) {
            preFaceOff = true;
            this.reset();
            AIFaceOffCountDown  = 100;
            scoreManager.add(0, 1); //Player 1 scores
            console.log('adding score to player');
        } else if (this.isInLeftGoal()) {
            AIFaceOffCountDown  = 100;
            preFaceOff = true;
            this.reset();
            scoreManager.add(1, 1);
            console.log('adding score to comp');
        }
    }

    checkForCollisions(){
        if (this.velocity.length === 0) return;
        for (let i of obstacles) {
            let collision = circleRectCollision(this, i);
            if (collision) {   
                if(this.inPlay){
                    audio.playEvent('railBounce');
                }
                this.lastPredictedBounce++;
                let dir = vectorDirection(collision);
                let penetration = new Vector2(this.radius - Math.abs(collision.x), this.radius - Math.abs(collision.y));
                if (dir.y != 0)  {;
                    this.velY *= -1;
                    this.y += penetration.y * -dir.y;
                } else {
                    this.velX *= -1;
                    this.x += penetration.x * -dir.x;
                }

                //hacky way to reset the puck if it hits the wall too hard
                
                if((Math.abs(this.velocity.x) > 15 || Math.abs(this.velocity.y) > 15)){
                    if(this.inPlay){ //if actually firing
                        preFaceOff = true; //if this flag is true, faceOff() will be called in moveEverthing
                        AIFaceOffCountDown  = 100;
                        outOfBoundsTimer = 5;
                        outOfBoundsPuckXPos = this.x;
                        outOfBoundsPuckYPos = this.y;
                        this.reset(); 
                        //this.switchPlayer();
                    } else { //ruin shotPrediction since puck is outta bounds, we didn't actually fire
                        this.velX = this.velY = 0;
                    }
                }  
                
            } // end if collision 
        }
    }

    isInRightGoal() {
        return this.x > canvas.width;
    }

    isInLeftGoal() {
        return this.x < 0;
    }

    hold(vector) {
        this.shotVector = vector;
        this.shotVector.clamp(0, MAX_SHOT_VELOCITY);
    }

    faceOffThreat(vector) {
        if (this.inPlay) return;
        //this.aiFaceOffThreatVector = vector;
        this.aiFaceOffThreatVector.clamp(0, MAX_SHOT_VELOCITY);
    }

    release() {
        if (!this.shotVector) return;
        this.velocity = new Vector2(this.shotVector.x / -10, this.shotVector.y / -10);
        this.shotVector = null;
        this.inPlay = true;
    }

    shotPrediction(skipDraw, testLeftSide){
        this.lastPredictedBounce = 0;
        this.lastPredictedLength = 0;

        var gotPastGoalLeft = false;
        var gotPastGoalRight = false;

        var tempX = this.x;
        var tempY = this.y;
        var tempVelocity = this.velocity;
        var tempVelX = this.velX;
        var tempVelY = this.velY;
        this.velocity = new Vector2(this.shotVector.x / -10, this.shotVector.y / -10);
        var steps = 300;
        canvasContext.globalAlpha = 0.1;
        for(var i = 0; i < steps; i++){
            this.velocity.length -= BALL_FRICTION;
            this.x += this.velX;
            this.y += this.velY;
            this.lastPredictedLength += this.velocity.length;
            if(this.x < 0){
                gotPastGoalLeft = true;
                break;
            }
            if(this.x > canvas.width){
                gotPastGoalRight = true;
                break;
            }
            this.checkForCollisions(); //if puck winds out outta bounds, velocity gets 0'd out to ruin this test
            if(i % 2 == 0 && skipDraw == false){
                canvasContext.globalAlpha = 1.0 - i/steps;
                //var colorHere = '#FFF' + (Math.floor((i/steps)* 255).toString(16));
                colorCircle(this.x, this.y, this.radius , 'lime');
            }

        }
        canvasContext.globalAlpha = 1.0;
        this.x = tempX;
        this.y = tempY;
        this.velocity = tempVelocity;
        this.velX = tempVelX;
        this.velY = tempVelY;
        if(testLeftSide){
            return gotPastGoalLeft;
        } else {
            return gotPastGoalRight;
            //return false;
        }
    } //end of shotPrediction

   drawfaceOffThreat(){
    canvasContext.fillStyle = 'red';
    if(faceOffThreatTimer > 0){
        let start = this.aiFaceOffThreatVector.rotate(Math.PI/2).normalize(),
        weight = this.aiFaceOffThreatVector.length / 200,
        width = this.radius;
        let smoothShot = new Vector2(this.aiFaceOffThreatVector.x, this.aiFaceOffThreatVector.y);
        smoothShot.length = lerp(0, 100, weight);

        canvasContext.beginPath();
        canvasContext.moveTo(this.x + start.x * width, this.y + start.y * width);
        canvasContext.lineTo(this.x + smoothShot.x, this.y + smoothShot.y)
        canvasContext.lineTo(this.x - start.x * width, this.y - start.y * width);
        canvasContext.fill();
        faceOffThreatTimer--;
    } else {
        faceOffThreatCooldown --;        
        if(faceOffThreatCooldown <= 0){
            if(threatenTop == false){
                this.aiFaceOffThreatVector = threatVectors[0]
            }
            else {
                this.aiFaceOffThreatVector = threatVectors[1]
            }
            threatenTop = !threatenTop;
            faceOffThreatTimer = 5;
            faceOffThreatCooldown = 5;
        } 
    } 
   } 

   draw(){		
    if (this.shotVector) {
        //console.log(this.shotVector);
        let start = this.shotVector.rotate(Math.PI/2).normalize(),
            weight = this.shotVector.length / 200, //length is set in animations
            width = this.radius;
        
        let smoothShot = new Vector2(this.shotVector.x, this.shotVector.y);
        smoothShot.length = lerp(0, 100, weight);

        if (this.shotVector) {
            canvasContext.fillStyle = 'white';
            canvasContext.beginPath();
            canvasContext.moveTo(this.x + start.x * width, this.y + start.y * width);
            canvasContext.lineTo(this.x + smoothShot.x, this.y + smoothShot.y)
            canvasContext.lineTo(this.x - start.x * width, this.y - start.y * width);
            canvasContext.fill();
        } //I think this draws the shot Triangle, and it's shared between the two players. 
    }

    if(faceOffActive && this.aiFaceOffThreatVector && !this.inPlay){
        this.drawfaceOffThreat();
    } //AI threatening to take a shot

    colorCircle(this.x, this.y, this.radius, this.color);
}
    
    get x() {
        return this.position.x;
    }

    get y() {
        return this.position.y;
    }

    get velX() {
        return this.velocity.x;
    }

    get velY() {
        return this.velocity.y;
    }

    set x(newX) {
        this.position.x = newX;
    }

    set y(newY) {
        this.position.y = newY;
    }

    set velX(vx) {
        this.velocity.x = vx;
    }

    set velY(vy) {
        this.velocity.y = vy;
    }
}
