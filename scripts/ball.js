var blue = '#6dcff6';

function ballClass() {
    this.x = 500;
    this.y = 333;
    this.velX = 0;
    this.velY = 0;
	this.size = 30;
	this.color = blue;

    this.ballReset = function() {
        if (player1Score >= WINNING_SCORE ||
            player2Score >= WINNING_SCORE) {

            showingWinScreen = true;

            this.velX = -this.velX;
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
        }
    }

    this.move = function() {
        this.x = this.x + this.velX;
        this.y = this.y + this.velY;

        //check if ball is left of canvas boundary or paddle hit the ball
        if (this.x < 0) {
            if (this.y > paddle1Y &&
                this.y < paddle1Y + PADDLE_HEIGHT) {

                var deltaY = this.y - (paddle1Y + PADDLE_HEIGHT / 2);
                this.velX = -this.velX;

                this.velY = deltaY * 0.35;
            } else {
                player2Score++;
                this.ballReset();
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
            player1Score++;
            this.ballReset();
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

            player1Score++;
            this.ballReset();
        }

        if (this.y < railThickness + RAIL_COLLIDER) {
            this.velY = -this.velY;
        }
        if (this.y > canvas.height - railThickness - RAIL_COLLIDER) {
            this.velY = -this.velY;
        }
    }
	
	this.draw = function(){		
		colorCircle(this.x, this.y, this.size, this.color);
	}
}
