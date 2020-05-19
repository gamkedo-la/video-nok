var blue = '#6dcff6';

const BALL_SPEED_DECAY_MULT = .96;


function ballClass() {
    this.x = 500;
    this.y = 333;
    this.velX = 0;
    this.velY = 0;
	this.size = 30;
	this.color = blue;

    this.ballReset = function() {
        this.velX = -this.velX;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
    }

    this.move = function() {
        this.x = this.x + this.velX;
        this.y = this.y + this.velY;
        
        this.velX *= BALL_SPEED_DECAY_MULT;
        this.velY *= BALL_SPEED_DECAY_MULT;

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
        }
        //check if ball bounces off bottom right rail
        if (this.y > (canvas.height / 2) + (GOAL_POST_SIZE / 2) &&
            this.x > canvas.width - railThickness) {

            this.velX = -this.velX;
        }
        //puck enters right goal
        if (this.y > (canvas.height / 2) - (GOAL_POST_SIZE / 2) &&
            this.y < (canvas.height / 2) + (GOAL_POST_SIZE / 2) &&
            this.x > canvas.width) {
            this.ballReset();
            scoreManager.add(0, 1); //Player 1 scores
        }

        //puck bounces off top left rail
        if (this.y < (canvas.height / 2) - (GOAL_POST_SIZE / 2) &&
            this.x < railThickness) {

            this.velX = -this.velX;
        }

        //puck bounces off bottom right rail
        if (this.y > (canvas.height / 2) + (GOAL_POST_SIZE / 2) &&
            this.x < railThickness) {

            this.velX = -this.velX;
        }
        //puck enters right goal
        if (this.y > (canvas.height / 2) - (GOAL_POST_SIZE / 2) &&
            this.y < (canvas.height / 2) + (GOAL_POST_SIZE / 2) &&
            this.x < 0) {

            this.ballReset();
            scoreManager.add(0, 1);
        }

        if (this.y < railThickness + RAIL_COLLIDER) {
            this.velY = -this.velY;
        }
        if (this.y > canvas.height - railThickness - RAIL_COLLIDER) {
            this.velY = -this.velY;
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

	
	this.draw = function(){		
		colorCircle(this.x, this.y, this.size, this.color);
	}
}
