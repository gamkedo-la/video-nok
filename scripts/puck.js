const BALL_FRICTION = 0.10;

class Puck {
    constructor() {
        this.position = new Vector2(500, 333);
        this.velocity = new Vector2(0, 0);
        this.shotVector = null;
        this.inPlay = false;
        this.radius = 30;
        this.color = blue;
    }

    reset() {
        this.inPlay = false;
        this.velX = 0;
        this.velY = 0;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
    }

    move() {
        this.velocity.length -= BALL_FRICTION;

        this.x += this.velX;
        this.y += this.velY;

        if (this.inPlay && this.velocity.length <= 0) {
            activePlayer = activePlayer === 1 ? 2 : 1;
            this.inPlay = false;
        }

        this.checkForCollisions();
        
        if (this.isInRightGoal()) {
            this.reset();
            activePlayer = 2;
            scoreManager.add(0, 1); //Player 1 scores
        } else if (this.isInLeftGoal()) {
            this.reset();
            activePlayer = 1;
            scoreManager.add(1, 1);
        }
    }

    checkForCollisions(){
        if (this.velocity.length === 0) return;
        for (let i of obstacles) {
            let collision = circleRectCollision(this, i);
            if (collision) {
                let dir = vectorDirection(collision);
                let penetration = new Vector2(this.radius - Math.abs(collision.x), this.radius - Math.abs(collision.y));
                if (dir.y != 0)  {;
                    this.velY *= -1;
                    this.y += penetration.y * -dir.y;
                } else {
                    this.velX *= -1;
                    this.x += penetration.x * -dir.x;
                }
            }
        }
    }

    isInRightGoal() {
        return this.x > canvas.width;
    }

    isInLeftGoal() {
        return this.x < 0;
    }

    hold(vector) {
        if (this.inPlay) return;
        let newShot = clampVector2(vector, 0, 200);
        this.shotVector = new Vector2(newShot.x, newShot.y);
    }

    release() {
        if (!this.shotVector) return;
        this.velocity = new Vector2(this.shotVector.x / -10, this.shotVector.y / -10);
        this.shotVector = null;
        this.inPlay = true;
    }

    drawShotPrediction(){
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
            this.checkForCollisions();
            if(i % 2 == 0){
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
    }

   draw(){		
    if (this.shotVector) {
        let start = this.shotVector.rotate(Math.PI/2).normalize(),
            weight = this.shotVector.length / 200,
            width = this.radius;
        
        let smoothShot = new Vector2(this.shotVector.x, this.shotVector.y);
        smoothShot.length = lerp(0, 100, weight);

        if(activePlayer == 1){
        canvasContext.fillStyle = 'white';
        canvasContext.beginPath();
        canvasContext.moveTo(this.x + start.x * width, this.y + start.y * width);
        canvasContext.lineTo(this.x + smoothShot.x, this.y + smoothShot.y)
        canvasContext.lineTo(this.x - start.x * width, this.y - start.y * width);
        canvasContext.fill();
        }
    }

    if(this.shotVector && shotPredictionCheat){
        this.drawShotPrediction();
    }

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
