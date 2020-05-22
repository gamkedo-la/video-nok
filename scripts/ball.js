var blue = '#6dcff6';

const BALL_SPEED_DECAY_MULT = .98;
const PUCK_SPEED_DECAY_MULT_BOUNCE = .90;


function ballClass() {
    this.x = 500;
    this.y = 333;
    this.velX = 0;
    this.velY = 0;
    this.shotVector = null;
	this.radius = 30;
	this.color = blue;

    this.ballReset = function() {
        this.velX = 0;
        this.velY = 0;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
    }

    this.move = function() {
        this.x = this.x + this.velX;
        this.y = this.y + this.velY;

        //if(this.velX > .05 || this.velX < -.05){
            //console.log(this.velX);
            //console.log(activePlayer);
            this.velX *= BALL_SPEED_DECAY_MULT;
            this.velY *= BALL_SPEED_DECAY_MULT;
            /*
            if(activePlayer == 1){
                console.log(activePlayer);
                activePlayer = 2;
            }
            if(activePlayer == 2){
                activePlayer = 1;
            }
            */
        //}


        // I think this was your check for if the puck is stopped. 
        //this.velX < Math.abs(1) && this.velY < Math.abs(1) //saving this line, you wanna check velX and velY likely
        //going to just try VelX with a range rn

        //if puckSpeed is > -(.005) and < .005 we can consider it not moving. bc checking for == 0 is just skipping over it. 
        //this still isn't working, going to just flip it on a shot being taken,
        //commenting this out for rn
        
        /*
        console.log(this.velX);
        if(this.velX < .05 || this.velX > -.05){
            if(activePlayer == 1){
                activePlayer = 2;
            }
            if(activePlayer == 2){
                activePlayer = 1;
            }
        }
        */

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
	
	this.checkForCollisions = function(objectX, objectY, objectHeight, objectWidth){
		if(	this.x > objectX && this.x < objectX + objectWidth &&
			this.y > objectY && this.y < objectY + objectHeight){
			
			var deltaY = this.y - (objectY + objectHeight / 2);
            this.velX = -this.velX;

			this.velY = deltaY * 0.35;
		}
	}

    this.hold = function(vector) {
        let newShot = clampVector2(vector, 0, 200);
        this.shotVector = newShot;
    }

    this.release = function() {
        if (!this.shotVector) return;
        this.velX = this.shotVector.x / -10;
        this.velY = this.shotVector.y / -10;

        this.shotVector = null
    }
    
	this.draw = function(){		
        if (this.shotVector && activePlayer == 1) {
            colorLine(this.x, this.y, this.x + this.shotVector.x, this.y + this.shotVector.y, 2, 'white');
        }
        colorCircle(this.x, this.y, this.radius, this.color);
	}
}
