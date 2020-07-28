const BALL_FRICTION = 0.10;
const MAX_SHOT_VELOCITY = 200;

var faceOffThreatTimer = 5;
var faceOffThreatCooldown = 5;

class Puck {
    constructor() {
        this.position = new Vector2(500, 333);
        this.velocity = new Vector2(0, 0);
        this.shotVector = null;
        this.threatVectors = [];
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
        activePlayer = Math.abs(activePlayer - 1);
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
            startFaceoff();
            this.reset();
            scoreManager.add(0, 1); //Player 1 scores
            audio.playEvent('goal');
        } else if (this.isInLeftGoal()) {
            startFaceoff();
            this.reset();
            scoreManager.add(1, 1);
            audio.playEvent('goal');
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
                        startFaceoff();
                        outOfBoundsTimer = 5;
                        outOfBoundsPuckXPos = this.x;
                        outOfBoundsPuckYPos = this.y;
                        this.reset();
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

    release() {
        if (!this.shotVector) return;
        this.velocity = new Vector2(this.shotVector.x / -10, this.shotVector.y / -10);
        this.shotVector = null;
        this.inPlay = true;
        audio.playEvent('strike');
    }

    shotPrediction(skipDraw){
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
        canvasContext.globalAlpha = 0.1;
        const steps = 300;
        for(var i = 0; i < steps; i++){
            this.velocity.length -= BALL_FRICTION;
            this.x += this.velX;
            this.y += this.velY;
            this.lastPredictedLength += this.velocity.length;
            if(this.x < 0) {
                gotPastGoalLeft = true;
                break;
            }
            if(this.x > canvas.width) {
                gotPastGoalRight = true;
                break;
            }
            this.checkForCollisions(); //if puck winds out outta bounds, velocity gets 0'd out to ruin this test
            if(!skipDraw && i % 2 === 0){
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
        
        return [gotPastGoalRight, gotPastGoalLeft];
    } //end of shotPrediction

    drawFaceOffThreats() {
        for(let threat of this.threatVectors) {
            let start = threat.rotate(Math.PI/2).normalize(),
            weight = threat.length / 200,
            width = this.radius;
            let smoothShot = new Vector2(threat.x, threat.y);
            smoothShot.length = lerp(0, 100, weight);

            canvasContext.fillStyle = threat.color;
            canvasContext.beginPath();
            canvasContext.moveTo(this.x + start.x * width, this.y + start.y * width);
            canvasContext.lineTo(this.x + smoothShot.x, this.y + smoothShot.y)
            canvasContext.lineTo(this.x - start.x * width, this.y - start.y * width);
            canvasContext.fill();
        }

        this.threatVectors.length = 0;
    }

   draw(){
    this.drawFaceOffThreats();		
    if (this.shotVector) {
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

    colorCircle(this.x, this.y, this.radius, this.color);
}

    get x() {return this.position.x; }
    get y() { return this.position.y; }
    get velX() { return this.velocity.x; }
    get velY() { return this.velocity.y; }
    set x(newX) { this.position.x = newX; }
    set y(newY) { this.position.y = newY; }
    set velX(vx) { this.velocity.x = vx; }
    set velY(vy) { this.velocity.y = vy; }
}
