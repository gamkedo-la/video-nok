var blue = '#6dcff6';

const BALL_SPEED_DECAY_MULT = .98;
const PUCK_SPEED_DECAY_MULT_BOUNCE = .90;
const BALL_FRICTION = 0.3;

class Ball {
    constructor() {
        this.position = new Vector2(500, 333);
        this.velocity = new Vector2(0, 0);
        this.shotVector = null;
        this.inPlay = false;
        this.radius = 30;
        this.color = blue;
    }

    ballReset() {
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

        //check if ball is left of canvas boundary or paddle hit the ball
        if (this.x < 0) {
            if (this.y > paddle1Y &&
                this.y < paddle1Y + PADDLE_HEIGHT) {

                var deltaY = this.y - (paddle1Y + PADDLE_HEIGHT / 2);
                this.velX = -this.velX;

                this.velY = deltaY * 0.35;
            } else {
                this.ballReset();
                scoreManager.add(1, 1);// Player 2 scores
            }
        }

        //check if ball hits the right paddle
        if (this.y < (canvas.height / 2) - (GOAL_POST_SIZE / 2) &&
            this.x > canvas.width - railThickness) {

            this.velX = -this.velX;
            /*
            this.velX *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            this.velY *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            */
        }
        //check if ball bounces off bottom right rail
        if (this.y > (canvas.height / 2) + (GOAL_POST_SIZE / 2) &&
            this.x > canvas.width - railThickness) {

            this.velX = -this.velX;
            /*
            this.velX *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            this.velY *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            */
        }
        //puck enters right goal
        if (this.y > (canvas.height / 2) - (GOAL_POST_SIZE / 2) &&
            this.y < (canvas.height / 2) + (GOAL_POST_SIZE / 2) &&
            this.x > canvas.width) {
            this.ballReset();
            activePlayer = 2;
            console.log(activePlayer);
            scoreManager.add(0, 1); //Player 1 scores
        }

        //puck bounces off top left rail
        if (this.y < (canvas.height / 2) - (GOAL_POST_SIZE / 2) &&
            this.x < railThickness) {

            this.velX = -this.velX;
            /*
            this.velX *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            this.velY *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            */
        }

        //puck bounces off bottom right rail
        if (this.y > (canvas.height / 2) + (GOAL_POST_SIZE / 2) &&
            this.x < railThickness) {

            this.velX = -this.velX;
            /*
            this.velX *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            this.velY *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            */
        }
        //puck enters left goal
        if (this.y > (canvas.height / 2) - (GOAL_POST_SIZE / 2) &&
            this.y < (canvas.height / 2) + (GOAL_POST_SIZE / 2) &&
            this.x < 0) {

            this.ballReset();
            activePlayer = 1;
            console.log(activePlayer);
            scoreManager.add(0, 1);
        }

        // puck bounces off top rail
        if (this.y < railThickness + RAIL_COLLIDER) {
            this.velY = -this.velY;
            /*
            this.velX *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            this.velY *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            */
        }

        // puck bounces off bottom rail
        if (this.y > canvas.height - railThickness - RAIL_COLLIDER) {
            this.velY = -this.velY;
            /*
            this.velX *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            this.velY *= PUCK_SPEED_DECAY_MULT_BOUNCE;
            */
        }
    }
	
	checkForCollisions(objectX, objectY, objectHeight, objectWidth){
		if(	this.x > objectX && this.x < objectX + objectWidth &&
			this.y > objectY && this.y < objectY + objectHeight){
			
			var deltaY = this.y - (objectY + objectHeight / 2);
            this.velX = -this.velX;

			this.velY = deltaY * 0.35;
		}
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
    
	draw(){		
        if (this.shotVector) {
            let start = this.shotVector.rotate(Math.PI/2).normalize(),
                weight = this.shotVector.length / 200,
                width = lerp (0, this.radius, smoothStop(weight));
            
            let smoothShot = new Vector2(this.shotVector.x, this.shotVector.y);
            smoothShot.length = lerp(0, 200, smoothStart(weight));

            canvasContext.fillStyle = 'white';
            canvasContext.beginPath();
            canvasContext.moveTo(this.x + start.x * width, this.y + start.y * width);
            canvasContext.lineTo(this.x + smoothShot.x, this.y + smoothShot.y)
            canvasContext.lineTo(this.x - start.x * width, this.y - start.y * width);
            canvasContext.fill();
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
